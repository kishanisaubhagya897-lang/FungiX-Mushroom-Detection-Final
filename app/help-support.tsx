import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
    Linking,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HelpSupport() {
  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
      </TouchableOpacity>

      <Text style={styles.title}>Help & Support</Text>

      <ScrollView>
        <View style={styles.card}>
          <Text style={styles.heading}>Need Help?</Text>

          <Text style={styles.text}>
            Contact our support team for technical issues, account problems, or
            mushroom identification concerns.
          </Text>
        </View>

        <TouchableOpacity
          style={styles.card}
          onPress={() => Linking.openURL("mailto:support@fungix.com")}
        >
          <Text style={styles.heading}>📧 Email Support</Text>

          <Text style={styles.text}>support@fungix.com</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => Linking.openURL("https://www.google.com")}
        >
          <Text style={styles.heading}>🌐 Website</Text>

          <Text style={styles.text}>Visit FungiX Website</Text>
        </TouchableOpacity>

        <View style={styles.card}>
          <Text style={styles.heading}>FAQ</Text>

          <Text style={styles.text}>• How accurate are scans?</Text>

          <Text style={styles.text}>• Can I eat edible mushrooms?</Text>

          <Text style={styles.text}>• How does AI detection work?</Text>
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

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 20,
    marginBottom: 15,
  },

  heading: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 8,
  },

  text: {
    color: "#6B7280",
    lineHeight: 22,
  },
});
