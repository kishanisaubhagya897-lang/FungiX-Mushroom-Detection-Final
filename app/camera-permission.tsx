import { Camera } from "expo-camera";
import { router } from "expo-router";
import { Button, Text, View } from "react-native";

export default function Permission() {
  const requestPermission = async () => {
    await Camera.requestCameraPermissionsAsync();
    router.replace("/camera");
  };

  return (
    <View>
      <Text>Camera access required</Text>
      <Button title="Grant Permission" onPress={requestPermission} />
    </View>
  );
}
