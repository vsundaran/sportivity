import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  PanResponder,
  Animated,
  GestureResponderEvent,
  PanResponderGestureState,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const SkillAssessmentSummary = () => {
  // Initial skill ratings
  const [skillRatings, setSkillRatings] = useState([
    { name: "FOREHAND", score: 7.5, color: "#F9A825" },
    { name: "BACKHAND", score: 2.0, color: "#8D6E63" },
    { name: "SERVE", score: 8.0, color: "#F9A825" },
    { name: "VOLLEY", score: 0, color: "#9E9E9E" },
    { name: "LOB/SMASH", score: 0, color: "#9E9E9E" },
  ]);

  const renderSkillBar = (skill: any, index: any) => {
    const panRef = useRef(new Animated.ValueXY()).current;
    const initialX = (skill.score / 10) * 100;

    const panResponder = useRef(
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onPanResponderGrant: () => {
          panRef.setOffset({
            x: panRef.x._value,
            y: 0,
          });
          panRef.setValue({ x: 0, y: 0 });
        },
        onPanResponderMove: (_, gestureState) => {
          // Calculate the new position within the bar's bounds
          const barWidth = 100; // percentage width
          const newX = Math.min(
            Math.max(initialX + gestureState.dx / 3, 0),
            barWidth
          );
          panRef.x.setValue(newX - initialX);
        },
        onPanResponderRelease: (_, gestureState) => {
          // Calculate the final score based on position
          const barWidth = 100; // percentage width
          const newPosition = Math.min(
            Math.max(initialX + gestureState.dx / 3, 0),
            barWidth
          );
          const newScore = parseFloat(((newPosition / 100) * 10).toFixed(1));

          // Update the score in state
          const newSkillRatings = [...skillRatings];
          newSkillRatings[index] = {
            ...skill,
            score: newScore,
            color:
              newScore > 0 ? (newScore < 5 ? "#8D6E63" : "#F9A825") : "#9E9E9E",
          };
          setSkillRatings(newSkillRatings);

          // Reset the animated value
          panRef.flattenOffset();
        },
      })
    ).current;

    // Calculate the position for the marker
    const markerPosition = Animated.add(panRef.x, new Animated.Value(initialX));

    const animatedStyle = {
      left: markerPosition.interpolate({
        inputRange: [0, 100],
        outputRange: ["0%", "100%"],
        extrapolate: "clamp",
      }),
    };

    return (
      <View key={skill.name} style={styles.skillBarContainer}>
        <View style={styles.skillBar}>
          <View style={styles.skillBarBackground} />
          <Animated.View
            style={[
              styles.skillBarProgress,
              {
                width: markerPosition.interpolate({
                  inputRange: [0, 100],
                  outputRange: ["0%", "100%"],
                  extrapolate: "clamp",
                }),
              },
            ]}
          />
          {skill.score > 0 ? (
            <Animated.View
              {...panResponder.panHandlers}
              style={[
                styles.skillScoreMarker,
                animatedStyle,
                { backgroundColor: skill.color },
              ]}
            >
              <Text style={styles.skillScoreText}>
                {skill.score.toFixed(1)}
              </Text>
            </Animated.View>
          ) : (
            <Animated.View
              {...panResponder.panHandlers}
              style={[styles.zeroScoreMarker, animatedStyle]}
            >
              <Text style={styles.zeroScoreText}>0</Text>
            </Animated.View>
          )}
        </View>
        <Text style={styles.skillName}>{skill.name}</Text>
      </View>
    );
  };

  // Calculate average score for the level indicator
  const averageScore =
    skillRatings.reduce((sum, skill) => sum + skill.score, 0) /
    skillRatings.length;
  const formattedAverage = averageScore.toFixed(1);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Skill Assessment Summary</Text>
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        <Text style={styles.sectionTitle}>SKILL SUMMARY</Text>

        {/* Tennis Icon and Title */}
        <View style={styles.sportContainer}>
          <View style={styles.sportIconContainer}>
            <MaterialCommunityIcons name="tennis" size={30} color="white" />
          </View>
          <Text style={styles.sportName}>TENNIS</Text>
        </View>

        {/* Bronze Level */}
        <View style={styles.levelContainer}>
          <View style={styles.levelScoreContainer}>
            <Text style={styles.levelScore}>{formattedAverage}</Text>
          </View>
          <View style={styles.levelInfoContainer}>
            <Text style={styles.levelName}>BRONZE</Text>
            <Text style={styles.levelDescription}>
              Congrats on making it to the Bronze zone for tennis, you are all
              set to explore activities.
            </Text>
          </View>
        </View>

        {/* Skill Bars */}
        <View style={styles.skillBarsContainer}>
          {skillRatings.map((skill, index) => renderSkillBar(skill, index))}
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.exploreButton}>
          <Text style={styles.exploreButtonText}>EXPLORE ACTIVITIES</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "500",
    color: "#2196F3",
    marginRight: 40, // To offset the back button and center the title
  },
  content: {
    flex: 1,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#424242",
    marginBottom: 16,
  },
  sportContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  sportIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#FFC107",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  sportName: {
    fontSize: 20,
    fontWeight: "bold",
  },
  levelContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  levelScoreContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#FFC107",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  levelScore: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
  levelInfoContainer: {
    flex: 1,
  },
  levelName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  levelDescription: {
    fontSize: 14,
    color: "#616161",
    lineHeight: 20,
  },
  skillBarsContainer: {
    marginTop: 16,
  },
  skillBarContainer: {
    marginBottom: 24,
  },
  skillBar: {
    height: 6,
    marginBottom: 4,
    position: "relative",
  },
  skillBarBackground: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 6,
    backgroundColor: "#E0E0E0",
    borderRadius: 3,
  },
  skillBarProgress: {
    position: "absolute",
    left: 0,
    height: 6,
    backgroundColor: "#2196F3",
    borderRadius: 3,
  },
  skillScoreMarker: {
    position: "absolute",
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#FFC107",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: -18,
    top: -15,
    zIndex: 10,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  skillScoreText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
  },
  zeroScoreMarker: {
    position: "absolute",
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#9E9E9E",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: -18,
    top: -15,
    zIndex: 10,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  zeroScoreText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
  },
  skillName: {
    fontSize: 12,
    color: "#757575",
    marginTop: 8,
  },
  footer: {
    padding: 16,
    backgroundColor: "#F5F7FA",
  },
  exploreButton: {
    backgroundColor: "#2196F3",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  exploreButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default SkillAssessmentSummary;
