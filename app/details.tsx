import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function Details() {
  const {
    image,
    mushroomName,
    scientificName,
    confidence,
    description,
    habitat,
    type,
    season,
    conditions,
    notes,
  } = useLocalSearchParams();

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.heroContainer}>
        <Image source={{ uri: image as string }} style={styles.heroImage} />
      </View>

      <TouchableOpacity
        style={styles.floatingBack}
        onPress={() => router.back()}
      >
        <Ionicons name="arrow-back" size={22} color="#fff" />
      </TouchableOpacity>

      <View style={styles.content}>
        <Text style={styles.title}>{mushroomName}</Text>

        <Text style={styles.scientific}>{scientificName}</Text>

        <View style={styles.confidenceCard}>
          <Text style={styles.confidenceText}>
            🌿 AI Confidence: {confidence}%
          </Text>
        </View>

        <View
          style={[
            styles.typeBadge,
            {
              backgroundColor: type === "Edible" ? "#E8F5E9" : "#FFE5E5",
            },
          ]}
        >
          <Text
            style={{
              color: type === "Edible" ? "#2D6A4F" : "#D32F2F",
              fontWeight: "700",
            }}
          >
            {type}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>

          <Text style={styles.sectionText}>{description}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Habitat</Text>

          <Text style={styles.sectionText}>{habitat}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Season</Text>

          <Text style={styles.sectionText}>{season}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Conditions</Text>

          <Text style={styles.sectionText}>{conditions}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notes</Text>

          <Text style={styles.sectionText}>{notes}</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3FAF5",
  },

  floatingBack: {
    position: "absolute",
    top: 55,
    left: 20,
    zIndex: 999,

    width: 44,
    height: 44,

    borderRadius: 22,

    backgroundColor: "rgba(0,0,0,0.3)",

    justifyContent: "center",
    alignItems: "center",
  },

  image: {
    width: "100%",
    height: 250,
    borderRadius: 20,
    marginBottom: 20,
  },

  title: {
    fontSize: 30,
    fontWeight: "800",
    color: "#111827",
  },

  sub: {
    color: "gray",
    marginBottom: 15,
  },

  card: {
    backgroundColor: "#DFF5E1",
    padding: 15,
    borderRadius: 15,
    marginBottom: 15,
  },

  cardTitle: {
    fontWeight: "bold",
    marginBottom: 5,
  },

  badge: {
    backgroundColor: "#E8F5E9",
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 10,
    marginBottom: 10,
  },

  badgeText: {
    color: "#2D6A4F",
    fontWeight: "700",
  },

  heroImage: {
    width: "100%",
    height: 300,
    marginTop: 50,
  },

  content: {
    padding: 20,
  },

  scientific: {
    marginTop: 5,
    fontSize: 16,
    color: "#6B7280",
    fontStyle: "italic",
  },

  confidenceCard: {
    backgroundColor: "#E8F5E9",
    padding: 15,
    borderRadius: 18,
    marginTop: 20,
  },

  confidenceText: {
    color: "#2D6A4F",
    fontWeight: "700",
    fontSize: 16,
  },

  section: {
    backgroundColor: "#FFFFFF",
    padding: 18,
    borderRadius: 20,
    marginTop: 16,

    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,

    elevation: 3,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 8,
  },

  sectionText: {
    color: "#4B5563",
    lineHeight: 22,
  },

  heroContainer: {
    position: "relative",
  },

  overlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 120,
    backgroundColor: "rgba(0,0,0,0.4)",
  },

  heroText: {
    position: "absolute",
    bottom: 20,
    left: 20,
  },

  heroTitle: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "800",
  },

  heroScientific: {
    color: "#E5E7EB",
    fontSize: 15,
    marginTop: 4,
    fontStyle: "italic",
  },

  typeBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: "flex-start",
    marginTop: 12,
  },
});
