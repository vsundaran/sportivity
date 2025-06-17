import { CreateActivity } from "@/API/apiHandler";
import LocationSelector from "@/components/UI/map";
import { useAuth } from "@/context/AuthContext";
import useDateTimePicker from "@/custom-hooks/datePicker";
import { clearSelectedPlayers } from "@/redux/slices/playersSlice";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Easing,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import { useSelector } from "react-redux";
// import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

type Sport = {
  id: number;
  name: string;
  icon: string;
  color: string;
  activeColor: string;
};

type Player = {
  id: number;
  name: string;
  rating: number;
  image: string;
};

type Attribute = {
  id: number;
  name: string;
  options: string[];
};

type SelectedAttribute = {
  id: number;
  name: string;
  selectedOptions: string[];
};

const sports: Sport | any[] = [
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

const gameTypes = [
  "Singles",
  "Doubles",
  "Mixed Doubles",
  "Practice",
  "Training",
];

const attributes: Attribute[] = [
  {
    id: 1,
    name: "Skill Level",
    options: ["Beginner", "Intermediate", "Advanced", "Professional"],
  },
  {
    id: 2,
    name: "Intensity",
    options: ["Casual", "Moderate", "Competitive", "Very Competitive"],
  },
  {
    id: 3,
    name: "Equipment",
    options: ["Bring your own", "Provided", "Rent available"],
  },
];

const venues = [
  "Central Park Tennis Courts",
  "Downtown Sports Complex",
  "Riverside Badminton Club",
  "Elite Squash Center",
  "City Padel Courts",
];

const NewActivityScreen = () => {
  const router = useRouter();

  // Form state
  const [selectedSport, setSelectedSport] = useState<Sport>(sports[0]);
  const [duration, setDuration] = useState(6);
  const [playerSlots, setPlayerSlots] = useState(6);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isPaidActivity, setIsPaidActivity] = useState(false);
  const [isVenueBooked, setIsVenueBooked] = useState(false);
  const [isVisibleToInvited, setIsVisibleToInvited] = useState(false);
  const [isClubActivity, setIsClubActivity] = useState(false);
  const [animation] = useState(new Animated.Value(0));
  const [gameType, setGameType] = useState(gameTypes[0]);
  const [description, setDescription] = useState("");
  const [selectedVenue, setSelectedVenue] = useState("");
  const [selectedAttributes, setSelectedAttributes] = useState<
    SelectedAttribute[]
  >([]);
  const [players, setPlayers] = useState<Player[]>([
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
  ]);

  // UI state
  const [showGameTypeModal, setShowGameTypeModal] = useState(false);
  const [showVenueModal, setShowVenueModal] = useState(false);
  const [showAttributeModal, setShowAttributeModal] = useState(false);
  const [showOptionsModal, setShowOptionsModal] = useState(false);
  const [currentAttribute, setCurrentAttribute] = useState<Attribute | null>(
    null
  );
  const { user } = useAuth();

  const {
    date: selectedDateAndTime,
    showDatePicker: visibleDatePicker,
    showTimePicker,
    renderPicker,
  } = useDateTimePicker();

  const selectedPlayers = useSelector(
    (state: any) => state.players.selectedPlayers
  );

  // console.log(selectedPlayers, "selectedPlayers");

  // Animation handlers
  const handleSportSelect = (sport: Sport) => {
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

  const adjustValue = (
    value: number,
    setValue: React.Dispatch<React.SetStateAction<number>>,
    increment: boolean
  ) => {
    setValue(increment ? value + 1 : Math.max(1, value - 1));
  };

  const scaleInterpolation = animation.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 1.1, 1],
  });

  const animatedStyle = {
    transform: [{ scale: scaleInterpolation }],
  };

  const resetForm = useCallback(() => {
    setSelectedSport(sports[0]);
    setDuration(6);
    setPlayerSlots(6);
    setIsPlaying(true);
    setIsPaidActivity(false);
    setIsVenueBooked(false);
    setIsVisibleToInvited(false);
    setIsClubActivity(false);
    setGameType(gameTypes[0]);
    setDescription("");
    setVenueLocation(null);
    setSelectedAttributes([]);
    setPlayers([
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
      {
        id: 4,
        name: "V",
        rating: 4.7,
        image: "https://i.pravatar.cc/100?img=3",
      },
    ]);
  }, []);

  // Reset form when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      resetForm();
    }, [resetForm])
  );

  // Attribute handling
  const handleAddAttribute = () => {
    if (attributes.length > selectedAttributes.length) {
      const availableAttributes = attributes.filter(
        (attr) =>
          !selectedAttributes.some((selected) => selected.id === attr.id)
      );
      setCurrentAttribute(availableAttributes[0]);
      setShowAttributeModal(true);
    }
  };

  const handleSelectAttribute = (attribute: Attribute) => {
    setCurrentAttribute(attribute);
    setShowOptionsModal(true);
  };

  const handleSelectOptions = (options: string[]) => {
    if (currentAttribute) {
      const newSelectedAttribute: SelectedAttribute = {
        id: currentAttribute.id,
        name: currentAttribute.name,
        selectedOptions: options,
      };

      setSelectedAttributes((prev) => {
        const existingIndex = prev.findIndex(
          (attr) => attr.id === currentAttribute.id
        );
        if (existingIndex >= 0) {
          const updated = [...prev];
          updated[existingIndex] = newSelectedAttribute;
          return updated;
        } else {
          return [...prev, newSelectedAttribute];
        }
      });

      setShowOptionsModal(false);
      setShowAttributeModal(false);
    }
  };

  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: (formData: any) => CreateActivity(formData),
    onSuccess: (resposne) => {
      // console.log(resposne, "resposne");
      Toast.show({
        type: "success",
        text1: "Profile updated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["getActivity"] });
      router.replace("/activity-list");
    },
    onError: (error) => {
      Toast.show({
        type: "error",
        text1: "Failed to update profile",
        text2: error?.message || "Something went wrong",
      });
    },
  });

  // Form submission
  const handleSubmit = async () => {
    const activityData = {
      sport: selectedSport?.name,
      gameType,
      date: selectedDateAndTime?.toISOString(),
      duration,
      venue: venueLocation,
      description,
      playerSlots,
      isPlaying,
      attributes: selectedAttributes,
      isPaidActivity,
      isVenueBooked,
      isVisibleToInvited,
      isClubActivity,
      players: selectedPlayers?.map((p: any) => p._id),
    };
    // console.log(activityData, "activityData");

    mutate(activityData);
    clearSelectedPlayers();
  };

  const [venueLocation, setVenueLocation] = useState<{
    latitude: number;
    longitude: number;
    address?: string;
  } | null>(null);

  const selectLocation = (coords: {
    address: string;
    latitude: number;
    longitude: number;
  }) => {
    setVenueLocation(coords);
    // console.log(coords, "Selected location coordinates");
  };

  // Render methods
  const renderGameTypeModal = () => (
    <Modal
      visible={showGameTypeModal}
      transparent
      animationType="slide"
      onRequestClose={() => setShowGameTypeModal(false)}
    >
      <TouchableWithoutFeedback onPress={() => setShowGameTypeModal(false)}>
        <View style={styles.modalOverlay} />
      </TouchableWithoutFeedback>
      <View style={styles.modalContent}>
        <Text style={styles.modalTitle}>Select Game Type</Text>
        {gameTypes.map((type) => (
          <TouchableOpacity
            key={type}
            style={styles.modalOption}
            onPress={() => {
              setGameType(type);
              setShowGameTypeModal(false);
            }}
          >
            <Text style={styles.modalOptionText}>{type}</Text>
            {gameType === type && (
              <Ionicons name="checkmark" size={20} color="#3498db" />
            )}
          </TouchableOpacity>
        ))}
      </View>
    </Modal>
  );

  const renderAttributeModal = () => (
    <Modal
      visible={showAttributeModal}
      transparent
      animationType="slide"
      onRequestClose={() => setShowAttributeModal(false)}
    >
      <TouchableWithoutFeedback onPress={() => setShowAttributeModal(false)}>
        <View style={styles.modalOverlay} />
      </TouchableWithoutFeedback>
      <View style={styles.modalContent}>
        <Text style={styles.modalTitle}>Select Attribute</Text>
        {attributes
          .filter(
            (attr) =>
              !selectedAttributes.some((selected) => selected.id === attr.id)
          )
          .map((attr) => (
            <TouchableOpacity
              key={attr.id}
              style={styles.modalOption}
              onPress={() => handleSelectAttribute(attr)}
            >
              <Text style={styles.modalOptionText}>{attr.name}</Text>
            </TouchableOpacity>
          ))}
        <TouchableOpacity
          style={styles.modalCancelButton}
          onPress={() => setShowAttributeModal(false)}
        >
          <Text style={styles.modalCancelButtonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );

  const renderOptionsModal = () => (
    <Modal
      visible={showOptionsModal}
      transparent
      animationType="slide"
      onRequestClose={() => setShowOptionsModal(false)}
    >
      <TouchableWithoutFeedback onPress={() => setShowOptionsModal(false)}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>
                Select {currentAttribute?.name} Options
              </Text>
              {currentAttribute?.options.map((option) => {
                const currentOptions =
                  selectedAttributes.find(
                    (attr) => attr.id === currentAttribute.id
                  )?.selectedOptions || [];
                const isSelected = currentOptions.includes(option);

                return (
                  <TouchableOpacity
                    key={option}
                    style={styles.modalOption}
                    onPress={() => {
                      const newOptions = isSelected
                        ? currentOptions.filter((opt) => opt !== option)
                        : [...currentOptions, option];

                      handleSelectOptions(newOptions);
                    }}
                  >
                    <Text style={styles.modalOptionText}>{option}</Text>
                    {isSelected && (
                      <Ionicons name="checkmark" size={20} color="#3498db" />
                    )}
                  </TouchableOpacity>
                );
              })}
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => setShowOptionsModal(false)}
              >
                <Text style={styles.modalCancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );

  return (
    <View style={styles.container}>
      {/* <LocationSelector /> */}
      <ScrollView style={styles.scrollView} scrollEnabled={true}>
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
                    name={sport?.icon}
                    size={18}
                    color={
                      selectedSport.id === sport.id ? "white" : sport.color
                    }
                    style={styles.sportIcon}
                  />
                  <Text
                    style={[
                      styles.sportText,
                      {
                        color: selectedSport.id === sport.id ? "white" : "#333",
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

        {/* Game Type */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>GAME TYPE</Text>
          <TouchableOpacity
            style={styles.dropdown}
            onPress={() => setShowGameTypeModal(true)}
          >
            <Text style={styles.dropdownText}>{gameType}</Text>
            <Ionicons name="chevron-down" size={20} color="#999" />
          </TouchableOpacity>
        </View>

        {/* Date and Duration */}

        <View style={styles.rowSection}>
          <View style={{ ...styles.halfSection, paddingBottom: 0 }}>
            <Text style={styles.sectionTitle}>DATE AND TIME</Text>
            <TouchableOpacity
              style={styles.dateInput}
              onPress={visibleDatePicker}
            >
              <Ionicons
                name="calendar-outline"
                size={20}
                color="#999"
                style={styles.inputIcon}
              />
              <Text style={styles.inputText}>
                {selectedDateAndTime?.toLocaleString() ||
                  "Select date and time"}
              </Text>
            </TouchableOpacity>
          </View>

          {renderPicker()}

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
        {/* <View style={styles.section}>
          <Text style={styles.sectionTitle}>VENUE</Text>
          <TouchableOpacity
            style={styles.input}
            onPress={() => setShowVenueModal(true)}
          >
            <Text style={selectedVenue ? styles.inputText : styles.placeholderText}>
              {selectedVenue || "Select Venue"}
            </Text>
          </TouchableOpacity>
        </View> */}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>VENUE</Text>
          <View
            style={{
              height: 350,
              borderRadius: 8,
              overflow: "hidden",
              marginTop: 10,
            }}
          >
            <LocationSelector
              onSelect={selectLocation}
              value={user?.location || {}}
            />
          </View>
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>DESCRIPTION</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Tap to add game description"
            placeholderTextColor="#999"
            multiline
            value={description}
            onChangeText={setDescription}
          />
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

          {selectedAttributes.map((attribute) => (
            <View key={attribute.id} style={styles.attributeItem}>
              <Text style={styles.attributeName}>{attribute.name}:</Text>
              <View style={styles.attributeOptions}>
                {attribute.selectedOptions.map((option) => (
                  <View key={option} style={styles.attributeOption}>
                    <Text style={styles.attributeOptionText}>{option}</Text>
                  </View>
                ))}
              </View>
              <TouchableOpacity
                onPress={() =>
                  handleSelectAttribute(
                    attributes.find((a) => a.id === attribute.id)!
                  )
                }
              >
                <Ionicons name="pencil" size={18} color="#3498db" />
              </TouchableOpacity>
            </View>
          ))}

          {selectedAttributes.length < attributes.length && (
            <TouchableOpacity
              style={styles.addMoreButton}
              onPress={handleAddAttribute}
            >
              <Text style={styles.addMoreText}>ADD MORE</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Player List */}
        <View style={styles.section}>
          <View style={styles.playerListHeader}>
            <Text style={styles.sectionTitle}>PLAYER LIST</Text>
            <TouchableOpacity onPress={() => router.navigate("/invite-player")}>
              <Text style={styles.inviteText}>INVITE PLAYERS</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.playerList}>
            {selectedPlayers.map((player: any) => (
              <View key={player._id} style={styles.playerItem}>
                <Image
                  source={{
                    uri:
                      player.profileImage ||
                      `https://avatar.iran.liara.run/username?username=${player.firstName}+${player.lastName}`,
                  }}
                  style={styles.playerImage}
                />
                {player?.rating ? (
                  <View style={styles.playerRating}>
                    <Text style={styles.ratingText}>
                      {player?.rating || ""}
                    </Text>
                  </View>
                ) : null}

                <Text style={styles.playerName}>
                  {player?.firstName || ""}
                  {player?.lastName || ""}
                </Text>
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
          style={[
            styles.createButton,
            isPending && styles.createButtonDisabled,
          ]}
          onPress={handleSubmit}
          disabled={isPending}
        >
          {isPending ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.createButtonText}>CREATE ACTIVITY</Text>
          )}
        </TouchableOpacity>

        {/* Bottom padding */}
        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* Modals */}
      {renderGameTypeModal()}
      {renderAttributeModal()}
      {renderOptionsModal()}
    </View>
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
    flexDirection: "column",
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
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#f0f0f0",
    marginHorizontal: 3,
  },
  indicatorActive: {
    backgroundColor: "#3498db",
    width: 12,
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
    flexWrap: "wrap",
  },
  playerItem: {
    alignItems: "center",
    marginRight: 15,
    marginBottom: 10,
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
  createButtonDisabled: {
    backgroundColor: "#a0c4e0",
  },
  createButtonText: {
    color: "white",
    fontSize: 16,
  },
  bottomPadding: {
    height: 30,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333",
  },
  modalOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  modalOptionText: {
    fontSize: 16,
    color: "#333",
  },
  modalCancelButton: {
    marginTop: 15,
    padding: 10,
    alignItems: "center",
  },
  modalCancelButtonText: {
    color: "#e74c3c",
    fontSize: 16,
    fontWeight: "500",
  },
  attributeItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    padding: 10,
    backgroundColor: "#f8f8f8",
    borderRadius: 5,
  },
  attributeName: {
    fontWeight: "500",
    marginRight: 5,
    color: "#333",
  },
  attributeOptions: {
    flexDirection: "row",
    flexWrap: "wrap",
    flex: 1,
  },
  attributeOption: {
    backgroundColor: "#e0e0e0",
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 5,
    marginTop: 2,
  },
  attributeOptionText: {
    fontSize: 12,
    color: "#333",
  },
});

export default NewActivityScreen;
