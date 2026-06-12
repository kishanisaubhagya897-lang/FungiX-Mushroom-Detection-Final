import { View, Text, StyleSheet } from "react-native";

export default function Home() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>🍄 FungiX Home</Text>
      <Text style={styles.text}>Now we will add Upload + Camera + AI Prediction.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 22, fontWeight: "bold" },
  text: { marginTop: 10, color: "gray" },
});
