import "react-native-url-polyfill/auto";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";
const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || "";
const SUPABASE_API_KEY = process.env.EXPO_PUBLIC_SUPABASE_API_KEY || "";

const supabaseUrl = SUPABASE_URL;
const supabaseAnonKey = SUPABASE_API_KEY;

export const supabaseClient = async (supaBaseToken: string) => {
  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    global: { headers: { Authorization: `Bearer ${supaBaseToken}` } },
  });
  return supabase;
};
