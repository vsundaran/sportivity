"use client";

import {
  FontAwesome5,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// Activity type definition
type Activity = {
  id: string;
  title: string;
  location: string;
  skillRating: number;
  date: string;
  day: string;
  time: string;
  duration: string;
  available: number;
  total: number;
  isPaid: boolean;
  isClub: boolean;
  isBooked: boolean;
  isBookmarked: boolean;
  color: string;
  icon: string;
};

// Sample data
const activities: Activity[] = [
  {
    id: "1",
    title: "Doubles by James D",
    location: "Sun Park Club, Singapore",
    skillRating: 3.0,
    date: "June 17",
    day: "Sunday",
    time: "10:30 AM",
    duration: "2hrs",
    available: 4,
    total: 8,
    isPaid: true,
    isClub: true,
    isBooked: true,
    isBookmarked: true,
    color: "#1E88E5",
    icon: "tennis",
  },
  {
    id: "2",
    title: "Doubles by Ceylon Spo...",
    location: "Ceylon Sports Club, 101 Bal...",
    skillRating: 3.6,
    date: "June 17",
    day: "Sunday",
    time: "10:30 AM",
    duration: "2hrs",
    available: 4,
    total: 8,
    isPaid: true,
    isClub: true,
    isBooked: false,
    isBookmarked: false,
    color: "#4CAF50",
    icon: "badminton",
  },
  {
    id: "3",
    title: "Singles by Mary Lou",
    location: "Woodlands ActiveSG Spor...",
    skillRating: 4.5,
    date: "June 17",
    day: "Sunday",
    time: "10:30 AM",
    duration: "2hrs",
    available: 4,
    total: 8,
    isPaid: true,
    isClub: false,
    isBooked: false,
    isBookmarked: false,
    color: "#FF9800",
    icon: "tennis",
  },
  {
    id: "4",
    title: "Singles by Mary Lou",
    location: "Woodlands ActiveSG Spor...",
    skillRating: 4.5,
    date: "June 17",
    day: "Sunday",
    time: "10:30 AM",
    duration: "2hrs",
    available: 4,
    total: 8,
    isPaid: false,
    isClub: false,
    isBooked: false,
    isBookmarked: false,
    color: "#9C27B0",
    icon: "running",
  },
  {
    id: "5",
    title: "Doubles by Ceylon Spo...",
    location: "Ceylon Sports Club, 101 Bal...",
    skillRating: 3.6,
    date: "June 17",
    day: "Sunday",
    time: "10:30 AM",
    duration: "2hrs",
    available: 4,
    total: 8,
    isPaid: false,
    isClub: true,
    isBooked: false,
    isBookmarked: false,
    color: "#4CAF50",
    icon: "badminton",
  },
];

// Filter options
const sportOptions = ["Sport", "Tennis", "Badminton", "Running", "Swimming"];
const timeOptions = ["Time", "Morning", "Afternoon", "Evening"];
const clubOptions = ["My Clubs", "All Clubs", "Favorites"];

const ActivitiesList = () => {
  const [selectedSport, setSelectedSport] = useState(sportOptions[0]);
  const [selectedTime, setSelectedTime] = useState(timeOptions[0]);
  const [selectedClub, setSelectedClub] = useState(clubOptions[0]);
  const [bookmarkedCount, setBookmarkedCount] = useState(5);


  const router = useRouter();

  const toggleBookmark = (id: string) => {
    // In a real app, you would update the state properly
    console.log(`Toggling bookmark for activity ${id}`);
  };

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case "tennis":
        return <MaterialCommunityIcons name="tennis" size={24} color="white" />;
      case "badminton":
        return (
          <MaterialCommunityIcons name="badminton" size={24} color="white" />
        );
      case "running":
        return (
          <MaterialCommunityIcons name="run-fast" size={24} color="white" />
        );
      default:
        return <MaterialCommunityIcons name="tennis" size={24} color="white" />;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.profileContainer}>
          <Image
            source={{ uri: "https://randomuser.me/api/portraits/men/32.jpg" }}
            style={styles.profileImage}
          />
        </View>
        <Text style={styles.headerTitle}>Activities</Text>
        <TouchableOpacity style={styles.mapButton}>
          <MaterialIcons name="map" size={24} color="#2196F3" />
        </TouchableOpacity>
      </View>

      {/* Filters */}
      <View style={styles.filtersContainer}>
        <View style={styles.filterRow}>
          <TouchableOpacity style={styles.filterButton}>
            <Text style={styles.filterText}>{selectedSport}</Text>
            <MaterialIcons name="arrow-drop-down" size={24} color="black" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.filterButton}>
            <Text style={styles.filterText}>{selectedTime}</Text>
            <MaterialIcons name="arrow-drop-down" size={24} color="black" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.filterButton}>
            <Text style={styles.filterText}>{selectedClub}</Text>
            <MaterialIcons name="arrow-drop-down" size={24} color="black" />
          </TouchableOpacity>
        </View>

        <View style={styles.bookmarkedContainer}>
          <Ionicons name="bookmark-outline" size={20} color="#757575" />
          <Text style={styles.bookmarkedText}>Bookmarked</Text>
          <Text style={styles.bookmarkedCount}>{bookmarkedCount}</Text>
          <MaterialIcons name="keyboard-arrow-down" size={24} color="#757575" />
        </View>
      </View>

      {/* Activities List */}
      <ScrollView style={styles.activitiesList}>
        {activities.map((activity) => (
          <View key={activity.id} style={styles.activityCard}>
            {/* Card Header */}
            <View
              style={[styles.cardHeader, { backgroundColor: activity.color }]}
            >
              {/* Activity Icon */}
              <View style={styles.activityIconContainer}>
                {getIconComponent(activity.icon)}
              </View>

              {/* Header Content */}
              <View style={styles.headerContent}>
                <Text style={styles.activityTitle}>{activity.title}</Text>

                <View style={styles.locationContainer}>
                  <Ionicons name="location-outline" size={16} color="white" />
                  <Text style={styles.locationText}>{activity.location}</Text>
                </View>

                <View style={styles.ratingContainer}>
                  <Text style={styles.ratingText}>
                    {activity.skillRating.toFixed(1)} Avg Skill Rating
                  </Text>
                </View>
              </View>

              {/* Bookmark */}
              <TouchableOpacity
                style={styles.bookmarkButton}
                onPress={() => toggleBookmark(activity.id)}
              >
                <Ionicons
                  name={activity.isBookmarked ? "bookmark" : "bookmark-outline"}
                  size={24}
                  color="white"
                />
              </TouchableOpacity>
            </View>

            {/* Card Details */}
            <View style={styles.cardDetails}>
              {/* Date, Time, Availability */}
              <View style={styles.detailsRow}>
                <View style={styles.detailColumn}>
                  <Ionicons name="calendar-outline" size={20} color="#757575" />
                  <Text style={styles.detailText}>
                    {activity.date},{"\n"}
                    {activity.day}
                  </Text>
                </View>

                <View style={[styles.detailColumn, styles.middleColumn]}>
                  <Ionicons name="time-outline" size={20} color="#757575" />
                  <Text style={styles.detailText}>
                    {activity.time}
                    {"\n"}({activity.duration})
                  </Text>
                </View>

                <View style={styles.detailColumn}>
                  <Ionicons name="people-outline" size={20} color="#757575" />
                  <Text style={styles.detailText}>
                    {activity.available} Available
                    {"\n"}
                    {activity.total} Total
                  </Text>
                </View>
              </View>

              {/* Status Indicators */}
              <View style={styles.statusContainer}>
                <View style={styles.statusItem}>
                  <Ionicons
                    name="cash-outline"
                    size={18}
                    color={activity.isPaid ? "#4CAF50" : "#BDBDBD"}
                  />
                  <Text
                    style={[
                      styles.statusText,
                      { color: activity.isPaid ? "#4CAF50" : "#BDBDBD" },
                    ]}
                  >
                    Paid
                  </Text>
                </View>

                <View style={styles.statusItem}>
                  <FontAwesome5
                    name="building"
                    size={16}
                    color={activity.isClub ? "#757575" : "#BDBDBD"}
                  />
                  <Text
                    style={[
                      styles.statusText,
                      { color: activity.isClub ? "#757575" : "#BDBDBD" },
                    ]}
                  >
                    Club
                  </Text>
                </View>

                <View style={styles.statusItem}>
                  <Ionicons
                    name="checkmark-circle-outline"
                    size={18}
                    color={activity.isBooked ? "#2196F3" : "#BDBDBD"}
                  />
                  <Text
                    style={[
                      styles.statusText,
                      { color: activity.isBooked ? "#2196F3" : "#BDBDBD" },
                    ]}
                  >
                    Booked
                  </Text>
                </View>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity style={styles.fab}
        onPress={() => router.navigate("/(activity)/createActivity")}
      >
        <Ionicons name="add" size={24} color="white" />
      </TouchableOpacity>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="home-outline" size={24} color="#BDBDBD" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="calendar-outline" size={24} color="#BDBDBD" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="people-outline" size={24} color="#BDBDBD" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="notifications-outline" size={24} color="#BDBDBD" />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.navItem, styles.activeNavItem]}>
          <Ionicons name="grid-outline" size={24} color="#4CAF50" />
          <View style={styles.activeIndicator} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "white",
  },
  profileContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    overflow: "hidden",
  },
  profileImage: {
    width: "100%",
    height: "100%",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2196F3",
  },
  mapButton: {
    padding: 4,
  },
  filtersContainer: {
    backgroundColor: "white",
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  filterRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 4,
    backgroundColor: "white",
  },
  filterText: {
    fontSize: 14,
    color: "#212121",
    marginRight: 4,
  },
  bookmarkedContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  bookmarkedText: {
    fontSize: 14,
    color: "#757575",
    marginLeft: 8,
  },
  bookmarkedCount: {
    fontSize: 14,
    color: "#757575",
    marginLeft: "auto",
    marginRight: 4,
  },
  activitiesList: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  activityCard: {
    backgroundColor: "white",
    borderRadius: 8,
    marginBottom: 12,
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  activityIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#9C27B0",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
    padding: 12,
  },
  activityHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  activityTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "white",
    marginBottom: 4,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  locationText: {
    fontSize: 14,
    color: "white",
    marginLeft: 4,
  },
  ratingContainer: {
    backgroundColor: "#FFC107",
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: "500",
    color: "white",
  },
  detailsContainer: {
    marginBottom: 8,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  detailText: {
    fontSize: 13,
    color: "#757575",
    marginLeft: 8,
  },
  statusContainer: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "#EEEEEE",
    paddingTop: 12,
    paddingBottom: 4,
  },
  statusItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 24,
  },
  statusText: {
    fontSize: 14,
    marginLeft: 6,
  },
  fab: {
    position: "absolute",
    right: 16,
    bottom: 80,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#F44336",
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  bottomNav: {
    flexDirection: "row",
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#EEEEEE",
    paddingVertical: 8,
  },
  navItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
  },
  activeNavItem: {
    position: "relative",
  },
  activeIndicator: {
    position: "absolute",
    bottom: 0,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#4CAF50",
  },
  cardHeader: {
    flexDirection: "row",
    padding: 16,
    backgroundColor: "#2196F3",
  },
  headerContent: {
    flex: 1,
  },
  bookmarkButton: {
    alignSelf: "flex-start",
  },
  cardDetails: {
    backgroundColor: "white",
    padding: 16,
  },
  detailsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
    paddingBottom: 16,
  },
  detailColumn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-start",
  },
  middleColumn: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderLeftColor: "#EEEEEE",
    borderRightColor: "#EEEEEE",
    paddingHorizontal: 16,
    justifyContent: "center",
  },
});

export default ActivitiesList;
