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
import { Country, State, City } from "@/interfaces/location";
import * as Haptics from "expo-haptics";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { RadioButton } from "react-native-paper";
import { useState } from "react";
import { Input, Button, CheckBox } from "react-native-elements";
import { set, useForm } from "react-hook-form";
import Slider from "@react-native-community/slider";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SelectList } from "react-native-select-bottom-list";
import { SliderComponent } from "@/components/Slider";
import { WeightSliderComponent } from "@/components/WeightSlider";
import { GetCountries, GetState, GetCity } from "react-country-state-city";
import "react-country-state-city/dist/react-country-state-city.css";
import { useEffect } from "react";
import { useAuth } from "@clerk/clerk-react";
import { updateUser } from "@/utils/supabaseRequests";
import DateTimePicker from "@react-native-community/datetimepicker";
import DateTimePickerModal from "react-native-modal-datetime-picker";

const Page = () => {
  const { userId, getToken } = useAuth();

  const router = useRouter();
  const [measurement, setMeasurement] = useState("imperial");
  const [gender, setGender] = useState("male");

  const [countryName, setCountryName] = useState("");
  const [country, setCountry] = useState<Country | null>(null);
  const [stateName, setStateName] = useState("");
  const [state, setState] = useState<State | null>(null);
  const [cityName, setCityName] = useState("");
  const [city, setCity] = useState<City | null>(null);

  const [countriesList, setCountriesList] = useState<String[]>([]);
  const [countriesListFull, setCountriesListFull] = useState<Country[]>([]);
  const [stateList, setStateList] = useState<String[]>([]);
  const [stateListFull, setStateListFull] = useState<State[]>([]);
  const [cityList, setCityList] = useState<String[]>([]);
  const [cityListFull, setCityListFull] = useState<City[]>([]);

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [date, setDate] = useState<Date | null>(null);
  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date: Date) => {
    setDate(date);
    hideDatePicker();
  };

  useEffect(() => {
    GetCountries().then((result: Country[]) => {
      setCountriesListFull(result);
      const formattedResult = result.map(
        (country) => `${country.name} ${country.emoji}`
      );
      setCountriesList(formattedResult);
    });
  }, []);
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <View style={styles.infoContainer}>
        <Text style={styles.name}>Woohoo, looks like we have liftoff! 🚀 </Text>
        <Text style={styles.location}>
          Tell us a little more about yourself so we can match you with
          agencies!
        </Text>
        <Text style={styles.guide}>Select measurement</Text>

        <View style={styles.radioGroup}>
          <View style={styles.radioButton}>
            <RadioButton.Android
              value="imperial"
              status={measurement === "imperial" ? "checked" : "unchecked"}
              onPress={() => {
                setMeasurement("imperial");
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }}
              color={Colors.primary}
            />
            <Text style={styles.radioLabel}>🇺🇸 Imperial</Text>
          </View>

          <View style={styles.radioButton}>
            <RadioButton.Android
              value="metric"
              status={measurement === "metric" ? "checked" : "unchecked"}
              onPress={() => {
                setMeasurement("metric");
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }}
              color={Colors.primary}
            />
            <Text style={styles.radioLabel}>🌍 Metric</Text>
          </View>
        </View>
        <Text style={styles.guide}>Select sizing gender</Text>

        <View style={styles.radioGroup}>
          <View style={styles.radioButton}>
            <RadioButton.Android
              value="male"
              status={gender === "male" ? "checked" : "unchecked"}
              onPress={() => {
                setGender("male");
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }}
              color={Colors.primary}
            />
            <Text style={styles.radioLabel}>👨 Male</Text>
          </View>

          <View style={styles.radioButton}>
            <RadioButton.Android
              value="female"
              status={gender === "female" ? "checked" : "unchecked"}
              onPress={() => {
                setGender("female");
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }}
              color={Colors.primary}
            />
            <Text style={styles.radioLabel}>👩 Female</Text>
          </View>
        </View>
        <View>
          <Text style={styles.guide}>Country</Text>
          <SelectList
            data={countriesList}
            showSearch={true}
            listHeight={"80%"}
            placeHolder="Choose country"
            headerTitle="Select your country"
            headerTextStyle={{ fontFamily: "mon-sb" }}
            textStyle={{ fontFamily: "mon" }}
            itemTextStyle={{ fontFamily: "mon" }}
            itemStyle={{ padding: 16 }}
            value={countryName}
            onSelect={(item) => {
              const selectedCountry = countriesListFull.find(
                (country) => `${country.name} ${country.emoji}` === item
              );
              if (selectedCountry) {
                setCountry(selectedCountry);
                setCountryName(selectedCountry.name);
                setState(null);
                setStateName("");
                setCity(null);
                setCityName("");
                GetState(selectedCountry.id).then((result: State[]) => {
                  setStateListFull(result);
                  const formattedResult = result.map(
                    (state) => `${state.name}`
                  );
                  setStateList(formattedResult);
                });
              }
            }}
          />

          <Text style={styles.guide}>State</Text>
          <SelectList
            data={stateList}
            showSearch={true}
            listHeight={"80%"}
            placeHolder="Choose state"
            headerTitle="Select your state"
            headerTextStyle={{ fontFamily: "mon-sb" }}
            textStyle={{ fontFamily: "mon" }}
            itemTextStyle={{ fontFamily: "mon" }}
            itemStyle={{ padding: 16 }}
            disabled={!country}
            onSelect={(item) => {
              const selectedState = stateListFull.find(
                (state) => `${state.name}` === item
              );
              if (selectedState && country) {
                setStateName(selectedState.name);
                setState(selectedState);
                setCity(null);
                setCityName("");
                GetCity(country.id, selectedState.id).then((result: City[]) => {
                  setCityListFull(result);
                  const formattedResult = result.map((city) => `${city.name}`);
                  setCityList(formattedResult);
                });
              }
            }}
            value={stateName}
          />

          <Text style={styles.guide}>City</Text>
          <SelectList
            data={cityList}
            showSearch={true}
            listHeight={"80%"}
            placeHolder="Choose city"
            headerTitle="Select your city"
            headerTextStyle={{ fontFamily: "mon-sb" }}
            textStyle={{ fontFamily: "mon" }}
            itemTextStyle={{ fontFamily: "mon" }}
            itemStyle={{ padding: 16 }}
            disabled={!country && !state && !cityList}
            onSelect={(item) => {
              const selectedCity = cityListFull.find(
                (city) => `${city.name}` === item
              );
              if (selectedCity) {
                setCityName(selectedCity.name);
                setCity(selectedCity);
              }
            }}
            value={cityName}
          />
        </View>
        <View>
          <Text style={styles.guide}>Date of birth</Text>
          <TouchableOpacity onPress={showDatePicker}>
            <Text
              style={{
                fontFamily: "mon",
                borderColor: Colors.grey,
                borderWidth: StyleSheet.hairlineWidth,
                padding: 10,
                borderRadius: 5,
              }}
            >
              {date ? date.toDateString() : "Select date of birth"}
            </Text>
          </TouchableOpacity>
          <DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode="date"
            onConfirm={handleConfirm}
            onCancel={hideDatePicker}
            themeVariant="light"
            buttonTextColorIOS={Colors.primary}
          />
        </View>
      </View>

      <View style={styles.absoluteView}>
        <TouchableOpacity
          style={styles.btn}
          onPress={async () => {
            const updates = {
              measurement: measurement,
              gender: gender,
              country: country,
              state: state,
              city: city,
              dob: date,
            };
            const token = await getToken({ template: "supabase" });
            const update = await updateUser({
              userId: userId ?? "",
              token: token ?? "",
              updates: updates,
            });
            console.log(update);
            router.push({
              pathname: "/(modals)/measurementGeneral",
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
            Onto measurements
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
