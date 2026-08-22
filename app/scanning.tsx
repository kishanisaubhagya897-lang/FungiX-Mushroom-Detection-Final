import { router, useLocalSearchParams } from "expo-router";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import React, { useEffect, useRef } from "react";
import {
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

    processMorphologicalDemo();

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
   * The new XGBoost model is still being prepared.
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

  const processMorphologicalDemo = async () => {
    try {
      console.log("=================================");
      console.log("MORPHOLOGICAL ANALYSIS - DEMO");
      console.log("=================================");

      console.log("Received New Feature Data:");
      console.log(featureData);

      /**
       * Current new feature structure:
       *
       * capShape
       * capColor
       * capSurfaceTexture
       * undersideType
       * ringPresence
       * volvaPresence
       * gillColor
       * stalkShape
       */

      if (!featureData) {
        console.warn("No morphological feature data received.");
      }

      /**
       * -----------------------------------------------------
       * TEMPORARY DEMO RESULT
       * -----------------------------------------------------
       *
       * This is NOT an XGBoost prediction.
       *
       * It only stores the morphological feature data so
       * that the complete application flow can be tested
       * before the new model is deployed.
       */

      const demoResult = {
        mushroomName: "Morphological Analysis Pending",

        scientificName: "New XGBoost Model - Preparing",

        type: "Pending",

        confidence: 0,

        imageUrl: image || "",

        description:
          "Morphological features collected successfully. The new XGBoost model is currently being prepared.",

        habitat: "Pending",

        season: "Pending",

        conditions: "Pending",

        notes:
          "This is a demonstration result. No mushroom classification has been generated yet. The new XGBoost model will be integrated after model preparation.",

        morphologicalFeatures: featureData || {},

        modelStatus: "development",

        modelName: "New XGBoost Morphological Model",

        scanDate: serverTimestamp(),

        userId: auth.currentUser?.uid || null,
      };

      console.log("Demo Result:");
      console.log(demoResult);

      /**
       * Save the demo scan to Firebase.
       *
       * This allows the existing History / Detection
       * functionality to continue working while the
       * new model is being prepared.
       */

      const docRef = await addDoc(
        collection(db, "detections"),
        demoResult,
      );

      /**
       * Temporary notification
       */

      await addDoc(collection(db, "notifications"), {
        title: "Morphological Analysis Completed",

        message:
          "8 morphological features were successfully collected.",

        type: "info",

        userId: auth.currentUser?.uid || null,

        createdAt: serverTimestamp(),
      });

      console.log("Demo detection saved:", docRef.id);

      /**
       * Wait for the scanning animation to complete
       * before moving to the result screen.
       */

      setTimeout(() => {
        router.replace({
          pathname: "/analysis-complete",

          params: {
            id: docRef.id,

            image: image || "",

            prediction: "pending",

            modelStatus: "development",
          },
        });
      }, 3000);
    } catch (error) {
      console.error(
        "Morphological Demo Processing Error:",
        error,
      );

      /**
       * Even if Firebase saving fails, move to the
       * analysis screen so that the application does
       * not remain stuck on the scanning page.
       */

      setTimeout(() => {
        router.replace({
          pathname: "/analysis-complete",

          params: {
            id: "demo",

            image: image || "",

            prediction: "pending",

            modelStatus: "development",
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