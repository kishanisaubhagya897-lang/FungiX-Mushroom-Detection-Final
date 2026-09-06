import io
import json
from pathlib import Path
from typing import Dict, Any

import joblib
import numpy as np
import pandas as pd
import torch
import timm

from transformers import CLIPModel, CLIPProcessor
from PIL import Image
from fastapi import FastAPI, File, Form, UploadFile, HTTPException
from torchvision import transforms
from xgboost import XGBClassifier


# ============================================================
# FungiX Final Multimodal Inference API
# ============================================================

app = FastAPI(
    title="FungiX Mushroom Identification API",
    version="1.0.0",
    description="ViT-Small + Domain-Adapted XGBoost + Fixed Probability Fusion",
)


# ============================================================
# PATHS
# ============================================================

BASE_DIR = Path(__file__).resolve().parent
MODEL_DIR = BASE_DIR / "models"

VIT_BACKBONE_PATH = MODEL_DIR / "ViT_Small_pretrained_backbone.pth"
VIT_CLASSIFIER_PATH = MODEL_DIR / "ViT_Small_transfer_classifier.joblib"
VIT_CONFIG_PATH = MODEL_DIR / "ViT_Small_preprocessing_config.json"

XGB_MODEL_PATH = MODEL_DIR / "XGBoost_domain_adapted_exact54.json"
XGB_MAPPING_PATH = MODEL_DIR / "XGBoost_morphology_category_mapping.json"
DEPLOYMENT_CONFIG_PATH = MODEL_DIR / "deployment_config.json"


# ============================================================
# DEVICE
# ============================================================

DEVICE = torch.device("cpu")


# ============================================================
# LOAD CONFIGURATION
# ============================================================

with open(VIT_CONFIG_PATH, "r", encoding="utf-8") as f:
    vit_config = json.load(f)

with open(XGB_MAPPING_PATH, "r", encoding="utf-8") as f:
    xgb_mapping = json.load(f)

with open(DEPLOYMENT_CONFIG_PATH, "r", encoding="utf-8") as f:
    deployment_config = json.load(f)


# ============================================================
# MODEL CONFIG
# ============================================================

FEATURE_ORDER = xgb_mapping["feature_order"]

CATEGORIES = xgb_mapping["categories"]

CLASS_MAPPING = {
    0: "Edible",
    1: "Poisonous",
}

VIT_WEIGHT = 0.70
XGB_WEIGHT = 0.30

# ============================================================
# CLIP NON-MUSHROOM SCREENING GATE
# ============================================================

CLIP_MODEL_PATH = MODEL_DIR / "clip_gate"

CLIP_MUSHROOM_THRESHOLD = 0.50

clip_processor = CLIPProcessor.from_pretrained(
    CLIP_MODEL_PATH,
    local_files_only=True,
)

clip_model = CLIPModel.from_pretrained(
    CLIP_MODEL_PATH,
    local_files_only=True,
)

clip_model.to(DEVICE)
clip_model.eval()

CLIP_TEXT_LABELS = [
    "a photo of a mushroom",
    "a photo of something that is not a mushroom",
]


# ============================================================
# LOAD ViT-SMALL BACKBONE
# ============================================================

vit_model = timm.create_model(
    "vit_small_patch16_224",
    pretrained=False,
    num_classes=0,
)

state_dict = torch.load(
    VIT_BACKBONE_PATH,
    map_location=DEVICE,
)

vit_model.load_state_dict(
    state_dict,
    strict=True,
)

vit_model.to(DEVICE)
vit_model.eval()


# ============================================================
# LOAD ViT CLASSIFIER
# ============================================================

vit_classifier = joblib.load(VIT_CLASSIFIER_PATH)


# ============================================================
# IMAGE PREPROCESSING
# ============================================================

IMAGE_SIZE = tuple(vit_config["input_size"][1:])

IMAGE_MEAN = vit_config["mean"]
IMAGE_STD = vit_config["std"]

