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
import "react-country-state-city/dist/react-country-state-city.css";
import { useAuth } from "@clerk/clerk-react";
import { updateUser } from "@/utils/supabaseRequests";

const Page = () => {
  const router = useRouter();
  const { userId, getToken } = useAuth();

  // male specific states
  const [sleeve, setSleeve] = useState(50);
  const [inseam, setInseam] = useState(50);
  const [shirt, setShirt] = useState(50);

  // female specific states
  const [cup, setCup] = useState("");
  const [dress, setDress] = useState(50);
  const [hips, setHips] = useState(50);

  // chest for both
  const [chest, setChest] = useState(50);

  const params = useLocalSearchParams();
  const measurement = params.measurement;
  const gender = params.gender;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <View style={styles.infoContainer}>
        <Text style={styles.name}>
          Gender Specific {gender === "male" ? "👨" : "👩"}{" "}
        </Text>
        <Text style={styles.location}>
          This is not a reflection of your gender identity, just the gender you
          typically size in clothing!
        </Text>

        <View>
          <SliderComponent
            name="Chest"
            isMetric={measurement === "metric"}
            minValue={25}
            maxValue={50}
            stepsIn={0.5}
            onValueChange={(chest) => setChest(chest)}
          />
          {gender === "male" ? (
            <View>
              <SliderComponent
                name="Sleeve Length"
                isMetric={measurement === "metric"}
                minValue={18}
                maxValue={42}
                stepsIn={0.5}
                onValueChange={(sleeve) => setSleeve(sleeve)}
              />
              <SliderComponent
                name="Inseam"
                isMetric={measurement === "metric"}
                minValue={18}
                maxValue={42}
                stepsIn={0.5}
                onValueChange={(inseam) => setInseam(inseam)}
              />
              <SliderComponent
                name="Shirt"
                isMetric={measurement === "metric"}
                minValue={13}
                maxValue={36}
                stepsIn={0.5}
                onValueChange={(shirt) => setShirt(shirt)}
              />
            </View>
          ) : (
            <View>
              <SliderComponent
                name="Dress"
                isMetric={measurement === "metric"}
                minValue={0}
                maxValue={30}
                stepsIn={1}
                onValueChange={(dress) => setDress(dress)}
              />
              <SliderComponent
                name="Hips"
                isMetric={measurement === "metric"}
                minValue={18}
                maxValue={42}
                stepsIn={0.5}
                onValueChange={(hips) => setHips(hips)}
              />
              <SelectList
                style={{ marginTop: 20 }}
                onSelect={(cup) => setCup(cup)}
                value={cup}
                data={["A", "B", "C", "D", "DD", "DDD", "E", "F", "G"]}
                placeHolder="Choose cup size"
                textStyle={{ fontFamily: "mon" }}
                itemTextStyle={{ fontFamily: "mon" }}
                headerTextStyle={{ fontFamily: "mon-sb" }}
                headerTitle={"Select cup size"}
                itemStyle={{ padding: 16 }}
                listHeight={"80%"}
              />
            </View>
          )}
        </View>
      </View>

      <View style={styles.absoluteView}>
        <TouchableOpacity
          style={styles.btn}
          onPress={async () => {
            // set updates based on gender
            let updates = {};
            if (gender === "male") {
              updates = {
                chest: chest,
                shirt: shirt,
                sleeve: sleeve,
                inseam: inseam,
              };
            } else {
              updates = {
                chest: chest,
                cup: cup,
                hips: hips,
                dress: dress,
              };
            }
            const token = await getToken({ template: "supabase" });
            const update = await updateUser({
              userId: userId ?? "",
              token: token ?? "",
              updates: updates,
            });
            console.log(update);
            router.push({
              pathname: "/(modals)/onboardingPhotos",
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
