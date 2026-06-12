import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { showError, showSuccess } from "../utils/toast";

export default function ResetPassword() {
  const { email, otp } = useLocalSearchParams();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [secure1, setSecure1] = useState(true);
  const [secure2, setSecure2] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async () => {
    if (!newPassword || !confirmPassword) {
      showError("Validation Error", "Fill all fields.");
      return;
    }

    if (newPassword.length < 6) {
      showError("Weak Password", "Password must be at least 6 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      showError("Password Mismatch", "Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "http://10.104.100.238:5000/reset-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            otp,
            newPassword,
          }),
        },
      );

      const text = await response.text();

      console.log("SERVER RESPONSE:", text);

      const result = JSON.parse(text);

      if (!result.success) {
        showError("Reset Failed", result.message);
        return;
      }

      showSuccess("Password Updated", "Password updated successfully.");

      router.replace("/login");
    } catch (error: any) {
      console.log("RESET ERROR:", error);

      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={["#F8FCF8", "#EDF8F0", "#E4F3E8"]}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          {/* Glow */}
          <View
            style={{
              position: "absolute",
              top: -100,
              right: -80,
              width: 240,
              height: 240,
              borderRadius: 120,
              backgroundColor: "rgba(46,125,50,0.10)",
            }}
          />

          <View
            style={{
              position: "absolute",
              bottom: -100,
              left: -80,
              width: 260,
              height: 260,
              borderRadius: 130,
              backgroundColor: "rgba(46,125,50,0.08)",
            }}
          />

          <View
            style={{
              flex: 1,
              paddingHorizontal: 28,
              justifyContent: "center",
            }}
          >
            {/* Mushroom */}
            <View
              style={{
                alignItems: "center",
                marginBottom: 42,
              }}
            >
              <View
                style={{
                  width: 90,
                  height: 90,
                  borderRadius: 30,
                  backgroundColor: "rgba(255,255,255,0.75)",
                  justifyContent: "center",
                  alignItems: "center",
                  shadowColor: "#000",
                  shadowOpacity: 0.06,
                  shadowRadius: 14,
                  elevation: 6,
                }}
              >
                <MaterialCommunityIcons
                  name="mushroom-outline"
                  size={42}
                  color="#2E7D32"
                />
              </View>
            </View>

            {/* Title */}
            <Text
              style={{
                fontSize: 34,
                fontWeight: "900",
                color: "#123D18",
                textAlign: "center",
              }}
            >
              Reset Password
            </Text>

            <Text
              style={{
                fontSize: 16,
                color: "#607164",
                textAlign: "center",
                marginTop: 12,
                marginBottom: 38,
                lineHeight: 24,
              }}
            >
              Create your new secure password
            </Text>

            {/* New Password */}
            <View style={inputStyle}>
              <Ionicons name="lock-closed-outline" size={22} color="#6C7C70" />

              <TextInput
                placeholder="New Password"
                placeholderTextColor="#8A9990"
                style={textInputStyle}
                secureTextEntry={secure1}
                value={newPassword}
                onChangeText={setNewPassword}
              />

              <TouchableOpacity onPress={() => setSecure1(!secure1)}>
                <Ionicons
                  name={secure1 ? "eye-off-outline" : "eye-outline"}
                  size={22}
                  color="#6C7C70"
                />
              </TouchableOpacity>
            </View>

            {/* Confirm */}
            <View style={inputStyle}>
              <Ionicons
                name="shield-checkmark-outline"
                size={22}
                color="#6C7C70"
              />

              <TextInput
                placeholder="Confirm Password"
                placeholderTextColor="#8A9990"
                style={textInputStyle}
                secureTextEntry={secure2}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />

              <TouchableOpacity onPress={() => setSecure2(!secure2)}>
                <Ionicons
                  name={secure2 ? "eye-off-outline" : "eye-outline"}
                  size={22}
                  color="#6C7C70"
                />
              </TouchableOpacity>
            </View>

            {/* Button */}
            <TouchableOpacity
              onPress={handleResetPassword}
              disabled={loading}
              style={{
                marginTop: 30,
                height: 62,
                borderRadius: 22,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#2E7D32",
                shadowColor: "#2E7D32",
                shadowOpacity: 0.25,
                shadowRadius: 16,
                elevation: 8,
              }}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text
                  style={{
                    color: "#fff",
                    fontSize: 17,
                    fontWeight: "800",
                  }}
                >
                  Update Password
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const inputStyle = {
  flexDirection: "row" as const,
  alignItems: "center" as const,
  backgroundColor: "rgba(255,255,255,0.72)",
  borderRadius: 22,
  paddingHorizontal: 20,
  height: 62,
  marginBottom: 16,
  borderWidth: 1,
  borderColor: "rgba(255,255,255,0.55)",
};

const textInputStyle = {
  flex: 1,
  marginLeft: 14,
  fontSize: 16,
  color: "#1E2B21",
};
