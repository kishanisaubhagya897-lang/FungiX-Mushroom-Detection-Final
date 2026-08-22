from fastapi import FastAPI
from pydantic import BaseModel
import pandas as pd
import pickle

app = FastAPI()

# Load model files
with open("xgb_mushroom_model.pkl", "rb") as f:
    model = pickle.load(f)

with open("xgb_label_encoders.pkl", "rb") as f:
    encoders = pickle.load(f)

    print("ENCODER CLASSES")

for key in encoders:
    print("\n", key)
    print(encoders[key].classes_)

with open("xgb_target_encoder.pkl", "rb") as f:
    target_encoder = pickle.load(f)

with open("xgb_feature_order.pkl", "rb") as f:
    feature_order = pickle.load(f)

with open("xgb_app_mapping.pkl", "rb") as f:
    app_mapping = pickle.load(f)

print("FEATURE ORDER:")
print(feature_order)

print("APP MAPPING:")
print(app_mapping)


@app.get("/")
def home():
    return {"status": "running"}


@app.get("/features")
def features():
    return {"features": list(encoders.keys())}


class PredictionRequest(BaseModel):
    capShape: str
    capColor: str
    gillType: str
    ringPresence: str
    volvaPresence: str
    surfaceTexture: str

@app.post("/predict")
def predict(data: PredictionRequest):

    values = {
        "cap-shape": app_mapping["cap-shape"][data.capShape],
        "cap-color": app_mapping["cap-color"][data.capColor],
        "gill-attachment": app_mapping["gill-attachment"][data.gillType],
        "ring-number": app_mapping["ring-number"][data.ringPresence],
        "stalk-root": app_mapping["stalk-root"][data.volvaPresence],
        "cap-surface": app_mapping["cap-surface"][data.surfaceTexture],
    }

    df = pd.DataFrame([values])

    print(df)

    for col in feature_order:
        print(col)
        print(encoders[col].classes_)

    for col in feature_order:
        df[col] = encoders[col].transform(df[col])

    prediction = model.predict(df)[0]

    result = target_encoder.inverse_transform([prediction])[0]

    return {
        "prediction": str(result)
    }