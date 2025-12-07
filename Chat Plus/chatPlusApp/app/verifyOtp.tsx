import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  useColorScheme,
  ActivityIndicator,
} from "react-native";
import React, { useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import axios from "axios";
import * as SecureStore from "expo-secure-store";

export default function VerifyOtp() {
  const theme = useColorScheme();
  const params = useLocalSearchParams();
  const email = params.email;
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputs = Array.from({ length: 6 }).map(() => useRef<TextInput>(null));

  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (value: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) inputs[index + 1].current?.focus();
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === "Backspace" && !otp[index] && index > 0) {
      inputs[index - 1].current?.focus();
    }
  };

  const handleVerify = async () => {
    try {
      setError("");
      setMsg("");
      setLoading(true);

      const finalOtp = otp.join("");

      const res = await axios.patch(
        `${process.env.EXPO_PUBLIC_BACKEND}/user/verify-user`,
        {
          email,
          otp: Number(finalOtp),
        }
      );

      if (!res.data.success) {
        setLoading(false);
        return setError("OTP is incorrect or expired");
      }

      const token = res.data.data.token

      await SecureStore.setItem("token",token)
      console.log("Token : ",token)
      console.log("Secure Token : ",SecureStore.getItem("token"))

      setMsg("OTP Verified! Logging in...");
      setLoading(false);

      setTimeout(() => {
        router.replace("/(tabs)");
      }, 1000);
    } catch (err) {
      setLoading(false);
      setError("OTP is incorrect");
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: 25,
      justifyContent: "center",
      backgroundColor: theme === "dark" ? "#0b0b0b" : "#f6f7fb",
    },
    title: {
      fontSize: 32,
      fontWeight: "800",
      color: theme === "dark" ? "#fff" : "#111",
      marginBottom: 10,
    },
    subtitle: {
      fontSize: 16,
      color: theme === "dark" ? "#b3b3b3" : "#555",
      marginBottom: 40,
    },
    otpContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 30,
    },
    otpBox: {
      width: 50,
      height: 55,
      borderRadius: 12,
      backgroundColor: theme === "dark" ? "#1a1a1a" : "#ffffff",
      justifyContent: "center",
      alignItems: "center",
      elevation: 5,
    },
    otpInput: {
      fontSize: 22,
      fontWeight: "700",
      color: theme === "dark" ? "#fff" : "#111",
      textAlign: "center",
    },
    errorText: {
      color: "red",
      marginBottom: 15,
      fontSize: 14,
      fontWeight: "600",
    },
    successText: {
      color: "green",
      marginBottom: 15,
      fontSize: 14,
      fontWeight: "600",
    },
    button: {
      backgroundColor: theme === "dark" ? "#2563eb" : "#3b82f6",
      paddingVertical: 16,
      borderRadius: 14,
      alignItems: "center",
      elevation: 4,
      flexDirection: "row",
      justifyContent: "center",
      gap: 10,
    },
    buttonText: {
      color: "white",
      fontSize: 18,
      fontWeight: "700",
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Enter OTP</Text>
      <Text style={styles.subtitle}>A 6-digit code was sent to {email}</Text>

      <View style={styles.otpContainer}>
        {otp.map((digit, i) => (
          <View key={i} style={styles.otpBox}>
            <TextInput
              ref={inputs[i]}
              style={styles.otpInput}
              keyboardType="number-pad"
              maxLength={1}
              value={digit}
              onChangeText={(v) => handleChange(v, i)}
              onKeyPress={(e) => handleKeyPress(e, i)}
              autoFocus={i === 0}
            />
          </View>
        ))}
      </View>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      {msg ? <Text style={styles.successText}>{msg}</Text> : null}

      <TouchableOpacity
        style={styles.button}
        onPress={handleVerify}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.buttonText}>Verify</Text>
        )}
      </TouchableOpacity>
    </SafeAreaView>
  );
}
