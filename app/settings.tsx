import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SettingsScreen() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const [scanSoundsEnabled, setScanSoundsEnabled] = useState(true);

  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);

  const [darkModeEnabled, setDarkModeEnabled] = useState(false);

  const [analyticsEnabled, setAnalyticsEnabled] = useState(true);

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
            <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Settings</Text>

          <View style={{ width: 46 }} />
        </View>

        {/* PREFERENCES */}
        <Text style={styles.sectionTitle}>Preferences</Text>

        <View style={styles.card}>
          <View style={styles.settingRow}>
            <View style={styles.left}>
              <View style={styles.iconCircle}>
                <Ionicons
                  name="notifications-outline"
                  size={20}
                  color="#2D6A4F"
                />
              </View>

              <View>
                <Text style={styles.settingTitle}>Notifications</Text>
                <Text style={styles.settingSubtitle}>
                  Receive app alerts & reminders
                </Text>
              </View>
            </View>

            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{
                false: "#D1D5DB",
                true: "#A7F3D0",
              }}
              thumbColor={notificationsEnabled ? "#2D6A4F" : "#9CA3AF"}
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.settingRow}>
            <View style={styles.left}>
              <View style={styles.iconCircle}>
                <Ionicons
                  name="volume-high-outline"
                  size={20}
                  color="#2D6A4F"
                />
              </View>

              <View>
                <Text style={styles.settingTitle}>Scan Sounds</Text>
                <Text style={styles.settingSubtitle}>
                  Play scanning sound effects
                </Text>
              </View>
            </View>

            <Switch
              value={scanSoundsEnabled}
              onValueChange={setScanSoundsEnabled}
              trackColor={{
                false: "#D1D5DB",
                true: "#A7F3D0",
              }}
              thumbColor={scanSoundsEnabled ? "#2D6A4F" : "#9CA3AF"}
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.settingRow}>
            <View style={styles.left}>
              <View style={styles.iconCircle}>
                <Ionicons name="save-outline" size={20} color="#2D6A4F" />
              </View>

              <View>
                <Text style={styles.settingTitle}>Auto Save Scans</Text>
                <Text style={styles.settingSubtitle}>
                  Save scan results automatically
                </Text>
              </View>
            </View>

            <Switch
              value={autoSaveEnabled}
              onValueChange={setAutoSaveEnabled}
              trackColor={{
                false: "#D1D5DB",
                true: "#A7F3D0",
              }}
              thumbColor={autoSaveEnabled ? "#2D6A4F" : "#9CA3AF"}
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.settingRow}>
            <View style={styles.left}>
              <View style={styles.iconCircle}>
                <Ionicons name="moon-outline" size={20} color="#2D6A4F" />
              </View>

              <View>
                <Text style={styles.settingTitle}>Dark Mode</Text>
                <Text style={styles.settingSubtitle}>Experimental feature</Text>
              </View>
            </View>

            <Switch
              value={darkModeEnabled}
              onValueChange={setDarkModeEnabled}
              trackColor={{
                false: "#D1D5DB",
                true: "#A7F3D0",
              }}
              thumbColor={darkModeEnabled ? "#2D6A4F" : "#9CA3AF"}
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.settingRow}>
            <View style={styles.left}>
              <View style={styles.iconCircle}>
                <Ionicons name="analytics-outline" size={20} color="#2D6A4F" />
              </View>

              <View>
                <Text style={styles.settingTitle}>Analytics</Text>

                <Text style={styles.settingSubtitle}>Help improve FungiX</Text>
              </View>
            </View>

            <Switch
              value={analyticsEnabled}
              onValueChange={setAnalyticsEnabled}
              trackColor={{
                false: "#D1D5DB",
                true: "#A7F3D0",
              }}
              thumbColor={analyticsEnabled ? "#2D6A4F" : "#9CA3AF"}
            />
          </View>
        </View>

        {/* APP INFO */}
        <Text style={styles.sectionTitle}>App Information</Text>

        <View style={styles.card}>
          <TouchableOpacity
            style={styles.linkRow}
            onPress={() => router.push("/help-support")}
          >
            <View style={styles.left}>
              <View style={styles.iconCircle}>
                <Ionicons
                  name="help-circle-outline"
                  size={20}
                  color="#2D6A4F"
                />
              </View>

              <Text style={styles.linkText}>Help & Support</Text>
            </View>

            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity
            style={styles.linkRow}
            onPress={() => router.push("/privacy-policy")}
          >
            <View style={styles.left}>
              <View style={styles.iconCircle}>
                <Ionicons name="shield-outline" size={20} color="#2D6A4F" />
              </View>

              <Text style={styles.linkText}>Privacy Policy</Text>
            </View>

            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity
            style={styles.linkRow}
            onPress={() => router.push("/about-fungix")}
          >
            <View style={styles.left}>
              <View style={styles.iconCircle}>
                <Ionicons
                  name="information-circle-outline"
                  size={20}
                  color="#2D6A4F"
                />
              </View>

              <Text style={styles.linkText}>About FungiX</Text>
            </View>

            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerTitle}>FungiX AI</Text>

          <Text style={styles.footerVersion}>Version 1.0.0</Text>
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

  headerTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#111827",
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

  settingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingVertical: 14,
  },

  left: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
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

  settingTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },

  settingSubtitle: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 4,
  },

  divider: {
    height: 1,
    backgroundColor: "#F3F4F6",
    marginHorizontal: 18,
  },

  linkRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingVertical: 16,
  },

  linkText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },

  versionText: {
    color: "#6B7280",
    fontWeight: "600",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 10,
    marginBottom: 30,
  },

  backBtn: {
    width: 46,
    height: 46,
    borderRadius: 16,
    backgroundColor: "#2D6A4F",

    justifyContent: "center",
    alignItems: "center",

    shadowColor: "#2D6A4F",
    shadowOpacity: 0.25,
    shadowRadius: 10,

    elevation: 5,
  },

  footer: {
    alignItems: "center",
    marginTop: 10,
  },

  footerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2D6A4F",
  },

  footerVersion: {
    marginTop: 5,
    color: "#6B7280",
  },
});