image_transform = transforms.Compose(
    [
        transforms.Resize(IMAGE_SIZE),
        transforms.ToTensor(),
        transforms.Normalize(
            mean=IMAGE_MEAN,
            std=IMAGE_STD,
        ),
    ]
)


# ============================================================
# LOAD FINAL XGBOOST MODEL
# ============================================================

xgb_model = XGBClassifier()
xgb_model.load_model(str(XGB_MODEL_PATH))


# ============================================================
# STARTUP VALIDATION
# ============================================================

if FEATURE_ORDER != [
    "cap-shape",
    "cap-color",
    "cap-surface",
    "gill-attachment",
    "ring-number",
    "stalk-root",
    "gill-color",
    "stalk-shape",
]:
    raise RuntimeError(
        f"Unexpected XGBoost feature order: {FEATURE_ORDER}"
    )


# ============================================================
# HELPER: CLIP NON-MUSHROOM SCREENING
# ============================================================

def screen_mushroom_with_clip(
    image: Image.Image,
) -> Dict[str, Any]:
    """
    Zero-shot CLIP screening.

    Returns whether the image is likely to represent
    a mushroom before running the Edible/Poisonous models.
    """

    image = image.convert("RGB")

    inputs = clip_processor(
        text=CLIP_TEXT_LABELS,
        images=image,
        return_tensors="pt",
        padding=True,
    )

    # Move tensors to CPU
    inputs = {
        key: value.to(DEVICE)
        for key, value in inputs.items()
    }

    with torch.no_grad():
        outputs = clip_model(**inputs)

    probabilities = outputs.logits_per_image.softmax(
        dim=1
    )[0]

    mushroom_probability = float(
        probabilities[0].item()
    )

    non_mushroom_probability = float(
        probabilities[1].item()
    )

    is_mushroom = (
        mushroom_probability
        >= CLIP_MUSHROOM_THRESHOLD
    )

    return {
        "is_mushroom": is_mushroom,
        "mushroom_probability": mushroom_probability,
        "non_mushroom_probability": non_mushroom_probability,
    }



# ============================================================
# HELPER: ViT IMAGE PREDICTION
# ============================================================

def predict_vit(image: Image.Image) -> np.ndarray:
    """
    Returns:
        np.ndarray:
            [P(Edible), P(Poisonous)]
    """

    image = image.convert("RGB")

    tensor = image_transform(image)

    tensor = tensor.unsqueeze(0).to(DEVICE)

    with torch.no_grad():
        features = vit_model(tensor)

    features = features.cpu().numpy()

    probabilities = vit_classifier.predict_proba(features)[0]

    probabilities = np.asarray(
        probabilities,
        dtype=np.float64,
    )

    return probabilities


# ============================================================
# HELPER: PREPARE MORPHOLOGY
# ============================================================

def prepare_morphology(
    morphology: Dict[str, Any],
) -> pd.DataFrame:
    """
    Convert mobile morphology values into the exact
    categorical representation expected by XGBoost.

    The mobile app sends the final XGBoost categorical codes.

    Missing values are represented as NaN.
    """

    row = {}

    for feature in FEATURE_ORDER:

        value = morphology.get(feature)

        if value is None:
            row[feature] = np.nan
            continue

        if isinstance(value, str):
            value = value.strip()

        if value == "":
            row[feature] = np.nan
            continue

        # Explicit missing values
        if str(value).lower() in {
            "nan",
            "null",
            "none",
            "missing",
        }:
            row[feature] = np.nan
            continue

        # Validate against final model categories
        allowed_categories = CATEGORIES[feature]

        if value not in allowed_categories:
            raise ValueError(
                f"Invalid value '{value}' for feature "
                f"'{feature}'. Allowed categories: "
                f"{allowed_categories}"
            )

        row[feature] = value

    df = pd.DataFrame(
        [row],
        columns=FEATURE_ORDER,
    )

    # Apply exactly the categorical vocabulary used
    # when the final XGBoost model was trained.
    for feature in FEATURE_ORDER:
        df[feature] = pd.Categorical(
            df[feature],
            categories=CATEGORIES[feature],
        )

    return df


