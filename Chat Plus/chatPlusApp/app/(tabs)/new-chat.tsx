import React, { useCallback, useEffect, useMemo, useState } from "react"
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  ActivityIndicator,
  StyleSheet,
  useColorScheme,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import axios from "axios"
import * as SecureStore from "expo-secure-store"
import { router } from "expo-router"

type UserResult = {
  _id: string
  name: string
  username?: string
  email?: string
  image?: string | null
}

export default function NewChat() {
  const theme = useColorScheme()
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<UserResult[]>([])
  const [loading, setLoading] = useState(false)
  const [searching, setSearching] = useState(false)
  const [error, setError] = useState("")
  const [startingChatId, setStartingChatId] = useState<string | null>(null)

  const base = process.env.EXPO_PUBLIC_BACKEND ?? ""

  const searchUsers = useCallback(
    async (text: string) => {
      setQuery(text)
      setError("")
      if (text.trim().length < 1) {
        setResults([])
        return
      }
      setSearching(true)
      try {
        const token = await SecureStore.getItemAsync("token")
        if (!token) {
          setError("Not authenticated")
          setResults([])
          setSearching(false)
          return
        }
        const res = await axios.get(
          `${base}/user/search-user?query=${encodeURIComponent(text)}`,
          { headers: { Authorization: `Bearer ${token}` } }
        )
        setResults(Array.isArray(res.data.users) ? res.data.users : [])
      } catch {
        setError("Failed to search users")
        setResults([])
      } finally {
        setSearching(false)
      }
    },
    [base]
  )

  useEffect(() => {
    const id = setTimeout(() => {
      if (query.trim().length > 0) searchUsers(query)
    }, 350)
    return () => clearTimeout(id)
  }, [query, searchUsers])

  const startChat = useCallback(
    async (friendId: string) => {
      setError("")
      setStartingChatId(friendId)
      try {
        const token = await SecureStore.getItemAsync("token")
        if (!token) {
          setError("Not authenticated")
          setStartingChatId(null)
          return
        }
        const res = await axios.post(
          `${base}/chat/create-chat`,
          { friendId },
          { headers: { Authorization: `Bearer ${token}` } }
        )
        const chatId = res.data?.chatId
        if (!chatId) {
          setError("Unable to create chat")
          setStartingChatId(null)
          return
        }
        router.replace({
          pathname: "/chat/[chatId]",
          params: { chatId },
        })
      } catch {
        setError("Failed to start chat")
        setStartingChatId(null)
      }
    },
    [base]
  )

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: 1,
          backgroundColor: theme === "dark" ? "#0b0b0b" : "#f6f7fb",
          paddingHorizontal: 16,
          paddingTop: 16,
        },
        input: {
          backgroundColor: theme === "dark" ? "#111317" : "#ffffff",
          padding: 12,
          borderRadius: 12,
          fontSize: 16,
          color: theme === "dark" ? "#fff" : "#111",
          marginBottom: 12,
          elevation: 2,
        },
        card: {
          flexDirection: "row",
          alignItems: "center",
          paddingVertical: 12,
          paddingHorizontal: 8,
          borderBottomWidth: 1,
          borderColor: theme === "dark" ? "#222" : "#e6e6e6",
        },
        avatar: {
          width: 56,
          height: 56,
          borderRadius: 28,
          marginRight: 12,
          backgroundColor: theme === "dark" ? "#1f2937" : "#e5e7eb",
          justifyContent: "center",
          alignItems: "center",
          overflow: "hidden",
        },
        avatarImg: {
          width: "100%",
          height: "100%",
          resizeMode: "cover",
        },
        name: {
          fontSize: 16,
          fontWeight: "700",
          color: theme === "dark" ? "#fff" : "#111",
        },
        email: {
          fontSize: 13,
          color: theme === "dark" ? "#aaa" : "#666",
          marginTop: 2,
        },
        actions: {
          marginLeft: "auto",
        },
        startBtn: {
          backgroundColor: theme === "dark" ? "#2563eb" : "#3b82f6",
          paddingVertical: 8,
          paddingHorizontal: 12,
          borderRadius: 10,
        },
        startBtnText: {
          color: "#fff",
          fontWeight: "700",
        },
        empty: {
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          paddingTop: 40,
        },
        emptyText: {
          fontSize: 18,
          fontWeight: "700",
          color: theme === "dark" ? "#fff" : "#111",
          marginBottom: 8,
        },
        emptySub: {
          fontSize: 14,
          color: theme === "dark" ? "#aaa" : "#666",
          textAlign: "center",
          width: "80%",
        },
        headerError: {
          color: "red",
          textAlign: "center",
          marginBottom: 10,
        },
      }),
    [theme]
  )

  return (
    <SafeAreaView style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Search users by name, username or email"
        placeholderTextColor={theme === "dark" ? "#666" : "#999"}
        value={query}
        onChangeText={setQuery}
        autoCapitalize="none"
      />

      {error ? <Text style={styles.headerError}>{error}</Text> : null}

      {searching ? (
        <ActivityIndicator size="large" color={theme === "dark" ? "#60a5fa" : "#3b82f6"} />
      ) : results.length === 0 && query.trim().length > 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>No users found</Text>
          <Text style={styles.emptySub}>Try a different name, username or email.</Text>
        </View>
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => {
            const initials =
              (item.name || item.username || "U")
                .split(" ")
                .map((s) => s[0])
                .slice(0, 2)
                .join("")
                .toUpperCase() || "U"
            return (
              <View style={styles.card}>
                <View style={styles.avatar}>
                  {item.image ? (
                    <Image source={{ uri: item.image }} style={styles.avatarImg} />
                  ) : (
                    <Text style={styles.name}>{initials}</Text>
                  )}
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.name}>{item.name ?? item.username ?? "Unknown"}</Text>
                  <Text style={styles.email}>{item.email ?? ""}</Text>
                </View>
                <View style={styles.actions}>
                  <TouchableOpacity
                    style={styles.startBtn}
                    onPress={() => startChat(item._id)}
                    disabled={startingChatId === item._id}
                  >
                    {startingChatId === item._id ? (
                      <ActivityIndicator size="small" color="#fff" />
                    ) : (
                      <Text style={styles.startBtnText}>Start Chat</Text>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            )
          }}
          ItemSeparatorComponent={() => <View style={{ height: 0 }} />}
        />
      )}
    </SafeAreaView>
  )
}
