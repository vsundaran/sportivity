// import React, { useState, useEffect } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   Image,
//   Dimensions,
//   TouchableOpacity,
//   Platform,
//   ScrollView,
//   BackHandler,
//   Linking,
// } from "react-native";
// import { Button, Loader, SelectPictureView, CustomTextField } from "atoms";
// import {
//   GenderSelectionView,
//   ButtonTappedView,
//   TextInputView,
//   SelectionView,
// } from "molecules";
// import {
//   ALL_COLOR,
//   FONT,
//   SCREENNAME,
//   BUTTONNAME,
//   recordScreen,
//   recordEvent,
//   ALL_API,
// } from "constants";
// import { HeaderWhite } from "../../components/Header";
// import {
//   IC_PROFILE_HEADER,
//   IC_BACK,
//   IC_VENUE,
//   IC_PLAYER_SLOTS,
//   IC_CHECKMARK_SELECTED_USER,
//   IC_CHECKMARK_UNSELECTED_USER,
// } from "../../icon";

// const { height, width } = Dimensions.get("window");
// const profileHeight = 120;
// const pictureHeight = 100;
// const widthCompnent = width * 0.9;
// const CLASS_NAME = "MyProfileScreen";

// const MyProfileScreen = ({
//   navigation,
//   updateProfile,
//   uploadImage,
//   userData,
//   isUserProfileLoading,
//   error,
// }) => {
//   // State initialization
//   const [isAgree, setIsAgree] = useState(true);
//   const [isLoading, setIsLoading] = useState(false);
//   const [isVisible, setIsVisible] = useState(false);
//   const [genderArray, setGenderArray] = useState([]);
//   const [selectedId, setSelectedId] = useState(-1);
//   const [selectGender, setSelectGender] = useState("");
//   const [selectedCountryId, setSelectedCountryId] = useState(-1);
//   const [allCountry, setAllCountry] = useState([]);
//   const [isPreferDisclose, setIsPreferDisclose] = useState(false);
//   const [isMaleSelected, setIsMaleSelected] = useState(0);
//   const [firstName, setFirstName] = useState("");
//   const [lastName, setLastName] = useState("");
//   const [yearOfBirth, setYearOfBirth] = useState("");
//   const [shortBio, setShortBio] = useState("");
//   const [country, setCountry] = useState("");
//   const [imagePath, setImagePath] = useState("");
//   const [selectPic, setSelectPic] = useState(false);
//   const [latitude, setLatitude] = useState(0.0);
//   const [longitude, setLongitude] = useState(0.0);
//   const [venueId, setVenueId] = useState(-1);
//   const [selectedVenue, setSelectedVenue] = useState("");
//   const [lNameError, setLNameError] = useState(false);
//   const [fNameError, setFNameError] = useState(false);

//   const renderVisibleState = () => {
//     setIsVisible(true);
//     setTimeout(() => {
//       setIsVisible(false);
//     }, ALL_API.VISIBLE_LOADER_TIMEOUT);
//   };

//   useEffect(() => {
//     // Record screen view
//     recordScreen("MyProfileScreen");
//     recordEvent(CLASS_NAME, "componentDidMount", "");

//     // Initialize with user data if available
//     if (navigation.state?.params?.userInfo) {
//       const data = navigation.state.params.userInfo;
//       setFirstName(data.firstName || "");
//       setLastName(data.lastName || "");
//       setImagePath(data.photo || "");
//       setIsMaleSelected(data.gender === 0 ? 1 : 0);
//     }

//     // Add back handler
//     const backHandler = BackHandler.addEventListener(
//       "hardwareBackPress",
//       () => {
//         if (isVisible) {
//           return true;
//         }
//         renderVisibleState();
//         navigation.goBack();
//         return true;
//       }
//     );

//     // Get location
//     navigator.geolocation.getCurrentPosition(
//       (position) => {
//         setLatitude(position.coords.latitude);
//         setLongitude(position.coords.longitude);
//         // You would typically fetch location data from API here
//       },
//       (error) => console.log(error.message),
//       { enableHighAccuracy: false, timeout: 200000, maximumAge: 1000 }
//     );