# ============================================================
# HELPER: XGBOOST MORPHOLOGY PREDICTION
# ============================================================

def predict_xgboost(
    morphology: Dict[str, Any],
) -> np.ndarray:
    """
    Returns:
        np.ndarray:
            [P(Edible), P(Poisonous)]
    """

    df = prepare_morphology(morphology)

    probabilities = xgb_model.predict_proba(df)[0]

    probabilities = np.asarray(
        probabilities,
        dtype=np.float64,
    )

    return probabilities


# ============================================================
# HELPER: FIXED PROBABILITY FUSION
# ============================================================

def fuse_probabilities(
    vit_probabilities: np.ndarray,
    xgb_probabilities: np.ndarray,
) -> np.ndarray:

    fused = (
        VIT_WEIGHT * vit_probabilities
        + XGB_WEIGHT * xgb_probabilities
    )

    # Numerical safety
    fused = fused / fused.sum()

    return fused


# ============================================================
# HEALTH CHECK
# ============================================================

@app.get("/")
def root():

    return {
        "service": "FungiX Mushroom Identification API",
        "status": "running",
        "model": "ViT-Small + Domain-Adapted XGBoost",
        "fusion": {
            "ViT": VIT_WEIGHT,
            "XGBoost": XGB_WEIGHT,
        },
    }


# ============================================================
# MODEL INFORMATION
# ============================================================

@app.get("/model-info")
def model_info():

    return {
        "model_version": deployment_config.get(
            "model_version",
            "ViT-Small + Domain-Adapted XGBoost + Fixed Probability Fusion",
        ),
        "image_model": "vit_small_patch16_224",
        "image_feature_dimension": 384,
        "morphology_features": FEATURE_ORDER,
        "fusion": {
            "vit_weight": VIT_WEIGHT,
            "xgboost_weight": XGB_WEIGHT,
        },
        "classes": CLASS_MAPPING,
        "device": str(DEVICE),
    }


# ============================================================
# MORPHOLOGY FEATURE INFORMATION
# ============================================================

@app.get("/features")
def features():

    return {
        "feature_order": FEATURE_ORDER,
        "categories": CATEGORIES,
        "missing_value_policy": "NaN",
    }


# ============================================================
# NON-MUSHROOM SCREENING
# ============================================================

@app.post("/screen")
async def screen(
    image: UploadFile = File(...),
):
    try:
        image_bytes = await image.read()

        if not image_bytes:
            raise ValueError("Empty image file.")

        pil_image = Image.open(
            io.BytesIO(image_bytes)
        ).convert("RGB")

    except Exception as exc:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid image: {exc}",
        )

    try:
        clip_result = screen_mushroom_with_clip(
            pil_image
        )

    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=f"CLIP screening failed: {exc}",
        )

    return clip_result


# ============================================================
# MULTIMODAL PREDICTION
# ============================================================

