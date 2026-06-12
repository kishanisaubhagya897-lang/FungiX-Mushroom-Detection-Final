import React, {
  useState,
  useEffect,
} from "react";
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
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  addDoc,
  Timestamp,
} from "firebase/firestore";
import { db } from "../firebaseConfig";
import {
  useLocalSearchParams,
  router,
} from "expo-router";
import {
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import {
  showSuccess,
  showError,
  showInfo,
} from "../utils/toast";
import { sendOTPEmail } from "../services/emailService";

export default function OTPScreen() {
  const { email } =
    useLocalSearchParams();

  const [otp, setOtp] =
    useState("");
  const [loading, setLoading] =
    useState(false);
  const [resending, setResending] =
    useState(false);
  const [seconds, setSeconds] =
    useState(120);

  useEffect(() => {
    if (seconds <= 0) return;

    const timer = setInterval(() => {
      setSeconds((prev) => prev - 1);
    }, 1000);

    return () =>
      clearInterval(timer);
  }, [seconds]);

  const formatTime = () => {
    const mins = Math.floor(
      seconds / 60
    );
    const secs = seconds % 60;

    return `${mins}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const generateOTP = () => {
    return Math.floor(
      100000 + Math.random() * 900000
    ).toString();
  };

  const resendOTP = async () => {
    try {
      setResending(true);

      const newOTP =
        generateOTP();

      await addDoc(
        collection(
          db,
          "password_reset_otps"
        ),
        {
          email,
          otp: newOTP,
          verified: false,
          expiresAt:
            Timestamp.fromDate(
              new Date(
                Date.now() +
                  10 *
                    60 *
                    1000
              )
            ),
        }
      );

      const sent =
        await sendOTPEmail(
          String(email),
          newOTP
        );

      if (!sent) {
        showError(
          "Email Error",
          "Failed to resend OTP."
        );
        return;
      }

      setSeconds(120);

      showSuccess(
        "OTP Resent",
        "New verification code sent."
      );
    } catch {
      showError(
        "Error",
        "Failed to resend OTP."
      );
    } finally {
      setResending(false);
    }
  };

  const verifyOTP = async () => {
    if (seconds <= 0) {
      showError(
        "OTP Expired",
        "Please resend OTP."
      );
      return;
    }

    if (!otp) {
      showError(
        "Validation Error",
        "Enter OTP."
      );
      return;
    }

    try {
      setLoading(true);

      const q = query(
        collection(
          db,
          "password_reset_otps"
        ),
        where("email", "==", email),
        where("otp", "==", otp),
        where("verified", "==", false)
      );

      const snapshot =
        await getDocs(q);

      if (snapshot.empty) {
        showError(
          "Invalid OTP",
          "Please check code."
        );
        return;
      }

      const docRef =
        snapshot.docs[0].ref;

      await updateDoc(docRef, {
        verified: true,
      });

      showSuccess(
        "OTP Verified",
        "Verification successful."
      );

      router.replace({
        pathname:
          "/reset-password",
        params: {
          email,
          otp,
        },
      });
    } catch {
      showError(
        "Verification Failed",
        "Unable to verify OTP."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={[
        "#F8FCF8",
        "#EDF8F0",
        "#E4F3E8",
      ]}
      style={{ flex: 1 }}
    >
      <SafeAreaView
        style={{ flex: 1 }}
      >
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={
            Platform.OS === "ios"
              ? "padding"
              : undefined
          }
        >
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
              justifyContent:
                "center",
            }}
          >
            <View
              style={{
                alignItems:
                  "center",
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
                  justifyContent:
                    "center",
                  alignItems:
                    "center",
                }}
              >
                <MaterialCommunityIcons
                  name="mushroom-outline"
                  size={42}
                  color="#2E7D32"
                />
              </View>
            </View>

            <Text
              style={{
                fontSize: 34,
                fontWeight:
                  "900",
                color:
                  "#123D18",
                textAlign:
                  "center",
              }}
            >
              Verify OTP
            </Text>

            <Text
              style={{
                fontSize: 16,
                color:
                  "#607164",
                textAlign:
                  "center",
                marginTop: 12,
                marginBottom: 18,
              }}
            >
              Enter the 6-digit
              code sent to your
              email
            </Text>

            <Text
              style={{
                textAlign:
                  "center",
                fontSize: 18,
                fontWeight:
                  "800",
                color:
                  seconds <= 15
                    ? "#D32F2F"
                    : "#2E7D32",
                marginBottom: 24,
              }}
            >
              {formatTime()}
            </Text>

            <View
              style={{
                backgroundColor:
                  "rgba(255,255,255,0.72)",
                borderRadius: 22,
                paddingHorizontal: 20,
                height: 62,
                justifyContent:
                  "center",
              }}
            >
              <TextInput
                placeholder="Enter OTP"
                placeholderTextColor="#8A9990"
                style={{
                  fontSize: 20,
                  letterSpacing: 10,
                  textAlign:
                    "center",
                }}
                keyboardType="number-pad"
                maxLength={6}
                value={otp}
                onChangeText={
                  setOtp
                }
              />
            </View>

            <TouchableOpacity
              onPress={
                verifyOTP
              }
              disabled={
                loading ||
                seconds <= 0
              }
              style={{
                marginTop: 28,
                height: 62,
                borderRadius: 22,
                justifyContent:
                  "center",
                alignItems:
                  "center",
                backgroundColor:
                  "#2E7D32",
              }}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text
                  style={{
                    color:
                      "#fff",
                    fontSize: 17,
                    fontWeight:
                      "800",
                  }}
                >
                  Verify OTP
                </Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={
                resendOTP
              }
              disabled={
                resending
              }
            >
              <Text
                style={{
                  textAlign:
                    "center",
                  marginTop: 20,
                  color:
                    "#2E7D32",
                  fontWeight:
                    "700",
                }}
              >
                {resending
                  ? "Resending..."
                  : "Resend OTP"}
              </Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}