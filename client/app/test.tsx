import axios, { AxiosResponse } from 'axios';
import { debounce } from 'lodash';
import React, { useCallback, useRef, useState } from 'react';
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import MapView, { LatLng, Marker, Region } from 'react-native-maps';

interface Place {
    place_id: number;
    display_name: string;
    lat: string;
    lon: string;
    addressdetails?: any;
}

export default function OpenSourceLocationPicker() {
    const [query, setQuery] = useState<string>('');
    const [results, setResults] = useState<Place[]>([]);
    const [selectedLocation, setSelectedLocation] = useState<LatLng | null>(null);
    const mapRef = useRef<MapView>(null);

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
                        'User-Agent': 'FreshCotsApp/1.0 (yourname@example.com)',
                    },
                }
            );
            setResults(response.data);
        } catch (err) {
            console.error('[Search Error]', err);
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
        setQuery(place.display_name);

        const region: Region = {
            ...coords,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
        };

        mapRef.current?.animateToRegion(region);
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
                    renderItem={({ item }) => (
                        <TouchableOpacity onPress={() => selectPlace(item)} style={styles.resultItem}>
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
                onPress={(e) => setSelectedLocation(e.nativeEvent.coordinate)}
            >
                {selectedLocation && <Marker coordinate={selectedLocation} />}
            </MapView>
        </View>
    );
}

const styles = StyleSheet.create({
    searchInput: {
        position: 'absolute',
        top: 10,
        left: 10,
        right: 10,
        zIndex: 10,
        height: 45,
        paddingHorizontal: 10,
        backgroundColor: '#fff',
        borderRadius: 5,
        elevation: 2,
    },
    resultList: {
        position: 'absolute',
        top: 85,
        left: 10,
        right: 10,
        maxHeight: 200,
        backgroundColor: '#fff',
        zIndex: 9,
        borderRadius: 5,
        elevation: 2,
    },
    resultItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
});