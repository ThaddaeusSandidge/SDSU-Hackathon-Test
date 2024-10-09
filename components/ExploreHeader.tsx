import { View, Text, StyleSheet, UIManager } from "react-native";
import React, { useRef, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import Colors from "@/constants/Colors";
import * as Haptics from "expo-haptics";
import { findNodeHandle } from "react-native";

const categories = [
  {
    category: "Fashion",
    icon: "style",
  },
  {
    category: "Boutique",
    icon: "store",
  },
  {
    category: "Mother",
    icon: "people",
  },
  {
    category: "Designer",
    icon: "brush",
  },
  {
    category: "Male",
    icon: "person",
  },
  {
    category: "Female",
    icon: "person",
  },
  {
    category: "Plus Size",
    icon: "plus-one",
  },
  {
    category: "Beauty",
    icon: "palette",
  },
  {
    category: "Diverse",
    icon: "public",
  },
  {
    category: "International",
    icon: "public",
  },
  {
    category: "Creative",
    icon: "create",
  },
  {
    category: "Development",
    icon: "trending-up",
  },
];

interface Props {
  onCategoryChanged: (category: string) => void;
}

const ExploreHeader = ({ onCategoryChanged }: Props) => {
  const scrollRef = useRef<ScrollView>(null);
  const itemsRef = useRef<Array<TouchableOpacity | null>>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  const selectCategory = (index: number) => {
    const selected = itemsRef.current[index];
    setActiveIndex(index);

    const handle = findNodeHandle(selected);
    if (handle) {
      UIManager.measure(handle, (x: number) => {
        scrollRef.current?.scrollTo({ x: x - 16, y: 0, animated: true });
      });
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onCategoryChanged(categories[index].category);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <View style={styles.container}>
        <View style={styles.actionRow}>
          <Link href={"/(modals)/apply"} asChild>
            <TouchableOpacity style={styles.searchBtn}>
              <Ionicons name="search" size={24}></Ionicons>
              <View>
                <Text style={{ fontFamily: "mon-sb" }}>Search Agencies?</Text>
                <Text style={{ fontFamily: "mon", color: Colors.grey }}>
                  Get Discovered • Today
                </Text>
              </View>
            </TouchableOpacity>
          </Link>
          <TouchableOpacity style={styles.filterBtn}>
            <Ionicons name="options-outline" size={24}></Ionicons>
          </TouchableOpacity>
        </View>
        <ScrollView
          horizontal
          ref={scrollRef}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            alignItems: "center",
            gap: 30,
            paddingHorizontal: 16,
          }}
        >
          {categories.map((item, index) => (
            <TouchableOpacity
              ref={(el) => (itemsRef.current[index] = el)}
              key={index}
              style={
                activeIndex === index
                  ? styles.categoriesBtnActive
                  : styles.categoriesBtn
              }
              onPress={() => selectCategory(index)}
            >
              <MaterialIcons
                name={item.icon as any}
                size={24}
                color={activeIndex === index ? "#000" : Colors.grey}
              />
              <Text
                style={
                  activeIndex === index
                    ? styles.categoryTextActive
                    : styles.categoryText
                }
              >
                {item.category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    height: 150,
  },
  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingBottom: 24,
    gap: 10,
  },
  filterBtn: {
    padding: 10,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: "#c2c2c2",
  },
  searchBtn: {
    flexDirection: "row",
    gap: 10,
    padding: 14,
    width: 280,
    borderRadius: 30,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#c2c2c2",
    backgroundColor: "#fff",

    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: {
      width: 1,
      height: 1,
    },
  },
  categoryText: {
    fontFamily: "mon-sb",
    fontSize: 14,
    color: Colors.grey,
  },
  categoryTextActive: {
    fontFamily: "mon-sb",
    fontSize: 14,
    color: "#000",
  },
  categoriesBtn: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 8,
  },
  categoriesBtnActive: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderBottomColor: "#000",
    borderBottomWidth: 2,
    paddingBottom: 8,
  },
});

export default ExploreHeader;
