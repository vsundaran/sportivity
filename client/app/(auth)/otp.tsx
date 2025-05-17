import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useState } from "react";
import apiService from "../../API/apiService";
import API_ENDPOINTS from "../../API/apiEndpoints";

const IC_NORMAL_SCREEN = require("../../assets/images/background/normalScren.png");

// Constants
const FONT = {
  SELECTED_TEXT_FONT: "System",
};
const { width } = Dimensions.get("window");

const fontFunction = (size: number) => {
  return size;
};

// Mock API functions - replace with your actual API calls
const sendOTP = async (email: string) => {
  const response = await fetch(
    "http://192.168.184.192:5000/api/auth/send-otp",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    }
  );
  return await response.json();
};

const verifyOTP = async (email: string, otp: string) => {
  const response = await fetch(
    "http://192.168.184.192:5000/api/auth/verify-otp",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, otp }),
    }
  );
  return await response.json();
};

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpError, setOtpError] = useState("");

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSendOTP = async () => {
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
      const response = await sendOTP(email);
      if (response?.success) {
        Alert.alert("Success", response.message || "OTP sent successfully");
        setOtpSent(true);
      } else {
        Alert.alert("Error", response.message || "Failed to send OTP");
      }
    } catch (err: any) {
      setError(err.message || "Failed to send OTP. Please try again.");
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
      const response = await verifyOTP(email, otp);
      if (response?.success) {
        Alert.alert("Success", response.message || "OTP verified successfully");
        // Navigate to next screen or perform login
      } else {
        Alert.alert("Error", response.message || "Invalid OTP");
      }
    } catch (err: any) {
      setOtpError(err.message || "Verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
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
          <View style={[styles.inputContainer, { marginTop: 15 }]}>
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
      </View>
    </View>
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
