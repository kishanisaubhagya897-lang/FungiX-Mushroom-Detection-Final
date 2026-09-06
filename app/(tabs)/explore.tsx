import { router } from "expo-router";
import React, { useState } from "react";

import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const mushrooms = [
  {
    id: "1",
    name: "Chanterelle",
    type: "Edible",
    scientific: "Species not determined by this model",
    image: require("../../assets/images/chanterelle.jpg"),
  },
  {
    id: "2",
    name: "Death Cap",
    type: "Poisonous",
    scientific: "Amanita phalloides",
    image: require("../../assets/images/chanterelle.jpg"),
  },
  {
    id: "3",
    name: "Lion's Mane",
    type: "Edible",
    scientific: "Hericium erinaceus",
     image: require("../../assets/images/chanterelle.jpg"),
  },
  {
    id: "4",
    name: "Fly Agaric",
    type: "Poisonous",
    scientific: "Amanita_muscaria",
     image: require("../../assets/images/chanterelle.jpg"),
  },
];

export default function ExploreScreen() {
  const [search, setSearch] = useState("");

  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredMushrooms = mushrooms.filter((item) => {
    const matchesSearch = item.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesCategory =
      selectedCategory === "All" ? true : item.type === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Explore Mushrooms</Text>

      <TextInput
        style={styles.searchInput}
        placeholder="Search mushrooms..."
        value={search}
        onChangeText={setSearch}
      />

      <View style={styles.filterRow}>
        {["All", "Edible", "Poisonous"].map((category) => (
          <TouchableOpacity
            key={category}
            style={[
              styles.filterChip,

              selectedCategory === category && styles.activeChip,
            ]}
            onPress={() => setSelectedCategory(category)}
          >
            <Text
              style={{
                color: selectedCategory === category ? "#fff" : "#111827",
                fontWeight: "600",
              }}
            >
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filteredMushrooms}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() =>
              router.push({
                pathname: "/mushroom-details",
                params: {
                  name: item.name,
                  scientific: item.scientific,
                  type: item.type,
                },
              })
            }
          >
            <Image source={item.image} style={styles.image} />
            <Text style={styles.name}>{item.name}</Text>

            <Text style={styles.scientific}>{item.scientific}</Text>

            <Text
              style={[
                styles.type,
                {
                  color: item.type === "Poisonous" ? "#DC2626" : "#2D6A4F",
                },
              ]}
            >
              {item.type}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7FAF8",
    padding: 20,
  },
  image: {
    width: "100%",
    height: 180,
    borderRadius: 16,
    marginBottom: 12,
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    marginTop: 60,
    marginBottom: 20,
  },

  searchInput: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  card: {
    backgroundColor: "#FFFFFF",
    padding: 18,
    borderRadius: 20,
    marginBottom: 12,
  },

  name: {
    fontSize: 18,
    fontWeight: "700",
  },

  scientific: {
    color: "#6B7280",
    marginTop: 4,
  },

  type: {
    marginTop: 8,
    fontWeight: "700",
  },
  filterRow: {
    flexDirection: "row",
    marginBottom: 20,
  },

  filterChip: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 10,
  },

  activeChip: {
    backgroundColor: "#2D6A4F",
  },
});
