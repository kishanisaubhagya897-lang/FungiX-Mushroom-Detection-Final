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
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  showSuccess,
  showError,
} from "../utils/toast";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [secure, setSecure] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      showError(
  "Validation Error",
  "Please fill all fields."
);
      return;
    }

    try {
      setLoading(true);

      await signInWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );

 
      router.replace("/loading");
    } catch (error: any) {
      let message = "Login failed.";

      if (error.code === "auth/invalid-email") {
        message = "Invalid email address.";
      } else if (error.code === "auth/invalid-credential") {
        message = "Incorrect email or password.";
      } else if (error.code === "auth/user-not-found") {
        message = "User not found.";
      }

     showError("Login Error", message);
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
          {/* Background glow */}
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
            {/* Logo */}
            <View
              style={{
                alignItems: "center",
                marginBottom: 50,
              }}
            >
              <View
                style={{
                  width: 90,
                  height: 90,
                  borderRadius: 30,
                  backgroundColor: "rgba(255, 255, 255, 0.75)",
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

            {/* Heading */}
            <Text
              style={{
                fontSize: 36,
                fontWeight: "900",
                color: "#123D18",
                textAlign: "center",
                letterSpacing: -0.5,
              }}
            >
              Welcome Back
            </Text>

            <Text
              style={{
                fontSize: 16,
                color: "#607164",
                textAlign: "center",
                marginTop: 12,
                marginBottom: 40,
                lineHeight: 24,
              }}
            >
              Sign in to continue your FungiX journey
            </Text>

            {/* Email */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: "rgba(255,255,255,0.72)",
                borderRadius: 22,
                paddingHorizontal: 20,
                height: 62,
                marginBottom: 18,
                borderWidth: 1,
                borderColor: "rgba(255,255,255,0.55)",
              }}
            >
              <Ionicons
                name="mail-outline"
                size={22}
                color="#6C7C70"
              />

              <TextInput
                placeholder="Email Address"
                placeholderTextColor="#8A9990"
                style={{
                  flex: 1,
                  marginLeft: 14,
                  fontSize: 16,
                  color: "#1E2B21",
                }}
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
            </View>

            {/* Password */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: "rgba(255,255,255,0.72)",
                borderRadius: 22,
                paddingHorizontal: 20,
                height: 62,
                borderWidth: 1,
                borderColor: "rgba(255,255,255,0.55)",
              }}
            >
              <Ionicons
                name="lock-closed-outline"
                size={22}
                color="#6C7C70"
              />

              <TextInput
                placeholder="Password"
                placeholderTextColor="#8A9990"
                style={{
                  flex: 1,
                  marginLeft: 14,
                  fontSize: 16,
                  color: "#1E2B21",
                }}
                secureTextEntry={secure}
                value={password}
                onChangeText={setPassword}
              />

              <TouchableOpacity onPress={() => setSecure(!secure)}>
                <Ionicons
                  name={secure ? "eye-off-outline" : "eye-outline"}
                  size={22}
                  color="#6C7C70"
                />
              </TouchableOpacity>
            </View>

            {/* Forgot */}
            <TouchableOpacity
              onPress={() => router.push("/forgot-password")}
            >
              <Text
                style={{
                  textAlign: "right",
                  marginTop: 16,
                  color: "#2E7D32",
                  fontWeight: "700",
                  fontSize: 14,
                }}
              >
                Forgot Password?
              </Text>
            </TouchableOpacity>

            {/* Button */}
            <TouchableOpacity
              onPress={handleLogin}
              disabled={loading}
              style={{
                marginTop: 32,
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
                  Sign In
                </Text>
              )}
            </TouchableOpacity>

            {/* Signup */}
            <Text
              style={{
                textAlign: "center",
                marginTop: 28,
                fontSize: 15,
                color: "#607164",
              }}
            >
              New to FungiX?{" "}
              <Text
                onPress={() => router.push("/signup")}
                style={{
                  color: "#2E7D32",
                  fontWeight: "800",
                }}
              >
                Create Account
              </Text>
            </Text>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}