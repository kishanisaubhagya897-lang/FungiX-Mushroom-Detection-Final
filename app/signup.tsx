import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { router } from "expo-router";
import {
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { auth } from "../firebaseConfig";
import {
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import {
  showSuccess,
  showError,
} from "../utils/toast";

export default function SignUp() {
  const [fullName, setFullName] =
    useState("");
  const [email, setEmail] =
    useState("");
  const [password, setPassword] =
    useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");
  const [secure1, setSecure1] =
    useState(true);
  const [secure2, setSecure2] =
    useState(true);
  const [loading, setLoading] =
    useState(false);

  const handleSignup = async () => {
    if (
      !fullName ||
      !email ||
      !password ||
      !confirmPassword
    ) {
     showError(
  "Validation Error",
  "Please fill all fields."
);
      return;
    }

    if (password !== confirmPassword) {
    showError(
  "Validation Error",
  "Passwords do not match."
);
      return;
    }

 if (password.length < 6) {
  showError(
    "Weak Password",
    "Password must be at least 6 characters."
  );
  return;
}



    if (!/[A-Z]/.test(password)) {
  showError(
    "Weak Password",
    "Password must contain at least one uppercase letter."
  );
  return;
}

    try {
      setLoading(true);

      const userCredential =
        await createUserWithEmailAndPassword(
          auth,
          email.trim(),
          password
        );

      await updateProfile(
        userCredential.user,
        {
          displayName: fullName,
        }
      );

      showSuccess(
  "Success",
  "Account created successfully!"
);

      router.replace("/login");
    } catch (error: any) {
      let message = "Signup failed.";

      if (
        error.code === "auth/email-already-in-use"
      ) {
        message =
          "This email is already registered.";
      } else if (
        error.code === "auth/invalid-email"
      ) {
        message = "Invalid email address.";
      }

      showError("Signup Error", message);
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
              backgroundColor:
                "rgba(46,125,50,0.10)",
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
              backgroundColor:
                "rgba(46,125,50,0.08)",
            }}
          />

          <View
            style={{
              flex: 1,
              paddingHorizontal: 28,
              justifyContent: "center",
            }}
          >
            {/* Mushroom Icon */}
            <View
              style={{
                alignItems: "center",
                marginBottom: 36,
              }}
            >
              <View
                style={{
                  width: 90,
                  height: 90,
                  borderRadius: 30,
                  backgroundColor:
                    "rgba(255,255,255,0.75)",
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
              Create Account
            </Text>

            <Text
              style={{
                fontSize: 16,
                color: "#607164",
                textAlign: "center",
                marginTop: 12,
                marginBottom: 34,
                lineHeight: 24,
              }}
            >
              Join FungiX and start your mushroom safety journey
            </Text>

            {/* Full Name */}
            <View
              style={inputStyle}
            >
              <Ionicons
                name="person-outline"
                size={22}
                color="#6C7C70"
              />

              <TextInput
                placeholder="Full Name"
                placeholderTextColor="#8A9990"
                style={textInputStyle}
                value={fullName}
                onChangeText={setFullName}
              />
            </View>

            {/* Email */}
            <View
              style={inputStyle}
            >
              <Ionicons
                name="mail-outline"
                size={22}
                color="#6C7C70"
              />

              <TextInput
                placeholder="Email Address"
                placeholderTextColor="#8A9990"
                style={textInputStyle}
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
            </View>

            {/* Password */}
            <View
              style={inputStyle}
            >
              <Ionicons
                name="lock-closed-outline"
                size={22}
                color="#6C7C70"
              />

              <TextInput
                placeholder="Password"
                placeholderTextColor="#8A9990"
                style={textInputStyle}
                secureTextEntry={secure1}
                value={password}
                onChangeText={setPassword}
              />

              <TouchableOpacity
                onPress={() =>
                  setSecure1(!secure1)
                }
              >
                <Ionicons
                  name={
                    secure1
                      ? "eye-off-outline"
                      : "eye-outline"
                  }
                  size={22}
                  color="#6C7C70"
                />
              </TouchableOpacity>
            </View>

            {/* Confirm */}
            <View
              style={inputStyle}
            >
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

              <TouchableOpacity
                onPress={() =>
                  setSecure2(!secure2)
                }
              >
                <Ionicons
                  name={
                    secure2
                      ? "eye-off-outline"
                      : "eye-outline"
                  }
                  size={22}
                  color="#6C7C70"
                />
              </TouchableOpacity>
            </View>

            {/* Button */}
            <TouchableOpacity
              onPress={handleSignup}
              disabled={loading}
              style={{
                marginTop: 28,
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
                  Create Account
                </Text>
              )}
            </TouchableOpacity>

            {/* Login */}
            <Text
              style={{
                textAlign: "center",
                marginTop: 24,
                fontSize: 15,
                color: "#607164",
              }}
            >
              Already have an account?{" "}
              <Text
                onPress={() =>
                  router.push("/login")
                }
                style={{
                  color: "#2E7D32",
                  fontWeight: "800",
                }}
              >
                Sign In
              </Text>
            </Text>
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