import { router, useLocalSearchParams } from "expo-router";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import React, { useEffect, useRef } from "react";
import {
  Alert,
  Animated,
  Image,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { auth, db } from "../firebaseConfig";

export default function Scanning() {
  const params = useLocalSearchParams();

  const image =
    typeof params.image === "string"
      ? params.image
      : params.image?.[0];

  const featureData =
    typeof params.featureData === "string"
      ? JSON.parse(params.featureData)
      : null;

  const scanAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.timing(scanAnim, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      }),
    );

    animation.start();

    processMultimodalPrediction();

    return () => {
      animation.stop();
    };
  }, []);

  /**
   * ---------------------------------------------------------
   * MORPHOLOGICAL ANALYSIS - DEMO MODE
   * ---------------------------------------------------------
   *
   * The previous XGBoost model has been completely removed.
   *
   *
  * Sends the image and morphological features to the final multimodal model API.
   *
   * For now:
   *
   * Morphological Feature Page
   *          ↓
   *      featureData
   *          ↓
   *    Scanning Demo
   *          ↓
   *  Analysis Complete
   *
   * Once the new XGBoost model is ready,
   * the prediction API will be connected here.
   */

  const processMultimodalPrediction = async () => {
  try {
    console.log("=================================");
    console.log("FUNGI-X MULTIMODAL ANALYSIS");
    console.log("=================================");

    if (!image) {
      throw new Error("No mushroom image received.");
    }

    if (!featureData) {
      throw new Error("No morphological feature data received.");
    }

    console.log("Image:", image);
    console.log("Morphology:", featureData);

    // ---------------------------------------------------------
    // FASTAPI BACKEND
    // ---------------------------------------------------------
    // The phone reaches the backend through the PC's Wi-Fi IP.
    const API_URL = "http://10.107.13.29:8000/predict";

    // ---------------------------------------------------------
    // PREPARE IMAGE
    // ---------------------------------------------------------
    const fileName =
      image.split("/").pop() || "mushroom.jpg";

    const fileExtension =
      fileName.split(".").pop()?.toLowerCase();

    const mimeType =
      fileExtension === "png"
        ? "image/png"
        : "image/jpeg";

    const formData = new FormData();

    formData.append(
      "image",
      {
        uri: image,
        name: fileName,
        type: mimeType,
      } as any,
    );

    // The morphology screen already sends the exact
    // XGBoost feature names and category codes.
    formData.append(
      "morphology",
      JSON.stringify(featureData),
    );

    console.log("Sending prediction request...");

    // ---------------------------------------------------------
    // CALL REAL MULTIMODAL MODEL
    // ---------------------------------------------------------
    const response = await fetch(API_URL, {
      method: "POST",
      body: formData,
    });

    const responseText = await response.text();

    console.log("API Status:", response.status);
    console.log("API Response:", responseText);

    if (!response.ok) {
      throw new Error(
        `Prediction API failed (${response.status}): ${responseText}`,
      );
    }

    let result;

    try {
      result = JSON.parse(responseText);
    } catch {
      throw new Error("Backend returned invalid JSON.");
    }

    // ---------------------------------------------------------
    // HANDLE CLIP NON-MUSHROOM REJECTION
    // ---------------------------------------------------------
    if (
      result.prediction === "Not a Mushroom" &&
      result.gate
    ) {
      console.log("=================================");
      console.log("NON-MUSHROOM IMAGE REJECTED");
      console.log("=================================");
      console.log(
        "Mushroom probability:",
        result.gate.mushroom_probability,
      );
      console.log(
        "Non-mushroom probability:",
        result.gate.non_mushroom_probability,
      );

      Alert.alert(
        "Not a Mushroom",
        "The selected image does not appear to be a mushroom. Please capture or select a clear mushroom image.",
        [
          {
            text: "OK",
            onPress: () => router.back(),
          },
        ],
      );

      return;
    }

    if (!result.success) {
      throw new Error(
        result.detail || "Prediction failed.",
      );
    }

    console.log("=================================");
    console.log("MULTIMODAL PREDICTION SUCCESS");
    console.log("=================================");
    console.log("Prediction:", result.prediction);
    console.log("Confidence:", result.confidence);
    console.log("ViT:", result.models?.image);
    console.log("XGBoost:", result.models?.morphology);
    console.log("Fusion:", result.models?.fusion);

    // ---------------------------------------------------------
    // SAVE REAL DETECTION TO FIREBASE
    // ---------------------------------------------------------
    const prediction =
      result.prediction === "Poisonous"
        ? "Poisonous"
        : "Edible";

    const predictionCode =
      prediction === "Poisonous"
        ? "p"
        : "e";

    const detectionResult = {
      mushroomName:
        prediction === "Edible"
          ? "Edible Mushroom"
          : "Poisonous Mushroom",

      scientificName:
        "Species not determined by the classification model",

      type: prediction,

      confidence: Number(result.confidence || 0),

      imageUrl: image,

      description:
        `The multimodal model classified this specimen as ${prediction}.`,

      habitat: "Not determined",

      season: "Not determined",

      conditions: "Not determined",

      notes:
        "Prediction generated using ViT-Small image recognition, Domain-Adapted XGBoost morphological analysis, and fixed probability fusion.",

      morphologicalFeatures: featureData,

      modelStatus: "production",

      modelName:
        "ViT-Small + Domain-Adapted XGBoost + Fixed Probability Fusion",

      prediction: prediction,

      predictionCode: predictionCode,

      probabilities: result.probabilities || {},

      imageModel: result.models?.image || null,

      morphologyModel:
        result.models?.morphology || null,

      fusionModel:
        result.models?.fusion || null,

      modelVersion:
        result.model_version || "",

      safetyNote:
        result.safety_note || "",

      scanDate: serverTimestamp(),

      userId: auth.currentUser?.uid || null,
    };

    console.log(
      "Saving real detection:",
      detectionResult,
    );

    const docRef = await addDoc(
      collection(db, "detections"),
      detectionResult,
    );

    // ---------------------------------------------------------
    // NOTIFICATION
    // ---------------------------------------------------------
    await addDoc(collection(db, "notifications"), {
      title: "Mushroom Analysis Completed",

      message:
        `The mushroom was classified as ${prediction}.`,

      type: "info",

      userId: auth.currentUser?.uid || null,

      createdAt: serverTimestamp(),
    });

    console.log(
      "Real detection saved:",
      docRef.id,
    );

    // ---------------------------------------------------------
    // MOVE TO ANALYSIS COMPLETE
    // ---------------------------------------------------------
    setTimeout(() => {
      router.replace({
        pathname: "/analysis-complete",

        params: {
          id: docRef.id,

          image: image,

          prediction: predictionCode,

          modelStatus: "production",

          confidence: String(
            result.confidence || 0,
          ),
        },
      });
    }, 3000);
  } catch (error) {
    console.error(
      "Multimodal Processing Error:",
      error,
    );

    // Keep the existing scanning flow from getting stuck.
    setTimeout(() => {
      router.replace({
        pathname: "/analysis-complete",

        params: {
          id: "error",

          image: image || "",

          prediction: "error",

          modelStatus: "error",
        },
      });
    }, 3000);
  }
};

  const translateY = scanAnim.interpolate({
    inputRange: [0, 1],

    outputRange: [-120, 120],
  });

  return (
    <View style={styles.container}>
      {/* TITLE */}

      <Text style={styles.title}>
        AI Mushroom Analysis
      </Text>

      <Text style={styles.modelStatus}>
        Morphological Feature Analysis
      </Text>

      {/* IMAGE */}

      <View style={styles.imageWrapper}>
        {image ? (
          <Image
            source={{ uri: image }}
            style={styles.image}
          />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Text style={styles.placeholderText}>
              Mushroom Image
            </Text>
          </View>
        )}

        <Animated.View
          style={[
            styles.scanLine,
            {
              transform: [{ translateY }],
            },
          ]}
        />
      </View>

      {/* STATUS */}

      <Text style={styles.text}>
        Analyzing Mushroom...
      </Text>

      <Text style={styles.subText}>
        Processing morphological features
      </Text>

      {/* FEATURE COUNT */}

      <View style={styles.featureStatus}>
        <View style={styles.statusDot} />

        <Text style={styles.featureStatusText}>
          8 Morphological Features Collected
        </Text>
      </View>

      {/* MODEL STATUS */}

      <View style={styles.modelCard}>
        <Text style={styles.modelTitle}>
          New XGBoost Model
        </Text>

        <Text style={styles.modelText}>
          Model preparation in progress
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,

    backgroundColor: "#081C15",

    justifyContent: "center",

    alignItems: "center",

    paddingHorizontal: 20,
  },

  title: {
    color: "#F1FAEE",

    fontSize: 26,

    fontWeight: "700",

    marginBottom: 8,
  },

  modelStatus: {
    color: "#74C69D",

    fontSize: 13,

    fontWeight: "600",

    marginBottom: 28,
  },

  imageWrapper: {
    position: "relative",

    width: 280,

    height: 280,

    borderRadius: 24,

    overflow: "hidden",
  },

  image: {
    width: 280,

    height: 280,

    borderRadius: 24,
  },

  imagePlaceholder: {
    width: 280,

    height: 280,

    borderRadius: 24,

    backgroundColor: "#123D31",

    justifyContent: "center",

    alignItems: "center",
  },

  placeholderText: {
    color: "#74C69D",

    fontSize: 15,

    fontWeight: "600",
  },

  scanLine: {
    position: "absolute",

    left: 0,

    width: 280,

    height: 5,

    backgroundColor: "#52B788",

    shadowColor: "#52B788",

    shadowOpacity: 0.8,

    shadowRadius: 10,

    elevation: 8,
  },

  text: {
    marginTop: 30,

    fontWeight: "700",

    fontSize: 20,

    color: "#F1FAEE",
  },

  subText: {
    marginTop: 8,

    color: "#B7C9B2",

    fontSize: 14,
  },

  featureStatus: {
    marginTop: 20,

    flexDirection: "row",

    alignItems: "center",

    backgroundColor: "#123D31",

    borderWidth: 1,

    borderColor: "#245A47",

    paddingHorizontal: 15,

    paddingVertical: 10,

    borderRadius: 30,
  },

  statusDot: {
    width: 8,

    height: 8,

    borderRadius: 4,

    backgroundColor: "#74C69D",

    marginRight: 8,
  },

  featureStatusText: {
    color: "#D8E9E2",

    fontSize: 12,

    fontWeight: "600",
  },

  modelCard: {
    marginTop: 16,

    width: "100%",

    maxWidth: 320,

    backgroundColor: "#0F3025",

    borderWidth: 1,

    borderColor: "#245A47",

    borderRadius: 16,

    padding: 14,

    alignItems: "center",
  },

  modelTitle: {
    color: "#74C69D",

    fontSize: 13,

    fontWeight: "800",
  },

  modelText: {
    color: "#8EAAA0",

    fontSize: 11,

    marginTop: 4,
  },
});