import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  useColorScheme,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

export default function Contact() {
  const theme = useColorScheme();

  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");

  const colors = {
    bg: theme === "dark" ? "#0D0D0D" : "#F8F9FA",
    text: theme === "dark" ? "#FFFFFF" : "#111111",
    inputBg: theme === "dark" ? "#1A1A1A" : "#FFFFFF",
    inputBorder: theme === "dark" ? "#2A2A2A" : "#E5E5E5",
    placeholder: theme === "dark" ? "#999" : "#777",
  };

  const handleSubmit = () => {
    alert("Message sent ✅ We will contact you soon.");
    router.back();
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]}>
      <View style={styles.inner}>
        <Text style={[styles.title, { color: colors.text }]}>Contact Us 📩</Text>

        <Text style={[styles.subtitle, { color: colors.placeholder }]}>
          Have questions? We’re here to help.
        </Text>

        <TextInput
          placeholder="Your Name"
          placeholderTextColor={colors.placeholder}
          value={name}
          onChangeText={setName}
          style={[
            styles.input,
            {
              backgroundColor: colors.inputBg,
              borderColor: colors.inputBorder,
              color: colors.text,
            },
          ]}
        />

        <TextInput
          placeholder="Your Email"
          placeholderTextColor={colors.placeholder}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          style={[
            styles.input,
            {
              backgroundColor: colors.inputBg,
              borderColor: colors.inputBorder,
              color: colors.text,
            },
          ]}
        />

        <TextInput
          placeholder="Your message..."
          placeholderTextColor={colors.placeholder}
          value={message}
          onChangeText={setMessage}
          multiline
          style={[
            styles.textArea,
            {
              backgroundColor: colors.inputBg,
              borderColor: colors.inputBorder,
              color: colors.text,
            },
          ]}
        />

        <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
          <Text style={styles.submitText}>Send Message</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 26 },
  inner: { marginTop: 40, gap: 18 },
  title: { fontSize: 30, fontWeight: "700" },
  subtitle: { fontSize: 16, marginBottom: 10 },
  input: {
    width: "100%",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1.5,
    fontSize: 16,
  },
  textArea: {
    width: "100%",
    height: 140,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1.5,
    fontSize: 16,
    textAlignVertical: "top",
  },
  submitBtn: {
    backgroundColor: "#4F46E5",
    paddingVertical: 16,
    borderRadius: 14,
    marginTop: 10,
  },
  submitText: {
    color: "#FFFFFF",
    textAlign: "center",
    fontSize: 17,
    fontWeight: "600",
  },
});
