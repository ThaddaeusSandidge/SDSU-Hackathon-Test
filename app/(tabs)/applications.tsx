import { Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { Tabs } from "expo-router";
import { useAuth } from "@clerk/clerk-react";
import { supabase } from "@/utils/supabase";
import { Ionicons } from "@expo/vector-icons";
import { createClient } from "@supabase/supabase-js";

const Page = () => {
  const { getToken } = useAuth();

  const fetchData = async () => {
    // TODO #1: Replace with your JWT template name
    const token = await getToken({ template: "supabase" });

    supabase.auth.setAuth(token);

    // TODO #2: Replace with your database table name
    const { data, error } = await supabase.from("your_table").select();
    console.log("data", data);
    console.log("Error", error);

    // TODO #3: Handle the response
  };

  return (
    <View style={{ gap: 22 }}>
      <TouchableOpacity onPress={() => fetchData()}>
        <Ionicons name="md-logo-apple" size={24} />
        <Text>Continue with Apple</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Page;
