import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  KeyboardAvoidingView,
  Platform,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";

export default function Login() {
  const theme = useColorScheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [popup, setPopup] = useState(false);

  const colors = {
    bg: theme === "dark" ? "#0D0D0D" : "#F8F9FA",
    text: theme === "dark" ? "#FFFFFF" : "#111111",
    inputBg: theme === "dark" ? "#1A1A1A" : "#FFFFFF",
    inputBorder: theme === "dark" ? "#2A2A2A" : "#E5E5E5",
    placeholder: theme === "dark" ? "#999" : "#777",
    primary: ["#4F46E5", "#6D5DF6"],
  };

  const handleLogin = async () => {
    setError("");
    setMsg("");

    if (!email || !password) {
      setError("Email and password are required");
      return;
    }

    try {
      const res = await axios.post(
        `${process.env.EXPO_PUBLIC_BACKEND}/user/login-user`,
        { email, password }
      );

      const user = res.data?.user;

      if (!user) {
        setError("Login failed");
        return;
      }

      const token = res.data?.token;

      if (token) {
        await SecureStore.setItemAsync("spendmate_token", token);
      }

      if (user.verified === false) {
        router.replace(`/verify-otp?email=${email}`);
        return;
      }

      await AsyncStorage.setItem("spendmate_token", res.data.token);
      router.replace("/tutorial");

    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1, justifyContent: "center" }}
      >
        <View style={styles.inner}>
          <Text style={[styles.title, { color: colors.text }]}>
            Welcome Back 👋
          </Text>

          <Text style={[styles.subtitle, { color: colors.placeholder }]}>
            Login to continue your journey
          </Text>

          <TextInput
            placeholder="Email"
            placeholderTextColor={colors.placeholder}
            value={email}
            onChangeText={setEmail}
            style={[
              styles.input,
              {
                backgroundColor: colors.inputBg,
                borderColor: colors.inputBorder,
                color: colors.text,
              },
            ]}
          />

          <TextInput
            placeholder="Password"
            placeholderTextColor={colors.placeholder}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            style={[
              styles.input,
              {
                backgroundColor: colors.inputBg,
                borderColor: colors.inputBorder,
                color: colors.text,
              },
            ]}
          />

          {error ? (
            <Text style={{ color: "red", textAlign: "center", marginTop: -6 }}>
              {error}
            </Text>
          ) : null}

          {msg ? (
            <Text
              style={{
                color: colors.placeholder,
                textAlign: "center",
                marginTop: -6,
              }}
            >
              {msg}
            </Text>
          ) : null}

          <LinearGradient
            colors={["#4F46E5", "#6D5DF6"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.primaryBtn}
          >
            <TouchableOpacity onPress={handleLogin}>
              <Text style={styles.primaryBtnText}>Login</Text>
            </TouchableOpacity>
          </LinearGradient>

          <View style={styles.footerRow}>
            <Text style={[styles.footerText, { color: colors.placeholder }]}>
              Don’t have an account?
            </Text>

            <TouchableOpacity onPress={() => router.push("/register")}>
              <Text style={[styles.footerLink, { color: colors.text }]}>
                Sign Up
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity onPress={() => setPopup(true)}>
            <Text style={[styles.forgotText, { color: colors.placeholder }]}>
              Forgot Password?
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      <Modal visible={popup} transparent animationType="fade">
        <View style={styles.popupOverlay}>
          <View style={styles.popupCard}>
            <Ionicons name="information-circle-outline" size={60} color="#4F46E5" />

            <Text style={styles.popupTitle}>Forgot Password?</Text>

            <Text style={styles.popupMsg}>
              Abe Jahil Badam Khaya Kar Yaad Rahega Password !
              Ab Tere Liye Pura Banane Baithun Ye Functionilty Bhi Ja Jakar New Account Banale - Gawar !
            </Text>

            <TouchableOpacity onPress={() => setPopup(false)}>
              <Text style={styles.popupCancel}>Okay !</Text>
            </TouchableOpacity>

          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 26,
  },
  inner: {
    gap: 18,
  },
  title: {
    fontSize: 34,
    fontWeight: "700",
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 20,
  },
  input: {
    width: "100%",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1.5,
    fontSize: 16,
  },
  primaryBtn: {
    width: "100%",
    paddingVertical: 16,
    borderRadius: 14,
    marginTop: 10,
  },
  primaryBtnText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "600",
    textAlign: "center",
  },
  footerRow: {
    flexDirection: "row",
    gap: 6,
    marginTop: 15,
    justifyContent: "center",
  },
  footerText: {
    fontSize: 14,
  },
  footerLink: {
    fontSize: 14,
    fontWeight: "600",
  },
  forgotText: {
    textAlign: "center",
    fontSize: 14,
    marginTop: 10,
  },

  popupOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  popupCard: {
    width: "80%",
    padding: 26,
    backgroundColor: "#fff",
    borderRadius: 18,
    alignItems: "center",
    gap: 14,
  },
  popupTitle: {
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
  },
  popupMsg: {
    fontSize: 15,
    textAlign: "center",
    color: "#666",
    lineHeight: 20,
  },
  popupBtn: {
    backgroundColor: "#4F46E5",
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 12,
    marginTop: 10,
  },
  popupBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  popupCancel: {
    marginTop: 10,
    fontSize: 15,
    color: "#555",
  },
});
