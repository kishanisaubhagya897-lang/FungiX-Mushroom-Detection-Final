import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  Modal,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { auth } from "../firebaseConfig";

export default function EditProfileScreen() {
  const user = auth.currentUser;

  const loadProfileImage = async () => {
    try {
      const savedImage = await AsyncStorage.getItem(
        `profileImage_${user?.uid}`,
      );

      if (savedImage) {
        setProfileImage(savedImage);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const loadProfileData = async () => {
    try {
      const savedName = await AsyncStorage.getItem(`profileName_${user?.uid}`);

      const savedProfession = await AsyncStorage.getItem(
        `profileProfession_${user?.uid}`,
      );
      if (savedName) {
        setName(savedName);
      }

      if (savedProfession) {
        setProfession(savedProfession);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    loadProfileImage();
    loadProfileData();
  }, []);

  const handleSave = async () => {
    try {
      await AsyncStorage.setItem(`profileName_${user?.uid}`, name);

      await AsyncStorage.setItem(`profileProfession_${user?.uid}`, profession);

      setModalVisible(true);
    } catch (error) {
      Alert.alert("Error", "Failed to save profile.");
    }
  };

  const [name, setName] = useState(
    user?.displayName || user?.email?.split("@")[0] || "User",
  );

  const [profession, setProfession] = useState("Software Developer");

  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      const imageUri = result.assets[0].uri;

      setProfileImage(imageUri);

      await AsyncStorage.setItem(`profileImage_${user?.uid}`, imageUri);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();

    if (status !== "granted") {
      Alert.alert("Permission Required", "Camera permission is needed.");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      const imageUri = result.assets[0].uri;

      setProfileImage(imageUri);

      await AsyncStorage.setItem("profileImage", imageUri);
    }
  };
  const removePhoto = async () => {
    await AsyncStorage.removeItem(`profileImage_${user?.uid}`);

    setProfileImage(null);
  };
  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <StatusBar barStyle="dark-content" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* Header */}

        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={22} color="#111827" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Edit Profile</Text>

          <View style={{ width: 46 }} />
        </View>

        {/* Profile Photo */}

        <View style={styles.profileCard}>
          <TouchableOpacity
            style={styles.avatarContainer}
            onPress={() =>
              Alert.alert("Profile Photo", "Choose an option", [
                {
                  text: "📷 Camera",
                  onPress: takePhoto,
                },
                {
                  text: "🖼 Gallery",
                  onPress: pickImage,
                },
                {
                  text: "Remove Photo",
                  onPress: removePhoto,
                },
                {
                  text: "Cancel",
                  style: "cancel",
                },
              ])
            }
          >
            {profileImage ? (
              <Image source={{ uri: profileImage }} style={styles.avatar} />
            ) : (
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {name.charAt(0).toUpperCase()}
                </Text>
              </View>
            )}

            <View style={styles.cameraBadge}>
              <Ionicons name="camera" size={16} color="#fff" />
            </View>
          </TouchableOpacity>

          <Text style={styles.changePhoto}>Change Profile Photo</Text>
        </View>

        {/* Form */}

        <View style={styles.formCard}>
          <Text style={styles.label}>Full Name</Text>

          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Enter full name"
          />

          <Text style={styles.label}>Profession</Text>

          <TextInput
            style={styles.input}
            value={profession}
            onChangeText={setProfession}
            placeholder="Enter profession"
          />

          <Text style={styles.label}>Email Address</Text>

          <View style={styles.readOnlyBox}>
            <Text style={styles.readOnlyText}>{user?.email || "No Email"}</Text>
          </View>

          <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
            <Text style={styles.saveText}>Save Changes</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Modal transparent visible={modalVisible}>
        <View style={styles.modalOverlay}>
          <View style={styles.premiumModal}>
            <Text style={styles.modalEmoji}>✅</Text>

            <Text style={styles.modalTitle}>Profile Updated</Text>

            <Text style={styles.modalMessage}>
              Your profile has been updated successfully.
            </Text>

            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => {
                setModalVisible(false);
                router.back();
              }}
            >
              <Text style={styles.modalButtonText}>OK</Text>
            </TouchableOpacity>
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
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 10,
    marginBottom: 24,
  },

  backBtn: {
    width: 46,
    height: 46,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111827",
  },

  profileCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 24,
    alignItems: "center",
    marginBottom: 24,

    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 12,
    shadowOffset: {
      width: 0,
      height: 6,
    },

    elevation: 3,
  },

  avatarContainer: {
    position: "relative",
  },

  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: "#2D6A4F",
    justifyContent: "center",
    alignItems: "center",
  },

  avatarText: {
    color: "#FFFFFF",
    fontSize: 42,
    fontWeight: "700",
  },

  cameraBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,

    width: 34,
    height: 34,

    borderRadius: 17,

    backgroundColor: "#111827",

    justifyContent: "center",
    alignItems: "center",

    borderWidth: 2,
    borderColor: "#FFFFFF",
  },

  changePhoto: {
    marginTop: 14,
    color: "#2D6A4F",
    fontWeight: "600",
  },

  formCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 20,

    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 12,
    shadowOffset: {
      width: 0,
      height: 6,
    },

    elevation: 3,
  },

  label: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 8,
    marginTop: 10,
  },

  input: {
    backgroundColor: "#F9FAFB",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginBottom: 8,
  },

  readOnlyBox: {
    backgroundColor: "#F3F4F6",
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },

  readOnlyText: {
    color: "#6B7280",
  },

  saveBtn: {
    backgroundColor: "#2D6A4F",
    padding: 18,
    borderRadius: 18,
    alignItems: "center",
    marginTop: 10,
  },

  saveText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },

  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.45)",
  },

  premiumModal: {
    width: "85%",
    backgroundColor: "#FFFFFF",
    borderRadius: 30,
    padding: 25,
    alignItems: "center",
  },

  modalEmoji: {
    fontSize: 55,
  },

  modalTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#111827",
    marginTop: 10,
  },

  modalMessage: {
    textAlign: "center",
    color: "#6B7280",
    marginTop: 10,
    lineHeight: 22,
  },

  modalButton: {
    backgroundColor: "#2D6A4F",
    width: "100%",
    padding: 15,
    borderRadius: 16,
    marginTop: 20,
    alignItems: "center",
  },

  modalButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
});
