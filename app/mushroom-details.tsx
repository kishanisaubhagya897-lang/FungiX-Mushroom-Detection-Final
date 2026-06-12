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

export default function MushroomDetails() {
  const params = useLocalSearchParams();

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color="#111827" />
      </TouchableOpacity>
      <View style={styles.photoCard}>
        <Image
          source={require("../assets/images/chanterelle.jpg")}
          style={styles.photo}
        />
      </View>

      <View style={styles.heroCard}>
        <Text style={styles.title}>{params.name}</Text>

        <Text style={styles.subtitle}>{params.scientific}</Text>
      </View>

      <View
        style={[
          styles.typeBadge,
          {
            backgroundColor:
              params.type === "Poisonous" ? "#FEE2E2" : "#DCFCE7",
          },
        ]}
      >
        <Text
          style={[
            styles.typeText,
            {
              color: params.type === "Poisonous" ? "#DC2626" : "#15803D",
            },
          ]}
        >
          {params.type}
        </Text>
      </View>

      <Text style={styles.section}>Description</Text>

      <View style={styles.infoCard}>
        <Text style={styles.cardTitle}>Habitat</Text>

        <Text style={styles.cardText}>
          Found in forests near oak, birch, and beech trees.
        </Text>
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.cardTitle}>Season</Text>

        <Text style={styles.cardText}>Late summer to early autumn.</Text>
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.cardTitle}>Safety Notes</Text>

        <Text style={styles.cardText}>
          Always verify mushroom identity before consumption.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7FAF8",
    padding: 20,
  },

  back: {
    fontSize: 18,
    marginTop: 60,
    color: "#2D6A4F",
  },

  title: {
    fontSize: 30,
    fontWeight: "700",
    marginTop: 20,
  },

  subtitle: {
    color: "#6B7280",
    marginTop: 5,
  },

  type: {
    color: "#2D6A4F",
    fontWeight: "700",
    marginTop: 15,
  },

  section: {
    fontSize: 20,
    fontWeight: "700",
    marginTop: 30,
  },

  text: {
    marginTop: 10,
    color: "#374151",
  },
  infoCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 18,
    marginTop: 15,
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },

  cardText: {
    marginTop: 8,
    color: "#6B7280",
    lineHeight: 22,
  },

  backBtn: {
    width: 50,
    height: 50,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",

    justifyContent: "center",
    alignItems: "center",

    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,

    elevation: 4,

    marginTop: 15,
  },

  backIcon: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111827",
  },
  typeBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 15,
  },

  typeText: {
    fontWeight: "500",
    fontSize: 14,
  },

  heroCard: {
    backgroundColor: "#F3FAF5",
    borderRadius: 24,
    padding: 18,
    marginTop: 10,

    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 12,

    elevation: 1,
  },
  headerImage: {
    width: "100%",
    height: 200,

    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,

    marginBottom: 20,
  },

  photoCard: {
    backgroundColor: "#FFFFFF",

    borderRadius: 30,

    padding: 10,

    marginTop: 20,

    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 15,

    elevation: 6,
  },

  photo: {
    width: "100%",
    height: 200,

    borderRadius: 24,
  },
});
