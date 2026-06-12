import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PrivacyPolicy() {
  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
      </TouchableOpacity>

      <Text style={styles.title}>Privacy Policy</Text>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <Text style={styles.heading}>Information Collection</Text>

          <Text style={styles.text}>
            FungiX may collect scan results, profile information and app usage
            data to improve user experience.
          </Text>

          <Text style={styles.heading}>Data Security</Text>

          <Text style={styles.text}>
            We use Firebase services to securely store user data.
          </Text>

          <Text style={styles.heading}>User Privacy</Text>

          <Text style={styles.text}>
            Your personal information is not sold to third parties.
          </Text>

          <Text style={styles.heading}>Contact</Text>

          <Text style={styles.text}>support@fungix.com</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7FAF8",
    padding: 20,
  },

  backBtn: {
    width: 46,
    height: 46,
    borderRadius: 16,
    backgroundColor: "#2D6A4F",

    justifyContent: "center",
    alignItems: "center",

    marginBottom: 20,
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 20,
    alignItems: "center",
    paddingLeft: 90,
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 20,
  },

  heading: {
    fontSize: 18,
    fontWeight: "700",
    marginTop: 15,
    marginBottom: 8,
  },

  text: {
    color: "#6B7280",
    lineHeight: 24,
  },
});
