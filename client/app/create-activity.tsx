import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Animated,
  Easing,
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View
} from "react-native";

const sports = [
  {
    id: 1,
    name: "Tennis",
    icon: "tennisball-outline",
    color: "#e74c3c",
    activeColor: "#c0392b",
  },
  {
    id: 2,
    name: "Badminton",
    icon: "basketball-outline",
    color: "#27ae60",
    activeColor: "#219653",
  },
  {
    id: 3,
    name: "Padel",
    icon: "tennisball-outline",
    color: "#3498db",
    activeColor: "#2980b9",
  },
  {
    id: 4,
    name: "Squash",
    icon: "basketball-outline",
    color: "#9b59b6",
    activeColor: "#8e44ad",
  },
  {
    id: 5,
    name: "Pickleball",
    icon: "tennisball-outline",
    color: "#f39c12",
    activeColor: "#e67e22",
  },
  {
    id: 6,
    name: "Other",
    icon: "ellipsis-horizontal",
    color: "#95a5a6",
    activeColor: "#7f8c8d",
  },
];

const NewActivityScreen = () => {
  const [selectedSport, setSelectedSport] = useState(sports[0]);
  const [duration, setDuration] = useState(6);
  const [playerSlots, setPlayerSlots] = useState(6);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isPaidActivity, setIsPaidActivity] = useState(false);
  const [isVenueBooked, setIsVenueBooked] = useState(false);
  const [isVisibleToInvited, setIsVisibleToInvited] = useState(false);
  const [isClubActivity, setIsClubActivity] = useState(false);
  const [animation] = useState(new Animated.Value(0));

  const router = useRouter();

  const players = [
    {
      id: 1,
      name: "You",
      rating: 4.5,
      image: "https://i.pravatar.cc/100?img=1",
    },
    {
      id: 2,
      name: "Janely",
      rating: 4.5,
      image: "https://i.pravatar.cc/100?img=5",
    },
    {
      id: 3,
      name: "Kristine",
      rating: 4.3,
      image: "https://i.pravatar.cc/100?img=9",
    },
    { id: 4, name: "V", rating: 4.7, image: "https://i.pravatar.cc/100?img=3" },
  ];

  const handleSportSelect = (sport: any) => {
    Animated.sequence([
      Animated.timing(animation, {
        toValue: 1,
        duration: 150,
        easing: Easing.ease,
        useNativeDriver: true,
      }),
      Animated.timing(animation, {
        toValue: 0,
        duration: 150,
        easing: Easing.ease,
        useNativeDriver: true,
      }),
    ]).start();

    setSelectedSport(sport);
  };

  const adjustValue = (value: any, setValue: any, increment: any) => {
    setValue(increment ? value + 1 : Math.max(1, value - 1));
  };

  const scaleInterpolation = animation.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 1.1, 1],
  });

  const animatedStyle = {
    transform: [{ scale: scaleInterpolation }],
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView style={styles.scrollView}>
        {/* Sport Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>CHOOSE A SPORT</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.sportOptionsContainer}
          >
            {sports.map((sport) => (
              <Animated.View
                key={sport.id}
                style={[
                  selectedSport.id === sport.id && animatedStyle,
                  { marginRight: 12 },
                ]}
              >
                <TouchableOpacity
                  style={[
                    styles.sportButton,
                    selectedSport.id === sport.id && {
                      backgroundColor: sport.activeColor,
                      shadowColor: sport.color,
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.3,
                      shadowRadius: 4,
                      elevation: 5,
                    },
                    {
                      backgroundColor:
                        selectedSport.id === sport.id
                          ? sport.activeColor
                          : "#f0f0f0",
                    },
                  ]}
                  onPress={() => handleSportSelect(sport)}
                >
                  <Ionicons
                    // name={sport.name || ""}
                    size={18}
                    color={selectedSport.id === sport.id ? "white" : sport.color}
                    style={styles.sportIcon}
                  />
                  <Text
                    style={[
                      styles.sportText,
                      {
                        color:
                          selectedSport.id === sport.id ? "white" : "#333",
                      },
                    ]}
                  >
                    {sport.name}
                  </Text>
                </TouchableOpacity>
              </Animated.View>
            ))}
          </ScrollView>

          {/* Sport Selection Indicators */}
          <View style={styles.indicators}>
            {sports.map((sport) => (
              <View
                key={sport.id}
                style={[
                  styles.indicator,
                  selectedSport.id === sport.id && [
                    styles.indicatorActive,
                    { backgroundColor: sport.color },
                  ],
                ]}
              />
            ))}
          </View>
        </View>

        {/* Rest of your components... */}
        {/* Game Type */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>GAME TYPE</Text>
          <TouchableOpacity style={styles.dropdown}>
            <Text style={styles.dropdownText}>Singles</Text>
            <Ionicons name="chevron-down" size={20} color="#999" />
          </TouchableOpacity>
        </View>

        {/* Date and Duration */}
        <View style={styles.rowSection}>
          <View style={styles.halfSection}>
            <Text style={styles.sectionTitle}>DATE AND TIME</Text>
            <TouchableOpacity style={styles.dateInput}>
              <Ionicons
                name="calendar-outline"
                size={20}
                color="#999"
                style={styles.inputIcon}
              />
              <Text style={styles.inputText}>Time</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.halfSection}>
            <Text style={styles.sectionTitle}>DURATION</Text>
            <View style={styles.durationContainer}>
              <TouchableOpacity
                style={styles.circleButton}
                onPress={() => adjustValue(duration, setDuration, false)}
              >
                <Ionicons name="remove" size={20} color="#3498db" />
              </TouchableOpacity>

              <Text style={styles.durationText}>
                {duration.toString().padStart(2, "0")} hr
              </Text>

              <TouchableOpacity
                style={styles.circleButton}
                onPress={() => adjustValue(duration, setDuration, true)}
              >
                <Ionicons name="add" size={20} color="#3498db" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Venue */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>VENUE</Text>
          <TouchableOpacity style={styles.input}>
            <Text style={styles.placeholderText}>Select Venue</Text>
          </TouchableOpacity>
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>DESCRIPTION</Text>
          <TouchableOpacity style={[styles.input, styles.textArea]}>
            <Text style={styles.placeholderText}>
              Tap to add game description
            </Text>
          </TouchableOpacity>
        </View>

        {/* Total Player Slots */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>TOTAL PLAYER SLOTS</Text>
          <View style={styles.durationContainer}>
            <TouchableOpacity
              style={styles.circleButton}
              onPress={() => adjustValue(playerSlots, setPlayerSlots, false)}
            >
              <Ionicons name="remove" size={20} color="#3498db" />
            </TouchableOpacity>

            <Text style={styles.durationText}>
              {playerSlots.toString().padStart(2, "0")}
            </Text>

            <TouchableOpacity
              style={styles.circleButton}
              onPress={() => adjustValue(playerSlots, setPlayerSlots, true)}
            >
              <Ionicons name="add" size={20} color="#3498db" />
            </TouchableOpacity>
          </View>
        </View>

        {/* I am playing */}
        <View style={styles.toggleSection}>
          <Text style={styles.sectionTitle}>I AM PLAYING</Text>
          <Switch
            value={isPlaying}
            onValueChange={setIsPlaying}
            trackColor={{ false: "#f0f0f0", true: "#3498db" }}
            thumbColor={"#fff"}
            ios_backgroundColor="#f0f0f0"
          />
        </View>

        {/* Attributes */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ATTRIBUTES</Text>
          <View style={styles.attributeRow}>
            <TouchableOpacity
              style={[styles.dropdown, styles.attributeDropdown]}
            >
              <Text style={styles.placeholderText}>Select Attribute</Text>
              <Ionicons name="chevron-down" size={20} color="#999" />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.dropdown, styles.attributeDropdown]}
            >
              <Text style={styles.placeholderText}>Select Option(s)</Text>
              <Ionicons name="chevron-down" size={20} color="#999" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.addMoreButton}>
            <Text style={styles.addMoreText}>ADD MORE</Text>
          </TouchableOpacity>
        </View>

        {/* Player List */}
        <View style={styles.section}>
          <View style={styles.playerListHeader}>
            <Text style={styles.sectionTitle}>PLAYER LIST</Text>
            <TouchableOpacity>
              <Text style={styles.inviteText}>INVITE PLAYERS</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.playerList}>
            {players.map((player) => (
              <View key={player.id} style={styles.playerItem}>
                <Image
                  source={{ uri: player.image }}
                  style={styles.playerImage}
                />
                <View style={styles.playerRating}>
                  <Text style={styles.ratingText}>{player.rating}</Text>
                </View>
                <Text style={styles.playerName}>{player.name}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Toggle Options */}
        <View style={styles.toggleSection}>
          <Text style={styles.sectionTitle}>PAID ACTIVITY</Text>
          <Switch
            value={isPaidActivity}
            onValueChange={setIsPaidActivity}
            trackColor={{ false: "#f0f0f0", true: "#3498db" }}
            thumbColor={"#fff"}
            ios_backgroundColor="#f0f0f0"
          />
        </View>

        <View style={styles.toggleSection}>
          <Text style={styles.sectionTitle}>VENUE IS BOOKED</Text>
          <Switch
            value={isVenueBooked}
            onValueChange={setIsVenueBooked}
            trackColor={{ false: "#f0f0f0", true: "#3498db" }}
            thumbColor={"#fff"}
            ios_backgroundColor="#f0f0f0"
          />
        </View>

        <View style={styles.toggleSection}>
          <Text style={styles.sectionTitle}>
            VISIBLE ONLY TO INVITED PLAYERS
          </Text>
          <Switch
            value={isVisibleToInvited}
            onValueChange={setIsVisibleToInvited}
            trackColor={{ false: "#f0f0f0", true: "#3498db" }}
            thumbColor={"#fff"}
            ios_backgroundColor="#f0f0f0"
          />
        </View>

        <View style={styles.toggleSection}>
          <Text style={styles.sectionTitle}>MAKE THIS CLUB ACTIVITY</Text>
          <Switch
            value={isClubActivity}
            onValueChange={setIsClubActivity}
            trackColor={{ false: "#f0f0f0", true: "#3498db" }}
            thumbColor={"#fff"}
            ios_backgroundColor="#f0f0f0"
          />
        </View>

        {/* Create Button */}
        <TouchableOpacity
          style={styles.createButton}
          onPress={() => router.navigate("/activity-list")}
        >
          <Text style={styles.createButtonText}>CREATE ACTIVITY</Text>
        </TouchableOpacity>

        {/* Bottom padding */}
        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  sportOptionsContainer: {
    paddingVertical: 8,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 50,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "500",
    color: "#3498db",
  },
  headerRight: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  rowSection: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  halfSection: {
    flex: 1,
    padding: 15,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#666",
    marginBottom: 10,
  },
  sportOptions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  sportButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    minWidth: 100,
  },
  sportButtonSelected: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
    elevation: 2,
  },
  sportIcon: {
    marginRight: 5,
  },
  sportText: {
    fontWeight: "500",
  },
  indicators: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 15,
  },
  indicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#f0f0f0",
    marginHorizontal: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  indicatorActive: {
    backgroundColor: "#3498db",
  },
  dropdown: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 45,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 5,
  },
  dropdownText: {
    color: "#333",
  },
  dateInput: {
    flexDirection: "row",
    alignItems: "center",
    height: 45,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 5,
  },
  inputIcon: {
    marginRight: 10,
  },
  inputText: {
    color: "#333",
  },
  durationContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  circleButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#3498db",
    alignItems: "center",
    justifyContent: "center",
  },
  durationText: {
    fontSize: 18,
    fontWeight: "500",
    color: "#333",
  },
  input: {
    height: 45,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 5,
    justifyContent: "center",
  },
  textArea: {
    height: 80,
    paddingTop: 12,
  },
  placeholderText: {
    color: "#999",
  },
  toggleSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  attributeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  attributeDropdown: {
    flex: 1,
    marginRight: 5,
  },
  addMoreButton: {
    marginTop: 10,
  },
  addMoreText: {
    color: "#3498db",
    fontWeight: "500",
  },
  playerListHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  inviteText: {
    color: "#3498db",
    fontWeight: "500",
  },
  playerList: {
    flexDirection: "row",
    marginTop: 10,
  },
  playerItem: {
    alignItems: "center",
    marginRight: 15,
  },
  playerImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  playerRating: {
    position: "absolute",
    right: -5,
    top: -5,
    backgroundColor: "#3498db",
    borderRadius: 10,
    paddingHorizontal: 5,
    paddingVertical: 2,
  },
  ratingText: {
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
  },
  playerName: {
    marginTop: 5,
    fontSize: 12,
  },
  createButton: {
    backgroundColor: "#3498db",
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 15,
    marginTop: 20,
    borderRadius: 5,
  },
  createButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  bottomPadding: {
    height: 30,
  },
});

export default NewActivityScreen;
