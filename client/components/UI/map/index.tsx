import axios, { AxiosResponse } from "axios";
import { debounce } from "lodash";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, { LatLng, Marker, Region } from "react-native-maps";

interface Place {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
  addressdetails?: any;
}
export default function LocationSelector({
  onSelect = () => {},
  value = { address: "", latitude: 0, longitude: 0 },
}: {
  onSelect?: (location: any) => void;
  value?: { address: string; latitude: number; longitude: number };
}) {
  const [query, setQuery] = useState<string>(value.address);
  const [results, setResults] = useState<Place[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<LatLng | null>(
    value.latitude && value.longitude
      ? { latitude: value.latitude, longitude: value.longitude }
      : null
  );
  const mapRef = useRef<MapView>(null);

  // Initialize map to show the value's location if it exists
  useEffect(() => {
    if (value.latitude && value.longitude) {
      const region: Region = {
        latitude: value.latitude,
        longitude: value.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };
      mapRef.current?.animateToRegion(region);
    }
  }, []);
  useRef<MapView>(null);

  useEffect(() => {
    if (selectedLocation && onSelect) {
      onSelect({
        latitude: selectedLocation.latitude,
        longitude: selectedLocation.longitude,
        address: query || "Dropped pin",
      });
    }
  }, [selectedLocation, query]);

  const searchPlaces = async (text: string) => {
    if (text.length < 3) {
      setResults([]);
      return;
    }

    try {
      const response: AxiosResponse<Place[]> = await axios.get(
        `https://nominatim.openstreetmap.org/search?q=${text}&format=json&addressdetails=1`,
        {
          headers: {
            "User-Agent": "FreshCotsApp/1.0 (vsundaran77@gmail.com)",
          },
        }
      );
      setResults(response.data);
    } catch (err) {
      console.error("[Search Error]", err);
    }
  };

  const debouncedSearch = useCallback(debounce(searchPlaces, 500), []);

  const handleInputChange = (text: string) => {
    setQuery(text);
    debouncedSearch(text);
  };

  const selectPlace = (place: Place) => {
    const { lat, lon } = place;
    const coords: LatLng = {
      latitude: parseFloat(lat),
      longitude: parseFloat(lon),
    };

    setSelectedLocation(coords);
    setResults([]);
    console.log(place.display_name, "place.display_name");

    setQuery(place.display_name || "");

    const region: Region = {
      ...coords,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    };

    mapRef.current?.animateToRegion(region);
  };

  const getLocationFromCoords = async (coords: LatLng) => {
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?lat=${coords.latitude}&lon=${coords.longitude}&format=json&addressdetails=1`,
        {
          headers: {
            "User-Agent": "FreshCotsApp/1.0 (vsundaran77@gmail.com)",
          },
        }
      );

      return response.data.address;
    } catch (err) {
      console.error("[Reverse Geocode Error]", err);
    }
  };

  const handleMapPress = async (e: { nativeEvent: { coordinate: LatLng } }) => {
    const coords = e.nativeEvent.coordinate;
    setSelectedLocation(coords);

    try {
      const address: any = await getLocationFromCoords(coords);
      const addressParts = [
        address.village,
        address.county,
        address.state_district,
        address.state,
        address.country,
        address.postcode,
      ].filter(Boolean);
      const displayName = addressParts.join(", ");
      setQuery(displayName);
    } catch (err) {
      console.error("[Reverse Geocode Error]", err);
      setQuery("Dropped pin");
    }
  };
  return (
    <View style={{ flex: 1 }}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search location"
        value={query}
        onChangeText={handleInputChange}
      />
      {results.length > 0 && (
        <FlatList
          data={results}
          keyExtractor={(item) => item.place_id.toString()}
          style={styles.resultList}
          scrollEnabled={false} // Add this line
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => selectPlace(item)}
              style={styles.resultItem}
            >
              <Text>{item.display_name}</Text>
            </TouchableOpacity>
          )}
        />
      )}
      <MapView
        ref={mapRef}
        style={{ flex: 1 }}
        initialRegion={{
          latitude: 12.9716,
          longitude: 77.5946,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
        onPress={handleMapPress}
      >
        {selectedLocation && <Marker coordinate={selectedLocation} />}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  searchInput: {
    position: "absolute",
    top: 10,
    left: 10,
    right: 10,
    zIndex: 10,
    height: 45,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
    borderRadius: 5,
    elevation: 2,
  },
  resultList: {
    position: "absolute",
    top: 85,
    left: 10,
    right: 10,
    maxHeight: 200,
    backgroundColor: "#fff",
    zIndex: 9,
    borderRadius: 5,
    elevation: 2,
  },
  resultItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
});
