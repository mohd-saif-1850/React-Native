import { useEffect, useState } from "react"
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
} from "react-native"
import socket from "../../src/socket"
import * as SecureStore from "expo-secure-store"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { router } from "expo-router"

export default function App() {
  const scheme = useColorScheme()
  const isDark = scheme === "dark"

  const [msg, setMsg] = useState("")
  const [messages, setMessages] = useState<any[]>([])

  useEffect(() => {
    socket.connect()

    socket.on("connect", () => {
      console.log("Connected:", socket.id)
    })

    socket.on("receiveMessage", (data) => {
      setMessages((prev) => [...prev, data])
    })

    return () => {
      socket.off("connect")
      socket.off("receiveMessage")
    }
  }, [])

  const sendMessage = () => {
    if (!msg.trim()) return

    socket.emit("sendMessage", {
      msg,
      userId: socket.id,
    })

    setMsg("")
  }

  const logout = async () => {
    await Promise.all([
      SecureStore.deleteItemAsync("token"),
      AsyncStorage.removeItem("tutorial"),
    ])

    if (socket.connected) {
      socket.removeAllListeners()
      socket.disconnect()
    }

    router.replace("/")
  }

  return (
    <KeyboardAvoidingView
      style={{
        flex: 1,
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
        backgroundColor: isDark ? "#0b0b0b" : "#f5f5f5",
      }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={{ flex: 1 }}>
        <View
          style={{
            paddingHorizontal: 16,
            paddingVertical: 14,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: isDark ? "#020617" : "#ffffff",
            borderBottomWidth: 1,
            borderBottomColor: isDark ? "#1f2933" : "#e5e7eb",
          }}
        >
          <Text
            style={{
              fontSize: 18,
              fontWeight: "700",
              color: isDark ? "#ffffff" : "#111827",
            }}
          >
            Chat
          </Text>

          <TouchableOpacity
            onPress={logout}
            style={{
              backgroundColor: "#ef4444",
              paddingHorizontal: 14,
              paddingVertical: 6,
              borderRadius: 20,
            }}
          >
            <Text style={{ color: "#ffffff", fontWeight: "600" }}>
              Logout
            </Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={messages}
          keyExtractor={(_, i) => i.toString()}
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingTop: 12,
            paddingBottom: 110,
          }}
          keyboardShouldPersistTaps="handled"
          renderItem={({ item }) => (
            <View
              style={{
                alignSelf:
                  item.userId === socket.id ? "flex-end" : "flex-start",
                backgroundColor:
                  item.userId === socket.id
                    ? "#3b82f6"
                    : isDark
                    ? "#1f2933"
                    : "#e5e7eb",
                paddingVertical: 12,
                paddingHorizontal: 14,
                borderRadius: 18,
                marginVertical: 6,
                maxWidth: "75%",
              }}
            >
              <Text
                style={{
                  color:
                    item.userId === socket.id
                      ? "#ffffff"
                      : isDark
                      ? "#e5e7eb"
                      : "#111827",
                  fontSize: 15,
                  lineHeight: 20,
                }}
              >
                {item.msg}
              </Text>
            </View>
          )}
        />

        <View
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 14,
            paddingVertical: 12,
            backgroundColor: isDark ? "#020617" : "#ffffff",
            borderTopWidth: 1,
            borderTopColor: isDark ? "#1f2933" : "#e5e7eb",
          }}
        >
          <TextInput
            value={msg}
            onChangeText={setMsg}
            placeholder="Type a message"
            placeholderTextColor={isDark ? "#9ca3af" : "#6b7280"}
            style={{
              flex: 1,
              backgroundColor: isDark ? "#020617" : "#f9fafb",
              color: isDark ? "#ffffff" : "#000000",
              paddingHorizontal: 16,
              paddingVertical: 10,
              borderRadius: 24,
              fontSize: 16,
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
      </View>
    </KeyboardAvoidingView>
  )
}
