import React, { useCallback, useEffect, useState } from "react"
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  StyleSheet,
  useColorScheme,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import axios from "axios"
import * as SecureStore from "expo-secure-store"
import { router } from "expo-router"

type ChatItem = {
  chatId: string
  friend: {
    name: string
    username?: string
    image?: string | null
    online?: boolean
    lastSeen?: string | null
  }
  lastMessage?: string | null
  lastMessageTime?: string | null
}

export default function Chats() {
  const theme = useColorScheme()
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [chats, setChats] = useState<ChatItem[]>([])
  const [error, setError] = useState("")

  const fetchChats = useCallback(async () => {
    try {
      setError("")
      const token = await SecureStore.getItemAsync("token")
      if (!token) {
        setChats([])
        setLoading(false)
        return
      }

      const res = await axios.get(`${process.env.EXPO_PUBLIC_BACKEND}/chat/all-chats`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      setChats(Array.isArray(res.data.chats) ? res.data.chats : [])
      setLoading(false)
      setRefreshing(false)
    } catch {
      setLoading(false)
      setRefreshing(false)
      setError("Failed to load chats")
    }
  }, [])

  useEffect(() => {
    fetchChats()
  }, [fetchChats])

  const onRefresh = useCallback(() => {
    setRefreshing(true)
    fetchChats()
  }, [fetchChats])

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme === "dark" ? "#0b0b0b" : "#f6f7fb",
      paddingHorizontal: 15,
    },
    chatCard: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 15,
      borderBottomWidth: 1,
      borderColor: theme === "dark" ? "#222" : "#e6e6e6",
    },
    avatar: {
      width: 55,
      height: 55,
      borderRadius: 28,
      marginRight: 15,
      backgroundColor: theme === "dark" ? "#1f2937" : "#e5e7eb",
      justifyContent: "center",
      alignItems: "center",
      overflow: "hidden",
    },
    avatarImg: {
      width: "100%",
      height: "100%",
    },
    initials: {
      color: theme === "dark" ? "#fff" : "#111827",
      fontWeight: "700",
      fontSize: 18,
    },
    name: {
      fontSize: 18,
      fontWeight: "700",
      color: theme === "dark" ? "#fff" : "#111",
    },
    message: {
      fontSize: 15,
      color: theme === "dark" ? "#aaa" : "#555",
      marginTop: 3,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 30,
    },
    emptyImage: {
      width: 140,
      height: 140,
      marginBottom: 20,
      opacity: 0.95,
    },
    emptyText: {
      fontSize: 20,
      fontWeight: "700",
      color: theme === "dark" ? "#fff" : "#111",
      marginTop: 8,
    },
    emptySub: {
      fontSize: 15,
      color: theme === "dark" ? "#aaa" : "#666",
      marginTop: 8,
      textAlign: "center",
    },
    addButton: {
      position: "absolute",
      bottom: 25,
      right: 25,
      backgroundColor: theme === "dark" ? "#2563eb" : "#3b82f6",
      width: 60,
      height: 60,
      borderRadius: 30,
      justifyContent: "center",
      alignItems: "center",
      elevation: 6,
    },
    addButtonText: {
      color: "#fff",
      fontSize: 34,
      marginTop: -4,
    },
    headerError: {
      color: "red",
      textAlign: "center",
      marginVertical: 8,
    },
  })

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color={theme === "dark" ? "#60a5fa" : "#3b82f6"} />
      </SafeAreaView>
    )
  }

  if (chats.length === 0) {
    return (
      <SafeAreaView style={styles.emptyContainer}>
        <Image source={require("../../assets/start-chat.png")} style={styles.emptyImage} />
        <Text style={styles.emptyText}>Start Messaging</Text>
        <Text style={styles.emptySub}>Your chats will appear here once you start a conversation.</Text>

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => router.push("/new-chat")}
        >
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={chats}
        keyExtractor={(item) => item.chatId}
        refreshing={refreshing}
        onRefresh={onRefresh}
        renderItem={({ item }) => {
          const initials = item.friend?.name?.[0]?.toUpperCase() ?? "U"

          return (
            <TouchableOpacity
              style={styles.chatCard}
              onPress={() =>
                router.push({
                  pathname: "/chat/[chatId]",
                  params: { chatId: item.chatId },
                })
              }
            >
              <View style={styles.avatar}>
                {item.friend?.image ? (
                  <Image source={{ uri: item.friend.image }} style={styles.avatarImg} />
                ) : (
                  <Text style={styles.initials}>{initials}</Text>
                )}
              </View>
              <View>
                <Text style={styles.name}>
                  {item.friend?.name ?? item.friend?.username ?? "Unknown"}
                </Text>
                <Text style={styles.message}>{item.lastMessage ?? "Say hi 👋"}</Text>
              </View>
            </TouchableOpacity>
          )
        }}
      />

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => router.push("/new-chat")}
      >
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  )
}
