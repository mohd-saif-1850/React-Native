import { useState } from "react"
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  useColorScheme,
} from "react-native"
import axios from "axios"
import { useRouter } from "expo-router"
import * as SecureStore from "expo-secure-store"
import AsyncStorage from "@react-native-async-storage/async-storage"

export default function LoginScreen() {
  const scheme = useColorScheme()
  const isDark = scheme === "dark"
  const router = useRouter()

  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleLogin = async () => {
    if (!username || !password) {
      setError("Username and password are required")
      return
    }

    try {
      setLoading(true)
      setError("")

      const res = await axios.post(
        `${process.env.EXPO_PUBLIC_URL}/user/login-user`,
        { username, password }
      )

      await SecureStore.setItemAsync("token",res.data.data.token)
      const tutorial = await AsyncStorage.getItem("tutorial")

      if (res.data?.data?.token && !tutorial) {
        router.replace("/changeProfilePic")
      }
      if (res.data?.data?.token && tutorial) {
        router.replace("/(tabs)")
      }
    } catch (err: any) {
      setError(
        err?.response?.data?.message || "Login failed. Try again"
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
          backgroundColor: isDark ? "#0a0a0a" : "#f3f4f6",
          justifyContent: "center",
          paddingHorizontal: 24,
        }}
      >
        <View style={{ marginBottom: 40 }}>
          <Text
            style={{
              fontSize: 36,
              fontWeight: "800",
              color: isDark ? "#ffffff" : "#111827",
              marginBottom: 6,
            }}
          >
            Core Line
          </Text>

          <Text
            style={{
              fontSize: 16,
              color: isDark ? "#9ca3af" : "#6b7280",
            }}
          >
            Sign in to continue
          </Text>
        </View>

        {error ? (
          <Text
            style={{
              color: "#ef4444",
              marginBottom: 12,
              fontSize: 14,
            }}
          >
            {error}
          </Text>
        ) : null}

        <View
          style={{
            backgroundColor: isDark ? "#111827" : "#ffffff",
            borderRadius: 18,
            paddingHorizontal: 18,
            paddingVertical: 16,
            marginBottom: 16,
          }}
        >
          <TextInput
            value={username}
            onChangeText={setUsername}
            placeholder="Username"
            placeholderTextColor={isDark ? "#9ca3af" : "#6b7280"}
            style={{
              color: isDark ? "#ffffff" : "#000000",
              fontSize: 16,
            }}
          />
        </View>

        <View
          style={{
            backgroundColor: isDark ? "#111827" : "#ffffff",
            borderRadius: 18,
            paddingHorizontal: 18,
            paddingVertical: 16,
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 28,
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
              color: isDark ? "#ffffff" : "#000000",
              fontSize: 16,
            }}
          />

          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={{ paddingHorizontal: 8 }}
          >
            <Text
              style={{
                color: "#3b82f6",
                fontWeight: "600",
                fontSize: 14,
              }}
            >
              {showPassword ? "Hide" : "Show"}
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          disabled={loading}
          onPress={handleLogin}
          style={{
            backgroundColor: loading ? "#93c5fd" : "#3b82f6",
            paddingVertical: 18,
            borderRadius: 20,
            alignItems: "center",
            shadowColor: "#3b82f6",
            shadowOpacity: 0.3,
            shadowRadius: 10,
            elevation: 6,
          }}
        >
          <Text
            style={{
              color: "#ffffff",
              fontSize: 17,
              fontWeight: "700",
            }}
          >
            {loading ? "Signing in..." : "Login"}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  )
}
