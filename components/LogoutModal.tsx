import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Pressable,
  Alert,
  ScrollView,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { collection, getDocs } from "firebase/firestore";
import { auth, db } from "../firebaseConfig";

export default function ProfileScreen() {
  const [logoutVisible, setLogoutVisible] = useState(false);

  const [totalScans, setTotalScans] = useState(0);
  const [edibleCount, setEdibleCount] = useState(0);
  const [poisonousCount, setPoisonousCount] = useState(0);

  const fetchStats = async () => {
    try {
      const snapshot = await getDocs(collection(db, "detections"));

      const data = snapshot.docs.map((doc) => doc.data());

      setTotalScans(data.length);

      setEdibleCount(
        data.filter((item: any) => item.type === "Edible").length
      );

      setPoisonousCount(
        data.filter((item: any) => item.type === "Poisonous").length
      );
    } catch (error) {
      console.log(error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchStats();
    }, [])
  );

  const menuItems = [
    {
      title: "Settings",
      icon: "settings-outline",
      action: () => router.push("/settings"),
    },
    {
      title: "Safety Information",
      icon: "shield-checkmark-outline",
      action: () => router.push("/safety"),
    },
    {
      title: "Change Password",
      icon: "lock-closed-outline",
      action: () => router.push("/change-password"),
    },
    {
      title: "Privacy Policy",
      icon: "document-text-outline",
      action: () =>
        Alert.alert("Privacy Policy", "Privacy page coming soon."),
    },
    {
      title: "About FungiX",
      icon: "information-circle-outline",
      action: () =>
        Alert.alert(
          "About FungiX",
          "FungiX helps identify mushrooms using AI."
        ),
    },
    {
      title: "Logout",
      icon: "log-out-outline",
      action: () => setLogoutVisible(true),
      danger: true,
    },
  ];

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <StatusBar barStyle="dark-content" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* HEADER */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profile</Text>

          <TouchableOpacity style={styles.settingsBtn}>
            <Ionicons
              name="ellipsis-horizontal"
              size={24}
              color="#1F2937"
            />
          </TouchableOpacity>
        </View>

        {/* PROFILE CARD */}
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>S</Text>
          </View>

          <Text style={styles.name}>Mohamed Sasan</Text>

          <Text style={styles.email}>
            sasan@fungixapp.com
          </Text>

          <TouchableOpacity style={styles.editBtn}>
            <Text style={styles.editText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {/* STATS */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{totalScans}</Text>
            <Text style={styles.statLabel}>Total Scans</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{edibleCount}</Text>
            <Text style={styles.statLabel}>Edible</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              {poisonousCount}
            </Text>
            <Text style={styles.statLabel}>Poisonous</Text>
          </View>
        </View>

        {/* MENU */}
        <View style={styles.menuContainer}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.menuItem}
              onPress={item.action}
            >
              <View style={styles.menuLeft}>
                <View style={styles.iconCircle}>
                  <Ionicons
                    name={item.icon as any}
                    size={20}
                    color={
                      item.danger ? "#DC2626" : "#2D6A4F"
                    }
                  />
                </View>

                <Text
                  style={[
                    styles.menuText,
                    item.danger && { color: "#DC2626" },
                  ]}
                >
                  {item.title}
                </Text>
              </View>

              <Ionicons
                name="chevron-forward"
                size={20}
                color="#9CA3AF"
              />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* LOGOUT MODAL */}
      <Modal
        transparent
        visible={logoutVisible}
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Ionicons
              name="log-out-outline"
              size={44}
              color="#DC2626"
            />

            <Text style={styles.modalTitle}>
              Logout?
            </Text>

            <Text style={styles.modalText}>
              Are you sure you want to sign out?
            </Text>

            <View style={styles.modalBtns}>
              <Pressable
                style={styles.cancelBtn}
                onPress={() => setLogoutVisible(false)}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </Pressable>

              <Pressable
                style={styles.logoutBtn}
                onPress={() => {
                  setLogoutVisible(false);
                  Alert.alert(
                    "Logout",
                    "Firebase Auth integration next phase."
                  );
                }}
              >
                <Text style={styles.logoutText}>Logout</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7FAF8",
    paddingHorizontal: 20,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 24,
  },

  headerTitle: {
    fontSize: 30,
    fontWeight: "700",
    color: "#1F2937",
  },

  settingsBtn: {
    backgroundColor: "#FFFFFF",
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  profileCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 28,
    padding: 24,
    alignItems: "center",

    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },

    elevation: 4,
  },

  avatar: {
    width: 92,
    height: 92,
    borderRadius: 46,
    backgroundColor: "#2D6A4F",
    justifyContent: "center",
    alignItems: "center",
  },

  avatarText: {
    color: "#fff",
    fontSize: 34,
    fontWeight: "700",
  },

  name: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111827",
    marginTop: 16,
  },

  email: {
    color: "#6B7280",
    marginTop: 6,
  },

  editBtn: {
    marginTop: 18,
    backgroundColor: "#2D6A4F",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 16,
  },

  editText: {
    color: "#fff",
    fontWeight: "700",
  },

  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 24,
    marginBottom: 28,
  },

  statCard: {
    backgroundColor: "#FFFFFF",
    width: "31%",
    borderRadius: 22,
    padding: 18,
    alignItems: "center",

    borderWidth: 1,
    borderColor: "#E5E7EB",

    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },

    elevation: 2,
  },

  statNumber: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111827",
  },

  statLabel: {
    marginTop: 8,
    color: "#6B7280",
    fontSize: 13,
  },

  menuContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    paddingVertical: 8,

    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },

    elevation: 3,
  },

  menuItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingVertical: 16,
  },

  menuLeft: {
    flexDirection: "row",
    alignItems: "center",
  },

  iconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#F3F7F4",
    justifyContent: "center",
    alignItems: "center",
  },

  menuText: {
    marginLeft: 14,
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  modalBox: {
    backgroundColor: "#FFFFFF",
    width: "100%",
    borderRadius: 28,
    padding: 28,
    alignItems: "center",
  },

  modalTitle: {
    fontSize: 24,
    fontWeight: "700",
    marginTop: 16,
    color: "#111827",
  },

  modalText: {
    color: "#6B7280",
    textAlign: "center",
    marginTop: 10,
    lineHeight: 22,
  },

  modalBtns: {
    flexDirection: "row",
    marginTop: 26,
    width: "100%",
    justifyContent: "space-between",
  },

  cancelBtn: {
    width: "48%",
    padding: 16,
    backgroundColor: "#F3F4F6",
    borderRadius: 16,
    alignItems: "center",
  },

  logoutBtn: {
    width: "48%",
    padding: 16,
    backgroundColor: "#DC2626",
    borderRadius: 16,
    alignItems: "center",
  },

  cancelText: {
    fontWeight: "700",
    color: "#111827",
  },

  logoutText: {
    fontWeight: "700",
    color: "#fff",
  },
});