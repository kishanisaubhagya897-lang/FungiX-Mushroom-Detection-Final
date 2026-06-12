import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useFocusEffect } from "expo-router";
import { signOut } from "firebase/auth";
import { collection, getDocs } from "firebase/firestore";
import React, { useCallback, useState } from "react";
import {
  Image,
  Modal,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { auth, db } from "../../firebaseConfig";

export default function ProfileScreen() {
  const [logoutVisible, setLogoutVisible] = useState(false);

  const [totalScans, setTotalScans] = useState(0);
  const [edibleCount, setEdibleCount] = useState(0);
  const [poisonousCount, setPoisonousCount] = useState(0);

  const [profileImage, setProfileImage] = useState<string | null>(null);

  const [name, setName] = useState("");

  const [profession, setProfession] = useState("");

  const loadProfileData = async () => {
    try {
      const savedImage = await AsyncStorage.getItem(
        `profileImage_${user?.uid}`,
      );

      const savedName = await AsyncStorage.getItem(`profileName_${user?.uid}`);

      const savedProfession = await AsyncStorage.getItem(
        `profileProfession_${user?.uid}`,
      );
      setProfileImage(savedImage);

    if (savedName) {
  setName(savedName);
} else {
  setName(
    auth.currentUser?.displayName ||
    auth.currentUser?.email?.split("@")[0] ||
    "User"
  );
}

      if (savedProfession) setProfession(savedProfession);
    } catch (error) {
      console.log(error);
    }
  };

  const user = auth.currentUser;


  const fetchStats = async () => {
    try {
      const snapshot = await getDocs(collection(db, "detections"));
      const data = snapshot.docs.map((doc) => doc.data());

      setTotalScans(data.length);
      setEdibleCount(data.filter((item: any) => item.type === "Edible").length);
      setPoisonousCount(
        data.filter((item: any) => item.type === "Poisonous").length,
      );
    } catch (error) {
      console.log(error);
    }
  };

 useFocusEffect(
  useCallback(() => {
    fetchStats();
    loadProfileData();
  }, []),
);

  const handleLogout = async () => {
    try {
      await signOut(auth);

      setLogoutVisible(false);

      router.replace("/login");
    } catch (error) {
      console.log(error);
    }
  };

  const menuItems = [
    {
      title: "Edit Profile",
      icon: "person-outline",
      action: () => router.push("/edit-profile"),
    },

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
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profile</Text>
        </View>

        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            {profileImage ? (
              <Image source={{ uri: profileImage }} style={styles.avatar} />
            ) : (
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {name.charAt(0).toUpperCase()}
                </Text>
              </View>
            )}
          </View>

          <Text style={styles.name}>{name}</Text>

          <Text style={styles.email}>{profession}</Text>

          <Text
            style={{
              color: "#9CA3AF",
              marginTop: 5,
            }}
          >
            {auth.currentUser?.email}
          </Text>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{totalScans}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{edibleCount}</Text>
            <Text style={styles.statLabel}>Edible</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{poisonousCount}</Text>
            <Text style={styles.statLabel}>Poisonous</Text>
          </View>
        </View>

        <View style={styles.menuContainer}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.menuItem}
              onPress={item.action}
            >
              <View style={styles.menuLeft}>
                <Ionicons
                  name={item.icon as any}
                  size={22}
                  color={item.danger ? "#DC2626" : "#2D6A4F"}
                />
                <Text
                  style={[styles.menuText, item.danger && { color: "#DC2626" }]}
                >
                  {item.title}
                </Text>
              </View>

              <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <Modal transparent visible={logoutVisible}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <>
              <Text style={styles.modalTitle}>Sign Out</Text>

              <Text style={styles.logoutText}>
                Are you sure you want to sign out of FungiX?
              </Text>
            </>

            <View style={styles.modalBtns}>
              <Pressable
                style={styles.cancelBtn}
                onPress={() => setLogoutVisible(false)}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </Pressable>

              <Pressable style={styles.logoutBtn} onPress={handleLogout}>
                <Text style={styles.logoutTextBtn}>Sign Out</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F7FAF8", paddingHorizontal: 20 },
  header: { marginTop: 10, marginBottom: 20 },
  headerTitle: { fontSize: 30, fontWeight: "700" },
  profileCard: {
    backgroundColor: "#fff",
    padding: 24,
    borderRadius: 24,
    alignItems: "center",
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#2D6A4F",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: { color: "#fff", fontSize: 34, fontWeight: "700" },
  name: { fontSize: 24, fontWeight: "700", marginTop: 16 },
  email: { color: "#6B7280", marginTop: 6 },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 24,
  },
  statCard: {
    backgroundColor: "#fff",
    width: "31%",
    padding: 18,
    borderRadius: 20,
    alignItems: "center",
  },
  statNumber: { fontSize: 24, fontWeight: "700" },
  statLabel: { marginTop: 8, color: "#6B7280" },
  menuContainer: { backgroundColor: "#fff", borderRadius: 24 },
  menuItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 18,
  },
  menuLeft: { flexDirection: "row", alignItems: "center" },
  menuText: { marginLeft: 14, fontSize: 16, fontWeight: "600" },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  modalBox: {
    backgroundColor: "#fff",
    padding: 24,
    borderRadius: 24,
    width: "85%",
  },
  modalTitle: { fontSize: 22, fontWeight: "700", textAlign: "center" },
  modalBtns: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  cancelBtn: {
    padding: 14,
    width: "48%",
    backgroundColor: "#F3F4F6",
    borderRadius: 16,
    alignItems: "center",
  },
  logoutBtn: {
    padding: 14,
    width: "48%",
    backgroundColor: "#DC2626",
    borderRadius: 16,
    alignItems: "center",
  },
  avatarContainer: {
    position: "relative",
  },

  cameraBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,

    width: 30,
    height: 30,

    borderRadius: 15,

    backgroundColor: "#2D6A4F",

    justifyContent: "center",
    alignItems: "center",

    borderWidth: 2,
    borderColor: "#fff",
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 12,
  },

  completionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 20,
    marginTop: 20,
  },

  completionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },

  progressBar: {
    height: 10,
    backgroundColor: "#E5E7EB",
    borderRadius: 20,
    marginTop: 15,
    overflow: "hidden",
  },

  progressFill: {
    width: "90%",
    height: "100%",
    backgroundColor: "#2D6A4F",
  },

  progressText: {
    marginTop: 10,
    color: "#6B7280",
    fontWeight: "600",
  },

  checkRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
  },

  checkText: {
    marginLeft: 8,
    color: "#374151",
    fontWeight: "500",
  },

  logoutEmoji: {
    fontSize: 50,
    textAlign: "center",
    marginBottom: 10,
  },

  logoutText: {
    textAlign: "center",
    color: "#6B7280",
    marginTop: 10,
    lineHeight: 22,
  },

  cancelText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#374151",
  },

  logoutTextBtn: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
});
