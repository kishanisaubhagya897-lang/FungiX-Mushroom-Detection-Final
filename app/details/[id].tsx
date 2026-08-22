import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function DetailsScreen() {
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

          <Text style={styles.headerTitle}>Mushroom Details</Text>

          <View style={{ width: 44 }} />
        </View>

        {/* HERO IMAGE */}
        <Image
          source={{
            uri:
              image ||
              "https://images.unsplash.com/photo-1501004318641-b39e6451bec6",
          }}
          style={styles.heroImage}
        />

        {/* TITLE */}
       <Text style={styles.name}>
  {isPoisonous
    ? "Poisonous Mushroom"
    : "Edible Mushroom"}
</Text>

        <View style={styles.scientificRow}>
        <Ionicons
  name="flask-outline"
  size={18}
  color="#A8D5BA"
/>
          <Text style={styles.scientific}>
  {isPoisonous
    ? "Potentially Toxic Species"
    : "Cantharellus cibarius"}
</Text>
        </View>

        {/* DESCRIPTION */}
       <View
  style={[
    styles.card,
    {
      backgroundColor: isPoisonous
        ? "#991B1B"
        : "#1B4332",
    },
  ]}
>
          <View style={styles.cardHeader}>
            <Ionicons
              name="document-text-outline"
              size={22}
              color="#52B788"
            />
            <Text style={styles.cardTitle}>Description</Text>
          </View>

         <Text style={styles.cardText}>
  {isPoisonous
    ? "This mushroom has been classified as potentially poisonous by the AI model. Consumption is not recommended."
    : "This mushroom has been classified as edible by the AI model and appears safe based on the selected features."}
</Text>
        </View>

        {/* HABITAT */}
        <View
  style={[
    styles.card,
    {
      backgroundColor: isPoisonous
        ? "#991B1B"
        : "#1B4332",
    },
  ]}
>
          <View style={styles.cardHeader}>
            <Ionicons
              name="leaf-outline"
              size={22}
              color="#52B788"
            />
            <Text style={styles.cardTitle}>Habitat</Text>
          </View>

          <Text style={styles.cardText}>
            Usually found in mixed forests near oak, birch,
            and beech trees.
          </Text>
        </View>

        {/* SEASON */}
       <View
  style={[
    styles.card,
    {
      backgroundColor: isPoisonous
        ? "#991B1B"
        : "#1B4332",
    },
  ]}
>
          <View style={styles.cardHeader}>
            <Ionicons
              name="sunny-outline"
              size={22}
              color="#FFD166"
            />
            <Text style={styles.cardTitle}>Season</Text>
          </View>

          <Text style={styles.cardText}>
            Late summer through autumn.
          </Text>
        </View>

        {/* CONDITIONS */}
    <View
  style={[
    styles.card,
    {
      backgroundColor: isPoisonous
        ? "#991B1B"
        : "#1B4332",
    },
  ]}
>
          <View style={styles.cardHeader}>
            <Ionicons
              name="rainy-outline"
              size={22}
              color="#64B5F6"
            />
            <Text style={styles.cardTitle}>Conditions</Text>
          </View>

          <Text style={styles.cardText}>
            Thrives in moist woodland soil and shaded conditions.
          </Text>
        </View>

        {/* WARNING */}
        <View style={styles.warningBox}>
          <View style={styles.cardHeader}>
            <Ionicons
              name="warning-outline"
              size={22}
              color="#FFD166"
            />
            <Text style={styles.warningTitle}>Safety Notice</Text>
          </View>

          <Text style={styles.warningText}>
            Always consult a mushroom expert before consuming wild
            mushrooms. AI predictions are for guidance only.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#081C15",
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginTop: 10,
    marginBottom: 20,
  },

  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 16,
    backgroundColor: "#1B4332",
    justifyContent: "center",
    alignItems: "center",
  },

  headerTitle: {
    color: "#F1FAEE",
    fontSize: 22,
    fontWeight: "700",
  },

  heroImage: {
    width: "90%",
    height: 260,
    borderRadius: 28,
    alignSelf: "center",
    marginBottom: 24,
  },

  name: {
    color: "#fff",
    fontSize: 30,
    fontWeight: "700",
    paddingHorizontal: 20,
  },

  scientificRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    marginTop: 8,
    marginBottom: 24,
  },

  scientific: {
    color: "#A8D5BA",
    marginLeft: 8,
    fontSize: 15,
    fontStyle: "italic",
  },

  card: {
    backgroundColor: "#1B4332",
    marginHorizontal: 20,
    borderRadius: 22,
    padding: 18,
    marginBottom: 16,
  },

  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },

  cardTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    marginLeft: 10,
  },

  cardText: {
    color: "#D8F3DC",
    fontSize: 15,
    lineHeight: 24,
  },

  warningBox: {
    backgroundColor: "#2B3A2F",
    marginHorizontal: 20,
    borderRadius: 22,
    padding: 18,
    marginBottom: 30,
  },

  warningTitle: {
    color: "#FFD166",
    fontSize: 18,
    fontWeight: "700",
    marginLeft: 10,
  },

  warningText: {
    color: "#F1FAEE",
    lineHeight: 24,
    marginTop: 8,
  },
});