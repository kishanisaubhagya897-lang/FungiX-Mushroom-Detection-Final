import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { collection, getDocs } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    Image,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { db } from "../firebaseConfig";

export default function EdibleScreen() {
  const [edibleData, setEdibleData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEdibleData();
  }, []);

  const loadEdibleData = async () => {
    try {
      const snapshot = await getDocs(collection(db, "detections"));

      const filtered = snapshot.docs
        .map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        .filter((item: any) => item.type === "Poisonous");

      setEdibleData(filtered);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  const renderItem = ({ item }: any) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        router.push({
          pathname: "/details",
          params: {
            image: item.imageUrl,
            mushroomName: item.mushroomName,
            scientificName: item.scientificName,
            confidence: item.confidence,
            description: item.description,
            habitat: item.habitat,
            type: item.type,
            season: item.season,
            conditions: item.conditions,
            notes: item.notes,
          },
        })
      }
    >
      <Image source={{ uri: item.imageUrl }} style={styles.image} />

      <View style={{ flex: 1 }}>
        <Text style={styles.name}>{item.mushroomName}</Text>

        <Text style={styles.scientific}>{item.scientificName}</Text>

        <View style={styles.badge}>
          <Text style={styles.badgeText}>{item.confidence}% Confidence</Text>
        </View>
      </View>

      <Ionicons name="chevron-forward" size={24} color="#2D6A4F" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={["#7F1D1D", "#ad2525", "#DC2626"]}
        style={styles.hero}
      >
        <View style={styles.headerRow}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backBtn}
          >
            <Ionicons name="arrow-back" size={22} color="#B91C1C" />
          </TouchableOpacity>

          <Text style={styles.heroTitle}>Poisonous Mushrooms</Text>
        </View>

        <Text style={styles.heroSubtitle}> Dangerous Mushroom Collection</Text>

        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            marginTop: 8,
            marginBottom: 20,
          }}
        >
          <Ionicons name="warning-outline" size={35} color="#ffffff" />
        </View>
      </LinearGradient>

      {loading ? (
        <ActivityIndicator
          size="large"
          color="#2D6A4F"
          style={{ marginTop: 50 }}
        />
      ) : (
        <FlatList
          data={edibleData}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: 30,
            paddingHorizontal: 20,
          }}
          ListEmptyComponent={
            <Text style={styles.empty}>No Poisonous mushrooms found.</Text>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3FAF5",
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },

  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111827",
  },

  subtitle: {
    color: "#6B7280",
    marginTop: 8,
    marginBottom: 20,
  },

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 18,
    marginBottom: 14,
    flexDirection: "row",
    alignItems: "center",

    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,

    elevation: 4,
    borderLeftWidth: 5,
    borderLeftColor: "#B91C1C",
  },

  image: {
    width: 70,
    height: 70,
    borderRadius: 16,
    marginRight: 14,
  },
  info: {
    flex: 1,
    marginLeft: 12,
    justifyContent: "center",
  },

  name: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
  },

  confidence: {
    marginTop: 6,
    color: "#6B7280",
  },

  type: {
    marginTop: 8,
    color: "#d82206",
    fontWeight: "700",
  },

  empty: {
    textAlign: "center",
    marginTop: 60,
    color: "#6B7280",
  },

  hero: {
    height: 180,
    borderBottomLeftRadius: 35,
    borderBottomRightRadius: 35,

    paddingHorizontal: 24,
    paddingTop: 60,

    marginBottom: 18,
  },

  backBtn: {
    width: 33,
    height: 33,
    borderRadius: 21,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },

  heroTitle: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "800",

    flex: 1,
    textAlign: "center",
  },

  heroSubtitle: {
    color: "#E8F5E9",
    marginTop: 6,
    fontSize: 15,
    textAlign: "center",
    marginLeft: 18,
  },

  heroCount: {
    color: "#fff",
    marginTop: 10,
    fontWeight: "700",
  },

  scientific: {
    color: "#6B7280",
    marginTop: 5,
    fontStyle: "italic",
  },

  badge: {
    backgroundColor: "#FEE2E2",
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 10,
  },

  badgeText: {
    color: "#B91C1C",
    fontWeight: "700",
  },
});
