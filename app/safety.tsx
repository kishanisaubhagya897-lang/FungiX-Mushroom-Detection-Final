import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

export default function SafetyScreen() {
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
            Safety Information
          </Text>

          <View style={{ width: 46 }} />
        </View>

        {/* HERO WARNING */}
        <View style={styles.heroCard}>
          <View style={styles.heroIcon}>
            <Ionicons
              name="warning-outline"
              size={34}
              color="#FFFFFF"
            />
          </View>

          <Text style={styles.heroTitle}>
            Mushroom Safety First
          </Text>

          <Text style={styles.heroText}>
            Never consume wild mushrooms based only on AI
            identification. Expert confirmation is strongly
            recommended.
          </Text>
        </View>

        {/* SAFETY RULES */}
        <Text style={styles.sectionTitle}>
          Essential Safety Rules
        </Text>

        <View style={styles.card}>
          <SafetyItem
            icon="shield-checkmark-outline"
            title="Verify with Experts"
            text="Always confirm mushroom identification with a trained expert."
          />

          <Divider />

          <SafetyItem
            icon="eye-outline"
            title="Inspect Carefully"
            text="Check cap, stem, gills, spores, smell, and surrounding habitat."
          />

          <Divider />

          <SafetyItem
            icon="restaurant-outline"
            title="Do Not Taste Unknown Mushrooms"
            text="Even a small amount of poisonous species can be dangerous."
          />
        </View>

        {/* POISONING SIGNS */}
        <Text style={styles.sectionTitle}>
          Poisoning Warning Signs
        </Text>

        <View style={styles.card}>
          <WarningItem text="Nausea or vomiting" />
          <WarningItem text="Severe stomach pain" />
          <WarningItem text="Dizziness or confusion" />
          <WarningItem text="Breathing difficulty" />
          <WarningItem text="Sweating or abnormal heartbeat" />
        </View>

        {/* EMERGENCY */}
        <Text style={styles.sectionTitle}>
          Emergency Steps
        </Text>

        <View style={styles.emergencyCard}>
          <EmergencyStep
            number="1"
            text="Stop eating the mushroom immediately."
          />

          <EmergencyStep
            number="2"
            text="Call emergency medical services."
          />

          <EmergencyStep
            number="3"
            text="Keep leftover mushroom samples for identification."
          />

          <EmergencyStep
            number="4"
            text="Record time of consumption and symptoms."
          />
        </View>

        {/* DISCLAIMER */}
        <View style={styles.disclaimerBox}>
          <Ionicons
            name="information-circle-outline"
            size={22}
            color="#D97706"
          />

          <Text style={styles.disclaimerText}>
            FungiX AI provides guidance only. Accuracy is not
            guaranteed. Always seek professional verification.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function Divider() {
  return <View style={styles.divider} />;
}

function SafetyItem({
  icon,
  title,
  text,
}: {
  icon: any;
  title: string;
  text: string;
}) {
  return (
    <View style={styles.itemRow}>
      <View style={styles.iconCircle}>
        <Ionicons
          name={icon}
          size={20}
          color="#2D6A4F"
        />
      </View>

      <View style={{ flex: 1 }}>
        <Text style={styles.itemTitle}>{title}</Text>
        <Text style={styles.itemText}>{text}</Text>
      </View>
    </View>
  );
}

function WarningItem({ text }: { text: string }) {
  return (
    <View style={styles.warningRow}>
      <Ionicons
        name="warning-outline"
        size={18}
        color="#DC2626"
      />
      <Text style={styles.warningText}>{text}</Text>
    </View>
  );
}

function EmergencyStep({
  number,
  text,
}: {
  number: string;
  text: string;
}) {
  return (
    <View style={styles.stepRow}>
      <View style={styles.stepCircle}>
        <Text style={styles.stepNumber}>{number}</Text>
      </View>

      <Text style={styles.stepText}>{text}</Text>
    </View>
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
    backgroundColor: "#DC2626",
    borderRadius: 28,
    padding: 24,
    alignItems: "center",
    marginBottom: 28,
  },

  heroIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "rgba(255,255,255,0.2)",
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
    color: "#FEE2E2",
    textAlign: "center",
    marginTop: 10,
    lineHeight: 22,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 14,
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    paddingVertical: 10,
    marginBottom: 28,

    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },

    elevation: 3,
  },

  itemRow: {
    flexDirection: "row",
    paddingHorizontal: 18,
    paddingVertical: 14,
  },

  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#F3F7F4",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },

  itemTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
  },

  itemText: {
    color: "#6B7280",
    marginTop: 6,
    lineHeight: 20,
  },

  divider: {
    height: 1,
    backgroundColor: "#F3F4F6",
    marginHorizontal: 18,
  },

  warningRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingVertical: 12,
  },

  warningText: {
    marginLeft: 12,
    fontSize: 15,
    color: "#111827",
  },

  emergencyCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 20,
    marginBottom: 28,

    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },

    elevation: 3,
  },

  stepRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
  },

  stepCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#2D6A4F",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },

  stepNumber: {
    color: "#FFFFFF",
    fontWeight: "700",
  },

  stepText: {
    flex: 1,
    color: "#111827",
    lineHeight: 22,
  },

  disclaimerBox: {
    backgroundColor: "#FEF3C7",
    borderRadius: 20,
    padding: 18,
    flexDirection: "row",
    alignItems: "flex-start",
  },

  disclaimerText: {
    flex: 1,
    marginLeft: 12,
    color: "#92400E",
    lineHeight: 20,
  },
});