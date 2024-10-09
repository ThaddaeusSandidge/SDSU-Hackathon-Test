import { View, Text } from "react-native";
import React from "react";
import { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { StyleSheet } from "react-native";
import { defaultStyles } from "@/constants/Styles";
import { useEffect, useState, memo } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "expo-router";
import MapView from "react-native-map-clustering";
import Colors from "@/constants/Colors";
interface Props {
  agencies: any;
}
const INITIAL_REGION = {
  latitude: 37.78825,
  longitude: -122.4324,
  latitudeDelta: 9,
  longitudeDelta: 9,
};

const AgenciesMap = ({ agencies }: Props) => {
  const router = useRouter();

  const onMarkerSelected = (agency: any) => {
    router.push(`/agency/${agency.id}`);
  };

  const renderCluster = (cluster: any) => {
    const { id, geometry, onPress, properties } = cluster;
    const points = properties.point_count;

    return (
      <Marker
        key={`cluster-${id}`}
        onPress={onPress}
        coordinate={{
          longitude: geometry.coordinates[0],
          latitude: geometry.coordinates[1],
        }}
      >
        <View style={styles.marker}>
          <Text
            style={{
              color: "#000",
              textAlign: "center",
              fontFamily: "mon-sb",
            }}
          >
            {points}
          </Text>
        </View>
      </Marker>
    );
  };

  return (
    <View style={defaultStyles.container}>
      <MapView
        animationEnabled={false}
        style={StyleSheet.absoluteFill}
        showsUserLocation
        showsMyLocationButton
        initialRegion={INITIAL_REGION}
        clusterColor={Colors.primary}
        clusterFontFamily="mon-sb"
      >
        {agencies.map((agency: any) => (
          <Marker
            key={agency.id}
            onPress={() => onMarkerSelected(agency)}
            coordinate={{
              latitude: agency.latitude,
              longitude: agency.longitude,
            }}
          >
            <View style={styles.marker}>
              <Text style={styles.markerText}>{agency.display_name}</Text>
            </View>
          </Marker>
        ))}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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

export default AgenciesMap;
