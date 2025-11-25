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
import axios from 'axios'

export default function Register() {
  const theme = useColorScheme();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [mobileNo, setMobileNo] = useState("");
  const [password, setPassword] = useState("");
  const [error,setError] = useState("")
  const [msg,setMsg] = useState("")

  const url = process.env.EXPO_PUBLIC_BACKEND

  const colors = {
    bg: theme === "dark" ? "#0D0D0D" : "#F8F9FA",
    text: theme === "dark" ? "#FFFFFF" : "#111111",
    inputBg: theme === "dark" ? "#1A1A1A" : "#FFFFFF",
    inputBorder: theme === "dark" ? "#2A2A2A" : "#E5E5E5",
    placeholder: theme === "dark" ? "#999" : "#777",
    primary: ["#4F46E5", "#6D5DF6"],
  };

  const handleRegister = async () => {
    setError("")
    setMsg("")
    try {
        const res = await axios.post(
            `${process.env.EXPO_PUBLIC_BACKEND}/user/create-user`,{
                username,
                email,
                mobileNo,
                password
            }
        )

        setMsg("Account Created Successfully !")
    
        // router.replace("/login");
    } catch (error) {
        setError("User Failed to Register !")
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
            Create Account ✨
          </Text>
          <Text style={[styles.subtitle, { color: colors.placeholder }]}>
            Join Spend Mate and control your finances !
          </Text>

          <TextInput
            placeholder="Username"
            placeholderTextColor={colors.placeholder}
            value={username}
            onChangeText={setUsername}
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
            placeholder="Email"
            placeholderTextColor={colors.placeholder}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
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
            placeholder="Mobile Number"
            placeholderTextColor={colors.placeholder}
            value={mobileNo}
            onChangeText={setMobileNo}
            keyboardType="phone-pad"
            maxLength={10}
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
            <TouchableOpacity onPress={handleRegister}>
              <Text style={styles.primaryBtnText}>Sign Up</Text>
            </TouchableOpacity>
          </LinearGradient>

            {/* Errors and Msgs */}
            {error ? (
                <Text style={[styles.footerText, { color: "red" }]}>{error}</Text>
            ) : null}

            {msg ? (
                <Text style={[styles.footerText, { color: colors.placeholder }]}>
                {msg}
                </Text>
            ) : null}
            
          <View style={styles.footerRow}>
            <Text style={[styles.footerText, { color: colors.placeholder }]}>
              Already have an account?
            </Text>
            <TouchableOpacity onPress={() => router.push("/login")}>
              <Text style={[styles.footerLink, { color: colors.text }]}>
                Login
              </Text>
            </TouchableOpacity>
          </View>
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
});
