import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/custom-hooks/useToast";
import { setToken } from "@/redux/slices/authSlice";
import { saveToken } from "@/utils/token";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useDispatch } from "react-redux";
import API_ENDPOINTS from "../API/apiEndpoints";
import apiService from "../API/apiService";

const IC_NORMAL_SCREEN = require("../assets/images/background/normalScren.png");

// Constants
const FONT = {
  SELECTED_TEXT_FONT: "System",
};
const { width } = Dimensions.get("window");

const fontFunction = (size: number) => {
  return size;
};

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpError, setOtpError] = useState("");
  const { showSuccess, showError } = useToast();
  const router = useRouter();
  const dispatch = useDispatch();
  const { isAuthenticated, isLoading } = useAuth();

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSendOTP = async () => {
    setOtp("");
    setError("");

    // Validate email
    if (!email) {
      setError("Email is required");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    try {
      setLoading(true);
      const response: any = await apiService.post(API_ENDPOINTS.AUTH.SEND_OTP, {
        email,
      });
      console.log(response, "response from send otp");
      if (response?.success) {
        showSuccess("OTP Sent!", response.message || "Please check your inbox");
        setOtpSent(true);
      } else {
        showError(
          "Failed to Send OTP!",
          response.message || "Please try again"
        );
      }
    } catch (err: any) {
      showError("Failed to Send OTP!", err.message || "Please try again");
      setError(err?.message || "Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    setOtpError("");

    if (!otp) {
      setOtpError("OTP is required");
      return;
    }

    if (otp.length !== 6) {
      setOtpError("OTP must be 6 digits");
      return;
    }

    try {
      setLoading(true);
      const response: any = await apiService.post(
        API_ENDPOINTS.AUTH.VERIFY_OTP,
        {
          email,
          otp,
        }
      );
      if (response?.success) {
        showSuccess("OTP verified!!!", response.message || "");
        await saveToken(response.token || "");
        dispatch(setToken(response.token || ""));
        const { isNewUser } = response?.data || {}
        if (isNewUser) {
          router.replace("/profile");
        } else {
          router.replace("/activity-list")
        }
      } else {
        showError(
          "Failed to verify OTP!",
          response.message || "Please try again"
        );
      }
    } catch (err: any) {
      showError("Failed to verify OTP!", err.message || "Please try again");
      setOtpError(err.message || "Verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  //checking the auth and redirecting to activity list if authenticated
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace("/activity-list");
    }
  }, [isLoading, isAuthenticated]);

  if (isLoading) {
    return <ActivityIndicator />;
  }

  return (
    <KeyboardAwareScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{ flexGrow: 1 }}
      enableOnAndroid
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.mainView}>
        <View
          style={{
            position: "absolute",
            height: "100%",
            width: "100%",
            top: 0,
            backgroundColor: "white",
          }}
        >
          <Image
            source={IC_NORMAL_SCREEN}
            style={{ width: "100%", height: "100%", resizeMode: "cover" }}
          />
        </View>

        <View style={styles.mainBottomView}>
          {/* Email Input Field */}
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Enter your email"
              placeholderTextColor="#999"
              style={[styles.emailInput, error ? styles.inputError : null]}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if (error) setError(""); // Clear error when typing
              }}
              editable={!loading && !otpSent}
            />
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
          </View>

          {/* OTP Input Field (visible after OTP is sent) */}
          {otpSent && (
            <View style={[styles.inputContainer, { marginTop: 5 }]}>
              <TextInput
                placeholder="Enter OTP"
                placeholderTextColor="#999"
                style={[styles.emailInput, otpError ? styles.inputError : null]}
                keyboardType="number-pad"
                autoCapitalize="none"
                autoCorrect={false}
                value={otp}
                onChangeText={(text) => {
                  setOtp(text);
                  if (otpError) setOtpError(""); // Clear error when typing
                }}
                editable={!loading}
                maxLength={6}
              />
              {otpError ? <Text style={styles.errorText}>{otpError}</Text> : null}
            </View>
          )}

          {/* Submit Button */}
          <TouchableOpacity
            style={[
              styles.submitButton,
              loading ? styles.submitButtonDisabled : null,
            ]}
            onPress={otpSent ? handleVerifyOTP : handleSendOTP}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.submitButtonText}>
                {otpSent ? "Verify OTP" : "Send OTP"}
              </Text>
            )}
          </TouchableOpacity>

          {/* Resend OTP option */}
          {otpSent && (
            <TouchableOpacity
              style={{ marginTop: 15 }}
              onPress={handleSendOTP}
              disabled={loading}
            >
              <Text style={styles.resendText}>
                Didn't receive OTP?{" "}
                <Text style={{ color: "#1856AF", fontWeight: "bold" }}>
                  Resend
                </Text>
              </Text>
            </TouchableOpacity>
          )}

          {/* <Link href={"/create-activity"}>Hello</Link> */}
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  mainBottomView: {
    width: "100%",
    height: "40%",
    bottom: 0,
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  mainView: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  inputContainer: {
    width: "90%",
    marginBottom: 5,
  },
  inputLabel: {
    fontSize: fontFunction(14),
    color: "#333",
    marginBottom: 8,
    fontFamily: FONT.SELECTED_TEXT_FONT,
  },
  emailInput: {
    width: "100%",
    height: 50,
    backgroundColor: "white",
    borderRadius: 8,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: "#ddd",
    fontSize: fontFunction(15),
    fontFamily: FONT.SELECTED_TEXT_FONT,
    color: "#333",
  },
  inputError: {
    borderColor: "#ff4444",
  },
  errorText: {
    color: "#ff4444",
    fontSize: fontFunction(12),
    marginTop: 5,
    fontFamily: FONT.SELECTED_TEXT_FONT,
  },
  submitButton: {
    width: "90%",
    height: 50,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1856AF",
    overflow: "hidden",
    marginTop: 10,
  },
  submitButtonDisabled: {
    backgroundColor: "#7a9cc9",
  },
  submitButtonText: {
    textAlign: "center",
    color: "white",
    fontSize: fontFunction(16),
    width: "100%",
    fontFamily: FONT.SELECTED_TEXT_FONT,
    fontWeight: "500",
  },
  resendText: {
    fontSize: fontFunction(14),
    color: "#666",
    fontFamily: FONT.SELECTED_TEXT_FONT,
  },
  bottomView: {
    bottom: 0,
    backgroundColor: "transparent",
    position: "absolute",
    flexDirection: "row",
    marginBottom: 20,
    padding: 10,
    justifyContent: "space-around",
  },
});

export default LoginScreen;
