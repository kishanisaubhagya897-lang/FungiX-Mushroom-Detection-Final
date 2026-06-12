import React, { useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  Animated,
} from "react-native";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import LottieView from "lottie-react-native";

export default function LoadingScreen() {
  const fadeAnim = new Animated.Value(0);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();

    const timer = setTimeout(() => {
      router.replace("/(tabs)/main");
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <LinearGradient
      colors={[
        "#FDFEFD",
        "#F4FAF5",
        "#EDF8F0",
      ]}
      style={{ flex: 1 }}
    >
      {/* ambient glow */}
      <View
        style={{
          position: "absolute",
          top: -140,
          right: -120,
          width: 300,
          height: 300,
          borderRadius: 150,
          backgroundColor:
            "rgba(46,125,50,0.05)",
        }}
      />

      <View
        style={{
          position: "absolute",
          bottom: -140,
          left: -120,
          width: 320,
          height: 320,
          borderRadius: 160,
          backgroundColor:
            "rgba(46,125,50,0.04)",
        }}
      />

      <SafeAreaView style={{ flex: 1 }}>
        <Animated.View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: 30,
            opacity: fadeAnim,
          }}
        >
          {/* AI animation ONLY */}
          <LottieView
            source={require("../assets/images/animations/loading.json")}
            autoPlay
            loop
            style={{
              width: 360,
              height: 360,
            }}
          />

          <Text
            style={{
              fontSize: 30,
              fontWeight: "900",
              color: "#163B1D",
              marginTop: -25,
              letterSpacing: -0.5,
            }}
          >
            FungiX AI
          </Text>

          <Text
            style={{
              fontSize: 15,
              color: "#6B7C70",
              textAlign: "center",
              marginTop: 12,
              lineHeight: 24,
            }}
          >
            Analyzing your environment and
            preparing your dashboard...
          </Text>
        </Animated.View>
      </SafeAreaView>
    </LinearGradient>
  );
}