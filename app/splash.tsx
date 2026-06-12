import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import LottieView from "lottie-react-native";
import { MotiText, MotiView } from "moti";
import React, { useEffect } from "react";
import { Dimensions, StatusBar, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width, height } = Dimensions.get("window");

export default function Splash() {
  useEffect(() => {
    const checkNavigation = async () => {
     await AsyncStorage.removeItem("onboardingSeen");
const seen = await AsyncStorage.getItem("onboardingSeen");

      setTimeout(() => {
        if (seen === "true") {
          router.replace("/login");
        } else {
          router.replace("/onboarding");
        }
      }, 4800);
    };

    checkNavigation();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar barStyle="dark-content" />

      <LinearGradient
        colors={["#F9FCF8", "#EEF8F0", "#DDF3E4"]}
        style={styles.container}
      >
        {/* Premium ambient glow */}
        <View style={styles.glow1} />
        <View style={styles.glow2} />

        {/* Hero Animation */}
        <MotiView
          from={{
            opacity: 0,
            scale: 0.75,
            translateY: 30,
          }}
          animate={{
            opacity: 1,
            scale: 1,
            translateY: 0,
          }}
          transition={{
            type: "timing",
            duration: 1400,
          }}
          style={styles.animationWrapper}
        >
          <LottieView
            source={require("../assets/images/animations/fungix-splash.json")}
            autoPlay
            loop
            style={styles.animation}
          />
        </MotiView>

        {/* Brand Name */}
        <MotiText
          from={{
            opacity: 0,
            translateY: 20,
          }}
          animate={{
            opacity: 1,
            translateY: 0,
          }}
          transition={{
            delay: 1200,
            duration: 900,
          }}
          style={styles.title}
        >
          FungiX
        </MotiText>

        {/* Subtitle */}
        <MotiText
          from={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          transition={{
            delay: 1700,
            duration: 1000,
          }}
          style={styles.subtitle}
        >
          Detect • Identify • Stay Safe
        </MotiText>

        {/* Premium loading animation */}
        <View style={styles.loaderRow}>
          {[0, 1, 2].map((i) => (
            <MotiView
              key={i}
              from={{
                opacity: 0.25,
                scale: 0.8,
              }}
              animate={{
                opacity: 1,
                scale: 1.15,
              }}
              transition={{
                loop: true,
                type: "timing",
                duration: 650,
                delay: i * 250,
              }}
              style={styles.dot}
            />
          ))}
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },

  glow1: {
    position: "absolute",
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: "rgba(46,125,50,0.08)",
    top: 90,
    left: -40,
  },

  glow2: {
    position: "absolute",
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: "rgba(76,175,80,0.06)",
    bottom: 100,
    right: -60,
  },

  animationWrapper: {
    alignItems: "center",
    justifyContent: "center",
  },

  animation: {
    width: width * 0.72,
    height: width * 0.72,
  },

  title: {
    fontSize: 42,
    fontWeight: "900",
    color: "#1B5E20",
    letterSpacing: 1.5,
    marginTop: 10,
  },

  subtitle: {
    fontSize: 16,
    color: "#4B6B50",
    marginTop: 12,
    textAlign: "center",
    fontWeight: "600",
    letterSpacing: 0.5,
  },

  loaderRow: {
    flexDirection: "row",
    marginTop: 40,
  },

  dot: {
    width: 12,
    height: 12,
    borderRadius: 20,
    backgroundColor: "#2E7D32",
    marginHorizontal: 8,
  },
});
