import React, { useMemo } from "react";
import { Text, View } from "react-native";
import { Link, Stack, useLocalSearchParams, useRouter } from "expo-router";
import ExploreHeader from "@/components/ExploreHeader";
import Agencies from "@/components/Agencies";
import { useEffect, useState } from "react";
import listingsData from "@/assets/data/airbnb-listings.json";
import AgenciesMap from "@/components/AgenciesMap";
import { createClient } from "@supabase/supabase-js";
import AgenciesBottomSheet from "@/components/AgenciesBottomSheet";
import { getUser } from "@/utils/supabaseRequests";
import axios from "axios";
import base64 from "react-native-base64";
import { decode } from "base64-arraybuffer";
import { useAuth } from "@clerk/clerk-react";

// Example usage in your Page component
const Page = () => {
  const route = useRouter();
  const params = useLocalSearchParams();
  const { userId, getToken } = useAuth();

  const refresh = params?.refresh;
  const [category, setCategory] = useState<string | null>(null);
  const items = useMemo(() => listingsData as any, []);

  const [userDetails, setUserDetails] = useState<any>([]);
  const [loadingUser, setLoadingUser] = useState(true);
  const [loading, setLoading] = useState(false);
  const [agencies, setAgencies] = useState<any[]>([]);

  const loadUser = async () => {
    try {
      const token = await getToken({ template: "supabase" });
      const user = await getUser({
        userId: userId ?? "",
        token: token ?? "",
      });
      setUserDetails(user);
      console.log("USER DETAILS_ ", user);
    } catch (error) {
      console.error("Error loading user details:", error);
    } finally {
      setLoadingUser(false);
    }
  };

  useEffect(() => {
    console.log("RELOAD LISTINGS_ ", items.length);
    setLoading(true);

    loadAgencies(category ?? undefined).then(() => setLoading(false));
  }, [category, refresh]);
  const loadAgencies = async (category?: string) => {
    const supabase = await createClient(
      "https://lqccaeeetnpeqczjqyqd.supabase.co",
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxxY2NhZWVldG5wZXFjempxeXFkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDQwNDU0MzEsImV4cCI6MjAxOTYyMTQzMX0.PKXx00j5tqis-HRRYJvTBFHLwWsPkYiTqHuIQcYkKCQ"
    );

    let query = supabase
      .from("agencies")
      .select("*")
      .order("image", { ascending: true });
    if (category) {
      query = query.filter(
        "categories",
        "cs",
        JSON.stringify([category.toLowerCase()])
      );
    }

    let { data: agencies, error } = await query;

    if (error) {
      console.error("INDEX ERROR_ ", error);
    } else if (agencies) {
      console.log("AGENCIES_ ", agencies.length);
      setAgencies(agencies);
    }
  };

  const onDataChanged = (category: string) => {
    console.log("CHANGED_ ", category);
    setCategory(category);
  };
  return (
    <View style={{ flex: 1, marginTop: 65 }}>
      <Stack.Screen
        options={{
          header: () => <ExploreHeader onCategoryChanged={onDataChanged} />,
        }}
      ></Stack.Screen>
      <AgenciesMap agencies={agencies} />

      <AgenciesBottomSheet
        agencies={agencies}
        category={category}
      ></AgenciesBottomSheet>
    </View>
  );
};

export default Page;
