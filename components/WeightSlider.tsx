import React, { useState } from "react";
import { Text, View } from "react-native";
import Colors from "@/constants/Colors";
import Slider from "@react-native-community/slider";
import { useEffect } from "react";
import * as Haptics from "expo-haptics";

interface SliderComponentProps {
  name: string;
  isMetric: boolean;
  minValue: number;
  maxValue: number;
  stepsIn: number;
  onValueChange: (value: number) => void;
}

export const WeightSliderComponent: React.FC<SliderComponentProps> = ({
  name,
  isMetric,
  minValue,
  maxValue,
  stepsIn,
  onValueChange,
}) => {
  const [value, setValue] = useState(minValue);

  useEffect(() => {
    const min = isMetric ? Math.round(minValue / 2.205) : minValue; // convert inches to cm
    const max = isMetric ? Math.round(maxValue / 2.205) : maxValue;
    const midPoint = Math.round((min + max) / 2);
    setValue(midPoint);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    onValueChange(midPoint);
  }, [isMetric, minValue, maxValue]);

  // on value change do haptics

  const handleChange = (newValue: number) => {
    const roundedValue = Math.round(newValue);
    setValue(roundedValue);
    onValueChange(roundedValue);
  };
  const min = isMetric ? Math.round(minValue / 2.205) : minValue; // convert inches to cm
  const max = isMetric ? Math.round(maxValue / 2.205) : maxValue;
  const steps = stepsIn;
  // convert cm to feet and inches

  return (
    <View>
      <Text
        style={{
          marginTop: 20,
          fontSize: 14,
          fontFamily: "mon",
          fontWeight: "bold",
        }}
      >
        {name}: {value} {isMetric ? "kgs" : "lbs"}
      </Text>

      <Slider
        style={{ height: 40 }}
        minimumValue={min}
        maximumValue={max}
        minimumTrackTintColor={Colors.primary}
        maximumTrackTintColor={Colors.grey}
        onValueChange={handleChange}
        value={value}
        step={steps}
      />
    </View>
  );
};
