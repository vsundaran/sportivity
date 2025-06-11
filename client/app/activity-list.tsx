import { GetActivity } from "@/API/apiHandler";
import ActivityListSkeleton from "@/components/UI/loading/activityList";
import {
  Ionicons,
  MaterialCommunityIcons
} from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";


// Filter options
const sportOptions = ["Sport", "Tennis", "Badminton", "Running", "Swimming"];
const timeOptions = ["Time", "Morning", "Afternoon", "Evening"];
const clubOptions = ["My Clubs", "All Clubs", "Favorites"];

const ActivitiesList = () => {

  const { data, isLoading } = useQuery({
    queryKey: ["getActivity"],
    queryFn: GetActivity,
  });
  const activityResponse: any = data || null;

  const activities: any = activityResponse?.activities || [];

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


  if (isLoading) return <ActivityListSkeleton />

  return (
    <View style={{ flex: 1 }}>
      {/* Activities List */}
      <ScrollView style={styles.activitiesList}>
        {activities?.map((activity: any) => (
          <View key={activity._id} style={styles.activityCard}>
            {/* Card Header */}
            <View style={[styles.cardHeader, { backgroundColor: activity?.color || "#2196F3" }]}>
              {/* Activity Icon */}

              <View style={styles.activityIconContainer}>
                {getIconComponent(activity.sport.toLowerCase())}
              </View>

              {/* Header Content */}
              <View style={styles.headerContent}>
                <Text style={styles.activityTitle}>{activity.sport} - {activity.gameType}</Text>

                <View style={styles.locationContainer}>
                  <Ionicons name="location-outline" style={{ marginTop: 3 }} size={16} color="white" />
                  <Text style={styles.locationText}>{activity?.venue?.address || ""}</Text>
                </View>

                {
                  activity.attributes.find((attr: any) => attr.name === "Skill Level")?.selectedOptions[0] ? <View style={styles.ratingContainer}>
                    <Text style={styles.ratingText}>
                      {activity.attributes.find((attr: any) => attr.name === "Skill Level")?.selectedOptions[0]} Skill Level
                    </Text>
                  </View> : null
                }

              </View>

              {/* Bookmark */}
              <TouchableOpacity
                style={styles.bookmarkButton}
                onPress={() => toggleBookmark(activity._id)}
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
                    {new Date(activity.date).toLocaleDateString()},{"\n"}
                    {new Date(activity.date).toLocaleDateString(undefined, { weekday: 'long' })}
                  </Text>
                </View>

                <View style={[styles.detailColumn, styles.middleColumn]}>
                  <Ionicons name="time-outline" size={20} color="#757575" />
                  <Text style={styles.detailText}>
                    {new Date(activity.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    {"\n"}({activity.duration} hrs)
                  </Text>
                </View>

                <View style={styles.detailColumn}>
                  <Ionicons name="people-outline" size={20} style={{ marginLeft: 10 }} color="#757575" />
                  <Text style={styles.detailText}>
                    {activity.playerSlots - activity.players.length} Available
                    {"\n"}
                    {activity.playerSlots} Total
                  </Text>
                </View>
              </View>

              {/* Status Indicators */}
              <View style={styles.statusContainer}>
                <View style={styles.statusItem}>
                  <Ionicons
                    name="cash-outline"
                    size={18}
                    color={activity.isPaidActivity ? "#4CAF50" : "#BDBDBD"}
                  />
                  <Text
                    style={[
                      styles.statusText,
                      { color: activity.isPaidActivity ? "#4CAF50" : "#BDBDBD" },
                    ]}
                  >
                    Paid
                  </Text>
                </View>

                <View style={styles.statusItem}>
                  <Ionicons
                    name="checkmark-circle-outline"
                    size={18}
                    color={activity.isPlaying ? "#2196F3" : "#BDBDBD"}
                  />
                  <Text
                    style={[
                      styles.statusText,
                      { color: activity.isPlaying ? "#2196F3" : "#BDBDBD" },
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
        // onPress={() => router.navigate("/invite-player")}
        onPress={() => router.navigate("/create-activity")}
      // onPress={() => router.navigate("/test")}
      >
        <Ionicons name="add" size={24} color="white" />
      </TouchableOpacity>

    </View>
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
    color: "white",
    marginBottom: 4,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
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
    // borderTopWidth: 1,
    // borderTopColor: "#EEEEEE",
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
    // borderLeftWidth: 1,
    // borderRightWidth: 1,
    // borderLeftColor: "#EEEEEE",
    // borderRightColor: "#EEEEEE",
    // paddingHorizontal: 16,
    justifyContent: "center",
  },
});

export default ActivitiesList;
