import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  StatusBar,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
} from "firebase/auth";

import { auth } from "../firebaseConfig";

export default function ChangePasswordScreen() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [loading, setLoading] = useState(false);

  const handleChangePassword = async () => {
    const user = auth.currentUser;

    if (!user || !user.email) {
      Alert.alert("Authentication Error", "User not logged in.");
      return;
    }

    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert("Validation Error", "Please fill all fields.");
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert(
        "Weak Password",
        "New password must be at least 6 characters."
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert(
        "Password Mismatch",
        "New password and confirm password do not match."
      );
      return;
    }

    try {
      setLoading(true);

      const credential = EmailAuthProvider.credential(
        user.email,
        currentPassword
      );

      await reauthenticateWithCredential(user, credential);

      await updatePassword(user, newPassword);

      Alert.alert(
        "Success",
        "Password updated successfully!"
      );

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      router.back();
    } catch (error: any) {
      let message = "Failed to update password.";

      if (error.code === "auth/wrong-password") {
        message = "Current password is incorrect.";
      } else if (
        error.code === "auth/too-many-requests"
      ) {
        message =
          "Too many attempts. Please try again later.";
      } else if (
        error.code === "auth/requires-recent-login"
      ) {
        message =
          "Please log in again before changing password.";
      }

      Alert.alert("Password Error", message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <StatusBar barStyle="dark-content" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => router.back()}
          >
            <Ionicons
              name="arrow-back"
              size={22}
              color="#111827"
            />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>
            Change Password
          </Text>

          <View style={{ width: 46 }} />
        </View>

        {/* HERO */}
        <View style={styles.heroCard}>
          <View style={styles.lockCircle}>
            <Ionicons
              name="lock-closed-outline"
              size={34}
              color="#FFFFFF"
            />
          </View>

          <Text style={styles.heroTitle}>
            Secure Your Account
          </Text>

          <Text style={styles.heroText}>
            Update your password to keep your account
            secure.
          </Text>
        </View>

        {/* FORM */}
        <View style={styles.formCard}>
          {/* CURRENT */}
          <Text style={styles.label}>Current Password</Text>

          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              secureTextEntry={!showCurrent}
              placeholder="Enter current password"
              placeholderTextColor="#9CA3AF"
              value={currentPassword}
              onChangeText={setCurrentPassword}
            />

            <TouchableOpacity
              onPress={() => setShowCurrent(!showCurrent)}
            >
              <Ionicons
                name={
                  showCurrent
                    ? "eye-off-outline"
                    : "eye-outline"
                }
                size={22}
                color="#6B7280"
              />
            </TouchableOpacity>
          </View>

          {/* NEW */}
          <Text style={styles.label}>New Password</Text>

          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              secureTextEntry={!showNew}
              placeholder="Enter new password"
              placeholderTextColor="#9CA3AF"
              value={newPassword}
              onChangeText={setNewPassword}
            />

            <TouchableOpacity
              onPress={() => setShowNew(!showNew)}
            >
              <Ionicons
                name={
                  showNew
                    ? "eye-off-outline"
                    : "eye-outline"
                }
                size={22}
                color="#6B7280"
              />
            </TouchableOpacity>
          </View>

          {/* CONFIRM */}
          <Text style={styles.label}>Confirm Password</Text>

          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              secureTextEntry={!showConfirm}
              placeholder="Confirm new password"
              placeholderTextColor="#9CA3AF"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />

            <TouchableOpacity
              onPress={() => setShowConfirm(!showConfirm)}
            >
              <Ionicons
                name={
                  showConfirm
                    ? "eye-off-outline"
                    : "eye-outline"
                }
                size={22}
                color="#6B7280"
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.saveBtn}
            onPress={handleChangePassword}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.saveText}>
                Update Password
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
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

  heroCard: {
    backgroundColor: "#2D6A4F",
    borderRadius: 28,
    padding: 24,
    alignItems: "center",
    marginBottom: 28,
  },

  lockCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "rgba(255,255,255,0.18)",
    justifyContent: "center",
    alignItems: "center",
  },

  heroTitle: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "700",
    marginTop: 18,
  },

  heroText: {
    color: "#D1FAE5",
    textAlign: "center",
    marginTop: 10,
    lineHeight: 22,
  },

  formCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },

  label: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 10,
    marginTop: 10,
  },

  inputWrapper: {
    backgroundColor: "#F9FAFB",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },

  input: {
    flex: 1,
    paddingVertical: 16,
    color: "#111827",
  },

  saveBtn: {
    backgroundColor: "#2D6A4F",
    padding: 18,
    borderRadius: 18,
    alignItems: "center",
    marginTop: 18,
  },

  saveText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
});