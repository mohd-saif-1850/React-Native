import { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  useColorScheme,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import axios from "axios";
import { wakeBackend } from "@/utils/wakeServer";

export default function Signup() {
  const scheme = useColorScheme();
  const isDark = scheme === "dark";

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const colors = {
    bg: isDark ? "#020617" : "#F8FAFC",
    text: isDark ? "#FFFFFF" : "#020617",
    muted: isDark ? "#94A3B8" : "#64748B",
    border: isDark ? "#1E293B" : "#E2E8F0",
    primary: "#6366F1",
    danger: "#EF4444",
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = "Name is required";
    if (!username.trim()) e.username = "Username is required";
    if (!email.trim()) e.email = "Email is required";
    if (!password) e.password = "Password is required";
    else if (password.length < 6) e.password = "Minimum 6 characters";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  useEffect(() => {
    wakeBackend()
  },[])

  const handleSignup = async () => {
  if (!validate()) return;

  try {
    const res = await axios.post(
      `https://mumentum-backend.onrender.com/api/v1/user/register-with-email`,
      {
        name,
        username,
        email,
        password,
      }
    );

    console.log("SUCCESS:", res.data);
    router.push("/otpVerification");
  } catch (error: any) {
    console.log("ERROR:", error.response?.data || error.message);

    if (error.response?.data?.message) {
      setErrors({ email: error.response.data.message });
    }
  }
};


  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.bg }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>
            Create account
          </Text>
          <Text style={[styles.subtitle, { color: colors.muted }]}>
            Join and start your journey
          </Text>
        </View>

        <View style={[styles.inputBox, { borderColor: errors.name ? colors.danger : colors.border }]}>
          <Ionicons name="person-outline" size={20} color={colors.muted} />
          <TextInput
            placeholder="Full name"
            placeholderTextColor={colors.muted}
            style={[styles.input, { color: colors.text }]}
            value={name}
            onChangeText={setName}
          />
        </View>
        {errors.name && <Text style={[styles.error, { color: colors.danger }]}>{errors.name}</Text>}

        <View style={[styles.inputBox, { borderColor: errors.username ? colors.danger : colors.border }]}>
          <Ionicons name="at-outline" size={20} color={colors.muted} />
          <TextInput
            placeholder="Username"
            placeholderTextColor={colors.muted}
            style={[styles.input, { color: colors.text }]}
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
          />
        </View>
        {errors.username && <Text style={[styles.error, { color: colors.danger }]}>{errors.username}</Text>}

        <View style={[styles.inputBox, { borderColor: errors.email ? colors.danger : colors.border }]}>
          <MaterialCommunityIcons name="email-outline" size={20} color={colors.muted} />
          <TextInput
            placeholder="Email"
            placeholderTextColor={colors.muted}
            style={[styles.input, { color: colors.text }]}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
        </View>
        {errors.email && <Text style={[styles.error, { color: colors.danger }]}>{errors.email}</Text>}

        <View style={[styles.inputBox, { borderColor: errors.password ? colors.danger : colors.border }]}>
          <MaterialCommunityIcons name="lock-outline" size={20} color={colors.muted} />
          <TextInput
            placeholder="Password"
            placeholderTextColor={colors.muted}
            style={[styles.input, { color: colors.text }]}
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Ionicons
              name={showPassword ? "eye-off-outline" : "eye-outline"}
              size={20}
              color={colors.muted}
            />
          </TouchableOpacity>
        </View>
        {errors.password && <Text style={[styles.error, { color: colors.danger }]}>{errors.password}</Text>}

        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.primary }]}
          onPress={() => handleSignup()}
        >
          <Text style={styles.buttonText}>Sign up</Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={{ color: colors.muted }}>Already have an account?</Text>
          <TouchableOpacity onPress={() => router.push("/otpVerification")}>
            <Text style={{ color: colors.primary, fontWeight: "700" }}>
              {" "}Sign in
            </Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 75,
    padding: 24,
    paddingTop: 60,
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 30,
    fontWeight: "700",
  },
  subtitle: {
    fontSize: 15,
    marginTop: 6,
  },
  inputBox: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 54,
    gap: 10,
    marginTop: 14,
  },
  input: {
    flex: 1,
    fontSize: 16,
  },
  error: {
    fontSize: 13,
    marginTop: 6,
    color: "#EF4444",
  },
  button: {
    height: 54,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 28,
  },
});
