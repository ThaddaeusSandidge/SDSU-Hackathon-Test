import React from "react";
import { Tabs } from "expo-router";
import { defaultStyles } from "@/constants/Styles";
import { SafeAreaView } from "react-native-safe-area-context";
import Colors from "@/constants/Colors";
import {
  Text,
  View,
  StyleSheet,
  Dimensions,
  Image,
  TouchableOpacity,
  Share,
} from "react-native";
import { SplashScreen, Stack, router, useRouter } from "expo-router";

import { Ionicons } from "@expo/vector-icons";

const Page = () => {
  const router = useRouter();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <View style={styles.infoContainer}>
        <Text style={styles.name}>Welcome to ModelMe 👋 </Text>
        <Text style={styles.location}>
          Kickstart your modeling journey! Fill out your comp card once, and
          breeze through all your applications.
        </Text>
        <Image
          source={require("@/assets/images/phone.png")}
          style={{ width: "100%", height: 300, marginTop: 100 }}
          resizeMode="contain"
        ></Image>
      </View>

      <View style={styles.absoluteView}>
        <TouchableOpacity
          style={styles.btn}
          onPress={() => router.push("/(modals)/general")}
        >
          <Text
            style={{
              fontFamily: "mon-sb",
              color: "#fff",
              fontWeight: "bold",
              fontSize: 16,
            }}
          >
            Let's do this
          </Text>
          <Ionicons name="arrow-forward" size={20} color={"#fff"}></Ionicons>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },

  infoContainer: {
    marginTop: 25,
    padding: 24,
    backgroundColor: "#fff",
  },
  name: {
    fontSize: 26,
    fontWeight: "bold",
    fontFamily: "mon-sb",
  },
  absoluteView: {
    position: "absolute",
    bottom: 50,
    width: "100%",
    alignItems: "center",
  },
  absoluteViewTopRight: {
    position: "absolute",
    padding: 24,
    top: 0,
    right: 0,
    width: "20%",
    alignItems: "flex-end",
  },
  btn: {
    backgroundColor: Colors.primary,
    padding: 14,
    paddingHorizontal: 24,
    height: 50,
    borderRadius: 20,
    flexDirection: "row",
    marginHorizontal: "auto",
    alignItems: "center",
    gap: 8,
  },
  img: {
    padding: 24,
    height: 100,
    width: "100%",
  },
  location: {
    fontSize: 16,
    marginTop: 10,
    fontFamily: "mon",
  },
  rooms: {
    fontSize: 16,
    color: Colors.grey,
    marginVertical: 4,
    fontFamily: "mon",
  },
  ratings: {
    fontSize: 16,
    fontFamily: "mon-sb",
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: Colors.grey,
    marginVertical: 16,
  },
  host: {
    width: 50,
    height: 50,
    borderRadius: 50,
    backgroundColor: Colors.grey,
  },
  hostView: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  footerText: {
    height: "100%",
    justifyContent: "center",
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  footerPrice: {
    fontSize: 18,
    fontFamily: "mon-sb",
  },
  roundButton: {
    width: 40,
    height: 40,
    borderRadius: 50,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    color: Colors.primary,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.grey,
  },
  bar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  header: {
    backgroundColor: "#fff",
    height: 100,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.grey,
  },

  description: {
    fontSize: 16,
    marginTop: 10,
    fontFamily: "mon",
  },
  marker: {
    padding: 8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    elevation: 5,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: {
      width: 1,
      height: 10,
    },
  },
  markerText: {
    fontSize: 14,
    fontFamily: "mon-sb",
  },
  locateBtn: {
    position: "absolute",
    top: 70,
    right: 20,
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: {
      width: 1,
      height: 10,
    },
  },
});
export default Page;
