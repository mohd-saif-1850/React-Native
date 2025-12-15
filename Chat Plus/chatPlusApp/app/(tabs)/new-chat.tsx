import React, { useCallback, useEffect, useMemo, useState } from "react"
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  useColorScheme,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import axios from "axios"
import * as SecureStore from "expo-secure-store"
import { router } from "expo-router"
import socket from "../../src/socket"

type UserResult = {
  _id: string
  name: string
  username?: string
  email?: string
  image?: string | null
  online?: boolean
}

export default function NewChat() {
  const theme = useColorScheme()
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<UserResult[]>([])
  const [searching, setSearching] = useState(false)
  const [startingChatId, setStartingChatId] = useState<string | null>(null)
  const [myUserId, setMyUserId] = useState<string>("")

  const base = process.env.EXPO_PUBLIC_BACKEND ?? ""

  useEffect(() => {
    const initSocket = async () => {
      const token = await SecureStore.getItemAsync("token")
      const userId = await SecureStore.getItemAsync("userId")
      if (!token || !userId) return

      setMyUserId(userId)

      socket.connect()
      socket.emit("user-online", userId)
    }

    initSocket()

    socket.on("user-status-changed", ({ userId, online }) => {
      setResults((prev) =>
        prev.map((u) =>
          u._id === userId ? { ...u, online } : u
        )
      )
    })

    return () => {
      socket.off("user-status-changed")
    }
  }, [])

  const searchUsers = useCallback(
    async (text: string) => {
      setQuery(text)
      if (!text.trim()) {
        setResults([])
        return
      }

      setSearching(true)
      try {
        const token = await SecureStore.getItemAsync("token")
        if (!token) return

        const res = await axios.get(
          `${base}/user/search-user?query=${encodeURIComponent(text)}`,
          { headers: { Authorization: `Bearer ${token}` } }
        )

        setResults(
          Array.isArray(res.data.users)
            ? res.data.users.map((u: UserResult) => ({
                ...u,
                online: false,
              }))
            : []
        )
      } finally {
        setSearching(false)
      }
    },
    [base]
  )

  useEffect(() => {
    const id = setTimeout(() => {
      if (query.trim()) searchUsers(query)
    }, 300)
    return () => clearTimeout(id)
  }, [query, searchUsers])

  const startChat = async (friendId: string) => {
    setStartingChatId(friendId)
    try {
      const token = await SecureStore.getItemAsync("token")
      if (!token) return

      const res = await axios.post(
        `${base}/chat/create-chat`,
        { friendId },
        { headers: { Authorization: `Bearer ${token}` } }
      )

      const chatId = res.data?.chatId
      if (!chatId) return

      router.replace({
        pathname: "/chat/[chatId]",
        params: { chatId },
      })
    } finally {
      setStartingChatId(null)
    }
  }

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
          backgroundColor: theme === "dark" ? "#111317" : "#fff",
          padding: 12,
          borderRadius: 12,
          fontSize: 16,
          color: theme === "dark" ? "#fff" : "#111",
          marginBottom: 12,
        },
        card: {
          flexDirection: "row",
          alignItems: "center",
          paddingVertical: 12,
          borderBottomWidth: 1,
          borderColor: theme === "dark" ? "#222" : "#e6e6e6",
        },
        avatar: {
          width: 52,
          height: 52,
          borderRadius: 26,
          marginRight: 12,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#374151",
        },
        name: {
          fontSize: 16,
          fontWeight: "700",
          color: theme === "dark" ? "#fff" : "#111",
        },
        status: {
          fontSize: 12,
          color: "#22c55e",
        },
        startBtn: {
          backgroundColor: "#3b82f6",
          paddingVertical: 8,
          paddingHorizontal: 12,
          borderRadius: 10,
        },
        startBtnText: {
          color: "#fff",
          fontWeight: "700",
        },
      }),
    [theme]
  )

  return (
    <SafeAreaView style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Search users"
        placeholderTextColor="#888"
        value={query}
        onChangeText={setQuery}
      />

      {searching ? (
        <ActivityIndicator size="large" />
      ) : (
        <FlatList
          data={results.filter((u) => u._id !== myUserId)}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.avatar}>
                <Text style={{ color: "#fff" }}>
                  {item.name?.[0]?.toUpperCase()}
                </Text>
              </View>

              <View style={{ flex: 1 }}>
                <Text style={styles.name}>{item.name}</Text>
                {item.online && <Text style={styles.status}>Online</Text>}
              </View>

              <TouchableOpacity
                style={styles.startBtn}
                onPress={() => startChat(item._id)}
                disabled={startingChatId === item._id}
              >
                {startingChatId === item._id ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Text style={styles.startBtnText}>Chat</Text>
                )}
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  )
}
