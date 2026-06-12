import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import Toast from "react-native-toast-message";

import { useColorScheme } from "@/hooks/use-color-scheme";

export default function RootLayout() {
  const colorScheme =
    useColorScheme();

  return (
    <ThemeProvider
      value={
        colorScheme === "dark"
          ? DarkTheme
          : DefaultTheme
      }
    >
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen
          name="splash"
        />

        <Stack.Screen
          name="index"
        />

        <Stack.Screen
          name="onboarding"
        />

        <Stack.Screen
          name="login"
        />

        <Stack.Screen
          name="signup"
        />

        <Stack.Screen
          name="forgot-password"
        />

        <Stack.Screen
          name="otp"
        />

        <Stack.Screen
          name="reset-password"
        />
        <Stack.Screen name="loading" />

        <Stack.Screen
          name="(tabs)"
        />

        <Stack.Screen
          name="modal"
          options={{
            presentation:
              "modal",
          }}
        />
      </Stack>

      <Toast />

      <StatusBar style="auto" />
    </ThemeProvider>
  );
}