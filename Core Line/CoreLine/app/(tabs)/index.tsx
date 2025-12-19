import { useEffect, useState } from "react"
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  useColorScheme,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import axios from "axios"
import * as SecureStore from "expo-secure-store"
import { router } from "expo-router"

type User = {
  _id: string
  username: string
  profilePic?: string
}

type Chat = {
  _id: string
  participants: User[]
  lastMessage?: {
    text?: string
  }
}

export default function ChatsScreen() {
  const isDark = useColorScheme() === "dark"

  const bg = isDark ? "#0a0a0a" : "#f4f4f5"
  const card = isDark ? "#111827" : "#ffffff"
  const text = isDark ? "#ffffff" : "#0a0a0a"
  const subText = isDark ? "#9ca3af" : "#6b7280"
  const accent = "#3b82f6"

  const [me, setMe] = useState<User | null>(null)
  const [chats, setChats] = useState<Chat[]>([])
  const [loading, setLoading] = useState(true)
  const [userCache, setUserCache] = useState<Record<string, User>>({})

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    if (!me) return
    fetchMissingUsers()
  }, [chats, me])

  const loadData = async () => {
    try {
      const token = await SecureStore.getItemAsync("token")

      const userRes = await axios.get(
        `${process.env.EXPO_PUBLIC_URL}/user/get-user`,
        { headers: { Authorization: `Bearer ${token}` } }
      )

      const chatRes = await axios.get(
        `${process.env.EXPO_PUBLIC_URL}/chat/get-chats`,
        { headers: { Authorization: `Bearer ${token}` } }
      )

      setMe(userRes.data.data)
      setChats(chatRes.data.data)
    } finally {
      setLoading(false)
    }
  }

  const fetchMissingUsers = async () => {
    const token = await SecureStore.getItemAsync("token")
    const usernames = new Set<string>()

    chats.forEach((chat) => {
      chat.participants.forEach((p) => {
        if (p._id !== me?._id && !userCache[p.username]) {
          usernames.add(p.username)
        }
      })
    })

    if (usernames.size === 0) return

    for (const username of usernames) {
      const res = await axios.get(
        `${process.env.EXPO_PUBLIC_URL}/user/search-user?username=${username}`,
        { headers: { Authorization: `Bearer ${token}` } }
      )

      const user = res.data.find((u: User) => u.username === username)
      if (user) {
        setUserCache((prev) => ({ ...prev, [username]: user }))
      }
    }
  }

  const openChat = (chatId: string) => {
    router.push({
      pathname: "/chat/[chatId]",
      params: { chatId },
    })
  }

  const renderItem = ({ item }: { item: Chat }) => {
    if (!me) return null

    const otherUser = item.participants.find(
      (p) => p._id !== me._id
    )

    if (!otherUser) return null

    const cached = userCache[otherUser.username]

    return (
      <TouchableOpacity
        onPress={() => openChat(item._id)}
        activeOpacity={0.7}
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingVertical: 14,
          borderBottomWidth: 1,
          borderBottomColor: isDark ? "#1f2937" : "#e5e7eb",
        }}
      >
        <Image
          source={{
            uri: cached?.profilePic || "https://via.placeholder.com/150",
          }}
          style={{
            width: 48,
            height: 48,
            borderRadius: 24,
            marginRight: 14,
            backgroundColor: "#1f2937",
          }}
        />

        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: "600",
              color: text,
            }}
          >
            @{otherUser.username}
          </Text>

          <Text
            numberOfLines={1}
            style={{
              marginTop: 4,
              fontSize: 13,
              color: subText,
            }}
          >
            {item.lastMessage?.text || "No messages yet"}
          </Text>
        </View>
      </TouchableOpacity>
    )
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: bg }}>
      <View style={{ flex: 1, paddingHorizontal: 16 }}>
        <Text
          style={{
            fontSize: 22,
            fontWeight: "700",
            color: text,
            marginVertical: 14,
          }}
        >
          Chats
        </Text>

        {loading ? (
          <ActivityIndicator size="small" color={accent} />
        ) : chats.length === 0 ? (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              paddingHorizontal: 30,
            }}
          >
            <View
              style={{
                backgroundColor: card,
                padding: 24,
                borderRadius: 18,
              }}
            >
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "600",
                  color: text,
                  textAlign: "center",
                }}
              >
                No chats yet
              </Text>

              <Text
                style={{
                  marginTop: 8,
                  fontSize: 14,
                  color: subText,
                  textAlign: "center",
                  lineHeight: 20,
                }}
              >
                Start a new conversation and connect with people
              </Text>
            </View>
          </View>
        ) : (
          <FlatList
            data={chats}
            keyExtractor={(item) => item._id}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>

      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => router.push("/searchUser")}
        style={{
          position: "absolute",
          right: 20,
          bottom: 24,
          width: 56,
          height: 56,
          borderRadius: 28,
          backgroundColor: accent,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text style={{ fontSize: 28, color: "#ffffff" }}>+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  )
}
