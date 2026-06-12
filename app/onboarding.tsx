import React, { useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  StatusBar,
} from "react-native";
import PagerView from "react-native-pager-view";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { MotiView } from "moti";

const { width, height } = Dimensions.get("window");

const slides: {
  image: any;
  title: string;
  desc: string;
  colors: readonly [string, string, string];
}[] = [
  {
    image: require("../assets/images/on1.png"),
    title: "Identify Mushrooms Instantly",
    desc:
      "Scan or upload mushroom images and get instant AI-powered identification.",
    colors: ["#F8FCF7", "#E8F7EA", "#D6F0DB"],
  },
  {
    image: require("../assets/images/on3.png"),
    title: "Safety First",
    desc:
      "Never consume wild mushrooms without proper identification. FungiX helps you stay safe with AI-powered detection.",
    colors: ["#FFF9F4", "#FFF0E1", "#FFE4CC"],
  },
  {
    image: require("../assets/images/on2.png"),
    title: "Track Your Journey",
    desc:
      "Save scan history, review identifications, and stay informed safely.",
    colors: ["#F4FBF6", "#DDF4E5", "#CDEAD8"],
  },
];

export default function Onboarding() {
  const pagerRef = useRef<PagerView>(null);
  const [currentPage, setCurrentPage] = useState(0);

  const finish = async () => {
    await AsyncStorage.setItem("onboardingSeen", "true");
    router.replace("/login");
  };

  const nextPage = () => {
    if (currentPage < slides.length - 1) {
      pagerRef.current?.setPage(currentPage + 1);
    } else {
      finish();
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar barStyle="dark-content" />

      <PagerView
        style={{ flex: 1 }}
        initialPage={0}
        ref={pagerRef}
        onPageSelected={(e) =>
          setCurrentPage(e.nativeEvent.position)
        }
      >
        {slides.map((slide, index) => (
          <LinearGradient
            key={index}
            colors={slide.colors}
            style={styles.container}
          >
            <TouchableOpacity
              style={styles.skipBtn}
              onPress={finish}
              activeOpacity={0.85}
            >
              <Text style={styles.skipText}>Skip</Text>
            </TouchableOpacity>

            <MotiView
              from={{
                opacity: 0,
                scale: 0.9,
                translateY: 30,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                translateY: 0,
              }}
              transition={{
                type: "timing",
                duration: 700,
              }}
            >
              <Image
                source={slide.image}
                style={styles.image}
                resizeMode="contain"
              />
            </MotiView>

            <View style={styles.textWrapper}>
              <Text style={styles.title}>
                {slide.title}
              </Text>

              <Text style={styles.desc}>
                {slide.desc}
              </Text>
            </View>

            <View style={styles.dotsRow}>
              {slides.map((_, dotIndex) => (
                <View
                  key={dotIndex}
                  style={[
                    styles.dot,
                    currentPage === dotIndex &&
                      styles.activeDot,
                  ]}
                />
              ))}
            </View>

            <TouchableOpacity
              style={styles.nextBtn}
              onPress={nextPage}
              activeOpacity={0.85}
            >
              <Text style={styles.nextBtnText}>
                {currentPage === slides.length - 1
                  ? "Get Started"
                  : "Next"}
              </Text>
            </TouchableOpacity>
          </LinearGradient>
        ))}
      </PagerView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: "space-between",
    alignItems: "center",
  },

  skipBtn: {
    alignSelf: "flex-end",
    marginTop: 12,
    backgroundColor: "rgba(255,255,255,0.45)",
    paddingHorizontal: 22,
    paddingVertical: 10,
    borderRadius: 30,
  },

  skipText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#2E7D32",
  },

  image: {
    width: width * 0.95,
    height: height * 0.42,
    marginTop: 20,
  },

  textWrapper: {
    alignItems: "center",
    paddingHorizontal: 10,
    marginTop: -20,
  },

  title: {
    fontSize: 34,
    fontWeight: "900",
    color: "#145A1D",
    textAlign: "center",
    lineHeight: 46,
  },

  desc: {
    fontSize: 18,
    color: "#4E6E55",
    textAlign: "center",
    lineHeight: 28,
    marginTop: 18,
    fontWeight: "500",
  },

  dotsRow: {
    flexDirection: "row",
    marginTop: 10,
  },

  dot: {
    width: 12,
    height: 12,
    borderRadius: 20,
    backgroundColor: "#B9D7BE",
    marginHorizontal: 7,
  },

  activeDot: {
    width: 34,
    backgroundColor: "#2E7D32",
  },

  nextBtn: {
    width: "100%",
    backgroundColor: "#2E7D32",
    paddingVertical: 20,
    borderRadius: 28,
    alignItems: "center",
    marginBottom: 28,
    shadowColor: "#2E7D32",
    shadowOpacity: 0.25,
    shadowRadius: 14,
    elevation: 6,
  },

  nextBtnText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "800",
    letterSpacing: 0.4,
  },
});