import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";

import React, { useState } from "react";
import {
    Alert,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export default function MorphologicalFeaturesScreen() {
  const router = useRouter();

  const params = useLocalSearchParams();

  const image =
    typeof params.image === "string" ? params.image : params.image?.[0];

  const [capShape, setCapShape] = useState("");
  const [capColor, setCapColor] = useState("");
  const [gillType, setGillType] = useState("");
  const [ringPresence, setRingPresence] = useState("");
  const [volvaPresence, setVolvaPresence] = useState("");
  const [surfaceTexture, setSurfaceTexture] = useState("");

  const completedCount = [
    capShape,
    capColor,
    gillType,
    ringPresence,
    volvaPresence,
    surfaceTexture,
  ].filter(Boolean).length;

  const progressPercentage = (completedCount / 6) * 100;

  const handleContinue = () => {
    if (
      !capShape ||
      !capColor ||
      !gillType ||
      !ringPresence ||
      !volvaPresence ||
      !surfaceTexture
    ) {
      Alert.alert(
        "Incomplete Information",
        "Please select all mushroom features.",
      );
      return;
    }

    const featureData = {
      capShape,
      capColor,
      gillType,
      ringPresence,
      volvaPresence,
      surfaceTexture,
    };

    router.push({
      pathname: "/scanning",
      params: {
        image: image as string,
        featureData: JSON.stringify(featureData),
      },
    });
  };

  return (
    <LinearGradient
      colors={["#081C15", "#0B2E22", "#114232"]}
      style={{ flex: 1 }}
    >
      <ScrollView
        contentContainerStyle={{ paddingBottom: 30 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={26} color="#fff" />
          </TouchableOpacity>

          <Text style={styles.logo}>FungiX</Text>

          <View style={{ width: 26 }} />
        </View>

        {/* Step */}
        <View style={styles.stepContainer}>
          <Text style={styles.title}>Mushroom Features</Text>
          <Text style={styles.subtitle}>
            Help us improve identification accuracy by selecting mushroom
            characteristics.
          </Text>
        </View>

        {/* Image Preview */}
        <View style={styles.imageCard}>
          <Image source={{ uri: image }} style={styles.image} />
          <Text style={styles.imageText}>Selected Mushroom Image</Text>
        </View>

        {/* Feature Cards */}

        <View style={styles.card}>
          <Text style={styles.cardTitle}>🍄 Cap Shape</Text>

          <View style={styles.optionGrid}>
            {["Convex", "Flat", "Conical", "Funnel-shaped", "Irregular"].map(
              (item, index, array) => (
                <TouchableOpacity
                  key={item}
                  style={[
                    styles.optionCard,

                    index === array.length - 1 && styles.lastOptionCard,

                    capShape === item && styles.selectedCard,
                  ]}
                  onPress={() => setCapShape(item)}
                >
                  <Text
                    style={[
                      styles.optionText,
                      capShape === item && styles.selectedText,
                    ]}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              ),
            )}
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>🎨 Cap Color</Text>

          <View style={styles.colorContainer}>
            {[
              {
                label: "White",
                color: "#F5F5F5",
              },
              {
                label: "Yellow",
                color: "#FFD60A",
              },
              {
                label: "Brown",
                color: "#8B5E3C",
              },
              {
                label: "Orange",
                color: "#FF7B00",
              },
              {
                label: "Purple",
                color: "#9D4EDD",
              },
            ].map((item) => (
              <TouchableOpacity
                key={item.label}
                style={styles.colorItem}
                onPress={() => setCapColor(item.label)}
              >
                <View
                  style={[
                    styles.colorCircle,
                    {
                      backgroundColor: item.color,
                    },
                    capColor === item.label && styles.selectedColor,
                  ]}
                />

                <Text style={styles.colorLabel}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>🪶 Gill / Underside Type</Text>

          <View style={styles.optionGrid}>
            {["Gills", "Pores", "Spines", "Honeycomb", "No Gills"].map(
              (item, index, array) => (
                <TouchableOpacity
                  key={item}
                  style={[
                    styles.optionCard,

                    index === array.length - 1 &&
                      array.length % 2 !== 0 &&
                      styles.lastOptionCard,
                    gillType === item && styles.selectedCard,
                  ]}
                  onPress={() => setGillType(item)}
                >
                  <Text
                    style={[
                      styles.optionText,
                      gillType === item && styles.selectedText,
                    ]}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              ),
            )}
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>⭕ Ring Presence</Text>

          <View style={styles.optionGrid}>
            {[
              "Ring Present",
              "No Ring",
              "Partial Ring",
              "Ring Zone",
              "Not Visible",
            ].map((item, index, array) => (
              <TouchableOpacity
                key={item}
                style={[
                  styles.optionCard,

                  index === array.length - 1 &&
                    array.length % 2 !== 0 &&
                    styles.lastOptionCard,
                  ringPresence === item && styles.selectedCard,
                ]}
                onPress={() => setRingPresence(item)}
              >
                <Text
                  style={[
                    styles.optionText,
                    ringPresence === item && styles.selectedText,
                  ]}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>🌱 Volva Presence</Text>

          <View style={styles.optionGrid}>
            {[
              "Cup Base",
              "Clean Base",
              "Basal Bulb",
              "Rings",
              "Not Visible",
            ].map((item, index, array) => (
              <TouchableOpacity
                key={item}
                style={[
                  styles.optionCard,

                  index === array.length - 1 &&
                    array.length % 2 !== 0 &&
                    styles.lastOptionCard,
                  volvaPresence === item && styles.selectedCard,
                ]}
                onPress={() => setVolvaPresence(item)}
              >
                <Text
                  style={[
                    styles.optionText,
                    volvaPresence === item && styles.selectedText,
                  ]}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>✨ Surface Texture</Text>

          <View style={styles.optionGrid}>
            {["Smooth", "Warty", "Slimy", "Velvety", "Honeycomb"].map(
              (item, index, array) => (
                <TouchableOpacity
                  key={item}
                  style={[
                    styles.optionCard,

                    index === array.length - 1 &&
                      array.length % 2 !== 0 &&
                      styles.lastOptionCard,
                    surfaceTexture === item && styles.selectedCard,
                  ]}
                  onPress={() => setSurfaceTexture(item)}
                >
                  <Text
                    style={[
                      styles.optionText,
                      surfaceTexture === item && styles.selectedText,
                    ]}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              ),
            )}
          </View>
        </View>

        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>
            Completed {completedCount}/6 Features
          </Text>

          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${progressPercentage}%`,
                },
              ]}
            />
          </View>
        </View>

        {/* Continue Button */}
        <TouchableOpacity onPress={handleContinue}>
          <LinearGradient
            colors={["#52B788", "#95D5B2"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.button}
          >
            <Text style={styles.buttonText}>Continue Analysis →</Text>
          </LinearGradient>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </LinearGradient>
  );
}

function FeaturePicker({ title, value, onValueChange, items }: any) {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{title}</Text>

      <Picker
        selectedValue={value}
        onValueChange={onValueChange}
        dropdownIconColor="#74C69D"
        style={styles.picker}
      >
        <Picker.Item label="Select an option" value="" color="#999" />

        {items.map((item: string) => (
          <Picker.Item key={item} label={item} value={item} />
        ))}
      </Picker>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#001D1A",
  },

  header: {
    marginTop: 60,
    marginHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  logo: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "bold",
  },

  stepContainer: {
    paddingHorizontal: 20,
    marginTop: 25,
  },

  stepText: {
    color: "#74C69D",
    fontWeight: "600",
  },

  title: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "bold",
    marginTop: 8,
  },

  subtitle: {
    color: "#C7D0CC",
    marginTop: 8,
    lineHeight: 22,
  },

  imageCard: {
    marginHorizontal: 20,
    marginTop: 15,
    backgroundColor: "#114232",
    borderRadius: 24,
    overflow: "hidden",

    shadowColor: "#52B788",
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
  },

  image: {
    width: "100%",
    height: 160,
  },

  imageText: {
    color: "#74C69D",
    textAlign: "center",
    padding: 12,
    fontWeight: "600",
  },

  card: {
    backgroundColor: "#123D31",
    marginHorizontal: 20,
    marginTop: 18,
    borderRadius: 18,
    padding: 12,
  },

  cardTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },

  picker: {
    color: "#fff",
    backgroundColor: "#1B5E4A",
    borderRadius: 10,
  },

  button: {
    backgroundColor: "#52B788",
    marginHorizontal: 20,
    marginTop: 30,
    paddingVertical: 18,
    borderRadius: 18,
    alignItems: "center",
  },

  buttonText: {
    color: "#001D1A",
    fontWeight: "bold",
    fontSize: 18,
  },

  optionGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  optionCard: {
    width: "48%",

    backgroundColor: "#184737",

    borderWidth: 1,
    borderColor: "#2D6A4F",

    paddingVertical: 15,

    borderRadius: 14,

    marginTop: 8,
    marginLeft: 6,
    alignItems: "center",
    justifyContent: "center",
  },

  selectedCard: {
    backgroundColor: "#74C69D",
    borderColor: "#95D5B2",

    shadowColor: "#95D5B2",
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 6,
  },
  optionText: {
    color: "#fff",
    fontWeight: "600",
  },

  selectedText: {
    color: "#081C15",
    fontWeight: "700",
  },

  colorContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },

  colorItem: {
    alignItems: "center",
  },

  colorCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: "#ffffff",
  },

  selectedColor: {
    borderWidth: 4,
    borderColor: "#52B788",
  },

  colorLabel: {
    color: "#fff",
    fontSize: 11,
    marginTop: 6,
  },

  progressContainer: {
    marginHorizontal: 20,
    marginTop: 30,
  },

  progressText: {
    color: "#F1FAEE",
    marginBottom: 10,
    fontWeight: "600",
  },

  progressBar: {
    height: 10,
    backgroundColor: "#1B4332",
    borderRadius: 20,
    overflow: "hidden",
  },

  progressFill: {
    height: "100%",
    backgroundColor: "#52B788",
    borderRadius: 20,
  },

  lastOptionCard: {
    width: "100%",
  },
});
