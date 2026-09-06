import { router, useLocalSearchParams } from "expo-router";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Result() {
  const params = useLocalSearchParams();

  const image =
    typeof params.image === "string"
      ? params.image
      : params.image?.[0];

  // Demo quality check
  const lowQuality = Math.random() > 0.6;

  return (
    <View style={styles.container}>
      {/* Mushroom Image */}
      {image && <Image source={{ uri: image }} style={styles.image} />}

      {/* Warning */}
      {lowQuality ? (
        <View style={styles.warning}>
          <Text style={styles.warningText}>
            ⚠ Mushroom image not clear. Try again.
          </Text>
        </View>
      ) : (
        <>
          {/* Result Card */}
          <View style={styles.card}>
            <Text style={styles.title}>🍄 Edible Mushroom</Text>
            <Text style={styles.sub}>Model prediction: Edible</Text>

            <View style={styles.progressBg}>
              <View style={styles.progressFill} />
            </View>

            <Text style={styles.confidence}>Confidence: 85%</Text>
          </View>

          {/* Button */}
          <TouchableOpacity
            style={styles.btn}
            onPress={() =>
              router.push({
                pathname: "/details",
                params: { image },
              })
            }
          >
            <Text style={styles.btnText}>View Details →</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F6F8",
    alignItems: "center",
    paddingTop: 50,
    paddingHorizontal: 20,
  },

  image: {
    width: "100%",
    height: 250,
    borderRadius: 20,
    marginBottom: 20,
  },

  card: {
    backgroundColor: "#DFF5E1",
    padding: 20,
    borderRadius: 20,
    width: "100%",
    alignItems: "center",
  },

  title: {
    fontSize: 22,
    fontWeight: "bold",
  },

  sub: {
    color: "#2E7D32",
    marginBottom: 10,
  },

  progressBg: {
    height: 10,
    width: "100%",
    backgroundColor: "#BFE6C1",
    borderRadius: 10,
    marginVertical: 10,
  },

  progressFill: {
    width: "85%",
    height: "100%",
    backgroundColor: "#2E7D32",
    borderRadius: 10,
  },

  confidence: {
    fontWeight: "bold",
  },

  btn: {
    backgroundColor: "#2E7D32",
    padding: 15,
    borderRadius: 15,
    marginTop: 20,
    width: "100%",
    alignItems: "center",
  },

  btnText: {
    color: "white",
    fontWeight: "bold",
  },

  warning: {
    backgroundColor: "#FFCDD2",
    padding: 20,
    borderRadius: 20,
    width: "100%",
  },

  warningText: {
    color: "red",
    fontWeight: "bold",
    textAlign: "center",
  },
});