//     // Cleanup
//     return () => {
//       backHandler.remove();
//     };
//   }, []);

//   // Update loading state when props change
//   useEffect(() => {
//     if (isUserProfileLoading) {
//       setIsLoading(true);
//     } else {
//       setIsLoading(false);
//     }
//   }, [isUserProfileLoading]);

//   const onLocationSelected = ({ name, location, id }) => {
//     const object = {
//       selectedVenue: name,
//       latitude: location.lat,
//       longitude: location.lng,
//       venueId: id,
//     };

//     recordEvent(
//       CLASS_NAME,
//       "onLocationSelected - CreateClub",
//       JSON.stringify(object)
//     );

//     setSelectedVenue(name);
//     setLatitude(location.lat);
//     setLongitude(location.lng);
//     setVenueId(id);
//   };

//   const renderTermsCondition = () => {
//     return (
//       <View
//         style={{
//           width: "100%",
//           backgroundColor: "transparent",
//           justifyContent: "center",
//           alignItems: "center",
//           flexDirection: "row",
//           paddingTop: 10,
//           paddingBottom: 5,
//         }}
//       >
//         <View style={{ justifyContent: "center", alignItems: "center" }}>
//           <View
//             style={{
//               justifyContent: "center",
//               alignItems: "center",
//               flexDirection: "row",
//               marginTop: 2,
//             }}
//           >
//             <Text style={styles.agreeStyle}>You are agreeing to our </Text>

//             <TouchableOpacity
//               onPress={() => {
//                 Linking.openURL(ALL_API.TERMS).catch((err) =>
//                   console.error("An error occurred", err)
//                 );
//               }}
//             >
//               <Text style={styles.agreeSELECTEDStyle}>Terms</Text>
//             </TouchableOpacity>
//             <Text style={styles.agreeStyle}> and </Text>
//             <TouchableOpacity
//               onPress={() => {
//                 Linking.openURL(ALL_API.POLICY).catch((err) =>
//                   console.error("An error occurred", err)
//                 );
//               }}
//             >
//               <Text style={styles.agreeSELECTEDStyle}>Privacy</Text>
//             </TouchableOpacity>
//           </View>
//           <Text style={[styles.agreeStyle, { marginTop: 5, marginBottom: 6 }]}>
//             Policy by tapping Continue
//           </Text>
//         </View>
//       </View>
//     );
//   };

//   const renderBottomButton = () => {
//     recordEvent(CLASS_NAME, "renderBottomButton", "");

//     // Determine if button should be disabled
//     let isDisable = true;
//     if (
//       firstName.trim() === "" ||
//       lastName.trim() === "" ||
//       selectedVenue === ""
//     ) {
//       isDisable = true;
//     } else {
//       isDisable = false;
//     }

//     if (!isAgree) {
//       isDisable = true;
//     }

//     return (
//       <View
//         style={{
//           width: "100%",
//           flexDirection: "column",
//           justifyContent: "center",
//           alignItems: "center",
//         }}
//       >
//         {renderTermsCondition()}

//         <View
//           style={
//             isDisable
//               ? styles.bottomButtonStyleDisable
//               : styles.bottomButtonStyle
//           }
//           pointerEvents={isDisable ? "none" : "auto"}
//         >
//           <Button
//             isFullWidth={true}
//             name={BUTTONNAME.continue}
//             onPress={() => {
//               if (isVisible) {
//                 return;
//               }
//               renderVisibleState();

//               // Prepare user data
//               let objUser = {
//                 firstName,
//                 lastName,
//                 genderId: selectedId,
//                 yearOfBirth,
//                 shortBio,
//                 countryId: selectedCountryId,
//               };

//               let objLocation = {
//                 placeId: venueId,
//               };
//               objUser.baseLocation = objLocation;

//               // Handle profile update logic here
//               // This would typically call updateProfile and uploadImage props
//             }}
//           />
//         </View>
//       </View>
//     );
//   };

