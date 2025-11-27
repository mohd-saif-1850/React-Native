import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";
import { router } from "expo-router";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

export default function Report() {
  const theme = useColorScheme();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [issue, setIssue] = useState("");
  const [loading, setLoading] = useState(false);
  const [popup, setPopup] = useState(false);

  const colors = {
    bg: theme === "dark" ? "#0D0D0D" : "#F8F9FA",
    text: theme === "dark" ? "#FFFFFF" : "#111111",
    sub: theme === "dark" ? "#A1A1A1" : "#666666",
    card: theme === "dark" ? "#1A1A1A" : "#FFFFFF",
    border: theme === "dark" ? "#292929" : "#E5E5E5",
    primary: "#4F46E5",
  };

  const handleSubmit = async () => {
    if (!name.trim() || !email.trim() || !issue.trim()) {
      alert("All fields are required");
      return;
    }

    try {
      setLoading(true);

      await axios.post(`${process.env.EXPO_PUBLIC_BACKEND}/report/create-report`, {
        name,
        email,
        issue,
      });

      setLoading(false);
      setPopup(true);

      setName("");
      setEmail("");
      setIssue("");
    } catch (err: any) {
      setLoading(false);
      alert(err?.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]}>
      <View style={styles.inner}>
        <View style={styles.headerRow}>
          <MaterialIcons name="report" size={34} color={colors.primary} />
          <Text style={[styles.title, { color: colors.text }]}>Report Issue</Text>
        </View>

        <Text style={[styles.subtitle, { color: colors.sub }]}>
          Help us fix problems by describing them clearly.
        </Text>

        <View
          style={[
            styles.inputBox,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <Ionicons name="person-outline" size={20} color={colors.sub} />
          <TextInput
            placeholder="Your Name"
            placeholderTextColor={colors.sub}
            value={name}
            onChangeText={setName}
            style={[styles.input, { color: colors.text }]}
          />
        </View>

        <View
          style={[
            styles.inputBox,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <MaterialIcons name="alternate-email" size={20} color={colors.sub} />
          <TextInput
            placeholder="Your Email"
            placeholderTextColor={colors.sub}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            style={[styles.input, { color: colors.text }]}
          />
        </View>

        <View
          style={[
            styles.textAreaBox,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <Ionicons name="create-outline" size={22} color={colors.sub} />
          <TextInput
            placeholder="Describe the issue..."
            placeholderTextColor={colors.sub}
            value={issue}
            onChangeText={setIssue}
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
          <Text style={styles.submitText}>{loading ? "Submitting..." : "Submit"}</Text>
        </TouchableOpacity>
      </View>

      <Modal visible={popup} transparent animationType="fade">
        <View style={styles.popupOverlay}>
          <View style={[styles.popupCard, { backgroundColor: colors.card }]}>
            <Ionicons name="checkmark-circle" size={60} color={colors.primary} />
            <Text style={[styles.popupTitle, { color: colors.text }]}>
              Report Submitted
            </Text>
            <Text style={[styles.popupMsg, { color: colors.sub }]}>
              Thank you for helping us improve.
            </Text>

            <TouchableOpacity
              style={[styles.popupBtn, { backgroundColor: colors.primary }]}
              onPress={() => {
                setPopup(false);
                router.back();
              }}
            >
              <Text style={styles.popupBtnText}>Okay</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 26 },
  inner: { marginTop: 40, gap: 20 },
  headerRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  title: { fontSize: 30, fontWeight: "800" },
  subtitle: { fontSize: 15, lineHeight: 20 },
  inputBox: {
    flexDirection: "row",
    gap: 12,
    borderWidth: 1.5,
    paddingHorizontal: 14,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
  },
  input: { flex: 1, fontSize: 16 },
  textAreaBox: {
    flexDirection: "row",
    gap: 12,
    borderWidth: 1.5,
    paddingHorizontal: 14,
    borderRadius: 12,
    paddingVertical: 14,
    minHeight: 150,
  },
  textArea: { flex: 1, fontSize: 16, textAlignVertical: "top" },
  submitBtn: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 14,
    marginTop: 10,
  },
  submitText: { color: "#FFFFFF", fontSize: 17, fontWeight: "600" },

  popupOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  popupCard: {
    width: "80%",
    padding: 24,
    borderRadius: 16,
    alignItems: "center",
    gap: 12,
  },
  popupTitle: { fontSize: 22, fontWeight: "700" },
  popupMsg: { fontSize: 14, textAlign: "center", marginBottom: 10 },
  popupBtn: {
    marginTop: 6,
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 10,
  },
  popupBtnText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});
