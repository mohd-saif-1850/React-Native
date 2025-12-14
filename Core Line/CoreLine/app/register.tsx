import { useState } from "react"
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  useColorScheme,
  ActivityIndicator,
} from "react-native"
import axios from "axios"
import { useRouter } from "expo-router"

export default function RegisterScreen() {
  const scheme = useColorScheme()
  const isDark = scheme === "dark"
  const router = useRouter()

  const [name, setName] = useState("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleRegister = async () => {
    if (!username || !password) {
      setError("Username and password are required")
      return
    }

    try {
      setLoading(true)
      setError("")

      const res = await axios.post(
        `${process.env.EXPO_PUBLIC_URL}/user/register-user`,
        { name, username, password }
      )

      if (res.data?.statusCode === 200) {
        router.replace("/login")
      }
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
        "Registration failed, please try again"
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: isDark ? "#0b0b0b" : "#f5f5f5",
          justifyContent: "center",
          paddingHorizontal: 24,
        }}
      >
        <Text
          style={{
            fontSize: 32,
            fontWeight: "700",
            color: isDark ? "#fff" : "#111",
            marginBottom: 6,
          }}
        >
          Create Account
        </Text>

        <Text
          style={{
            fontSize: 16,
            color: isDark ? "#9ca3af" : "#6b7280",
            marginBottom: 32,
          }}
        >
          Join Core Line
        </Text>

        <View
          style={{
            backgroundColor: isDark ? "#111827" : "#fff",
            borderRadius: 14,
            paddingHorizontal: 16,
            paddingVertical: 14,
            marginBottom: 14,
          }}
        >
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Name"
            placeholderTextColor={isDark ? "#9ca3af" : "#6b7280"}
            style={{ color: isDark ? "#fff" : "#000", fontSize: 16 }}
          />
        </View>

        <View
          style={{
            backgroundColor: isDark ? "#111827" : "#fff",
            borderRadius: 14,
            paddingHorizontal: 16,
            paddingVertical: 14,
            marginBottom: 14,
          }}
        >
          <TextInput
            value={username}
            onChangeText={setUsername}
            placeholder="Username"
            placeholderTextColor={isDark ? "#9ca3af" : "#6b7280"}
            autoCapitalize="none"
            style={{ color: isDark ? "#fff" : "#000", fontSize: 16 }}
          />
        </View>

        <View
          style={{
            backgroundColor: isDark ? "#111827" : "#fff",
            borderRadius: 14,
            paddingHorizontal: 16,
            paddingVertical: 14,
            marginBottom: 10,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="Password"
            placeholderTextColor={isDark ? "#9ca3af" : "#6b7280"}
            secureTextEntry={!showPassword}
            style={{
              flex: 1,
              color: isDark ? "#fff" : "#000",
              fontSize: 16,
            }}
          />

          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Text
              style={{
                color: "#3b82f6",
                fontWeight: "600",
                marginLeft: 10,
              }}
            >
              {showPassword ? "Hide" : "Show"}
            </Text>
          </TouchableOpacity>
        </View>

        {error ? (
          <Text
            style={{
              color: "#ef4444",
              marginBottom: 14,
              fontSize: 14,
            }}
          >
            {error}
          </Text>
        ) : null}

        <TouchableOpacity
          onPress={handleRegister}
          disabled={loading}
          style={{
            backgroundColor: "#3b82f6",
            paddingVertical: 16,
            borderRadius: 16,
            alignItems: "center",
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text
              style={{
                color: "#fff",
                fontSize: 16,
                fontWeight: "600",
              }}
            >
              Register
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.replace("/login")}
          style={{ marginTop: 24, alignItems: "center" }}
        >
          <Text style={{ color: "#3b82f6", fontSize: 15 }}>
            Already have an account? Login
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  )
}
