FUNGIX — FINAL MULTIMODAL MODEL DEPLOYMENT PACKAGE
===================================================

System
------
Mushroom Identification Using a Mobile Application
with Image Recognition and Macro-Morphological Features

FINAL MODEL
-----------
Image Branch:
    ViT-Small (vit_small_patch16_224)
    384-dimensional feature representation
    StandardScaler + LogisticRegression classifier

Morphology Branch:
    Domain-adapted XGBoost
    8 macro-morphological features

Fusion:
    Fixed 70:30 probability fusion

    P_fusion =
        0.70 * P_ViT +
        0.30 * P_XGBoost

Classes
-------
0 = Edible
1 = Poisonous


MORPHOLOGY FEATURES
-------------------
1. cap-shape
2. cap-color
3. cap-surface
4. gill-attachment
5. ring-number
6. stalk-root
7. gill-color
8. stalk-shape


MISSING VALUES
--------------
Missing morphology values must remain NaN.

Do NOT artificially impute missing morphology
values during deployment.

The XGBoost model supports missing values natively.


PROTECTED EVALUATION
--------------------
54 specimens

Edible:     36
Poisonous:  18

The protected 54 specimens were not used for:

- training
- tuning
- fusion-weight optimization
- category mapping


FINAL PROTECTED PERFORMANCE
---------------------------
ViT:
    48 / 54
    Accuracy = 88.89%

XGBoost:
    50 / 54
    Accuracy = 92.59%

Fusion:
    48 / 54
    Accuracy = 88.89%


INTERPRETATION
--------------
The domain-adapted XGBoost branch achieved the highest
accuracy on the protected 54-specimen evaluation subset.

The fixed 70:30 fusion did not improve accuracy over
the ViT branch and was 3.70 percentage points below
XGBoost.

Therefore, the research results must NOT claim that
fusion outperformed the individual models.


DEPLOYMENT SAFETY
-----------------
This system is intended as an educational and
decision-support tool.

It should NOT be treated as:

- an expert replacement
- a definitive species identification system
- a guarantee of mushroom edibility
- the sole basis for consuming a wild mushroom


ARTIFACTS
---------
ViT_Small_pretrained_backbone.pth
ViT_Small_transfer_classifier.joblib
ViT_Small_preprocessing_config.json
XGBoost_domain_adapted_exact54.json
XGBoost_morphology_category_mapping.json
deployment_config.json
README.txt