import { FileObject } from "@supabase/storage-js";
import { Image, View, Text, TouchableOpacity } from "react-native";
import {
  updateUser,
  getUser,
  uploadPicture,
  loadPicture,
} from "@/utils/supabaseRequests";
import { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { supabaseClient } from "@/utils/supabase";
import { useAuth } from "@clerk/clerk-react";
import { StyleSheet } from "react-native";
import Colors from "@/constants/Colors";
import { ActivityIndicator } from "react-native";

const ImageItem = ({
  item,
  userId,
  onRemoveImage,
}: {
  item: FileObject;
  userId: string;
  onRemoveImage: () => void;
}) => {
  const [image, setImage] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const { getToken } = useAuth();
  const [refreshKey, setRefreshKey] = useState<number>(0); // State to force refresh

  const fetchData = async () => {
    try {
      const token = await getToken({ template: "supabase" });
      const supabase = await supabaseClient(token || "");
      console.log("Item", item);
      const { data } = await supabase.storage
        .from("models")
        .download(`${userId}/${item.name}`);
      processImageData(data);
    } catch (error) {
      console.error("Error fetching data:", error);
      // Handle error if needed
      setLoading(false); // Set loading to false even on error
    }
    console.log("Getting image in child");
  };

  useEffect(() => {
    fetchData();
  }, [userId, item]); // Add dependencies to rerun the effect when userId or item.name changes

  const processImageData = (data: Blob | null) => {
    if (data !== null) {
      const fr = new FileReader();
      fr.readAsDataURL(data);
      fr.onload = () => {
        setImage(fr.result as string);
        setLoading(false); // Set loading to false when data is fetched
      };
    }
  };

  return (
    <View>
      {loading ? (
        <View
          style={{
            width: 175,
            height: 175,
            borderWidth: StyleSheet.hairlineWidth,
            borderColor: Colors.grey,
            borderRadius: 10,
            padding: 16,
            justifyContent: "center", // Center the spinner vertically
            alignItems: "center", // Center the spinner horizontally
          }}
        >
          <ActivityIndicator size="large" color={Colors.grey} />
        </View>
      ) : (
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
          source={{ uri: image }}
        />
      )}
      <TouchableOpacity
        style={{
          position: "absolute",
          top: 10,
          right: 10,
          backgroundColor: "#fff",
          borderRadius: 20,
        }}
        onPress={onRemoveImage}
      >
        <Ionicons name="trash-outline" size={20} color={"#1a1a1a"} />
      </TouchableOpacity>
    </View>
  );
};

export default ImageItem;
