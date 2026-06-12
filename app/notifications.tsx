import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { collection, getDocs, orderBy, query } from "firebase/firestore";

import React, { useEffect, useState } from "react";
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { auth, db } from "../firebaseConfig";

export default function Notifications() {
  const [notifications, setNotifications] = useState<any[]>([]);

  const loadNotifications = async () => {
    try {
      console.log("Current User UID:", auth.currentUser?.uid);

      const q = query(
        collection(db, "notifications"),
        orderBy("createdAt", "desc"),
      );

      const snapshot = await getDocs(q);

      console.log("Notifications Found:", snapshot.size);

      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setNotifications(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (auth.currentUser) {
      loadNotifications();
    }
  }, []);

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter((item) => item.id !== id));
  };
  const renderItem = ({ item }: any) => (
    <View
      style={[
        styles.card,
        {
          borderLeftColor:
            item.type === "danger"
              ? "#DC2626"
              : item.type === "success"
                ? "#2D6A4F"
                : "#2563EB",
        },
      ]}
    >
      <View style={{ flex: 1, marginLeft: 12 }}>
        <Text style={styles.title}>{item.title}</Text>

        <Text style={styles.description}>{item.message}</Text>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: 6,
          }}
        >
          <Text style={styles.time}>{item.time}</Text>

          <TouchableOpacity onPress={() => deleteNotification(item.id)}>
            <Ionicons name="trash-outline" size={20} color="#9CA3AF" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.hero}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.heroTitle}> Notifications</Text>
      </View>

      <Text style={styles.sectionTitle}>Today</Text>

      <FlatList
        data={notifications}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingBottom: 30,
        }}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={
          <View
            style={{
              alignItems: "center",
              marginTop: 80,
            }}
          >
            <Ionicons
              name="notifications-off-outline"
              size={60}
              color="#9CA3AF"
            />

            <Text
              style={{
                fontSize: 18,
                fontWeight: "700",
                marginTop: 10,
              }}
            >
              No Notifications
            </Text>

            <Text
              style={{
                color: "#6B7280",
                marginTop: 5,
              }}
            >
              Your alerts will appear here
            </Text>
          </View>
        }
      />
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
    marginBottom: 20,
  },

  headerTitle: {
    fontSize: 24,
    fontWeight: "800",
    justifyContent: "center",
    alignItems: "center",
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    borderLeftWidth: 5,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },

  title: {
    fontWeight: "700",
    fontSize: 15,
  },

  time: {
    color: "#6B7280",
    marginTop: 4,
  },

  hero: {
    backgroundColor: "#2D6A4F",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,

    paddingTop: 60,
    paddingBottom: 25,
    paddingHorizontal: 20,
    height: 170,

    marginBottom: 20,
  },
  heroTitle: {
    color: "#fff",
    fontSize: 30,
    fontWeight: "800",
    marginTop: 10,
    textAlign: "center",
  },

  backBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,

    backgroundColor: "rgba(255,255,255,0.2)",

    justifyContent: "center",
    alignItems: "center",
  },

  heroSubtitle: {
    color: "#D1FAE5",
    marginTop: 5,
  },

  description: {
    color: "#6B7280",
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginHorizontal: 20,
    marginBottom: 10,
  },
});
