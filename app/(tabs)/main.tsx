// Full production-ready app/(tabs)/main.tsx
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import { router, useFocusEffect } from "expo-router";
import { collection, getDocs, limit, orderBy, query } from "firebase/firestore";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { auth, db } from "../../firebaseConfig";

type Detection = {
  id: string;
  mushroomName: string;
  type: string;
  confidence: number;
  imageUrl: string;
};

export default function MainScreen() {
  const [edibleCount, setEdibleCount] = useState(0);

  const [poisonousCount, setPoisonousCount] = useState(0);
  const [detections, setDetections] = useState<Detection[]>([]);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const loadCounts = async () => {
    const snapshot = await getDocs(collection(db, "detections"));

    let edible = 0;
    let poisonous = 0;

    snapshot.forEach((doc) => {
      const data = doc.data();

      if (data.type === "Edible") {
        edible++;
      }

      if (data.type === "Poisonous") {
        poisonous++;
      }
    });

    setEdibleCount(edible);
    setPoisonousCount(poisonous);
  };

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      const q = query(
        collection(db, "detections"),
        orderBy("scanDate", "desc"),
        limit(3),
      );

      const snapshot = await getDocs(q);

      const items = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      })) as Detection[];

      setDetections(items);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const loadProfileImage = async () => {
    try {
      const image = await AsyncStorage.getItem(
        `profileImage_${auth.currentUser?.uid}`,
      );

      if (image) {
        setProfileImage(image);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchDashboardData();
      loadCounts();
      loadProfileImage();
    }, []),
  );

  const checkMushroomBeforeMorphology = async (imageUri: string) => {
    try {
      const API_URL = "http://192.168.34.29:8000/screen";

      const fileName =
        imageUri.split("/").pop() || "mushroom.jpg";

      const fileExtension =
        fileName.split(".").pop()?.toLowerCase();

      const mimeType =
        fileExtension === "png"
          ? "image/png"
          : "image/jpeg";

      const formData = new FormData();

      formData.append(
        "image",
        {
          uri: imageUri,
          name: fileName,
          type: mimeType,
        } as any,
      );

      const response = await fetch(API_URL, {
        method: "POST",
        body: formData,
      });

      const responseText = await response.text();

      console.log("CLIP Screen Status:", response.status);
      console.log("CLIP Screen Response:", responseText);

      if (!response.ok) {
        throw new Error(
          `CLIP screening failed (${response.status}): ${responseText}`,
        );
      }

      let result;

      try {
        result = JSON.parse(responseText);
      } catch {
        throw new Error("CLIP screening returned invalid JSON.");
      }

      if (!result.is_mushroom) {
        Alert.alert(
          "Not a Mushroom",
          "The selected image does not appear to be a mushroom. Please capture or select a clear mushroom image.",
        );

        return false;
      }

      return true;
    } catch (error) {
      console.error(
        "CLIP Screening Error:",
        error,
      );

      Alert.alert(
        "Image Screening Error",
        "Unable to verify the image. Please try again.",
      );

      return false;
    }
  };

  const takePhoto = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) return;
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 1,
    });
    if (!result.canceled) {
      const imageUri = result.assets[0].uri;

      const isMushroom =
        await checkMushroomBeforeMorphology(imageUri);

      if (!isMushroom) return;

      router.push({
        pathname: "/morphological-features",
        params: {
          image: imageUri,
        },
      });
    }
  };

  const uploadImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
    });
    if (!result.canceled) {
      const imageUri = result.assets[0].uri;

      const isMushroom =
        await checkMushroomBeforeMorphology(imageUri);

      if (!isMushroom) return;

      router.push({
        pathname: "/morphological-features",
        params: {
          image: imageUri,
        },
      });
    }
  };

  const renderItem = ({ item }: { item: Detection }) => (
    <TouchableOpacity
      style={styles.recentCard}
      onPress={() =>
        router.push({
          pathname: "/details/[id]",
          params: { id: item.id, image: item.imageUrl },
        })
      }
    >
      <Image source={{ uri: item.imageUrl }} style={styles.recentImage} />
      <View style={{ flex: 1 }}>
        <Text style={styles.recentName}>{item.mushroomName}</Text>
        <Text style={styles.recentConfidence}>
          {item.confidence}% confidence
        </Text>
        <View
          style={[
            styles.badge,
            {
              backgroundColor:
                item.type === "Poisonous" ? "#E76F51" : "#52B788",
            },
          ]}
        >
          <Text style={styles.badgeText}>{item.type}</Text>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={22} color="#666" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <StatusBar barStyle="dark-content" />
      <FlatList
        data={detections.slice(0, 2)}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListHeaderComponent={
          <>
            <View style={styles.header}>
              <View>
                <Text style={styles.greeting}>Welcome Back </Text>

                <Text style={styles.subtitle}>FungiX AI Assistant</Text>
              </View>
              <View style={styles.headerBtns}>
                <TouchableOpacity
                  style={styles.iconBtn}
                  onPress={() => router.push("/notifications")}
                >
                  <Ionicons
                    name="notifications-outline"
                    size={22}
                    color="#222"
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.profileBtn}
                  onPress={() => router.push("/profile")}
                >
                  {profileImage ? (
                    <Image
                      source={{ uri: profileImage }}
                      style={styles.profileImage}
                    />
                  ) : (
                    <Ionicons name="person" size={28} color="#fff" />
                  )}
                </TouchableOpacity>
              </View>
            </View>

            <LinearGradient
              colors={["#1B4332", "#2D6A4F", "#40916C"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.heroCard}
            >
              <Text style={styles.heroTitle}>AI Mushroom Detection</Text>
              <Text style={styles.heroSub}>
                Scan or upload a mushroom image for instant analysis
              </Text>
              <View style={styles.actionRow}>
                <TouchableOpacity style={styles.scanBtn} onPress={takePhoto}>
                  <Ionicons name="camera" size={20} color="#fff" />
                  <Text style={styles.scanText}>Scan</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.uploadBtn}
                  onPress={uploadImage}
                >
                  <Ionicons
                    name="cloud-upload-outline"
                    size={20}
                    color="#2D6A4F"
                  />
                  <Text style={styles.uploadText}>Upload</Text>
                </TouchableOpacity>
              </View>
            </LinearGradient>

            <Text style={styles.sectionTitle}>Categories</Text>

            <View style={styles.categoryRow}>
              <TouchableOpacity
                style={styles.categoryCard}
                onPress={() => router.push("/edible")}
              >
                <Ionicons name="leaf-outline" size={26} color="#2D6A4F" />

                <Text style={styles.categoryName}>Edible Species</Text>

                <Text style={styles.categoryCount}>{edibleCount}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.categoryCard}
                onPress={() => router.push("/poisonous")}
              >
                <Ionicons name="warning-outline" size={26} color="#E76F51" />

                <Text style={styles.categoryName}>Poisonous Species</Text>

                <Text style={styles.categoryCount}>{poisonousCount}</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.sectionTitle}>Recent Scans </Text>
            {loading && <ActivityIndicator size="large" color="#2D6A4F" />}
          </>
        }
        ListEmptyComponent={
          !loading ? (
            <Text style={styles.empty}>No recent scans yet</Text>
          ) : null
        }
        contentContainerStyle={{ padding: 20 }}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F7FAF8" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  greeting: { fontSize: 28, fontWeight: "700", color: "#1F2937" },
  subtitle: { color: "#6B7280", marginTop: 4 },
  headerBtns: { flexDirection: "row", alignItems: "center" },
  iconBtn: {
    backgroundColor: "#FFFFFF",
    padding: 12,
    borderRadius: 16,
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#E8F0EB",
    elevation: 2,
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "#2D6A4F",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: { color: "#fff", fontWeight: "700" },
  searchBox: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 22,
    borderWidth: 1,
    borderColor: "#E8F0EB",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  searchInput: { marginLeft: 10, flex: 1 },
  heroCard: {
    backgroundColor: "#2D6A4F",
    padding: 18,
    borderRadius: 24,
    marginBottom: 18,
    shadowColor: "#2D6A4F",
    shadowOpacity: 0.18,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 8,
  },
  heroTitle: { color: "#fff", fontSize: 22, fontWeight: "700" },
  heroSub: { color: "#E5F3EB", marginTop: 8 },
  actionRow: {
    flexDirection: "row",
    marginTop: 20,
    justifyContent: "space-between",
    gap: 12,
  },
  scanBtn: {
    backgroundColor: "#1F2937",
    paddingVertical: 16,
    borderRadius: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    minHeight: 56,
  },
  scanText: { color: "#fff", marginLeft: 8, fontWeight: "700" },
  uploadBtn: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 16,
    borderRadius: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    minHeight: 56,
    borderWidth: 1,
    borderColor: "#DCE8E0",
  },
  uploadText: { color: "#2D6A4F", marginLeft: 8, fontWeight: "700" },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 14,
  },
  categoryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  categoryCard: {
    backgroundColor: "#FFFFFF",
    width: "48%",
    borderRadius: 20,
    padding: 18,
    height: 140,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E8F0EB",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 5,
  },
  categoryName: { marginTop: 10, color: "#374151", fontWeight: "600" },
  categoryCount: {
    marginTop: 4,
    fontSize: 22,
    fontWeight: "700",
    color: "#111827",
  },
  recentCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 12,
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E8F0EB",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },
  recentImage: { width: 55, height: 55, borderRadius: 14, marginRight: 14 },
  recentName: { fontSize: 17, fontWeight: "700", color: "#111827" },
  recentConfidence: { color: "#6B7280", marginTop: 6 },
  badge: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 8,
  },
  badgeText: { color: "#fff", fontWeight: "700", fontSize: 12 },
  empty: { textAlign: "center", color: "#6B7280", marginTop: 20 },
  profileImage: {
    width: 55,
    height: 55,
    borderRadius: 28,
  },
  profileBtn: {
    width: 55,
    height: 55,
    borderRadius: 28,

    backgroundColor: "#2D6A4F",

    justifyContent: "center",
    alignItems: "center",

    overflow: "hidden",
  },
});
