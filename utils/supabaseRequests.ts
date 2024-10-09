import { supabaseClient } from "./supabase";
import { decode } from "base64-arraybuffer";
import { FileObject } from "@supabase/storage-js";
import { User } from "@/interfaces/user";

export const getUser = async ({
  userId,
  token,
}: {
  userId: string;
  token: string;
}) => {
  const supabase = await supabaseClient(token);
  const { data: user } = await supabase
    .from("users")
    .select("*")
    .eq("user_id", userId);

  return user ? (user[0] as User) : null;
};

export const getOnboardingStatus = async ({
  token,
  userId,
}: {
  userId: string;
  token: string;
}) => {
  const supabase = await supabaseClient(token);
  const { data: user } = await supabase
    .from("users")
    .select("*")
    .eq("user_id", userId);

  console.log("Onboarding status in request", user.onboarded);
  return user.onboarded;
};

export const uploadPicture = async ({
  token,
  filePath,
  base64,
  contentType,
}: {
  token: string;
  filePath: string;
  base64: string;
  contentType: string;
}) => {
  const supabase = await supabaseClient(token);
  await supabase.storage
    .from("models")
    .upload(filePath, decode(base64), { contentType, upsert: true });
  return "success";
};

export const loadPicture = async ({
  token,
  userId,
}: {
  token: string;
  userId: string;
}) => {
  const supabase = await supabaseClient(token);
  const { data } = await supabase.storage.from("models").list(userId);
  return data;
};

export const viewPicture = async ({
  token,
  userId,
  item,
}: {
  token: string;
  userId: string;
  item: FileObject;
}) => {
  const supabase = await supabaseClient(token);
  const { data } = await supabase.storage
    .from("models")
    .download(`${userId}/${item.name}`);
  return data;
};

export const updateUser = async ({ userId, token, updates }: any) => {
  const supabase = await supabaseClient(token);
  // Create random number
  const { data, error } = await supabase
    .from("users")
    .update(updates)
    .eq("user_id", userId);
  if (error) {
    console.log(error);
    return;
  }
  console.log(data);
  return data;
};
