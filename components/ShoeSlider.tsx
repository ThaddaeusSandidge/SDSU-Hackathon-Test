import React, { useState } from "react";
import { Text, View } from "react-native";
import Colors from "@/constants/Colors";
import Slider from "@react-native-community/slider";
import { useEffect } from "react";
import * as Haptics from "expo-haptics";

interface SliderComponentProps {
  name: string;
  isMetric: boolean;
  isMale: boolean;
  minValue: number;
  maxValue: number;
  stepsIn: number;
  onValueChange: (value: number) => void;
}

export const ShoeSliderComponent: React.FC<SliderComponentProps> = ({
  name,
  isMetric,
  isMale,
  minValue,
  maxValue,
  stepsIn,
  onValueChange,
}) => {
  const [value, setValue] = useState(minValue);

  useEffect(() => {
    const midPoint = Math.round((minValue + maxValue) / 2);
    setValue(midPoint);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    onValueChange(midPoint);
  }, [isMetric, minValue, maxValue]);
  const handleChange = (newValue: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setValue(newValue);
    onValueChange(newValue);
  };

  const steps = stepsIn;

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
        {name}: {value} {isMetric ? "EU" : "US"} {isMale ? "M" : "W"}
      </Text>

      <Slider
        style={{ height: 40 }}
        minimumValue={minValue}
        maximumValue={maxValue}
        minimumTrackTintColor={Colors.primary}
        maximumTrackTintColor={Colors.grey}
        onValueChange={handleChange}
        value={value}
        step={steps}
      />
    </View>
  );
};
