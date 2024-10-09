import {
  Text,
  View,
  StyleSheet,
  Dimensions,
  Image,
  TouchableOpacity,
  Share,
} from "react-native";
import { Linking } from "react-native";

import React, { useLayoutEffect } from "react";
import { Tabs, useLocalSearchParams, useNavigation } from "expo-router";
import listingsData from "@/assets/data/airbnb-listings.json";
import Colors from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  SlideInDown,
  interpolate,
  useAnimatedRef,
  useAnimatedStyle,
  useScrollViewOffset,
} from "react-native-reanimated";
import { defaultStyles } from "@/constants/Styles";
import { createClient } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { Agency } from "@/interfaces/agency";
import { User } from "@/interfaces/user";
import * as MailComposer from "expo-mail-composer";
import * as Print from "expo-print";
import { supabaseClient } from "@/utils/supabase";
import {
  updateUser,
  getUser,
  uploadPicture,
  loadPicture,
} from "@/utils/supabaseRequests";
import { FileObject } from "@supabase/storage-js";
import { useAuth, useUser } from "@clerk/clerk-react";
import { set } from "react-hook-form";

const IMG_HEIGHT = 300;
const { width } = Dimensions.get("window");

interface Props {
  agency: Agency;
}

const Page = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [agency, setAgency] = useState<Agency[]>([]);
  const [userDetails, setUserDetails] = useState<User | null>(null);

  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const navigation = useNavigation();

  const scrollOffset = useScrollViewOffset(scrollRef);
  const [isAvailable, setIsAvailable] = useState(false);
  const [recipients, setRecipients] = useState([]);
  const [subject, setSubject] = useState(undefined);
  const [body, setBody] = useState(undefined);
  const [email, setEmail] = useState(undefined);

  const { signOut, isSignedIn, userId, getToken } = useAuth();

  const [loading, setLoading] = useState(true);
  const [headshot, setHeadshot] = useState<string>("");
  const [side, setSide] = useState<string>("");
  const [full, setFull] = useState<string>("");
  const [half, setHalf] = useState<string>("");

  const [headshotUrl, setHeadshotUrl] = useState<string>("");
  const [sideUrl, setSideUrl] = useState<string>("");
  const [halfUrl, setHalfUrl] = useState<string>("");
  const [fullUrl, setFullUrl] = useState<string>("");

  const processImageUrl = (name: string, url: string) => {
    switch (name) {
      case "headshot.png":
        setHeadshotUrl(url);
        break;
      case "side.png":
        setSideUrl(url);
        break;
      case "half.png":
        setHalfUrl(url);
        break;
      case "full.png":
        setFullUrl(url);
        break;
      default:
        console.error(`Unexpected image name: ${name}`);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await getToken({ template: "supabase" });
        const userData = await getUser({
          userId: userId ?? "",
          token: token ?? "",
        });
        if (userData) {
          console.log(userData);
          setUserDetails(userData);
        }
        const supabase = await supabaseClient(token || "");
        const images = ["headshot.png", "side.png", "half.png", "full.png"];

        const fetchImagePromises = images.map(async (imageName) => {
          const { data } = await supabase.storage
            .from("models")
            .getPublicUrl(`${userId}/${imageName}`);
          console.log(data);
          return { name: imageName, url: data.publicUrl };
        });

        const imageUrlsList = await Promise.all(fetchImagePromises);
        imageUrlsList.forEach(({ name, url }) => {
          processImageUrl(name, url);
        });
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]); // Add userId as a dependency to rerun the effect when it changes

  const processImageData = (name: string, data: Blob | null) => {
    if (data !== null) {
      const fr = new FileReader();
      fr.readAsDataURL(data);
      fr.onload = () => {
        switch (name) {
          case "headshot.png":
            setHeadshot(fr.result as string);
            break;
          case "side.png":
            setSide(fr.result as string);
            break;
          case "full.png":
            setFull(fr.result as string);
            break;
          case "half.png":
            setHalf(fr.result as string);
            break;
          default:
            break;
        }
        setLoading(false);
      };
    }
  };
  function calculateAge(dob: Date): number {
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  }
  const sendMail = async () => {
    try {
      const isMailAvailable = await MailComposer.isAvailableAsync();

      if (isMailAvailable) {
        const age = userDetails.dob ? calculateAge(userDetails.dob) : "Unknown";
        const measure = userDetails?.measurement == "imperial" ? " in" : "cm";
        const gender = userDetails?.gender == "male" ? "M" : "W";

        const htmlContent = `
        <style>
        .grid-container {
          display: grid;
          grid-template-columns: auto auto;
          gap: 10px;
        }
        .grid-item img {
          width: 150px;
          height: 150px;
          object-fit: cover;
        }
      </style>
      <p>Dear ${agency.display_name}, 
</p>
    <p>My name is ${userDetails.first_name} ${
          userDetails.last_name
        }. I am from ${userDetails.city?.name}, ${
          userDetails.state?.state_code
        } and I am ${age} years old.
    I have an interest in modeling and I would love to be considered at your agency. Please refer to my digitals and measurements below.</p>


  <div class="grid-container">
    <div class="grid-item"><img src="${headshotUrl}" alt="Headshot" /></div>
    <div class="grid-item"><img src="${sideUrl}" alt="Side" /></div>
    <div class="grid-item"><img src="${fullUrl}" alt="Full" /></div>
    <div class="grid-item"><img src="${halfUrl}" alt="Half" /></div>
  </div>
  <p>Look at the table below for my measurements:</p>
  <table>
    <tr>
      <td>Height:</td>
      <td>${userDetails.height} ${measure}</td>
    </tr>
    <tr>
      <td>Weight:</td>
      <td>${userDetails.weight} ${
          userDetails.measurement == "imperial" ? " lbs" : "kgs"
        }</td>
    </tr>
    <tr>
      <td>Waist:</td>
      <td>${userDetails.waist} ${measure}</td>
    </tr>
    <tr>
      <td>Shoe size:</td>
      <td>${userDetails.shoe} ${
          userDetails.measurement == "imperial" ? " US" : "EU"
        } ${gender}</td>
    </tr>
    <tr>
      <td>Chest:</td>
      <td>${userDetails.chest} ${measure}</td>
    </tr>
    <tr>
      <td>Hair color:</td>
      <td>${userDetails.hair}</td>
    </tr>
    <tr>
      <td>Eye color:</td>
      <td>${userDetails.eyes}</td>
    </tr>
    ${
      gender == "M"
        ? `   <tr>
      <td>Shirt:</td>
      <td>${userDetails.shirt} ${measure}</td>
    </tr>
    <tr>
      <td>Sleeve Length:</td>
      <td>${userDetails.sleeve} ${measure}</td>
    </tr>
    <tr>
    <td>Inseam:</td>
    <td>${userDetails.inseam} ${measure}</td>
  </tr>`
        : `   <tr>
      <td>Hips:</td>
      <td>${userDetails.hips} ${measure}</td>
    </tr>
    <tr>
      <td>Dress:</td>
      <td>${userDetails.dress} ${measure}</td>
    </tr>
    <tr>
    <td>Cup Size:</td>
    <td>${userDetails.cup}</td>
  </tr>`
    }
  </table>
  <p>Thank you so much for your consideration. I look forward to hearing from you!</p>
  <p>Sincerely,</p>
  <p>${userDetails.first_name} ${userDetails.last_name}</p>

`;

        await MailComposer.composeAsync({
          subject: "Model Application from ModelMe",
          body: htmlContent,
          recipients: [agency.email],
          isHtml: true, // Set isHtml to true to send HTML content
        });
      } else {
        console.log("Mail composer is not available on this device.");
      }
    } catch (error) {
      console.error("Error sending email:", error);
    }
  };

  const addRecipient = () => {
    let newRecipients = [...recipients];
    newRecipients.push(email);

    setRecipients(newRecipients);
    setEmail(undefined);
  };

  const showRecipients = () => {
    if (recipients.length === 0) {
      return <Text>No recipients added</Text>;
    }

    return recipients.map((recipient, index) => {
      return <Text key={index}>{recipient}</Text>;
    });
  };

  useEffect(() => {
    loadAgency();
  }, [userDetails]);

  const loadAgency = async () => {
    const supabase = await createClient(
      "https://lqccaeeetnpeqczjqyqd.supabase.co",
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxxY2NhZWVldG5wZXFjempxeXFkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDQwNDU0MzEsImV4cCI6MjAxOTYyMTQzMX0.PKXx00j5tqis-HRRYJvTBFHLwWsPkYiTqHuIQcYkKCQ"
    );

    const { data: agency, error } = await supabase
      .from("agencies")
      .select("*")
      .eq("id", id);
    if (agency) {
      setAgency(agency[0]);
    }
    if (error) {
      console.error("ID ERROR_ ", error);
    }
  };

  const shareListing = async () => {
    try {
      await Share.share({
        title: agency.name,
        url: agency.listing_url,
      });
    } catch (error) {
      console.log(error);
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerBackground: () => (
        <Animated.View
          style={[styles.header, headerAnimatedStyle]}
        ></Animated.View>
      ),
      headerRight: () => (
        <View style={styles.bar}>
          <TouchableOpacity style={styles.roundButton}>
            <Ionicons
              name="share-outline"
              size={22}
              color={"#000"}
              onPress={shareListing}
            ></Ionicons>
          </TouchableOpacity>
          <TouchableOpacity style={styles.roundButton}>
            <Ionicons name="heart-outline" size={24} color={"#000"}></Ionicons>
          </TouchableOpacity>
        </View>
      ),
      headerLeft: () => (
        <TouchableOpacity
          style={styles.roundButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={24} color={"#000"} />
        </TouchableOpacity>
      ),
    });
  }, []);

  const imageAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(
            scrollOffset.value,
            [-IMG_HEIGHT, 0, IMG_HEIGHT],
            [-IMG_HEIGHT / 2, 0, IMG_HEIGHT * 0.75]
          ),
        },
        {
          scale: interpolate(
            scrollOffset.value,
            [-IMG_HEIGHT, 0, IMG_HEIGHT],
            [2, 1, 1]
          ),
        },
      ],
    };
  });

  const headerAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(scrollOffset.value, [0, IMG_HEIGHT / 1.5], [0, 1]),
    };
  });
  return (
    <View style={styles.container}>
      <Animated.ScrollView
        ref={scrollRef}
        contentContainerStyle={{ paddingBottom: 100 }}
        scrollEventThrottle={16}
      >
        <Animated.Image
          source={{ uri: agency.image_url }}
          style={[styles.image, imageAnimatedStyle]}
        ></Animated.Image>
        <View style={styles.infoContainer}>
          <Text style={styles.name}>{agency.name}</Text>
          <Text style={styles.location}>in {agency.display_location}</Text>

          <View style={{ flexDirection: "row", gap: 4, paddingTop: 8 }}>
            {agency.website && (
              <TouchableOpacity onPress={() => Linking.openURL(agency.website)}>
                <View style={{ flexDirection: "row", gap: 4 }}>
                  <Ionicons name="earth" size={18} />
                  <Text style={styles.ratings}>Website ·</Text>
                </View>
              </TouchableOpacity>
            )}
            {agency.instagram && (
              <TouchableOpacity
                onPress={() => Linking.openURL(agency.instagram)}
              >
                <View style={{ flexDirection: "row", gap: 4 }}>
                  <Ionicons
                    name="logo-instagram"
                    size={18}
                    onPress={() => Linking.openURL(agency.instagram)}
                  />
                  <Text style={styles.ratings}>Instagram</Text>
                </View>
              </TouchableOpacity>
            )}
          </View>
          <View style={styles.divider} />
          <View style={defaultStyles.container}></View>

          <Text style={styles.description}>{agency.about}</Text>
        </View>
      </Animated.ScrollView>
      <Animated.View
        style={defaultStyles.footer}
        entering={SlideInDown.delay(200)}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <TouchableOpacity style={styles.footerText}>
            <Text style={styles.footerPrice}>{agency.applicants}</Text>
            <Text style={{ fontFamily: "mon" }}>applicants</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={sendMail}
            style={[defaultStyles.btn, { paddingHorizontal: 20 }]}
          >
            <Text style={defaultStyles.btnText}>Apply</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  image: {
    height: IMG_HEIGHT,
    width: width,
  },
  infoContainer: {
    padding: 24,
    backgroundColor: "#fff",
  },
  name: {
    fontSize: 26,
    fontWeight: "bold",
    fontFamily: "mon-sb",
  },
  location: {
    fontSize: 18,
    marginTop: 10,
    fontFamily: "mon-sb",
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
