import { View, Text, StyleSheet, TouchableOpacity, useColorScheme } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { useRouter } from "expo-router"
import { useEffect } from "react"
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from "expo-secure-store"

export default function LandingPage() {
  const theme = useColorScheme()
  const router = useRouter()
  const isDark = theme === "dark"

  const token = async () => {
    const existedToken = await SecureStore.getItemAsync("token")
    const tutorial = await AsyncStorage.getItem("tutorial")

    if (existedToken && tutorial == "true" || true) {
      return router.replace("/(tabs)")
    }
    if (!existedToken) {
      return router.replace("/profile")
    }
  }

  useEffect(() => {
    token()
  })

  return (
    <LinearGradient
      colors={isDark ? ["#0b0b0b", "#141414"] : ["#f9f9f9", "#eaeaea"]}
      style={styles.container}
    >
      <View style={styles.content}>
        <Text style={[styles.title, { color: isDark ? "#ffffff" : "#0b0b0b" }]}>
          Core Line
        </Text>

        <Text style={[styles.subtitle, { color: isDark ? "#b3b3b3" : "#555555" }]}>
          Real-time connection built with clarity, performance, and trust
        </Text>

        <View style={styles.buttonGroup}>
          <TouchableOpacity
            style={[styles.primaryButton, { backgroundColor: isDark ? "#ffffff" : "#0b0b0b" }]}
            onPress={() => router.push("/login")}
          >
            <Text style={[styles.primaryText, { color: isDark ? "#0b0b0b" : "#ffffff" }]}>
              Login
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.secondaryButton,
              { borderColor: isDark ? "#ffffff" : "#0b0b0b" },
            ]}
            onPress={() => router.push("/register")}
          >
            <Text style={[styles.secondaryText, { color: isDark ? "#ffffff" : "#0b0b0b" }]}>
              Create Account
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  title: {
    fontSize: 44,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 16,
    lineHeight: 24,
    maxWidth: 320,
  },
  buttonGroup: {
    width: "100%",
    marginTop: 48,
  },
  primaryButton: {
    height: 52,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  primaryText: {
    fontSize: 16,
    fontWeight: "600",
  },
  secondaryButton: {
    height: 52,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    marginTop: 16,
  },
  secondaryText: {
    fontSize: 16,
    fontWeight: "600",
  },
})
