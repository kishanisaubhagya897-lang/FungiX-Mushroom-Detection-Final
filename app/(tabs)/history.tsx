import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { db } from "../../firebaseConfig";

type Detection = {
  id: string;
  mushroomName: string;
  type: string;
  confidence: number;
  imageUrl: string;
  scanDate?: any;
};

export default function HistoryScreen() {
  const [detections, setDetections] = useState<Detection[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDetections = async () => {
    try {
      setLoading(true);

      const q = query(
        collection(db, "detections"),
        orderBy("scanDate", "desc"),
      );

      const snapshot = await getDocs(q);

      const items = snapshot.docs.map((docItem) => ({
        id: docItem.id,
        ...docItem.data(),
      })) as Detection[];

      setDetections(items);
    } catch (error) {
      console.log("History fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  // AUTO REFRESH EVERY TIME HISTORY TAB OPENS
  useFocusEffect(
    useCallback(() => {
      fetchDetections();
    }, []),
  );

  const deleteHistory = async (id: string) => {
    Alert.alert("Delete Scan", "Delete this scan history?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteDoc(doc(db, "detections", id));

            setDetections((prev) => prev.filter((item) => item.id !== id));
          } catch (error) {
            console.log(error);
          }
        },
      },
    ]);
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp?.seconds) return "Recent";

    return new Date(timestamp.seconds * 1000).toLocaleDateString();
  };

  const renderItem = ({ item }: { item: Detection }) => {
    const badgeColor = item.type === "Poisonous" ? "#E76F51" : "#52B788";

    return (
      <TouchableOpacity
        style={[
          styles.card,
          {
            borderLeftColor: item.type === "Poisonous" ? "#E76F51" : "#2D6A4F",
          },
        ]}
        onPress={() =>
          router.push({
            pathname: "/details/[id]",
            params: {
              id: item.id,
              image: item.imageUrl,
            },
          })
        }
      >
        <Image source={{ uri: item.imageUrl }} style={styles.image} />

        <View style={styles.info}>
          <Text style={styles.name}>{item.mushroomName}</Text>

          <View style={[styles.badge, { backgroundColor: badgeColor }]}>
            <Text style={styles.badgeText}>{item.type}</Text>
          </View>

          <Text style={styles.meta}>{item.confidence}% confidence</Text>

          <Text style={styles.date}>{formatDate(item.scanDate)}</Text>
        </View>

        <TouchableOpacity onPress={() => deleteHistory(item.id)}>
          <View
            style={{
              width: 42,
              height: 42,
              borderRadius: 12,
              backgroundColor: "#FEF2F2",

              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Ionicons name="trash-outline" size={20} color="#DC2626" />
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#2D6A4F" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Scan History</Text>

        <Text style={styles.headerSubtitle}>
          Your mushroom detection records
        </Text>
      </View>

      <FlatList
        data={detections}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={
          <View style={{ alignItems: "center", marginTop: 100 }}>
            <Ionicons name="time-outline" size={70} color="#9CA3AF" />

            <Text style={styles.empty}>No scan history yet</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7FAF8",
  },
  title: {
    color: "#111827",
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 20,
    alignItems: "center",
    paddingLeft: 90,
  },
  card: {
    flexDirection: "row",

    backgroundColor: "#FFFFFF",

    padding: 12,

    borderRadius: 24,

    marginBottom: 14,

    alignItems: "center",

    borderLeftWidth: 5,

    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 12,

    shadowOffset: {
      width: 0,
      height: 6,
    },

    elevation: 3,
  },
  image: {
    width: 84,
    height: 84,
    borderRadius: 18,
  },
  info: {
    flex: 1,
    marginLeft: 14,
  },
  name: {
    color: "#111827",
    fontSize: 18,
    fontWeight: "700",
  },
  badge: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    marginTop: 8,
  },
  badgeText: {
    color: "#111827",
    fontSize: 12,
    fontWeight: "700",
  },
  meta: {
    color: "#2D6A4F",
    marginTop: 8,
    fontWeight: "600",
  },
  date: {
    color: "#6B7280",
    marginTop: 4,
    fontSize: 13,
  },
  empty: {
    color: "#111827",
    textAlign: "center",
    marginTop: 100,
  },
  hero: {
    backgroundColor: "#2D6A4F",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    paddingTop: 60,
    paddingBottom: 25,
    paddingHorizontal: 20,
    marginBottom: 20,
  },

  heroTitle: {
    color: "#111827",
    fontSize: 30,
    fontWeight: "800",
    paddingLeft: 90,
  },

  heroSubtitle: {
    color: "#111827",
    marginTop: 5,
  },

  header: {
    paddingHorizontal: 20,
    paddingTop: 15,
    marginBottom: 20,
  },

  headerTitle: {
    fontSize: 30,
    fontWeight: "800",
    color: "#111827",
    paddingLeft: 90,
  },

  headerSubtitle: {
    color: "#6B7280",
    marginTop: 5,
    fontSize: 14,
    paddingLeft: 65,
  },
});
