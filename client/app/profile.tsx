import ProfileLoadingSkeleton from "@/components/UI/loading/Profile";
import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { ActivityIndicator } from "react-native-paper";
import { GetProfile, GetSkills, UpdateProfile } from "../API/apiHandler";
import Toast from "react-native-toast-message";
import LocationSelector from "@/components/UI/map";

export default function ProfileScreen() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [yearOfBirth, setYearOfBirth] = useState("");
  const [bio, setBio] = useState("");
  const [country, setCountry] = useState("India");
  const [gender, setGender] = useState("");
  const [showYearPicker, setShowYearPicker] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const router = useRouter();

  const { data, isLoading } = useQuery({
    queryKey: ["getProfile"],
    queryFn: GetProfile,
  });

  const { data: GetSkillsData } = useQuery({
    queryKey: ["getSkills"],
    queryFn: GetSkills,
  });
  const skillsStails: any = GetSkillsData;

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (formData: FormData) => UpdateProfile(formData),
    onSuccess: () => {
      Toast.show({
        type: "success",
        text1: "Profile updated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["getProfile"] });
      if (skillsStails?.name) {
        router.replace("/activity-list");
      } else {
        router.replace("/pic-sport");
      }
    },
    onError: (error) => {
      Toast.show({
        type: "error",
        text1: "Failed to update profile",
        text2: error?.message || "Something went wrong",
      });
    },
  });

  const handleSave = () => {
    const formData = new FormData();

    formData.append("firstName", firstName);
    formData.append("lastName", lastName);
    formData.append("gender", gender.toLowerCase());
    formData.append("yearOfBirth", yearOfBirth);
    formData.append("shortBio", bio);
    formData.append("country", country);
    formData.append("location", JSON.stringify(location));

    console.log(JSON.stringify(location), "JSON.stringify(location)");

    if (profileImage) {
      formData.append("profileImage", {
        uri: profileImage,
        name: "profile.jpg",
        type: "image/jpeg",
      } as any);
    }

    mutation.mutate(formData);
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  React.useEffect(() => {
    console.log(data, "data");
    if (data?.success) {
      const profileData = data.user;
      setFirstName(profileData.firstName || "");
      setLastName(profileData.lastName || "");
      setEmail(profileData.email || "");
      setYearOfBirth(profileData.yearOfBirth || "");
      setBio(profileData.shortBio || "");
      setCountry(profileData.country || "India");
      setGender(
        profileData.gender
          ? profileData.gender.charAt(0).toUpperCase() +
              profileData.gender.slice(1)
          : ""
      );
      if (profileData.profileImage) {
        setProfileImage(profileData.profileImage);
      }
      if (profileData.location) {
        setLocation({
          latitude: profileData.location.latitude,
          longitude: profileData.location.longitude,
          address: profileData.location.address,
        });
      }
    }
  }, [data]);

  const currentYear = new Date().getFullYear();
  const years = Array.from(
    { length: currentYear - 1974 },
    (_, i) => 1975 + i
  ).reverse();

  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
    address?: string;
  } | null>(null);

  const selectLocation = (coords: {
    address: string;
    latitude: number;
    longitude: number;
  }) => {
    setLocation(coords);
  };

  if (isLoading) return <ProfileLoadingSkeleton />;

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.photoContainer}>
          <TouchableOpacity style={styles.photoButton} onPress={pickImage}>
            {profileImage ? (
              <Image
                source={{ uri: profileImage }}
                style={styles.profileImage}
              />
            ) : (
              <View style={styles.photoPlaceholder}>
                <Ionicons name="camera" size={24} color="white" />
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Rest of the form remains the same */}
        <View style={styles.formContainer}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>FIRST NAME</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter first name"
              value={firstName}
              onChangeText={setFirstName}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>LAST NAME</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter last name"
              value={lastName}
              onChangeText={setLastName}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>EMAIL</Text>
            <TextInput
              readOnly
              style={styles.input}
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>YEAR OF BIRTH</Text>
            <TouchableOpacity
              style={styles.dateInput}
              onPress={() => setShowYearPicker(true)}
            >
              <Text
                style={
                  yearOfBirth
                    ? {
                        fontSize: 16,
                      }
                    : styles.dateInputText
                }
              >
                {yearOfBirth || "Year"}
              </Text>
              <Ionicons name="calendar-outline" size={20} color="gray" />
            </TouchableOpacity>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>SHORT BIO</Text>
            <TextInput
              style={{ ...styles.input, height: 88 }}
              placeholder="Enter short bio"
              value={bio}
              onChangeText={setBio}
              multiline
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>LOCATION</Text>
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
                value={data?.user?.location || {}}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>COUNTRY</Text>
            <View style={[styles.dropdownInput, styles.disabledInput]}>
              <Text style={styles.dropdownText}>India</Text>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>GENDER</Text>
            <View style={styles.genderButtons}>
              <TouchableOpacity
                style={[
                  styles.genderButton,
                  gender === "Male" && styles.genderButtonActive,
                ]}
                onPress={() => setGender("Male")}
              >
                <Text
                  style={[
                    styles.genderButtonText,
                    gender === "Male" && styles.genderButtonTextActive,
                  ]}
                >
                  Male
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.genderButton,
                  gender === "Female" && styles.genderButtonActive,
                ]}
                onPress={() => setGender("Female")}
              >
                <Text
                  style={[
                    styles.genderButtonText,
                    gender === "Female" && styles.genderButtonTextActive,
                  ]}
                >
                  Female
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Year Picker Modal */}
      <Modal
        visible={showYearPicker}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowYearPicker(false)}
      >
        <TouchableWithoutFeedback onPress={() => setShowYearPicker(false)}>
          <View style={styles.modalOverlay} />
        </TouchableWithoutFeedback>

        <View style={styles.modalContent}>
          <ScrollView>
            {years.map((year) => (
              <TouchableOpacity
                key={year}
                style={styles.yearItem}
                onPress={() => {
                  setYearOfBirth(year.toString());
                  setShowYearPicker(false);
                }}
              >
                <Text style={styles.yearText}>{year}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </Modal>

      {/* Save Button */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          {mutation.isPending ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.saveButtonText}>SAVE</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "500",
    color: "#2196F3",
  },
  scrollView: {
    flex: 1,
  },
  photoContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 24,
    backgroundColor: "#f5f7fa",
  },
  photoButton: {
    width: 100,
    height: 100,
    borderRadius: 50,
    overflow: "hidden",
  },
  profileImage: {
    width: "100%",
    height: "100%",
    borderRadius: 50,
  },
  photoPlaceholder: {
    width: "100%",
    height: "100%",
    backgroundColor: "#a9c4d9",
    alignItems: "center",
    justifyContent: "center",
  },
  formContainer: {
    padding: 16,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#555",
    marginBottom: 8,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 4,
    paddingHorizontal: 12,
    fontSize: 16,
  },
  disabledInput: {
    backgroundColor: "#f5f5f5",
  },
  dateInput: {
    height: 48,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 4,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dateInputText: {
    fontSize: 16,
    color: "#999",
    borderColor: "wihte",
  },
  dropdownInput: {
    height: 48,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 4,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dropdownText: {
    fontSize: 16,
  },
  genderButtons: {
    flexDirection: "row",
    gap: 12,
  },
  genderButton: {
    flex: 1,
    height: 48,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  genderButtonActive: {
    backgroundColor: "#2196F3",
    borderColor: "#2196F3",
  },
  genderButtonText: {
    fontSize: 16,
    color: "#333",
  },
  genderButtonTextActive: {
    color: "#fff",
  },
  footer: {
    padding: 16,
    backgroundColor: "#f5f7fa",
  },
  saveButton: {
    height: 48,
    backgroundColor: "#2196F3",
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  saveButtonText: {
    fontSize: 16,
    color: "#fff",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    maxHeight: "50%",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    padding: 20,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  yearItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  yearText: {
    fontSize: 18,
    textAlign: "center",
  },
});
