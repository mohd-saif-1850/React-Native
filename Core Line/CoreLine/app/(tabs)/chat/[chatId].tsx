import { useEffect, useRef, useState } from "react"
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  useColorScheme,
  StatusBar,
  Image,
} from "react-native"
import { useLocalSearchParams } from "expo-router"
import socket from "../../../src/socket"
import * as SecureStore from "expo-secure-store"
import axios from "axios"

export default function OneToOneChatScreen() {
  const isDark = useColorScheme() === "dark"
  const { chatId } = useLocalSearchParams()
  const listRef = useRef<FlatList>(null)
  const typingTimeout = useRef<any>(null)

  const [msg, setMsg] = useState("")
  const [messages, setMessages] = useState<any[]>([])
  const [me, setMe] = useState<any>(null)
  const [typingUser, setTypingUser] = useState<string | null>(null)

  const getMe = async () => {
    const token = await SecureStore.getItemAsync("token")
    if (!token) return

    const res = await axios.get(
      `${process.env.EXPO_PUBLIC_URL}/user/get-user`,
      { headers: { Authorization: `Bearer ${token}` } }
    )

    setMe(res.data.data)
  }

  const loadMessages = async () => {
    const token = await SecureStore.getItemAsync("token")
    if (!token) return

    const res = await axios.get(
      `${process.env.EXPO_PUBLIC_URL}/message/${chatId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    )

    setMessages(res.data.data)
  }

  useEffect(() => {
    getMe()
    loadMessages()
    socket.connect()

    socket.on("receive-1-1-message", (message) => {
      setMessages((prev) => [...prev, message])
    })

    socket.on("typing-1-1", ({ username }) => {
      setTypingUser(username)
    })

    socket.on("stop-typing-1-1", () => {
      setTypingUser(null)
    })

    return () => {
      socket.off("receive-1-1-message")
      socket.off("typing-1-1")
      socket.off("stop-typing-1-1")
      socket.disconnect()
    }
  }, [])

  useEffect(() => {
    if (!me) return

    socket.emit("join-chat", {
      chatId,
      userId: me._id,
    })
  }, [me])

  useEffect(() => {
    requestAnimationFrame(() => {
      listRef.current?.scrollToEnd({ animated: true })
    })
  }, [messages])

  const sendMessage = () => {
    if (!msg.trim() || !me) return

    socket.emit("send-1-1-message", {
      chatId,
      senderId: me._id,
      text: msg,
    })

    socket.emit("stop-typing-1-1", {
      chatId,
      username: me.username,
    })

    setMsg("")
  }

  return (
    <KeyboardAvoidingView
      style={{
        flex: 1,
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
        backgroundColor: isDark ? "#0b0b0b" : "#f5f5f5",
      }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
    >
      <FlatList
        ref={listRef}
        data={messages}
        keyExtractor={(item) => item._id}
        contentContainerStyle={{
          paddingHorizontal: 14,
          paddingBottom: 90,
          paddingTop: 10,
        }}
        renderItem={({ item }) => {
          const isMe = item.senderId === me?._id

          return (
            <View
              style={{
                flexDirection: isMe ? "row-reverse" : "row",
                alignItems: "flex-end",
                marginVertical: 6,
              }}
            >
              <View
                style={{
                  backgroundColor: isMe
                    ? "#3b82f6"
                    : isDark
                    ? "#1f2933"
                    : "#e5e7eb",
                  padding: 12,
                  borderRadius: 18,
                  maxWidth: "75%",
                }}
              >
                <Text
                  style={{
                    color: isMe ? "#ffffff" : isDark ? "#e5e7eb" : "#111827",
                  }}
                >
                  {item.text}
                </Text>

                <Text
                  style={{
                    fontSize: 10,
                    marginTop: 4,
                    alignSelf: "flex-end",
                    color: isMe ? "#dbeafe" : "#9ca3af",
                  }}
                >
                  {new Date(item.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Text>
              </View>
            </View>
          )
        }}
      />

      {typingUser && typingUser !== me?.username && (
        <Text
          style={{
            marginLeft: 16,
            marginBottom: 6,
            fontSize: 12,
            fontStyle: "italic",
            color: isDark ? "#9ca3af" : "#6b7280",
          }}
        >
          {typingUser} is typing...
        </Text>
      )}

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 14,
          paddingVertical: 10,
          backgroundColor: isDark ? "#020617" : "#ffffff",
          borderTopWidth: 1,
          borderTopColor: isDark ? "#1f2933" : "#e5e7eb",
        }}
      >
        <TextInput
          value={msg}
          onChangeText={(text) => {
            setMsg(text)

            socket.emit("typing-1-1", {
              chatId,
              username: me?.username,
            })

            if (typingTimeout.current) {
              clearTimeout(typingTimeout.current)
            }

            typingTimeout.current = setTimeout(() => {
              socket.emit("stop-typing-1-1", {
                chatId,
                username: me?.username,
              })
            }, 800)
          }}
          placeholder="Message"
          placeholderTextColor={isDark ? "#9ca3af" : "#6b7280"}
          style={{
            flex: 1,
            backgroundColor: isDark ? "#020617" : "#f9fafb",
            color: isDark ? "#ffffff" : "#000000",
            paddingHorizontal: 16,
            paddingVertical: 10,
            borderRadius: 24,
          }}
        />

        <TouchableOpacity
          onPress={sendMessage}
          style={{
            marginLeft: 10,
            backgroundColor: "#3b82f6",
            paddingHorizontal: 18,
            paddingVertical: 10,
            borderRadius: 24,
          }}
        >
          <Text style={{ color: "#ffffff", fontWeight: "700" }}>
            Send
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  )
}
