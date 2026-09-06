import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import {
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AnalysisComplete() {
  const params = useLocalSearchParams();

  const prediction =
  typeof params.prediction === "string"
    ? params.prediction
    : params.prediction?.[0];

const isPoisonous = prediction === "p";

  const image =
    typeof params.image === "string"
      ? params.image
      : params.image?.[0];

  const id =
  typeof params.id === "string"
    ? params.id
    : params.id?.[0];

const confidenceValue =
  typeof params.confidence === "string"
    ? Number(params.confidence)
    : Number(params.confidence?.[0] || 0);

const confidencePercent = Math.round(
  confidenceValue * 100,
);




  return (
    <SafeAreaView
  style={[
    styles.container,
    {
      backgroundColor: isPoisonous
        ? "#7F1D1D"
        : "#081C15",
    },
  ]}
  edges={["top"]}
>
      <StatusBar barStyle="light-content" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={22} color="#fff" />
          </TouchableOpacity>

          <Text style={styles.logo}>FungiX</Text>

          <TouchableOpacity style={styles.infoBtn}>
            <Ionicons
              name="information-circle-outline"
              size={24}
              color="#fff"
            />
          </TouchableOpacity>
        </View>

        {/* IMAGE */}
        <Image source={{ uri: image }} style={styles.heroImage} />

        {/* CHECK ICON */}
       <View
  style={[
    styles.checkCircle,
    {
      backgroundColor: isPoisonous
        ? "#FCA5A5"
        : "#A8D5BA",
    },
  ]}
>
         <Ionicons
  name={
    isPoisonous
      ? "warning"
      : "checkmark"
  }
  size={38}
  color="#081C15"
/>
        </View>

        {/* TITLE */}
       <Text style={styles.title}>
  {isPoisonous
    ? "Poisonous Mushroom"
    : "Edible Mushroom"}
</Text>

        

        {/* ANALYSIS CARD */}
       <View
  style={[
    styles.analysisCard,
    {
      backgroundColor: isPoisonous
        ? "#991B1B"
        : "#1B4332",
    },
  ]}
>
          <View style={styles.row}>
            <Text style={styles.label}>Status</Text>
            <Text style={styles.label}>Confidence</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.status}>
  {isPoisonous
    ? "Model Prediction: Poisonous"
    : "Model Prediction: Edible"}
</Text>
            <Text style={styles.percent}>
              {confidencePercent}%
            </Text>
          </View>

          <View style={styles.progressBg}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${confidencePercent}%`,
                },
              ]}
            />
          </View>

          <View style={styles.infoList}>
            <Text style={styles.infoItem}>
              ✅ Edibility classification completed
            </Text>
            <Text style={styles.infoItem}>
              ✅ Safety information available
            </Text>
            <Text style={styles.infoItem}>
              ✅ Match confidence: {confidencePercent}%
            </Text>
          </View>
        </View>

        {/* BUTTONS */}
        <TouchableOpacity
  style={[
    styles.primaryBtn,
    {
      backgroundColor: isPoisonous
        ? "#DC2626"
        : "#52B788",
    },
  ]}
  onPress={() => {
            if (!id) return;

          router.push({
  pathname: "/details/[id]",
  params: {
    id: String(id),
    image: image || "",
    prediction: prediction,
  },
});
          }}
        >
         <Text
  style={[
    styles.primaryText,
    {
      color: isPoisonous
        ? "#FFFFFF"
        : "#081C15",
    },
  ]}
>
            View Details →
          </Text>
        </TouchableOpacity>

       

        {/* WARNING */}
        <View style={styles.warningBox}>
          <Text style={styles.warningTitle}>
            ⚠ Important Notice
          </Text>

          <Text style={styles.warningText}>
            Always consult an expert before consuming wild
            mushrooms. AI guidance is not 100% guaranteed.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 24,
  },

  backBtn: {
    width: 46,
    height: 46,
    borderRadius: 16,
    backgroundColor: "#1B4332",
    justifyContent: "center",
    alignItems: "center",
  },

  infoBtn: {
    width: 46,
    height: 46,
    borderRadius: 16,
    backgroundColor: "#1B4332",
    justifyContent: "center",
    alignItems: "center",
  },

  logo: {
    color: "#F1FAEE",
    fontSize: 28,
    fontWeight: "700",
  },

  heroImage: {
    width: "100%",
    height: 250,
    borderRadius: 28,
  },

  checkCircle: {
    width: 78,
    height: 78,
    borderRadius: 39,
    backgroundColor: "#A8D5BA",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginTop: -38,
    borderWidth: 5,
    borderColor: "#081C15",
  },

  title: {
    color: "#F1FAEE",
    fontSize: 32,
    fontWeight: "700",
    textAlign: "center",
    marginTop: 18,
  },

  subtitle: {
    color: "#B7C9B2",
    textAlign: "center",
    marginTop: 8,
    marginBottom: 22,
    fontSize: 15,
  },

  analysisCard: {
    backgroundColor: "#1B4332",
    borderRadius: 24,
    padding: 20,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },

  label: {
    color: "#B7C9B2",
    fontSize: 14,
  },

  status: {
    color: "#F1FAEE",
    fontWeight: "700",
  },

  percent: {
    color: "#F1FAEE",
    fontWeight: "700",
  },

  progressBg: {
    height: 12,
    backgroundColor: "#355E4A",
    borderRadius: 10,
    marginVertical: 14,
  },

  progressFill: {
    width: "85%",
    height: 12,
    backgroundColor: "#52B788",
    borderRadius: 10,
  },

  infoList: {
    marginTop: 12,
  },

  infoItem: {
    color: "#D8F3DC",
    marginBottom: 8,
    fontSize: 15,
  },

  primaryBtn: {
    backgroundColor: "#52B788",
    padding: 18,
    borderRadius: 20,
    marginTop: 24,
    alignItems: "center",
  },

  primaryText: {
    color: "#081C15",
    fontWeight: "700",
    fontSize: 17,
  },

  secondaryBtn: {
    backgroundColor: "#1B4332",
    padding: 18,
    borderRadius: 20,
    marginTop: 14,
    alignItems: "center",
  },

  secondaryText: {
    color: "#F1FAEE",
    fontWeight: "700",
    fontSize: 17,
  },

  warningBox: {
    backgroundColor: "#2B3A2F",
    padding: 18,
    borderRadius: 20,
    marginTop: 24,
  },

  warningTitle: {
    color: "#FFD166",
    fontWeight: "700",
    marginBottom: 10,
    fontSize: 16,
  },

  warningText: {
    color: "#D8F3DC",
    lineHeight: 22,
  },
});