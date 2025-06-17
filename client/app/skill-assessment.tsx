import { GetSkills, GetUserSkill, UpdateSkill } from "@/API/apiHandler";
import SkeletonSkillAssessmentSummary from "@/components/UI/loading/skillAssessmentSummery";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Toast from "react-native-toast-message";

interface Skill {
  _id: string;
  name: string;
  description: string;
  weight: number;
  score?: number;
  color?: string;
}

interface UserSkill {
  _id: string;
  userId: string;
  level: string;
  primarySport: string;
  score: number;
  skills: Array<{
    name: string;
    score: number;
    _id: string;
  }>;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface SkillsData {
  _id: string;
  name: string;
  icon: string;
  skills: Skill[];
}

const SkillAssessmentSummary = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["getSkills"],
    queryFn: GetSkills,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });

  const { data: getUserSkillData, isLoading: getUserDataLoading } = useQuery({
    queryKey: ["getUserSkill"],
    queryFn: GetUserSkill,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });

  const skillsListData: SkillsData = data?.data || {};
  const userSkillData: UserSkill = getUserSkillData?.data || {};

  const skills = useMemo(() => {
    return (
      skillsListData?.skills?.map((skill) => {
        // Find the corresponding skill in user's data
        const userSkill = userSkillData?.skills?.find(
          (userSkill) => userSkill.name === skill.name
        );

        const score = userSkill?.score || 0;

        return {
          ...skill,
          score: score,
          color: score > 0 ? (score < 5 ? "#8D6E63" : "#F9A825") : "#9E9E9E",
        };
      }) || []
    );
  }, [skillsListData?.skills, userSkillData?.skills]);

  const [skillRatings, setSkillRatings] = useState<Skill[]>(skills);

  useEffect(() => {
    if (skills.length > 0) {
      setSkillRatings(skills);
    }
  }, [skills]);

  const router = useRouter();

  const handleValueChange = (value: number, index: number) => {
    const newSkillRatings = [...skillRatings];
    newSkillRatings[index] = {
      ...newSkillRatings[index],
      score: value,
      color: value > 0 ? (value < 5 ? "#8D6E63" : "#F9A825") : "#9E9E9E",
    };
    setSkillRatings(newSkillRatings);
  };

  const { mutate } = useMutation({
    mutationFn: UpdateSkill,
    onSuccess: (response) => {
      Toast.show({
        type: "success",
        text1: "Sport details updated",
      });
      router.replace("/activity-list");
    },
    onError: (error) => {
      Toast.show({
        type: "error",
        text1: "Failed to update sport details",
        text2: error.message || "Something went wrong",
      });
    },
  });

  const handlePress = () => {
    const averageScore =
      skillRatings.reduce(
        (sum: number, skill: any) => sum + (skill.score || 0),
        0
      ) / (skillRatings.length || 1);

    let level = "";
    if (averageScore < 3) {
      level = "beginner";
    } else if (averageScore < 6) {
      level = "bronze";
    } else if (averageScore < 8) {
      level = "silver";
    } else {
      level = "gold";
    }

    const skillsForApi = skillRatings.map((skill: any) => ({
      name: skill.name,
      score: skill.score,
    }));

    mutate({
      level: level,
      score: averageScore,
      skills: skillsForApi,
    });
  };

  const renderSkillBar = (skill: Skill, index: number) => {
    return (
      <View key={skill._id} style={styles.skillBarContainer}>
        <View style={styles.sliderContainer}>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={10}
            step={0.1}
            value={skill.score || 0}
            onValueChange={(value) => handleValueChange(value, index)}
            minimumTrackTintColor="#2196F3"
            maximumTrackTintColor="#E0E0E0"
            thumbTintColor={skill.color}
          />
          <View style={styles.sliderValueContainer}>
            <Text style={styles.sliderValue}>
              {(skill.score || 0).toFixed(1)}
            </Text>
          </View>
        </View>
        <Text style={styles.skillName}>{skill.name}</Text>
      </View>
    );
  };

  // Calculate average score for the level indicator
  const averageScore =
    userSkillData?.score ||
    skillRatings.reduce(
      (sum: number, skill: any) => sum + (skill.score || 0),
      0
    ) / (skillRatings.length || 1);

  const formattedAverage = averageScore.toFixed(1);

  // Determine level based on average score
  const getLevelName = (score: number) => {
    if (score < 3) return "BEGINNER";
    if (score < 6) return "BRONZE";
    if (score < 8) return "SILVER";
    return "GOLD";
  };

  const levelName = getLevelName(averageScore);
  const sportIcon: any = skillsListData?.icon || "";
  const sportName: any =
    userSkillData?.primarySport || skillsListData?.name || "";

  if (isLoading || getUserDataLoading)
    return <SkeletonSkillAssessmentSummary />;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        <ScrollView style={styles.scrollView}>
          <View style={styles.content}>
            <Text style={styles.sectionTitle}>SKILL SUMMARY</Text>

            <View style={styles.sportContainer}>
              <View style={styles.sportIconContainer}>
                <MaterialCommunityIcons
                  name={sportIcon}
                  size={30}
                  color="white"
                />
              </View>
              <Text style={styles.sportName}>{sportName.toUpperCase()}</Text>
            </View>

            <View style={styles.levelContainer}>
              <View style={styles.levelScoreContainer}>
                <Text style={styles.levelScore}>{formattedAverage}</Text>
              </View>
              <View style={styles.levelInfoContainer}>
                <Text style={styles.levelName}>{levelName}</Text>
                <Text style={styles.levelDescription}>
                  {levelName === "BEGINNER"
                    ? "You're just starting out, keep practicing to improve your skills!"
                    : levelName === "BRONZE"
                    ? "Congrats on making it to the Bronze zone, you are all set to explore activities."
                    : levelName === "SILVER"
                    ? "Great job! You've reached the Silver level with solid skills."
                    : "Excellent! You've achieved the Gold level with advanced skills."}
                </Text>
              </View>
            </View>

            <View style={styles.skillBarsContainer}>
              {skillRatings.map((skill: Skill, index: number) =>
                renderSkillBar(skill, index)
              )}
            </View>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.exploreButton} onPress={handlePress}>
            <Text style={styles.exploreButtonText}>EXPLORE ACTIVITIES</Text>
          </TouchableOpacity>
        </View>
      </View>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
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
    marginRight: 40,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  skillDescription: {
    fontSize: 12,
    color: "#9E9E9E",
    marginTop: 4,
    fontStyle: "italic",
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
    marginBottom: 32,
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
    marginBottom: 34,
  },
  sliderContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  slider: {
    flex: 1,
    height: 10,
  },
  sliderValueContainer: {
    width: 40,
    alignItems: "center",
  },
  sliderValue: {
    fontSize: 14,
    fontWeight: "bold",
  },
  skillName: {
    fontSize: 12,
    color: "#757575",
    marginTop: 0,
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
    fontSize: 16,
    color: "white",
  },
});

export default SkillAssessmentSummary;
