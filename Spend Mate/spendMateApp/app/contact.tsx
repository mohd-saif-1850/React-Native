import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  Linking,
  Modal,
  Animated,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";
import { router } from "expo-router";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

export default function Contact() {
  const theme = useColorScheme();

  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const [showPopup, setShowPopup] = useState(false);

  const popupScale = useRef(new Animated.Value(0.5)).current;
  const popupOpacity = useRef(new Animated.Value(0)).current;

  const colors = {
    bg: theme === "dark" ? "#0C0C0C" : "#F8F9FA",
    text: theme === "dark" ? "#FFFFFF" : "#111111",
    inputBorder: theme === "dark" ? "#2E2E2E" : "#E5E5E5",
    placeholder: theme === "dark" ? "#8F8F8F" : "#777",
    card: theme === "dark" ? "#1A1A1A" : "#FFFFFF",
    primary: "#4F46E5",
  };

  const animatePopup = () => {
    setShowPopup(true);

    Animated.parallel([
      Animated.timing(popupOpacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.spring(popupScale, {
        toValue: 1,
        speed: 10,
        bounciness: 6,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const closePopup = () => {
    Animated.parallel([
      Animated.timing(popupOpacity, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(popupScale, {
        toValue: 0.5,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setShowPopup(false);
      router.back();
    });
  };

  const handleSubmit = async () => {
    if (!name.trim() || !email.trim() || !message.trim()) {
      animatePopup();
      return;
    }

    try {
      setLoading(true);

      await axios.post(`${process.env.EXPO_PUBLIC_BACKEND}/feedback/create-feedback`, {
        name,
        email,
        message,
      });

      setLoading(false);
      setName("");
      setEmail("");
      setMessage("");

      animatePopup();
    } catch {
      setLoading(false);
      animatePopup();
    }
  };

  const emailClick = () => {
    Linking.openURL("mailto:mohdsaif18500@gmail.com");
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]}>
      <View style={styles.inner}>
        <View style={styles.headerBox}>
          <Ionicons name="chatbubbles-outline" size={34} color={colors.primary} />
          <Text style={[styles.title, { color: colors.text }]}>Contact Us</Text>
        </View>

        <Text style={[styles.subtitle, { color: colors.placeholder }]}>
          Have questions? Need help? We’re here for you.
        </Text>

        <View style={[styles.inputBox, { borderColor: colors.inputBorder }]}>
          <Ionicons name="person-outline" size={20} color={colors.placeholder} />
          <TextInput
            placeholder="Your Name"
            placeholderTextColor={colors.placeholder}
            value={name}
            onChangeText={setName}
            style={[styles.input, { color: colors.text }]}
          />
        </View>

        <View style={[styles.inputBox, { borderColor: colors.inputBorder }]}>
          <MaterialIcons name="alternate-email" size={20} color={colors.placeholder} />
          <TextInput
            placeholder="Your Email"
            placeholderTextColor={colors.placeholder}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            style={[styles.input, { color: colors.text }]}
          />
        </View>

        <View style={[styles.textAreaBox, { borderColor: colors.inputBorder }]}>
          <Ionicons name="create-outline" size={22} color={colors.placeholder} />
          <TextInput
            placeholder="Your message..."
            placeholderTextColor={colors.placeholder}
            value={message}
            onChangeText={setMessage}
            multiline
            style={[styles.textArea, { color: colors.text }]}
          />
        </View>

        <TouchableOpacity
          style={[
            styles.submitBtn,
            { backgroundColor: colors.primary, opacity: loading ? 0.6 : 1 },
          ]}
          disabled={loading}
          onPress={handleSubmit}
        >
          <Ionicons name="send" size={18} color="#fff" />
          <Text style={styles.submitText}>{loading ? "Sending..." : "Send Message"}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.footer}
          onPress={() => Linking.openURL("https://github.com/mohd-saif-1850")}
        >
          <Ionicons name="logo-github" size={22} color={colors.placeholder} />
          <Text style={[styles.footerText, { color: colors.placeholder }]}>
            Made by <Text style={{ fontWeight: "700", color: colors.text }}>Mohd Saif</Text>
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.emailBox} onPress={emailClick}>
          <Ionicons name="mail-outline" size={22} color={colors.primary} />
          <Text style={[styles.emailText, { color: colors.primary }]}>
            mohdsaif18500@gmail.com
          </Text>
        </TouchableOpacity>
      </View>

      <Modal visible={showPopup} transparent animationType="none">
        <View style={styles.popupOverlay}>
          <Animated.View
            style={[
              styles.popupBox,
              {
                opacity: popupOpacity,
                transform: [{ scale: popupScale }],
                backgroundColor: colors.card,
              },
            ]}
          >
            <Ionicons name="checkmark-circle" size={60} color={colors.primary} />
            <Text style={[styles.popupTitle, { color: colors.text }]}>
              Message Sent!
            </Text>

            <TouchableOpacity
              style={[styles.popupBtn, { backgroundColor: colors.primary }]}
              onPress={closePopup}
            >
              <Text style={styles.popupBtnText}>Okay</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 26 },
  inner: { marginTop: 40, gap: 18 },

  headerBox: { flexDirection: "row", alignItems: "center", gap: 12 },
  title: { fontSize: 32, fontWeight: "800" },
  subtitle: { fontSize: 15, marginTop: -6 },

  inputBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderWidth: 1.5,
    paddingHorizontal: 14,
    borderRadius: 12,
    paddingVertical: 12,
  },

  input: { flex: 1, fontSize: 16 },

  textAreaBox: {
    flexDirection: "row",
    gap: 12,
    borderWidth: 1.5,
    paddingHorizontal: 14,
    borderRadius: 12,
    paddingVertical: 14,
  },

  textArea: {
    flex: 1,
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: "top",
  },

  submitBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 16,
    borderRadius: 14,
    marginTop: 10,
    justifyContent: "center",
  },

  submitText: { color: "#FFFFFF", fontSize: 17, fontWeight: "600" },

  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    marginTop: 18,
  },

  footerText: { fontSize: 15 },

  emailBox: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },

  emailText: { fontSize: 15, fontWeight: "600" },

  popupOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
  },

  popupBox: {
    width: "75%",
    padding: 25,
    borderRadius: 20,
    alignItems: "center",
    gap: 18,
  },

  popupTitle: {
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
  },

  popupBtn: {
    paddingVertical: 12,
    paddingHorizontal: 22,
    borderRadius: 12,
  },

  popupBtnText: { color: "#fff", fontWeight: "700", fontSize: 16 },
});
