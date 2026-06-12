import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Camera } from "expo-camera";

export default function UploadScreen() {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Pick from gallery
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      fakeScan();
    }
  };

  // Take picture
  const takePhoto = async () => {
    const permission = await Camera.requestCameraPermissionsAsync();
    if (!permission.granted) {
      alert("Camera permission required");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      fakeScan();
    }
  };

  

  // Fake AI scan demo
  const fakeScan = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      alert("🍄 Mushroom Detected: Oyster Mushroom\n✅ Edible");
    }, 2000);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Scan Mushroom</Text>

      <TouchableOpacity style={styles.button} onPress={takePhoto}>
        <Text style={styles.btnText}>📷 Take Picture</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={pickImage}>
        <Text style={styles.btnText}>⬆ Upload Image</Text>
      </TouchableOpacity>

      {image && (
        <Image source={{ uri: image }} style={styles.preview} />
      )}

      {loading && <ActivityIndicator size="large" color="green" />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: "center",
  },

  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },

  button: {
    width: "80%",
    backgroundColor: "#2E7D32",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },

  btnText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },

  preview: {
    width: 250,
    height: 250,
    marginTop: 20,
    borderRadius: 15,
  },
});
