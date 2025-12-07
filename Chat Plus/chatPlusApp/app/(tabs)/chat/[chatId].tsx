import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  StyleSheet,
  useColorScheme,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
  Pressable,
  LayoutAnimation,
  UIManager,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { io, Socket } from "socket.io-client";
import { useLocalSearchParams, router } from "expo-router";
import { Buffer } from "buffer";

type Message = {
  _id?: string;
  sender?: string | null;
  message: string;
  createdAt?: string;
  tempId?: string;
  pending?: boolean;
};

export default function ChatRoom(){
  const theme = useColorScheme();
  const { chatId } = useLocalSearchParams() as { chatId?: string };
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const [socketConnected, setSocketConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);
  const flatRef = useRef<FlatList<any>>(null);
  const BACKEND = process.env.EXPO_PUBLIC_BACKEND ?? "https://myapi.com/api/v1";
  const SOCKET_URL = process.env.EXPO_PUBLIC_SOCKET_URL ?? "https://myapi.com";

  if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme === "dark" ? "#050609" : "#eef2ff",
    },
    header: {
      height: 84,
      paddingHorizontal: 16,
      flexDirection: "row",
      alignItems: "center",
      borderBottomWidth: 1,
      borderColor: theme === "dark" ? "#111827" : "#e6e6ff",
      backgroundColor: theme === "dark" ? "#06070a" : "#f8fafc",
      shadowColor: "#000",
      shadowOpacity: 0.08,
      shadowRadius: 10,
      elevation: 4,
    },
    back: { marginRight: 12, padding: 6 },
    avatar: {
      width: 52,
      height: 52,
      borderRadius: 52,
      marginRight: 12,
      backgroundColor: theme === "dark" ? "#111827" : "#e6eefc",
      overflow: "hidden",
      justifyContent: "center",
      alignItems: "center",
      shadowColor: "#000",
      shadowOpacity: 0.12,
      shadowRadius: 8,
      elevation: 6,
    },
    avatarImg: { width: "100%", height: "100%", resizeMode: "cover" },
    headerText: { flex: 1 },
    title: { fontSize: 18, fontWeight: "800", color: theme === "dark" ? "#fff" : "#0f172a" },
    subtitle: { fontSize: 12, color: theme === "dark" ? "#9ca3af" : "#475569", marginTop: 2 },
    list: { paddingHorizontal: 16, paddingVertical: 18, flex: 1 },
    bubbleLeft: {
      maxWidth: "78%",
      backgroundColor: theme === "dark" ? "#0b1220" : "#ffffff",
      paddingVertical: 12,
      paddingHorizontal: 14,
      borderRadius: 16,
      marginBottom: 12,
      alignSelf: "flex-start",
      shadowColor: "#000",
      shadowOpacity: 0.08,
      shadowRadius: 12,
      elevation: 3,
      transform: [{ translateY: 0 }],
    },
    bubbleRight: {
      maxWidth: "78%",
      backgroundColor: theme === "dark" ? "#0b1220" : "#1e3a8a",
      paddingVertical: 12,
      paddingHorizontal: 14,
      borderRadius: 16,
      marginBottom: 12,
      alignSelf: "flex-end",
      shadowColor: "#000",
      shadowOpacity: 0.18,
      shadowRadius: 18,
      elevation: 8,
      transform: [{ translateY: -2 }],
    },
    messageTextLeft: { color: theme === "dark" ? "#e6eef8" : "#0f172a", fontSize: 15, lineHeight: 20 },
    messageTextRight: { color: "#fff", fontSize: 15, lineHeight: 20 },
    timeText: { marginTop: 8, fontSize: 11, color: theme === "dark" ? "#9ca3af" : "#94a3b8", alignSelf: "flex-end" },
    pendingDot: { width: 8, height: 8, borderRadius: 8, backgroundColor: "#f59e0b", marginLeft: 6 },
    inputArea: {
      padding: 12,
      borderTopWidth: 1,
      borderColor: theme === "dark" ? "#0b0b0b" : "#e6e6ff",
      backgroundColor: theme === "dark" ? "#05060a" : "#fbfdff",
      flexDirection: "row",
      alignItems: "center",
      shadowColor: "#000",
      shadowOpacity: 0.06,
      shadowRadius: 10,
      elevation: 10,
    },
    textInputWrap: {
      flex: 1,
      marginRight: 10,
      backgroundColor: theme === "dark" ? "#0f1724" : "#eef2ff",
      borderRadius: 28,
      paddingHorizontal: 16,
      paddingVertical: Platform.OS === "ios" ? 12 : 8,
      shadowColor: "#000",
      shadowOpacity: 0.06,
      shadowRadius: 8,
      elevation: 3,
    },
    textInput: { color: theme === "dark" ? "#fff" : "#0f172a", fontSize: 16, minHeight: 20, maxHeight: 120 },
    sendButton: {
      backgroundColor: theme === "dark" ? "#2563eb" : "#3b82f6",
      paddingVertical: 10,
      paddingHorizontal: 14,
      borderRadius: 22,
      justifyContent: "center",
      alignItems: "center",
      shadowColor: "#000",
      shadowOpacity: 0.18,
      shadowRadius: 12,
      elevation: 6,
    },
    sendText: { color: "#fff", fontWeight: "800", letterSpacing: 0.4 },
    empty: { flex: 1, justifyContent: "center", alignItems: "center", paddingHorizontal: 40 },
    emptyTitle: { fontSize: 18, fontWeight: "800", color: theme === "dark" ? "#fff" : "#0f172a", marginBottom: 8 },
    emptySub: { fontSize: 14, color: theme === "dark" ? "#9ca3af" : "#475569", textAlign: "center" },
  });

  const decodeJwt = (token: string) => {
    try {
      const parts = token.split(".");
      if (parts.length < 2) return null;
      const payload = parts[1];
      const padded = payload.padEnd(payload.length + (4 - (payload.length % 4)) % 4, "=");
      const decoded = JSON.parse(Buffer.from(padded, "base64").toString("utf8"));
      return decoded as any;
    } catch {
      return null;
    }
  };

  const fetchMessages = useCallback(
    async (tk: string) => {
      try {
        setError("");
        const res = await axios.get(`${BACKEND.replace(/\/$/, "")}/chat/${chatId}/messages`, {
          headers: { Authorization: `Bearer ${tk}` },
        });
        const msgs = Array.isArray(res.data.messages) ? res.data.messages : [];
        setMessages(msgs);
        setLoading(false);
        setTimeout(() => flatRef.current?.scrollToEnd({ animated: true }), 200);
      } catch (err: any) {
        setLoading(false);
        setError("Failed to load messages");
      }
    },
    [chatId, BACKEND]
  );

  useEffect(() => {
    let mounted = true;
    const loadUserAndMessages = async () => {
      const token = await SecureStore.getItemAsync("token");
      if (!token) {
        setLoading(false);
        return;
      }
      const decoded = decodeJwt(token);
      const id = decoded && (decoded.sub || decoded.userId) ? String(decoded.sub ?? decoded.userId) : null;
      if (id) setUserId(id);
      await fetchMessages(token);
      setLoading(false);
    };
    if (mounted) loadUserAndMessages();
    return () => {
      mounted = false;
    };
  }, [chatId, fetchMessages]);

  useEffect(() => {
    if (!userId) return;
    let mounted = true;
    const initSocket = async () => {
      const token = await SecureStore.getItemAsync("token");
      const socket = io(SOCKET_URL, {
        transports: ["websocket"],
        auth: { token },
      });
      socketRef.current = socket;
      socket.on("connect", () => {
        setSocketConnected(true);
        socket.emit("join-room", chatId);
        socket.emit("user-online", userId);
      });
      socket.on("disconnect", () => {
        setSocketConnected(false);
      });
      socket.on("receive-message", (msg: Message) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setMessages((prev) => {
          const idx = prev.findIndex((m) => m.pending && m.message === msg.message && m.sender === userId);
          if (idx > -1) {
            const copy = [...prev];
            copy[idx] = msg;
            return copy;
          }
          return [...prev, msg];
        });
        setTimeout(() => flatRef.current?.scrollToEnd({ animated: true }), 120);
      });
      socket.on("message-delivered", () => {});
      socket.on("message-seen", () => {});
      socket.on("typing", () => {});
      socket.on("stop-typing", () => {});
      socket.on("connect_error", (err) => {
        setError("Socket connect error");
      });
    };
    if (mounted) initSocket();
    return () => {
      mounted = false;
      socketRef.current?.disconnect();
      socketRef.current = null;
    };
  }, [userId, chatId]);

  const sendMessage = async () => {
    if (!userId) return;
    if (!text.trim()) return;

    if (!socketRef.current || !socketRef.current.connected) {
      setError("Socket not ready");
      return;
    }

    setSending(true);
    const final = text.trim();
    setText("");

    const tempId = `temp-${Date.now()}`;
    const tempMsg: Message = {
      tempId,
      sender: userId,
      message: final,
      createdAt: new Date().toISOString(),
      pending: true,
    };

    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setMessages((prev) => [...prev, tempMsg]);
    flatRef.current?.scrollToEnd({ animated: true });

    try {
      socketRef.current.emit("send-message", {
        roomId: chatId,
        message: final,
        sender: userId,
        tempId,
      });
      setSending(false);
    } catch {
      setSending(false);
      setError("Failed to send message");
    }
  };

  const renderItem = ({ item }: { item: Message }) => {
    const isMe = item.sender === userId || item.sender === "me";
    return (
      <View style={{ marginVertical: 6 }}>
        <View style={isMe ? styles.bubbleRight : styles.bubbleLeft}>
          <Text style={isMe ? styles.messageTextRight : styles.messageTextLeft}>{item.message}</Text>
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "flex-end" }}>
            <Text style={styles.timeText}>
              {item.createdAt ? new Date(item.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : ""}
            </Text>
            {item.pending ? <View style={styles.pendingDot} /> : null}
          </View>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.back} onPress={() => router.back()}>
            <Text style={{ color: theme === "dark" ? "#fff" : "#0f172a" }}>Back</Text>
          </TouchableOpacity>
          <View style={styles.avatar}>
            <Image source={require("../../../assets/logo.png")} style={styles.avatarImg} />
          </View>
          <View style={styles.headerText}>
            <Text style={styles.title}>Chat</Text>
            <Text style={styles.subtitle}>Connecting...</Text>
          </View>
        </View>
        <View style={{ flex: 1, justifyContent: "center" }}>
          <ActivityIndicator size="large" color={theme === "dark" ? "#60a5fa" : "#3b82f6"} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.back} onPress={() => router.back()}>
          <Text style={{ color: theme === "dark" ? "#fff" : "#0f172a" }}>Back</Text>
        </TouchableOpacity>
        <View style={styles.avatar}>
          <Image source={require("../../../assets/logo.png")} style={styles.avatarImg} />
        </View>
        <View style={styles.headerText}>
          <Text style={styles.title}>Chat</Text>
          <Text style={styles.subtitle}>{socketConnected ? "Active" : "Connecting..."}</Text>
        </View>
      </View>

      {error ? (
        <View style={{ padding: 12 }}>
          <Text style={{ color: "red", textAlign: "center" }}>{error}</Text>
        </View>
      ) : null}

      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <FlatList
            ref={flatRef}
            style={styles.list}
            data={messages}
            keyExtractor={(item) => item._id ?? item.tempId ?? Math.random().toString()}
            renderItem={renderItem}
            onContentSizeChange={() => flatRef.current?.scrollToEnd({ animated: true })}
            onLayout={() => flatRef.current?.scrollToEnd({ animated: true })}
          />
        </TouchableWithoutFeedback>

        <View style={styles.inputArea}>
          <View style={styles.textInputWrap}>
            <TextInput
              editable={!!userId && socketConnected}
              placeholder="Type a message"
              placeholderTextColor={theme === "dark" ? "#9ca3af" : "#94a3b8"}
              value={text}
              onChangeText={setText}
              style={styles.textInput}
              multiline
            />
          </View>
          <Pressable
            style={[styles.sendButton, (!userId || !socketConnected || sending || !text.trim()) && { opacity: 0.4 }]}
            onPress={sendMessage}
            disabled={!userId || !socketConnected || sending || !text.trim()}
          >
            {sending ? <ActivityIndicator color="#fff" /> : <Text style={styles.sendText}>Send</Text>}
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
