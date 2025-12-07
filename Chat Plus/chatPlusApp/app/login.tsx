import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";
import { router } from "expo-router";

export default function Login() {
  const theme = useColorScheme();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");

  const handleSubmit = async () => {
    try {
      setError("");
      setMsg("");
      setLoading(true);

      const res = await axios.post(
        `${process.env.EXPO_PUBLIC_BACKEND}/user/login-user`,
        { email }
      );

      if (!res?.data?.success) {
        setLoading(false);
        return setError("Invalid Email Address");
      }

      setMsg(`OTP sent to ${email}`);
      setLoading(false);
      router.push(`/verifyOtp?email=${email}`);
    } catch (err) {
      setLoading(false);
      setError("Please enter a valid email address");
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: 25,
      justifyContent: "center",
      backgroundColor: theme === "dark" ? "#0b0b0b" : "#f6f7fb",
    },
    header: { marginBottom: 50 },
    title: {
      fontSize: 34,
      fontWeight: "800",
      color: theme === "dark" ? "#ffffff" : "#111111",
    },
    subtitle: {
      fontSize: 16,
      color: theme === "dark" ? "#b3b3b3" : "#555555",
      marginTop: 8,
      width: "90%",
    },
    inputContainer: {
      backgroundColor: theme === "dark" ? "#1a1a1a" : "#ffffff",
      paddingVertical: 14,
      paddingHorizontal: 18,
      borderRadius: 14,
      marginBottom: 15,
      elevation: 5,
    },
    input: { fontSize: 18, color: theme === "dark" ? "#fff" : "#111" },
    errorText: { color: "red", marginBottom: 15 },
    successText: { color: "green", marginBottom: 15 },
    button: {
      backgroundColor: theme === "dark" ? "#2563eb" : "#3b82f6",
      paddingVertical: 16,
      borderRadius: 14,
      alignItems: "center",
      elevation: 4,
      marginTop: 15,
    },
    buttonText: { color: "white", fontSize: 18, fontWeight: "700" },
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Welcome</Text>
        <Text style={styles.subtitle}>
          Enter your email to continue using Chat Plus.
        </Text>
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="example@gmail.com"
          placeholderTextColor={theme === "dark" ? "#777" : "#aaa"}
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
      </View>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      {msg ? <Text style={styles.successText}>{msg}</Text> : null}

      <TouchableOpacity
        style={styles.button}
        onPress={handleSubmit}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.buttonText}>Continue</Text>
        )}
      </TouchableOpacity>
    </SafeAreaView>
  );
}
