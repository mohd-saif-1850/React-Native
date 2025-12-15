import { useEffect, useState } from "react"
import {
  View,
  Text,
  Image,
  ActivityIndicator,
  StyleSheet,
  useColorScheme,
  TouchableOpacity,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import * as SecureStore from "expo-secure-store"
import axios from "axios"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { router } from "expo-router"

type User = {
  name: string
  username: string
  bio?: string
  profilePic?: string
}

export default function ProfileScreen() {
  const scheme = useColorScheme()
  const isDark = scheme === "dark"

  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUser = async () => {
      const token = await SecureStore.getItemAsync("token")

      const res = await axios.get(
        `${process.env.EXPO_PUBLIC_URL}/user/get-user`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      setUser(res.data.data)
      setLoading(false)
    }

    fetchUser()
  }, [])

  const logout = async () => {
    await SecureStore.deleteItemAsync("token")
    await AsyncStorage.removeItem("tutorial")

    router.replace("/login")
  }

  if (loading) {
    return (
      <SafeAreaView
        style={[
          styles.center,
          { backgroundColor: isDark ? "#000" : "#fff" },
        ]}
      >
        <ActivityIndicator size="large" />
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: isDark ? "#000" : "#fff" },
      ]}
    >
      <Image
        source={{
          uri: user?.profilePic,
        }}
        style={styles.avatar}
      />

      <Text style={[styles.name, { color: isDark ? "#fff" : "#000" }]}>
        {user?.name}
      </Text>

      <Text style={styles.username}>@{user?.username}</Text>

      {user?.bio ? <Text style={styles.bio}>{user.bio}</Text> : null}

      <View style={styles.spacer} />

      <TouchableOpacity
        activeOpacity={0.85}
        onPress={logout}
        style={[
          styles.logoutBtn,
          { backgroundColor: isDark ? "#1f2933" : "#ef4444" },
        ]}
      >
        <Text style={styles.logoutText}>Log out</Text>
      </TouchableOpacity>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingTop: 40,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
  },
  name: {
    fontSize: 22,
    fontWeight: "600",
  },
  username: {
    fontSize: 16,
    color: "#6b7280",
    marginTop: 4,
  },
  bio: {
    marginTop: 12,
    fontSize: 15,
    color: "#9ca3af",
    textAlign: "center",
    paddingHorizontal: 30,
  },
  spacer: {
    flex: 1,
  },
  logoutBtn: {
    width: "85%",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    marginBottom: 30,
  },
  logoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
})
