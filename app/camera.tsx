import { CameraView } from "expo-camera";
import { View, StyleSheet } from "react-native";

export default function CameraScreen() {
  return (
    <View style={{ flex: 1 }}>
      <CameraView style={{ flex: 1 }} />

      {/* Scan frame overlay */}
      <View style={styles.overlay} />
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    borderWidth: 3,
    borderColor: "white",
    width: 250,
    height: 250,
    alignSelf: "center",
    top: "30%",
    borderRadius: 15,
  },
});
