import { Button, Text, View, StyleSheet, ScrollView } from "react-native";
import React from "react";
import { Link, Tabs } from "expo-router";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { useEffect, useState } from "react";
import {
  updateUser,
  getUser,
  uploadPicture,
  loadPicture,
} from "@/utils/supabaseRequests";
import { FileObject } from "@supabase/storage-js";
import Colors from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native-gesture-handler";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import ImageItem from "@/components/ImageItem";
import { supabaseClient } from "@/utils/supabase";

const Page = () => {
  const { signOut, isSignedIn, userId, getToken } = useAuth();
  const { user } = useUser();

  const [loadingUser, setLoadingUser] = useState<any>(false);
  const [userDetails, setUserDetails] = useState<any>([]);

  const [files, setFiles] = useState<FileObject[]>([]);

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
      setFiles(data);
    }
  };

  const onSelectImage = async () => {
    const options: ImagePicker.ImagePickerOptions = {
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
    };
    const result = await ImagePicker.launchImageLibraryAsync(options);
    if (!result.canceled) {
      console.log("Result", result.assets[0].uri);
      const img = result.assets[0];
      const base64 = await FileSystem.readAsStringAsync(img.uri, {
        encoding: "base64",
      });
      const filePath = `${userId}/${new Date().getTime()}.${
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
      console.log(update);
      await loadImages();
    }
  };

  // Load user details from Supabase
  useEffect(() => {
    if (!isSignedIn) return;
    loadUser();
  }, [isSignedIn]);

  const loadUser = async () => {
    try {
      const token = await getToken({ template: "supabase" });
      const user = await getUser({
        userId: userId ?? "",
        token: token ?? "",
      });
      setUserDetails(user);
    } catch (error) {
      console.error("Error loading user details:", error);
    } finally {
      setLoadingUser(false);
    }
  };

  // Update user details in Supabase
  const updateUserDetails = async (event: any) => {
    console.log("updateUserDetails");
    const token = await getToken({ template: "supabase" });
    const update = await updateUser({
      userId: userId ?? "",
      token: token ?? "",
      event: event,
    });
    console.log(update);
    await loadUser();
  };
  const onRemoveImage = async (item: FileObject, listIndex: number) => {
    const token = await getToken({ template: "supabase" });

    if (token) {
      const supabase = await supabaseClient(token);
      supabase.storage.from("models").remove([`${userId}/${item.name}`]);
      const newFiles = [...files];
      newFiles.splice(listIndex, 1);
      setFiles(newFiles);
    } else {
      console.error("Error obtaining Clerk Token");
    }
  };
  return (
    <View style={styles.container}>
      <Button title="Upload" onPress={onSelectImage} />
      <Button title="Log out" onPress={() => signOut()} />
      <ScrollView>
        {files.map((item, index) => (
          <ImageItem
            key={item.id}
            item={item}
            userId={user!.id}
            onRemoveImage={() => onRemoveImage(item, index)}
          />
        ))}
      </ScrollView>
      {!isSignedIn && (
        <View>
          <Link href={"/(modals)/login"}>
            <Text>Login</Text>
          </Link>
        </View>
      )}
      {user && (
        <View>
          <Text>Hello, {userId} welcome test to Clerk</Text>
          <Button title="Update" onPress={updateUserDetails} />
        </View>

        // Load user details from Supabase
      )}
      {userDetails && (
        <View>
          <Text>User Details: {JSON.stringify(userDetails)}</Text>
          {/* You can customize the display of userDetails based on your data structure */}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  fab: {
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    width: 70,
    position: "absolute",
    bottom: 40,
    right: 30,
    height: 70,
    backgroundColor: Colors.primary,
    borderRadius: 100,
  },
});

export default Page;
