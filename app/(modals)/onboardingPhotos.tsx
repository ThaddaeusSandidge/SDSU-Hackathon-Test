import React from "react";
import { Tabs } from "expo-router";
import { defaultStyles } from "@/constants/Styles";
import { SafeAreaView } from "react-native-safe-area-context";
import Colors from "@/constants/Colors";
import { useNavigation } from "@react-navigation/native";

import {
  Text,
  View,
  StyleSheet,
  Button,
  Dimensions,
  Image,
  TouchableOpacity,
  Share,
  ScrollView,
} from "react-native";
import { useState, useEffect } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import ImageItem from "@/components/ImageItem";
import { supabaseClient } from "@/utils/supabase";
import {
  updateUser,
  getUser,
  uploadPicture,
  loadPicture,
} from "@/utils/supabaseRequests";
import { FileObject } from "@supabase/storage-js";
import { useAuth, useUser } from "@clerk/clerk-react";
import "react-country-state-city/dist/react-country-state-city.css";

const Page = () => {
  const router = useRouter();
  const { signOut, isSignedIn, userId, getToken } = useAuth();
  const { user } = useUser();

  const [loadingUser, setLoadingUser] = useState<any>(false);
  const [userDetails, setUserDetails] = useState<any>([]);

  const defaultHeadshot = require("@/assets/images/phone.png");
  const navigation = useNavigation();

  const [files, setFiles] = useState<Map<string, FileObject>>(new Map());
  const [headshot, setHeadshot] = useState<FileObject | null>(null);
  const [half, setHalf] = useState<FileObject | null>(null);
  const [side, setSide] = useState<FileObject | null>(null);
  const [full, setFull] = useState<FileObject | null>(null);

  const [localHeadshot, setLocalHeadshot] = useState(
    require("@/assets/images/headDefault.png")
  );
  const [localSide, setLocalSide] = useState(
    require("@/assets/images/sideDefault.png")
  );
  const [localHalf, setLocalHalf] = useState(
    require("@/assets/images/halfDefault.png")
  );
  const [localFull, setLocalFull] = useState(
    require("@/assets/images/fullDefault.png")
  );

  const [networkHeadshot, setNetworkHeadshot] = useState<string>("");
  const [networkSide, setNetworkSide] = useState<string>("");
  const [networkHalf, setNetworkHalf] = useState<string>("");
  const [networkFull, setNetworkFull] = useState<string>("");

  const [headshotLoading, setHeadshotLoading] = useState(false);
  const [halfLoading, setHalfLoading] = useState(false);
  const [sideLoading, setSideLoading] = useState(false);
  const [fullLoading, setFullLoading] = useState(false);

  useEffect(() => {
    if (!isSignedIn) return;

    loadImages();
  }, [isSignedIn]);

  const loadImages = async () => {
    const token = await getToken({ template: "supabase" });
    const data = await loadPicture({
      token: token ?? "",
      userId: userId ?? "",
    });
    if (data) {
      data.forEach((item: FileObject) => {
        switch (item.name) {
          case "headshot.png":
            setHeadshot(item);
            break;
          case "half.png":
            setHalf(item);
            break;
          case "side.png":
            setSide(item);
            break;
          case "full.png":
            setFull(item);
            break;
          default:
            break;
        }
      });
    }
  };

  const onSelectImage = async (type: string) => {
    const options: ImagePicker.ImagePickerOptions = {
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
    };
    const result = await ImagePicker.launchImageLibraryAsync(options);
    if (!result.canceled) {
      console.log("Result", result.assets[0].uri);
      const img = result.assets[0];
      switch (type) {
        case "headshot":
          setNetworkHeadshot(img.uri);
          break;
        case "half":
          setNetworkHalf(img.uri);
          break;
        case "side":
          setNetworkSide(img.uri);
          break;
        case "full":
          setNetworkFull(img.uri);
          break;
        default:
          break;
      }
      const base64 = await FileSystem.readAsStringAsync(img.uri, {
        encoding: "base64",
      });
      const filePath = `${userId}/${type}.${
        img.type === "image" ? "png" : "mp4"
      }`;
      const contentType = img.type === "image" ? "image/png" : "video/mp4";
      const token = await getToken({ template: "supabase" });
      const update = await uploadPicture({
        token: token ?? "",
        filePath: filePath,
        base64: base64,
        contentType: contentType,
      });

      await loadImages();
    }
  };
  const onRemoveImage = async (type: string) => {
    const token = await getToken({ template: "supabase" });
    switch (type) {
      case "headshot":
        setNetworkHeadshot("");
        break;
      case "half":
        setNetworkHalf("");
        break;
      case "side":
        setNetworkSide("");
        break;
      case "full":
        setNetworkFull("");
        break;
      default:
        break;
    }
    if (token) {
      const supabase = await supabaseClient(token);
      supabase.storage.from("models").remove([`${userId}/${type}.png`]);
      const newFiles = new Map(files);
      newFiles.delete(type);
      setFiles(newFiles);
    } else {
      console.error("Error obtaining Clerk Token");
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <View style={styles.infoContainer}>
        <Text style={styles.name}>Lights, camera, action! 📸</Text>
        <Text style={styles.location}>
          Try to avoid wearing baggy clothing, make-up, or smiling. The photos
          you submit should not be filtered, re-touched, or professionally
          taken. Take a look at the images below for examples. You look great!
        </Text>
      </View>
      <View style={styles.gridContainer}>
        <View>
          <TouchableOpacity onPress={() => onSelectImage("headshot")}>
            <Image
              style={{
                width: 175,
                height: 175,
                borderWidth: StyleSheet.hairlineWidth,
                borderColor: Colors.grey,
                borderRadius: 10,
                padding: 16,
              }}
              resizeMode="cover"
              source={
                networkHeadshot ? { uri: networkHeadshot } : localHeadshot
              }
            />
          </TouchableOpacity>
          {networkHeadshot && (
            <TouchableOpacity
              style={{
                position: "absolute",
                top: 10,
                right: 10,
                backgroundColor: "#fff",
                borderRadius: 20,
              }}
              onPress={() => onRemoveImage("headshot")}
            >
              <Ionicons name="trash-outline" size={20} color={"#1a1a1a"} />
            </TouchableOpacity>
          )}
        </View>
        <View>
          <TouchableOpacity onPress={() => onSelectImage("side")}>
            <Image
              style={{
                width: 175,
                height: 175,
                borderWidth: StyleSheet.hairlineWidth,
                borderColor: Colors.grey,
                borderRadius: 10,
                padding: 16,
              }}
              resizeMode="cover"
              source={networkSide ? { uri: networkSide } : localSide}
            />
          </TouchableOpacity>
          {networkSide && (
            <TouchableOpacity
              style={{
                position: "absolute",
                top: 10,
                right: 10,
                backgroundColor: "#fff",
                borderRadius: 20,
              }}
              onPress={() => onRemoveImage("side")}
            >
              <Ionicons name="trash-outline" size={20} color={"#1a1a1a"} />
            </TouchableOpacity>
          )}
        </View>
        <View>
          <TouchableOpacity onPress={() => onSelectImage("half")}>
            <Image
              style={{
                width: 175,
                height: 175,
                borderWidth: StyleSheet.hairlineWidth,
                borderColor: Colors.grey,
                borderRadius: 10,
                padding: 16,
              }}
              resizeMode="cover"
              source={networkHalf ? { uri: networkHalf } : localHalf}
            />
          </TouchableOpacity>
          {networkHalf && (
            <TouchableOpacity
              style={{
                position: "absolute",
                top: 10,
                right: 10,
                backgroundColor: "#fff",
                borderRadius: 20,
              }}
              onPress={() => onRemoveImage("half")}
            >
              <Ionicons name="trash-outline" size={20} color={"#1a1a1a"} />
            </TouchableOpacity>
          )}
        </View>
        <View>
          <TouchableOpacity onPress={() => onSelectImage("full")}>
            <Image
              style={{
                width: 175,
                height: 175,
                borderWidth: StyleSheet.hairlineWidth,
                borderColor: Colors.grey,
                borderRadius: 10,
                padding: 16,
              }}
              resizeMode="cover"
              source={networkFull ? { uri: networkFull } : localFull}
            />
          </TouchableOpacity>
          {networkFull && (
            <TouchableOpacity
              style={{
                position: "absolute",
                top: 10,
                right: 10,
                backgroundColor: "#fff",
                borderRadius: 20,
              }}
              onPress={() => onRemoveImage("full")}
            >
              <Ionicons name="trash-outline" size={20} color={"#1a1a1a"} />
            </TouchableOpacity>
          )}
        </View>
      </View>
      <View style={styles.absoluteView}>
        <TouchableOpacity
          style={styles.btn}
          onPress={() =>
            router.push({
              pathname: "/(tabs)/",
              params: { refresh: Date.now() },
            })
          }
        >
          <Text
            style={{
              fontFamily: "mon-sb",
              color: "#fff",
              fontWeight: "bold",
              fontSize: 16,
            }}
          >
            All done! Let's apply!
          </Text>
          <Ionicons name="arrow-forward" size={20} color={"#fff"}></Ionicons>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  gridContainer: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
    justifyContent: "center",
    alignItems: "center",
    padding: 8,
  },
  gridItem: {
    justifyContent: "center",
    alignItems: "center",
    width: 150,
    height: 150,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.grey,
    borderRadius: 10,
    padding: 16,
  },
  gridText: {
    fontSize: 16,
    color: "#000",
  },
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
  location: {
    fontSize: 16,
    marginTop: 10,
    fontFamily: "mon",
  },
  guide: {
    marginTop: 20,
    fontSize: 14,
    fontFamily: "mon",
    fontWeight: "bold",
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
