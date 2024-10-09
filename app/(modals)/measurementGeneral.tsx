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
import { useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SelectList } from "react-native-select-bottom-list";
import { SliderComponent } from "@/components/Slider";
import { WeightSliderComponent } from "@/components/WeightSlider";
import { HeightSliderComponent } from "@/components/HeightSlider";
import { ShoeSliderComponent } from "@/components/ShoeSlider";
import { useAuth } from "@clerk/clerk-react";
import { updateUser } from "@/utils/supabaseRequests";

import "react-country-state-city/dist/react-country-state-city.css";

const Page = () => {
  const router = useRouter();
  const { userId, getToken } = useAuth();

  const [height, setHeight] = useState(50);
  const [weight, setWeight] = useState(50);
  const [waist, setWaist] = useState(50);
  const [chest, setChest] = useState(50);
  const [hair, setHair] = useState("");
  const [eyes, setEyes] = useState("");
  const [shoe, setShoe] = useState(10);
  const params = useLocalSearchParams();
  const measurement = params.measurement;
  const gender = params.gender;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <View style={styles.infoContainer}>
        <Text style={styles.name}>Measurement time! 📏</Text>
        <Text style={styles.location}>
          You just need to fill this out once, we will handle it from there.
        </Text>
        <View>
          <Text
            style={{
              fontSize: 14,
              fontFamily: "mon",
              fontWeight: "bold",
              marginBottom: 3,
              marginTop: 10,
            }}
          >
            Hair color
          </Text>
          <SelectList
            onSelect={(item) => setHair(item)}
            value={hair}
            data={[
              "Black",
              "Brown",
              "Blonde",
              "Red",
              "White",
              "Grey",
              "Auburn",
              "Bald",
              "Other",
            ]}
            placeHolder="Choose hair color"
            textStyle={{ fontFamily: "mon" }}
            itemTextStyle={{ fontFamily: "mon" }}
            headerTextStyle={{ fontFamily: "mon-sb" }}
            headerTitle={"Select hair color"}
            itemStyle={{ padding: 16 }}
            listHeight={"80%"}
          />
        </View>
        <View>
          <Text
            style={{
              fontSize: 14,
              fontFamily: "mon",
              fontWeight: "bold",
              marginTop: 20,
              marginBottom: 3,
            }}
          >
            Eye color
          </Text>
          <SelectList
            onSelect={(item) => setEyes(item)}
            value={eyes}
            data={["Black", "Brown", "Blue", "Green", "Hazel", "Grey", "Other"]}
            placeHolder="Choose eye color"
            textStyle={{ fontFamily: "mon" }}
            itemTextStyle={{ fontFamily: "mon" }}
            headerTextStyle={{ fontFamily: "mon-sb" }}
            headerTitle={"Select eye color"}
            itemStyle={{ padding: 16 }}
            listHeight={"80%"}
          />
        </View>
        <View>
          <HeightSliderComponent
            name="Height"
            isMetric={measurement === "metric"}
            minValue={4 * 12}
            maxValue={7 * 12}
            onValueChange={(height) => setHeight(height)}
            stepsIn={1}
          />
        </View>
        <View>
          <WeightSliderComponent
            name="Weight"
            isMetric={measurement === "metric"}
            minValue={75}
            maxValue={400}
            stepsIn={1}
            onValueChange={(weight) => setWeight(weight)}
          />
        </View>
        <View>
          <SliderComponent
            name="Waist"
            isMetric={measurement === "metric"}
            minValue={18}
            maxValue={60}
            stepsIn={0.5}
            onValueChange={(waist) => setWaist(waist)}
          />
        </View>
        <View>
          <ShoeSliderComponent
            name="Shoe"
            isMetric={measurement === "metric"}
            isMale={gender === "male"}
            minValue={
              measurement === "metric"
                ? gender === "male"
                  ? 39
                  : 35
                : gender === "male"
                ? 7
                : 5
            }
            maxValue={
              measurement === "metric"
                ? gender === "male"
                  ? 47
                  : 42
                : gender === "male"
                ? 13
                : 10
            }
            stepsIn={0.5}
            onValueChange={(shoe) => setShoe(shoe)}
          />
        </View>
      </View>

      <View style={styles.absoluteView}>
        <TouchableOpacity
          style={styles.btn}
          onPress={async () => {
            const updates = {
              height: height,
              weight: weight,
              waist: waist,
              shoe: shoe,
              hair: hair,
              eyes: eyes,
            };
            const token = await getToken({ template: "supabase" });
            const update = await updateUser({
              userId: userId ?? "",
              token: token ?? "",
              updates: updates,
            });
            console.log(update);
            router.push({
              pathname: "/(modals)/measurementGender",
              params: { measurement: measurement, gender: gender },
            });
          }}
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
  radioGroup: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 20,
    borderRadius: 8,
    elevation: 4,
    padding: 8,
  },
  radioButton: {
    width: "50%",
    flexDirection: "row",
    alignItems: "flex-start",
  },

  radioLabel: {
    marginLeft: 8,
    fontSize: 16,
    fontFamily: "mon",
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
