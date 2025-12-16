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
  Modal,
  StyleSheet
} from "react-native"
import socket from "../../src/socket"
import * as SecureStore from "expo-secure-store"
import axios from "axios"
import { router } from "expo-router"

export default function ChatScreen() {
  const isDark = useColorScheme() === "dark"
  const listRef = useRef<FlatList>(null)

  const [msg, setMsg] = useState("")
  const [messages, setMessages] = useState<any[]>([])
  const [me, setMe] = useState<any>(null)
  const [open, setOpen] = useState(false)

  const getMe = async () => {
    const token = await SecureStore.getItemAsync("token")
    if (!token) return

    const res = await axios.get(
      `${process.env.EXPO_PUBLIC_URL}/user/get-user`,
      { headers: { Authorization: `Bearer ${token}` } }
    )

    setMe(res.data.data)
  }

  useEffect(() => {
    getMe()
    socket.connect()

    socket.on("receiveMessage", (data) => {
      setMessages((prev) => [
        ...prev,
        {
          ...data,
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ])
    })

    return () => {
      socket.off("receiveMessage")
      socket.disconnect()
    }
  }, [])

  useEffect(() => {
    requestAnimationFrame(() => {
      listRef.current?.scrollToEnd({ animated: true })
    })
  }, [messages])

  const sendMessage = () => {
    if (!msg.trim() || !me) return

    socket.emit("sendMessage", {
      userId: me._id,
      image: me.profilePic,
      username: me.username,
      msg,
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
            onPress={() => setOpen(true)}
            style={{
              width: 36,
              height: 36,
              borderRadius: 18,
              backgroundColor: isDark ? "#1f2933" : "#e5e7eb",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontWeight: "700",
                color: isDark ? "#ffffff" : "#111827",
              }}
            >
              i
            </Text>
          </TouchableOpacity>
        </View>

        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={(_, i) => i.toString()}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{
            paddingHorizontal: 14,
            paddingTop: 12,
            paddingBottom: 90,
          }}
          onContentSizeChange={() => {
            listRef.current?.scrollToEnd({ animated: true })
          }}
          renderItem={({ item }) => {
            if (!me) return null

            const isMe = item.userId === me._id

            return (
              <View
                style={{
                  flexDirection: isMe ? "row-reverse" : "row",
                  alignItems: "flex-end",
                  marginVertical: 8,
                }}
              >
                <Image
                  source={{ uri: item.image }}
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 18,
                    marginHorizontal: 8,
                  }}
                />

                <View style={{ maxWidth: "72%" }}>
                  <View
                    style={{
                      backgroundColor: isMe
                        ? "#3b82f6"
                        : isDark
                        ? "#1f2933"
                        : "#e5e7eb",
                      paddingVertical: 10,
                      paddingHorizontal: 14,
                      borderRadius: 18,
                    }}
                  >
                    <Text
                      style={{
                        color: isMe
                          ? "#ffffff"
                          : isDark
                          ? "#e5e7eb"
                          : "#111827",
                        fontSize: 15,
                      }}
                    >
                      {item.msg}
                    </Text>
                    

                    <Text
                      style={{
                        fontSize: 10,
                        marginTop: 4,
                        alignSelf: "flex-end",
                        color: isMe
                          ? "#dbeafe"
                          : isDark
                          ? "#9ca3af"
                          : "#6b7280",
                      }}
                    >
                      {item.time}
                    </Text>
                  </View>
                  <View
                    style={{
                      alignSelf: "flex-start",
                      marginBottom: 4,
                      paddingHorizontal: 10,
                      paddingVertical: 4,
                      borderRadius: 999,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 11,
                        fontWeight: "700",
                        color: isDark ? "#93c5fd" : "#2563eb",
                        letterSpacing: 0.3,
                      }}
                    >
                      {item.username}
                    </Text>
                  </View>
                </View>
              </View>
            )
          }}
        />

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
            onChangeText={setMsg}
            placeholder="Message"
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

      <Modal visible={open} transparent animationType="fade">
        <View style={styles.overlay}>
          <View
            style={[
              styles.modal,
              { backgroundColor: isDark ? "#020617" : "#ffffff" },
            ]}
          >
            <TouchableOpacity
              onPress={() => setOpen(false)}
              style={styles.closeBtn}
            >
              <Text
                style={[
                  styles.closeText,
                  { color: isDark ? "#e5e7eb" : "#111827" },
                ]}
              >
                ✕
              </Text>
            </TouchableOpacity>

            <View style={styles.iconWrap}>
              <Text style={styles.icon}>🌍</Text>
            </View>

            <Text
              style={[
                styles.title,
                { color: isDark ? "#ffffff" : "#020617" },
              ]}
            >
              Global Chat Notice
            </Text>

            <Text
              style={[
                styles.message,
                { color: isDark ? "#9ca3af" : "#475569" },
              ]}
            >
              This is a global space where everyone can join the conversation.
              Please keep the tone friendly, respectful, and welcoming for all.
            </Text>

            <View
              style={[
                styles.noticeBox,
                { backgroundColor: isDark ? "#34384bff" : "#f1f5f9" },
              ]}
            >
              <Text
                style={[
                  styles.noticeText,
                  { color: isDark ? "#f45a5aff" : "#b91c1c" },
                ]}
              >
                Messages here are temporary. Once you leave the app, they will be gone.
              </Text>
            </View>

            <TouchableOpacity
              onPress={() => setOpen(false)}
              style={styles.actionBtn}
            >
              <Text style={styles.actionText}>I Understand</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },

  modal: {
    width: "90%",
    borderRadius: 24,
    padding: 24,
  },

  closeBtn: {
    position: "absolute",
    top: 14,
    right: 14,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },

  closeText: {
    fontSize: 18,
    fontWeight: "700",
  },

  iconWrap: {
    alignSelf: "center",
    marginBottom: 12,
  },

  icon: {
    fontSize: 42,
  },

  title: {
    fontSize: 20,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 10,
  },

  message: {
    fontSize: 14,
    lineHeight: 22,
    textAlign: "center",
  },

  noticeBox: {
    marginTop: 18,
    padding: 14,
    borderRadius: 14,
  },

  noticeText: {
    fontSize: 13,
    textAlign: "center",
    fontWeight: "600",
    lineHeight: 20,
  },

  actionBtn: {
    marginTop: 22,
    backgroundColor: "#3b82f6",
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: "center",
  },

  actionText: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: 0.4,
  },
})