//   const renderHeader = () => {
//     return (
//       <View style={{ width: "100%" }}>
//         <HeaderWhite
//           isLeft={false}
//           isClose={true}
//           title="My Profile"
//           onBack={() => {
//             if (isVisible) {
//               return;
//             }
//             renderVisibleState();
//             navigation.goBack();
//           }}
//         />
//       </View>
//     );
//   };

//   return (
//     <View style={styles.mainView}>
//       {renderHeader()}
//       <ScrollView
//         style={{
//           width: "100%",
//           paddingBottom: ALL_API.DEFAULT_BUTTON_SIZE * 2,
//         }}
//         showsHorizontalScrollIndicator={false}
//         showsVerticalScrollIndicator={false}
//       >
//         <View
//           style={{
//             width: "100%",
//             height: profileHeight,
//             backgroundColor: ALL_COLOR.GENERAL_BG_COLOR,
//             justifyContent: "center",
//           }}
//         >
//           <View style={{ justifyContent: "center", alignItems: "center" }}>
//             <SelectPictureView
//               currentPic={imagePath}
//               size={pictureHeight}
//               onPress={(newImagePath) => {
//                 recordEvent(CLASS_NAME, "SelectPictureView-onPress", "");
//                 setImagePath(newImagePath);
//                 setSelectPic(true);
//               }}
//             />
//           </View>
//         </View>
//         <View
//           style={{
//             flex: 1,
//             backgroundColor: "white",
//             paddingLeft: 20,
//             paddingRight: 20,
//           }}
//         >
//           {/* First Name */}
//           <TextInputView
//             image={IC_PLAYER_SLOTS}
//             backgroundColor={"white"}
//             placeholder={"Enter first Name"}
//             name={"First Name".toUpperCase()}
//             text={firstName}
//             isEditable={true}
//             isHideLine={true}
//             maxLength={50}
//             marginTopUser={Platform.OS === "ios" ? -5 : -10}
//             onChanged={(value) => {
//               recordEvent(CLASS_NAME, "FirstName-onChanged", value);
//               const trimmedValue = value.trim();
//               const isValid =
//                 trimmedValue.length >= 2 && trimmedValue.length <= 50;
//               setFirstName(value);
//               setFNameError(!isValid);
//             }}
//           />
//           {fNameError && <Text style={styles.errorFont}>(2 to 50 chars)</Text>}

//           {/* Last Name */}
//           <TextInputView
//             image={IC_PLAYER_SLOTS}
//             placeholder={"Enter last Name"}
//             name={"Last Name".toUpperCase()}
//             backgroundColor={"white"}
//             text={lastName}
//             isEditable={true}
//             isHideLine={true}
//             maxLength={50}
//             marginTopUser={Platform.OS === "ios" ? -5 : -10}
//             onChanged={(value) => {
//               recordEvent(CLASS_NAME, "LastName-onChanged", value);
//               const trimmedValue = value.trim();
//               const isValid =
//                 trimmedValue.length > 0 && trimmedValue.length <= 50;
//               setLastName(value);
//               setLNameError(!isValid);
//             }}
//           />
//           {lNameError && <Text style={styles.errorFont}>(1 to 50 chars)</Text>}

//           {/* Gender */}
//           <View style={{ height: 20 }} />
//           <GenderSelectionView
//             isFull={true}
//             genderArray={genderArray}
//             selectedId={selectedId}
//             selectGender={selectGender}
//             onPress={(object) => {
//               recordEvent(
//                 CLASS_NAME,
//                 "GenderSelectionView-onPress",
//                 JSON.stringify(object)
//               );
//               setSelectedId(object.id);
//               setSelectGender(object.name);
//             }}
//           />

//           {/* Year of Birth */}
//           <TextInputView
//             image={IC_PLAYER_SLOTS}
//             backgroundColor={"white"}
//             placeholder={"Enter year of birth"}
//             name={"Year of Birth".toUpperCase()}
//             text={yearOfBirth}
//             isEditable={true}
//             isHideLine={true}
//             maxLength={4}
//             keyboardType="numeric"
//             marginTopUser={Platform.OS === "ios" ? -5 : -10}
//             onChanged={(value) => {
//               setYearOfBirth(value);
//             }}
//           />

