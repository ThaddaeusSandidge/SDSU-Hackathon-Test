import { Ionicons } from "@expo/vector-icons";
import { useFonts } from "expo-font";
import { SplashScreen, Stack, router, useRouter } from "expo-router";
import { useEffect } from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import * as SecureStore from "expo-secure-store";
import { ClerkProvider, useAuth } from "@clerk/clerk-expo";
import { getOnboardingStatus } from "@/utils/supabaseRequests";
const CLERK_PUBLISHABLE_KEY = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

const tokenCache = {
  async getToken(key: string) {
    try {
      return SecureStore.getItemAsync(key);
    } catch (err) {
      return null;
    }
  },
  async saveToken(key: string, value: string) {
    try {
      return SecureStore.setItemAsync(key, value);
    } catch (err) {
      return;
    }
  },
};
export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "(tabs)",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    mon: require("../assets/fonts/Montserrat-Regular.ttf"),
    "mon-sb": require("../assets/fonts/Montserrat-SemiBold.ttf"),
    "mon-b": require("../assets/fonts/Montserrat-Bold.ttf"),
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }
  return (
    <ClerkProvider
      publishableKey={CLERK_PUBLISHABLE_KEY!}
      tokenCache={tokenCache}
    >
      <RootLayoutNav />
    </ClerkProvider>
  );
}

function RootLayoutNav() {
  const router = useRouter();
  const { isLoaded, isSignedIn, userId, getToken } = useAuth();

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/(modals)/login");
    }
  }, [isLoaded]);

  // New useEffect for handling onboarding
  /*
  useEffect(() => {
    if (isLoaded && !isSignedIn) return;
    const checkOnboarding = async () => {
      const onboarded = await loadOnboarding();
      console.log("Onboarding status in useEffect", onboarded);
      if (!onboarded) {
        console.log("Onboarding not complete");
        router.push("/(modals)/onboardingA");
      }
    };

    checkOnboarding();
  }, [isLoaded, isSignedIn, userId]); */

  const loadOnboarding = async () => {
    const token = await getToken({ template: "supabase" });
    const data = await getOnboardingStatus({
      token: token ?? "",
      userId: userId ?? "",
    });
    if (data && data[0]) {
      return data[0].onboarded;
    }
  };

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="(modals)/login"
        options={{
          title: "Login or sign up",
          headerTitleStyle: { fontFamily: "mon-b" },
          presentation: "modal",
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="close-outline" size={28} />
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="(modals)/onboardingA"
        options={{
          title: "Let's get started",
          headerShown: false, // Add this
          headerTitleStyle: { fontFamily: "mon-b" },
          presentation: "card", // Change this
          gestureEnabled: false, // Add this
        }}
      />
      <Stack.Screen
        name="(modals)/general"
        options={{
          title: "Let's get started",
          headerShown: false, // Add this
          headerTitleStyle: { fontFamily: "mon-b" },
          presentation: "card", // Change this
          gestureEnabled: false, // Add this
        }}
      />
      <Stack.Screen
        name="(modals)/measurementGeneral"
        options={{
          title: "Let's get started",
          headerShown: false, // Add this
          headerTitleStyle: { fontFamily: "mon-b" },
          presentation: "card", // Change this
          gestureEnabled: false, // Add this
        }}
      />
      <Stack.Screen
        name="(modals)/measurementGender"
        options={{
          title: "Let's get started",
          headerShown: false, // Add this
          headerTitleStyle: { fontFamily: "mon-b" },
          presentation: "card", // Change this
          gestureEnabled: false, // Add this
        }}
      />
      <Stack.Screen
        name="(modals)/onboardingPhotos"
        options={{
          title: "Let's get started",
          headerShown: false, // Add this
          headerTitleStyle: { fontFamily: "mon-b" },
          presentation: "card", // Change this
          gestureEnabled: false, // Add this
        }}
      />
      <Stack.Screen
        name="agency/[id]"
        options={{ headerTitle: "", headerTransparent: true }}
      />
      <Stack.Screen
        name="(modals)/apply"
        options={{
          headerTitle: "Apply",
          headerTitleStyle: { fontFamily: "mon-b" },

          presentation: "transparentModal",
          animation: "fade",
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="close-outline" size={28} />
            </TouchableOpacity>
          ),
        }}
      />
    </Stack>
  );
}
