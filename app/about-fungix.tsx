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

export default function AboutFungiX() {
  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
      </TouchableOpacity>

      <Text style={styles.title}>About FungiX</Text>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.heroCard}>
          <Text style={styles.logo}>🍄</Text>

          <Text style={styles.appName}>FungiX AI</Text>

          <Text style={styles.version}>Version 1.0.0</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.heading}>Our Mission</Text>

          <Text style={styles.text}>
            FungiX helps users identify mushrooms using Artificial Intelligence
            technology, providing educational and safety information.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.heading}>Features</Text>

          <Text style={styles.text}>• AI Mushroom Detection</Text>

          <Text style={styles.text}>• Detection History</Text>

          <Text style={styles.text}>• Firebase Cloud Storage</Text>

          <Text style={styles.text}>• Notifications</Text>

          <Text style={styles.text}>• Mushroom Encyclopedia</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.heading}>Developed By</Text>

          <Text style={styles.text}>Mohamed Sasan</Text>

          <Text style={styles.text}>Undergraduate IT Student</Text>
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
    paddingLeft: 90,
  },

  heroCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 30,
    padding: 30,
    alignItems: "center",
    marginBottom: 20,
  },

  logo: {
    fontSize: 60,
  },

  appName: {
    fontSize: 24,
    fontWeight: "700",
    marginTop: 10,
  },

  version: {
    color: "#6B7280",
    marginTop: 5,
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 20,
    marginBottom: 15,
  },

  heading: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 10,
  },

  text: {
    color: "#6B7280",
    lineHeight: 24,
  },
});
