import { View, Text, StyleSheet, ImageBackground, Image, TouchableOpacity } from "react-native";
import { BlurView } from "expo-blur";
import { router } from "expo-router";

export default function Success() {
  return (
    <View style={{ flex: 1 }}>
      <ImageBackground
        source={require("../assets/images/auth-bg.png")}
        style={styles.bg}
        resizeMode="cover"
      >
        <BlurView intensity={20} style={styles.blur} />

        <View style={styles.card}>
          <Image
            source={require("../assets/images/success.png")}
            style={styles.img}
            resizeMode="contain"
          />

          <Text style={styles.title}>Successfully completed</Text>

          <Text style={styles.desc}>
            Your Account is Ready to Use. You will be redirected to the Login Page in a few seconds.
          </Text>

          <TouchableOpacity style={styles.greenBtn} onPress={() => router.replace("/login")}>
            <Text style={styles.greenBtnText}>Continue</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.back}>Back</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1, justifyContent: "flex-end" },
  blur: { ...StyleSheet.absoluteFillObject },

  card: {
    backgroundColor: "white",
    padding: 22,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    minHeight: "55%",
    alignItems: "center",
  },

  img: { width: "100%", height: 180 },

  title: { fontSize: 20, fontWeight: "800", marginTop: 10, textAlign: "center" },
  desc: { fontSize: 13, color: "#777", textAlign: "center", marginTop: 8 },

  greenBtn: {
    marginTop: 22,
    height: 50,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#2ECC71",
    width: "100%",
  },
  greenBtnText: { color: "white", fontSize: 15, fontWeight: "700" },

  back: { textAlign: "center", marginTop: 12, color: "#888" },
});
