import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import { View, Text, Button, Image } from 'react-native';

export default function Identify() {
 const [image, setImage] = useState<string | null>(null);
const [result, setResult] = useState<string | null>(null);


  const pickImage = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({
      quality: 1,
    });

    if (!res.canceled) {
      setImage(res.assets[0].uri);
      identifyMushroom(res.assets[0].uri);
    }
  };

const identifyMushroom = (uri: string) => {

    // Fake AI response (replace later)
    setTimeout(() => {
      setResult("Oyster Mushroom - Edible ✅");
    }, 1500);
  };

  return (
    <View style={{ padding: 20 }}>
      <Button title="Upload Mushroom Image" onPress={pickImage} />

      {image && (
        <Image
          source={{ uri: image }}
          style={{ height: 200, marginTop: 20 }}
        />
      )}

      {result && (
        <Text style={{ marginTop: 20, fontSize: 18 }}>
          {result}
        </Text>
      )}
    </View>
  );
}