//           {/* Short Bio */}
//           <TextInputView
//             image={IC_PLAYER_SLOTS}
//             backgroundColor={"white"}
//             placeholder={"Enter a short bio"}
//             name={"Short Bio".toUpperCase()}
//             text={shortBio}
//             isEditable={true}
//             isHideLine={true}
//             multiline={true}
//             numberOfLines={4}
//             marginTopUser={Platform.OS === "ios" ? -5 : -10}
//             onChanged={(value) => {
//               setShortBio(value);
//             }}
//           />

//           {/* Country */}
//           <ButtonTappedView
//             image={IC_PLAYER_SLOTS}
//             backgroundColor={"white"}
//             name={"Country".toUpperCase()}
//             isHideLine={true}
//             placeholder={"Select your country"}
//             text={country}
//             onPress={() => {
//               if (isVisible) {
//                 return;
//               }
//               renderVisibleState();
//               // Navigation to country selection would go here
//             }}
//           />

//           {/* Location */}
//           <ButtonTappedView
//             image={IC_VENUE}
//             backgroundColor={"white"}
//             name={SCREENNAME.baseLocation.toUpperCase()}
//             isHideLine={true}
//             placeholder={SCREENNAME.baseLocationPlaceholder}
//             text={selectedVenue}
//             onPress={() => {
//               if (isVisible) {
//                 return;
//               }
//               renderVisibleState();
//               recordEvent(
//                 CLASS_NAME,
//                 SCREENNAME.primaryLocation,
//                 "MyUserProfile Clicked"
//               );
//               navigation.navigate("AddLocationScreen", {
//                 callback: onLocationSelected,
//                 selectedVenue: selectedVenue,
//               });
//             }}
//           />

//           <View style={{ height: 20 }} />
//         </View>
//       </ScrollView>
//       {renderBottomButton()}
//       <Loader visible={isLoading} />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   errorFont: {
//     color: "red",
//     fontFamily: FONT.NORMAL_TEXT_FONT,
//     fontSize: 10,
//     marginTop: -5,
//   },
//   agreeStyle: {
//     color: "black",
//     fontSize: 15,
//     fontFamily: FONT.NORMAL_TEXT_FONT,
//   },
//   agreeSELECTEDStyle: {
//     color: ALL_COLOR.APP_COLOR,
//     fontSize: 15,
//     fontFamily: FONT.SELECTED_TEXT_FONT,
//   },
//   textHeaderStyle: {
//     justifyContent: "center",
//     alignSelf: "center",
//     fontFamily: FONT.NORMAL_TEXT_FONT,
//     fontSize: FONT.HEADER_SIZE,
//     color: "white",
//     textAlign: "center",
//     backgroundColor: "transparent",
//   },
//   bottomButtonStyleDisable: {
//     bottom: 0,
//     width: "100%",
//     opacity: 0.5,
//   },
//   bottomButtonStyle: {
//     bottom: 0,
//     width: "100%",
//   },
//   touchableOpacityStyle: {
//     width: 48,
//     height: 48,
//     backgroundColor: "transparent",
//     justifyContent: "center",
//     alignItems: "center",
//     alignSelf: "flex-start",
//   },
//   backStyle: {
//     width: 20,
//     height: 20,
//     resizeMode: "contain",
//   },
//   mainBottomView: {
//     backgroundColor: "transparent",
//     width: "100%",
//     height: 130,
//     bottom: 0,
//     position: "absolute",
//     justifyContent: "flex-start",
//     alignItems: "center",
//   },
//   textConnect: {
//     justifyContent: "center",
//     alignItems: "center",
//     alignSelf: "center",
//     color: "white",
//     fontFamily: FONT.SELECTED_TEXT_FONT,
//     fontSize: 15,
//   },
//   mainView: {
//     alignItems: "center",
//     justifyContent: "flex-start",
//     flex: 1,
//     backgroundColor: "white",
//   },
//   bottomView: {
//     bottom: 0,
//     backgroundColor: "transparent",
//     position: "absolute",
//     flexDirection: "row",
//     marginBottom: 20,
//     padding: 10,
//     justifyContent: "space-around",
//   },
// });

// export default MyProfileScreen;
