import { useEffect, useState } from "react"
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Image,
  useColorScheme,
  ActivityIndicator,
} from "react-native"
import axios from "axios"
import * as SecureStore from "expo-secure-store"
import { router } from "expo-router"
import { SafeAreaView } from "react-native-safe-area-context"
import useDebounce from "@/src/debouncing"

export default function SearchUserScreen() {
  const isDark = useColorScheme() === "dark"

  const [query, setQuery] = useState("")
  const [results, setResults] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const debouncing = useDebounce(query,500)

  const searchUsers = async (text: string) => {
    if (!text.trim()) {
      setResults([])
      return
    }

    setLoading(true)

    const token = await SecureStore.getItemAsync("token")

    try {
      const res = await axios.get(
        `${process.env.EXPO_PUBLIC_URL}/user/search-user?username=${text}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )

      setResults(res.data)
    } catch (err) {
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (debouncing.trim()) {
      searchUsers(debouncing)
    } else {
      setResults([])
    }
  },[debouncing])

  const startChat = async (receiverUsername: string) => {
    const token = await SecureStore.getItemAsync("token")

    const res = await axios.post(
      `${process.env.EXPO_PUBLIC_URL}/chat/create-chat`,
      { receiverUsername },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    )

    const chat = res.data.data

    router.push({
      pathname: "/chat/[chatId]",
      params: { chatId: chat._id },
    })
  }

  return (
    
    <View
      style={{
        flex: 1,
        backgroundColor: isDark ? "#0b0b0b" : "#f5f5f5",
        paddingTop: 20,
      }}
    >
      <SafeAreaView>
      <Text
        style={{
          fontSize: 20,
          fontWeight: "800",
          marginHorizontal: 16,
          marginBottom: 12,
          color: isDark ? "#ffffff" : "#111827",
        }}
      >
        New Chat
      </Text>

      <TextInput
        value={query}
        onChangeText={setQuery}
        placeholder="Search by username"
        placeholderTextColor={isDark ? "#9ca3af" : "#6b7280"}
        style={{
          marginHorizontal: 16,
          marginBottom: 10,
          backgroundColor: isDark ? "#020617" : "#ffffff",
          color: isDark ? "#ffffff" : "#000000",
          paddingHorizontal: 16,
          paddingVertical: 12,
          borderRadius: 14,
          fontSize: 16,
        }}
      />

      {loading && (
        <ActivityIndicator
          size="small"
          color={isDark ? "#ffffff" : "#000000"}
          style={{ marginTop: 20 }}
        />
      )}

      <FlatList
        data={results}
        keyExtractor={(item) => item._id}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingHorizontal: 16 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => startChat(item.username)}
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingVertical: 14,
              borderBottomWidth: 1,
              borderBottomColor: isDark ? "#1f2933" : "#e5e7eb",
            }}
          >
            <Image
              source={{ uri: item.profilePic }}
              style={{
                width: 44,
                height: 44,
                borderRadius: 22,
                marginRight: 12,
              }}
            />

            <View>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "700",
                  color: isDark ? "#ffffff" : "#111827",
                }}
              >
                @{item.username}
              </Text>

              <Text
                style={{
                  fontSize: 12,
                  color: isDark ? "#9ca3af" : "#6b7280",
                }}
              >
                Tap to chat
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />
      </SafeAreaView>
    </View>
  )
}
