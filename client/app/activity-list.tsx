import {
  GetActivity,
  RemoveSavedActivity,
  SaveActivity,
} from "@/API/apiHandler";
import ActivityListSkeleton from "@/components/UI/loading/activityList";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

const ActivitiesList = () => {
  const {
    data: activityResponse,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["activities"],
    queryFn: GetActivity,
  });

  const queryClient = useQueryClient();
  const router = useRouter();

  // Optimistic update mutation for bookmark toggle
  const { mutate: toggleBookmark } = useMutation({
    mutationFn: async ({
      activityId,
      isCurrentlySaved,
    }: {
      activityId: string;
      isCurrentlySaved: boolean;
    }) => {
      return isCurrentlySaved
        ? RemoveSavedActivity({ activityId })
        : SaveActivity({ activityId });
    },
    onMutate: async ({ activityId, isCurrentlySaved }) => {
      // Cancel any outgoing refetches to avoid overwriting our optimistic update
      await queryClient.cancelQueries({ queryKey: ["activities"] });

      // Snapshot the previous value
      const previousActivities = queryClient.getQueryData(["activities"]);

      // Optimistically update to the new value
      queryClient.setQueryData(["activities"], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          activities: old.activities.map((activity: any) =>
            activity._id === activityId
              ? { ...activity, isSaved: !isCurrentlySaved }
              : activity
          ),
        };
      });

      // Return a context object with the snapshotted value
      return { previousActivities };
    },
    onError: (error, variables, context) => {
      // Rollback to the previous value if mutation fails
      if (context?.previousActivities) {
        queryClient.setQueryData(["activities"], context.previousActivities);
      }
      Toast.show({
        type: "error",
        text1: "Failed to update bookmark",
        text2: error?.message || "Something went wrong",
      });
    },
    onSettled: () => {
      // Always refetch after error or success to ensure our server state is correct
      queryClient.invalidateQueries({ queryKey: ["activities"] });
    },
  });
  const activityList: any = activityResponse;
  const activities = activityList?.activities || [];
  //console.log(activities, "activities");
  //console.log(activityResponse, "activityResponse");

  const getIconComponent = (iconName: string) => {
    switch (iconName.toLowerCase()) {
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

  if (isLoading) {
    return <ActivityListSkeleton />;
  }

  if (isError) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Failed to load activities</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() =>
            queryClient.invalidateQueries({ queryKey: ["activities"] })
          }
        >
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (activities.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No activities found</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={styles.activitiesList}>
        {activities.map((activity: any) => (
          <View key={activity._id} style={styles.activityCard}>
            {/* Card Header */}
            <View
              style={[
                styles.cardHeader,
                { backgroundColor: activity?.color || "#2196F3" },
              ]}
            >
              <View style={styles.activityIconContainer}>
                {getIconComponent(activity.sport)}
              </View>

              <View style={styles.headerContent}>
                <Text style={styles.activityTitle}>
                  {activity.sport} - {activity.gameType}
                </Text>

                <View style={styles.locationContainer}>
                  <Ionicons
                    name="location-outline"
                    style={{ marginTop: 3 }}
                    size={16}
                    color="white"
                  />
                  <Text style={styles.locationText}>
                    {activity?.venue?.address || ""}
                  </Text>
                </View>

                {activity.attributes.find(
                  (attr: any) => attr.name === "Skill Level"
                )?.selectedOptions[0] && (
                  <View style={styles.ratingContainer}>
                    <Text style={styles.ratingText}>
                      {
                        activity.attributes.find(
                          (attr: any) => attr.name === "Skill Level"
                        )?.selectedOptions[0]
                      }{" "}
                      Skill Level
                    </Text>
                  </View>
                )}
              </View>

              <TouchableOpacity
                style={styles.bookmarkButton}
                onPress={() =>
                  toggleBookmark({
                    activityId: activity._id,
                    isCurrentlySaved: activity.isSaved,
                  })
                }
                disabled={activity.isBookmarkUpdating}
              >
                <Ionicons
                  name={activity.isSaved ? "bookmark" : "bookmark-outline"}
                  size={24}
                  color="white"
                />
              </TouchableOpacity>
            </View>

            {/* Card Details */}
            <View style={styles.cardDetails}>
              <View style={styles.detailsRow}>
                <View style={styles.detailColumn}>
                  <Ionicons name="calendar-outline" size={20} color="#757575" />
                  <Text style={styles.detailText}>
                    {new Date(activity.date).toLocaleDateString()},{"\n"}
                    {new Date(activity.date).toLocaleDateString(undefined, {
                      weekday: "long",
                    })}
                  </Text>
                </View>

                <View style={[styles.detailColumn, styles.middleColumn]}>
                  <Ionicons name="time-outline" size={20} color="#757575" />
                  <Text style={styles.detailText}>
                    {new Date(activity.date).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                    {"\n"}({activity.duration} hrs)
                  </Text>
                </View>

                <View style={styles.detailColumn}>
                  <Ionicons
                    name="people-outline"
                    size={20}
                    style={{ marginLeft: 10 }}
                    color="#757575"
                  />
                  <Text style={styles.detailText}>
                    {activity.playerSlots} Total
                  </Text>
                </View>
              </View>

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
                      {
                        color: activity.isPaidActivity ? "#4CAF50" : "#BDBDBD",
                      },
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

      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.navigate("/create-activity")}
      >
        <Ionicons name="add" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: "#FF3B30",
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: "#2196F3",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  retryButtonText: {
    color: "white",
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#757575",
  },
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
