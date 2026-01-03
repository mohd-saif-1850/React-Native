import { useState } from "react";
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

export default function Login() {
  const scheme = useColorScheme();
  const isDark = scheme === "dark";

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ identifier?: string; password?: string }>({});

  const colors = {
    bg: isDark ? "#020617" : "#F8FAFC",
    surface: isDark ? "#020617" : "#FFFFFF",
    text: isDark ? "#FFFFFF" : "#020617",
    muted: isDark ? "#94A3B8" : "#64748B",
    border: isDark ? "#1E293B" : "#E2E8F0",
    danger: "#EF4444",
    primary: "#6366F1",
  };

  const validate = () => {
    const newErrors: typeof errors = {};

    if (!identifier.trim()) {
      newErrors.identifier = "Email or username is required";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = () => {
    if (!validate()) return;
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.bg }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>
            Welcome back
          </Text>
          <Text style={[styles.subtitle, { color: colors.muted }]}>
            Login to your account
          </Text>
        </View>

        <View style={[styles.inputBox, { borderColor: errors.identifier ? colors.danger : colors.border }]}>
          <Ionicons name="person-outline" size={20} color={colors.muted} />
          <TextInput
            placeholder="Email or Username"
            placeholderTextColor={colors.muted}
            style={[styles.input, { color: colors.text }]}
            value={identifier}
            onChangeText={setIdentifier}
            autoCapitalize="none"
          />
        </View>
        {errors.identifier && (
          <Text style={[styles.error, { color: colors.danger }]}>
            {errors.identifier}
          </Text>
        )}

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
        {errors.password && (
          <Text style={[styles.error, { color: colors.danger }]}>
            {errors.password}
          </Text>
        )}

        <TouchableOpacity style={styles.forgot}>
          <Text style={{ color: colors.primary, fontWeight: "600" }}>
            Forgot password?
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.primary }]}
          onPress={handleLogin}
        >
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>

        <View style={styles.signup}>
          <Text style={{ color: colors.muted }}>Don’t have an account?</Text>
          <TouchableOpacity onPress={() => router.push("/signup")}>
            <Text style={{ color: colors.primary, fontWeight: "700" }}>
              {" "}Sign up
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 24,
    justifyContent: "center",
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
    marginTop: 10,
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 54,
    gap: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
  },
  error: {
    fontSize: 13,
    marginTop: 6,
    marginBottom: 10,
  },
  forgot: {
    alignSelf: "flex-end",
    marginVertical: 18,
  },
  button: {
    height: 54,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  signup: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 24,
  },
});