@app.post("/predict")
async def predict(
    image: UploadFile = File(...),
    morphology: str = Form(...),
):
    """
    Multimodal prediction endpoint.

    Form fields:

        image:
            Mushroom image file

        morphology:
            JSON object containing the 8 XGBoost morphology features

    Example morphology:

        {
            "cap-shape": "x",
            "cap-color": "n",
            "cap-surface": "s",
            "gill-attachment": "f",
            "ring-number": "o",
            "stalk-root": "b",
            "gill-color": "w",
            "stalk-shape": "e"
        }
    """

    # --------------------------------------------------------
    # Parse morphology JSON
    # --------------------------------------------------------

    try:
        morphology_data = json.loads(morphology)

    except json.JSONDecodeError:
        raise HTTPException(
            status_code=400,
            detail="Invalid morphology JSON.",
        )

    if not isinstance(morphology_data, dict):
        raise HTTPException(
            status_code=400,
            detail="Morphology must be a JSON object.",
        )

    # --------------------------------------------------------
    # Validate image
    # --------------------------------------------------------

    try:
        image_bytes = await image.read()

        if not image_bytes:
            raise ValueError("Empty image file.")

        pil_image = Image.open(
            io.BytesIO(image_bytes)
        ).convert("RGB")

    except Exception as exc:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid image: {exc}",
        )

    # --------------------------------------------------------
    # CLIP non-mushroom screening gate
    # --------------------------------------------------------

    try:
        clip_result = screen_mushroom_with_clip(
            pil_image
        )

    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=f"CLIP screening failed: {exc}",
        )

    # Reject obvious non-mushroom images before
    # running the Edible/Poisonous models.
    if not clip_result["is_mushroom"]:

        return {
            "success": False,
            "prediction": "Not a Mushroom",
            "class_id": None,
            "confidence": clip_result["non_mushroom_probability"],
            "probabilities": {
                "Mushroom": clip_result["mushroom_probability"],
                "Not Mushroom": clip_result["non_mushroom_probability"],
            },
            "gate": {
                "model": "Pretrained CLIP",
                "decision": "Rejected as non-mushroom",
                "mushroom_probability": clip_result["mushroom_probability"],
                "non_mushroom_probability": clip_result["non_mushroom_probability"],
            },
            "model_version": (
                "CLIP screening gate + "
                "ViT-Small + Domain-Adapted XGBoost"
            ),
            "safety_note": (
                "The image was rejected by the visual "
                "screening gate because it was unlikely "
                "to represent a mushroom."
            ),
        }

    # --------------------------------------------------------
    # ViT prediction
    # --------------------------------------------------------

    try:
        vit_probabilities = predict_vit(
            pil_image
        )

    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=f"ViT inference failed: {exc}",
        )

    # --------------------------------------------------------
    # XGBoost prediction
    # --------------------------------------------------------

    try:
        xgb_probabilities = predict_xgboost(
            morphology_data
        )

    except ValueError as exc:
        raise HTTPException(
            status_code=400,
            detail=str(exc),
        )

    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=f"XGBoost inference failed: {exc}",
        )

    # --------------------------------------------------------
    # Fixed 70/30 fusion
    # --------------------------------------------------------

    fused_probabilities = fuse_probabilities(
        vit_probabilities,
        xgb_probabilities,
    )

    # --------------------------------------------------------
    # Final prediction
    # --------------------------------------------------------

    final_class_id = int(
        np.argmax(fused_probabilities)
    )

    final_prediction = CLASS_MAPPING[
        final_class_id
    ]

    final_confidence = float(
        fused_probabilities[final_class_id]
    )

    # --------------------------------------------------------
    # Return complete result
    # --------------------------------------------------------

    return {
        "success": True,

        "prediction": final_prediction,

        "class_id": final_class_id,

        "confidence": final_confidence,

        "probabilities": {
            "Edible": float(
                fused_probabilities[0]
            ),
            "Poisonous": float(
                fused_probabilities[1]
            ),
        },

        "models": {
            "image": {
                "name": "ViT-Small",
                "architecture": "vit_small_patch16_224",
                "probabilities": {
                    "Edible": float(
                        vit_probabilities[0]
                    ),
                    "Poisonous": float(
                        vit_probabilities[1]
                    ),
                },
            },

            "morphology": {
                "name": "Domain-Adapted XGBoost",
                "probabilities": {
                    "Edible": float(
                        xgb_probabilities[0]
                    ),
                    "Poisonous": float(
                        xgb_probabilities[1]
                    ),
                },
            },

            "fusion": {
                "method": "Fixed probability fusion",
                "vit_weight": VIT_WEIGHT,
                "xgboost_weight": XGB_WEIGHT,
                "probabilities": {
                    "Edible": float(
                        fused_probabilities[0]
                    ),
                    "Poisonous": float(
                        fused_probabilities[1]
                    ),
                },
            },
        },

        "morphology": {
            feature: morphology_data.get(feature)
            for feature in FEATURE_ORDER
        },

        "model_version": deployment_config.get(
            "model_version",
            "ViT-Small + Domain-Adapted XGBoost + Fixed Probability Fusion",
        ),

        "safety_note": (
            "This system is intended for educational and "
            "decision-support purposes and should not replace "
            "expert mushroom identification."
        ),
    }