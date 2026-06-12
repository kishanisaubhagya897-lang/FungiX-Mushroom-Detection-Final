import { router, useLocalSearchParams } from "expo-router";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import React, { useEffect, useRef } from "react";
import { Animated, Image, StyleSheet, Text, View } from "react-native";
import { auth, db } from "../firebaseConfig";

export default function Scanning() {
  const params = useLocalSearchParams();

  const image =
    typeof params.image === "string" ? params.image : params.image?.[0];

  const scanAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(scanAnim, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      }),
    ).start();

    processDemoDetection();
  }, []);

  const processDemoDetection = async () => {
    try {
      const demoResult = {
        mushroomName: "Chanterelle",
        scientificName: "Cantharellus cibarius",
        type: "Edible",
        confidence: 85,
        imageUrl: image || "",
        description:
          "Chanterelle mushrooms are brightly yellow mushrooms with fruity aroma.",
        habitat: "Mixed forests near oak, birch, and beech trees.",
        season: "Late summer to early autumn.",
        conditions: "Moist forest soil.",
        notes: "Always consult an expert before consuming wild mushrooms.",
        scanDate: serverTimestamp(),
      };

      const docRef = await addDoc(collection(db, "detections"), demoResult);

      await addDoc(collection(db, "notifications"), {
        title: "Edible Mushroom Identified",

        message: demoResult.mushroomName,

        type: "success",

        userId: auth.currentUser?.uid,

        createdAt: serverTimestamp(),
      });

      setTimeout(() => {
        router.replace({
          pathname: "/analysis-complete",
          params: {
            id: docRef.id,
            image: image || "",
          },
        });
      }, 3000);
    } catch (error) {
      console.log("Firebase error:", error);

      router.replace({
        pathname: "/analysis-complete",
        params: {
          id: "demo123",
          image: image || "",
        },
      });
    }
  };

  const translateY = scanAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-120, 120],
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>AI Mushroom Analysis</Text>

      <View style={styles.imageWrapper}>
        <Image source={{ uri: image }} style={styles.image} />

        <Animated.View
          style={[styles.scanLine, { transform: [{ translateY }] }]}
        />
      </View>

      <Text style={styles.text}>Analyzing Mushroom...</Text>

      <Text style={styles.subText}>AI model simulation in progress</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#081C15",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  title: {
    color: "#F1FAEE",
    fontSize: 26,
    fontWeight: "700",
    marginBottom: 30,
  },

  imageWrapper: {
    position: "relative",
  },

  image: {
    width: 280,
    height: 280,
    borderRadius: 24,
  },

  scanLine: {
    position: "absolute",
    width: 280,
    height: 5,
    backgroundColor: "#52B788",
    shadowColor: "#52B788",
    shadowOpacity: 0.8,
    shadowRadius: 10,
  },

  text: {
    marginTop: 30,
    fontWeight: "700",
    fontSize: 20,
    color: "#F1FAEE",
  },

  subText: {
    marginTop: 10,
    color: "#B7C9B2",
    fontSize: 15,
  },
});
