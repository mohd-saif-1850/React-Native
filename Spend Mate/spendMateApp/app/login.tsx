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
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";

export default function Login() {
  const theme = useColorScheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const colors = {
    bg: theme === "dark" ? "#0D0D0D" : "#F8F9FA",
    text: theme === "dark" ? "#FFFFFF" : "#111111",
    inputBg: theme === "dark" ? "#1A1A1A" : "#FFFFFF",
    inputBorder: theme === "dark" ? "#2A2A2A" : "#E5E5E5",
    placeholder: theme === "dark" ? "#999" : "#777",
    primary: ["#4F46E5", "#6D5DF6"],
  };

  const handleLogin = () => {
    // ✅ later add backend auth
    router.replace("/(tabs)");
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

          {/* Forgot Password */}
          <TouchableOpacity onPress={() => {}}>
            <Text style={[styles.forgotText, { color: colors.placeholder }]}>
              Forgot Password?
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
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
});
