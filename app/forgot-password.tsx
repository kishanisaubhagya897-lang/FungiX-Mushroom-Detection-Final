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
  collection,
  addDoc,
  Timestamp,
} from "firebase/firestore";
import { db } from "../firebaseConfig";
import { sendOTPEmail } from "../services/emailService";
import {
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import {
  showSuccess,
  showError,
} from "../utils/toast";

export default function ForgotPassword() {
  const [email, setEmail] =
    useState("");
  const [loading, setLoading] =
    useState(false);

  const generateOTP = () => {
    return Math.floor(
      100000 + Math.random() * 900000
    ).toString();
  };

  const handleSendOTP = async () => {
    if (!email) {
      showError(
  "Validation Error",
  "Enter your email."
);
      return;
    }

    try {
      setLoading(true);

      const otp = generateOTP();

      await addDoc(
        collection(db, "password_reset_otps"),
        {
          email: email.trim(),
          otp,
          verified: false,
          expiresAt: Timestamp.fromDate(
            new Date(
              Date.now() +
                10 * 60 * 1000
            )
          ),
        }
      );

      const sent = await sendOTPEmail(
        email.trim(),
        otp
      );

      if (!sent) {
        showError(
  "Email Error",
  "Failed to send OTP."
);
        return;
      }

   showSuccess(
  "OTP Sent",
  "Verification code sent successfully."
);

      router.push({
        pathname: "/otp",
        params: {
          email: email.trim(),
        },
      });
    } catch (error) {
      showError(
  "Process Failed",
  "OTP process failed."
);
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
          behavior={
            Platform.OS === "ios"
              ? "padding"
              : undefined
          }
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
            {/* Mushroom Branding */}
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
              Forgot Password
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
              Enter your email to receive
              a secure OTP verification code
            </Text>

            {/* Email */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor:
                  "rgba(255,255,255,0.72)",
                borderRadius: 22,
                paddingHorizontal: 20,
                height: 62,
                borderWidth: 1,
                borderColor:
                  "rgba(255,255,255,0.55)",
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

            {/* Button */}
            <TouchableOpacity
              onPress={handleSendOTP}
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
                  Send OTP
                </Text>
              )}
            </TouchableOpacity>

            {/* Back */}
            <Text
              onPress={() =>
                router.push("/login")
              }
              style={{
                textAlign: "center",
                marginTop: 24,
                fontSize: 15,
                color: "#2E7D32",
                fontWeight: "700",
              }}
            >
              Back to Sign In
            </Text>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}