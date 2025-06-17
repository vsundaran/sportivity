import { UpdateSkill } from "@/API/apiHandler";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import Toast from "react-native-toast-message";

const SportSelectionScreen = () => {
  const [activeTab, setActiveTab] = useState("main");
  const [selectedSport, setSelectedSport] = useState("Tennis");
  const router = useRouter();

  const queryClient = useQueryClient();

  const mainSports = [
    { name: "Tennis", icon: "tennis" },
    { name: "Badminton", icon: "badminton" },
    { name: "Walking", icon: "walk" },
    { name: "Jogging", icon: "run" },
  ];

  const { mutate, isPending } = useMutation({
    mutationFn: UpdateSkill,
    onSuccess: (response) => {
      console.log(response, "response");
      Toast.show({
        type: "success",
        text1: "Sport details updated",
      });
      queryClient.invalidateQueries({ queryKey: ["getSkills"] });
      router.replace("/skill-assessment");
    },
    onError: (error) => {
      Toast.show({
        type: "error",
        text1: "Failed to update sport details",
        text2: error.message || "Something went wrong",
      });
    },
  });

  const otherSports: any = [
    // Future sports go here
  ];

  const renderSportItem = (sport: any) => {
    const isSelected = sport.name === selectedSport;

    return (
      <TouchableOpacity
        key={sport.name}
        style={styles.sportItem}
        onPress={() => setSelectedSport(sport.name)}
      >
        <View
          style={[
            styles.sportIconContainer,
            isSelected ? styles.selectedSportIcon : styles.unselectedSportIcon,
          ]}
        >
          <MaterialCommunityIcons
            name={sport.icon}
            size={30}
            color={isSelected ? "white" : "#9E9E9E"}
          />
        </View>
        <Text
          style={[
            styles.sportName,
            isSelected ? styles.selectedSportName : styles.unselectedSportName,
          ]}
        >
          {sport.name}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={styles.tabButton}
          onPress={() => setActiveTab("main")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "main"
                ? styles.activeTabText
                : styles.inactiveTabText,
            ]}
          >
            MAIN SPORTS
          </Text>
          {activeTab === "main" && <View style={styles.activeTabIndicator} />}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tabButton}
          onPress={() => setActiveTab("other")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "other"
                ? styles.activeTabText
                : styles.inactiveTabText,
            ]}
          >
            OTHER SPORTS
          </Text>
          {activeTab === "other" && <View style={styles.activeTabIndicator} />}
        </TouchableOpacity>
      </View>

      {/* Sports Grid */}
      <View style={styles.sportsGrid}>
        {
          activeTab === "main" ? (
            mainSports.map((sport) => renderSportItem(sport))
          ) : (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
              }}
            >
              <Text style={{ textAlign: "center", marginTop: 30 }}>
                No other sports available yet.
              </Text>
            </View>
          )
          // otherSports.map((sport: any) => renderSportItem(sport))
        }
      </View>

      {/* Continue Button */}
      <TouchableOpacity
        style={styles.continueButton}
        onPress={() => mutate({ primarySport: selectedSport })}
      >
        {isPending ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.continueButtonText}>CONTINUE</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "500",
    color: "#2196F3",
    marginRight: 40,
  },
  tabContainer: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
  },
  tabButton: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 16,
    position: "relative",
  },
  tabText: {
    fontSize: 16,
    fontWeight: "600",
  },
  activeTabText: {
    color: "#2196F3",
  },
  inactiveTabText: {
    color: "#9E9E9E",
  },
  activeTabIndicator: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: "#2196F3",
  },
  sportsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 16,
    justifyContent: "space-around",
  },
  sportItem: {
    alignItems: "center",
    margin: 16,
    width: 100,
  },
  sportIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  selectedSportIcon: {
    backgroundColor: "#D32F2F",
  },
  unselectedSportIcon: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  sportName: {
    fontSize: 16,
    fontWeight: "500",
    textAlign: "center",
  },
  selectedSportName: {
    color: "#D32F2F",
  },
  unselectedSportName: {
    color: "black",
  },
  continueButton: {
    backgroundColor: "#2196F3",
    margin: 16,
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    position: "absolute",
    bottom: 16,
    left: 16,
    right: 16,
  },
  continueButtonText: {
    fontSize: 16,
    color: "white",
  },
});

export default SportSelectionScreen;
