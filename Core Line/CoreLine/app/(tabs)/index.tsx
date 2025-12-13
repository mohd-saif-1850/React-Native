import { useEffect, useState } from "react";
import { View, Text, TextInput, Button, FlatList } from "react-native";
import socket from "../../src/socket";

export default function App() {
  const [msg, setMsg] = useState("");
  const [messages, setMessages] = useState<any[]>([]);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to socket:", socket.id);
    });

    socket.on("receiveMessage", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => {
      socket.off("receiveMessage");
      socket.disconnect();
    };
  }, []);

  const sendMessage = () => {
    if (!msg) return;

    socket.emit("sendMessage", { msg });
    setMsg("");
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <FlatList
        data={messages}
        keyExtractor={(_, i) => i.toString()}
        renderItem={({ item }) => (
          <Text>
            {item.userId}: {item.msg}
          </Text>
        )}
      />

      <TextInput
        value={msg}
        onChangeText={setMsg}
        placeholder="Type message"
        style={{
          borderWidth: 1,
          padding: 10,
          marginVertical: 10,
        }}
      />

      <Button title="Send" onPress={sendMessage} />
    </View>
  );
}
