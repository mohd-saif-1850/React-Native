import React, { useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  useColorScheme,
  Modal
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import axios from "axios";

export default function VerifyOtp() {
  const theme = useColorScheme();
  const { email } = useLocalSearchParams();

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputs = useRef<TextInput[]>([]);
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");
  const [showCodeBox, setShowCodeBox] = useState(false);

  const colors = {
    bg: theme === "dark" ? "#0D0D0D" : "#F8F9FA",
    text: theme === "dark" ? "#FFFFFF" : "#111111",
    inputBg: theme === "dark" ? "#1A1A1A" : "#FFFFFF",
    inputBorder: theme === "dark" ? "#3A3A3A" : "#E5E5E5",
    placeholder: theme === "dark" ? "#888" : "#777",
    primary: "#4F46E5",
  };

  const handleChange = (val: string, index: number) => {
    if (!/^\d*$/.test(val)) return;

    const updated = [...otp];
    updated[index] = val;
    setOtp(updated);

    if (val && index < 5) inputs.current[index + 1]?.focus();
    if (!val && index > 0) inputs.current[index - 1]?.focus();
  };

  const handleVerify = async () => {
    setError("");
    setMsg("");

    const code = otp.join("");

    if (code.length !== 6) {
      setError("Enter 6-digit OTP");
      return;
    }

    try {
      const res = await axios.patch(
        `${process.env.EXPO_PUBLIC_BACKEND}/user/verify-user`,
        { email, otp: code }
      );

      setMsg(res.data?.message || "Verified ✅");

      setTimeout(() => {
        router.replace("/login");
      }, 800);
    } catch (err: any) {
      setError(err.response?.data?.message || "Invalid OTP ❌");
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]}>
      <Text style={[styles.title, { color: colors.text }]}>Verify OTP 🔐</Text>

      <Text style={[styles.subtitle, { color: colors.placeholder }]}>
        Enter the 6-digit code sent to your email
      </Text>

      <Text style={[styles.emailText, { color: colors.text }]}>
        {email}
      </Text>

      <View style={styles.inputRow}>
        {otp.map((digit, index) => (
          <TextInput
            key={index}
            ref={(el) => {
              if (el) inputs.current[index] = el;
            }}
            style={[
              styles.otpInput,
              {
                backgroundColor: colors.inputBg,
                borderColor: colors.inputBorder,
                color: colors.text,
              },
            ]}
            keyboardType="number-pad"
            maxLength={1}
            value={digit}
            onChangeText={(val) => handleChange(val, index)}
          />
        ))}
      </View>

      {error ? <Text style={[styles.error, { color: "red" }]}>{error}</Text> : null}
      {msg ? (
        <Text style={[styles.msg, { color: colors.placeholder }]}>{msg}</Text>
      ) : null}

      <TouchableOpacity style={styles.verifyBtn} onPress={handleVerify}>
        <Text style={styles.verifyText}>Verify</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => setShowCodeBox(true)}>
        <Text style={[styles.resend, { color: colors.text }]}>
          Didn’t receive the code? Tap here
        </Text>
      </TouchableOpacity>

      <Modal visible={showCodeBox} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalBox, { backgroundColor: colors.inputBg }]}>

            <Text style={[styles.modalOtp, { color: colors.text }]}>
              000000
            </Text>

            <Text style={[styles.modalInfo, { color: colors.placeholder }]}>
              Use this temporary code to verify your account for now.
            </Text>

            <Text style={[styles.modalEmail, { color: colors.text }]}>
              Email: {email}
            </Text>

            <TouchableOpacity onPress={() => setShowCodeBox(false)}>
              <Text style={[styles.closeText, { color: colors.primary }]}>
                Close
              </Text>
            </TouchableOpacity>

          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 26, justifyContent: "center" },
  title: { fontSize: 32, fontWeight: "700", textAlign: "center" },
  subtitle: { fontSize: 15, textAlign: "center", marginTop: 6 },
  emailText: {
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
    marginTop: 6,
    marginBottom: 10,
  },
  inputRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 30,
  },
  otpInput: {
    width: 48,
    height: 58,
    borderWidth: 1.5,
    borderRadius: 10,
    fontSize: 22,
    textAlign: "center",
  },
  verifyBtn: {
    backgroundColor: "#4F46E5",
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 10,
  },
  verifyText: {
    color: "#FFF",
    fontSize: 18,
    textAlign: "center",
    fontWeight: "600",
  },
  resend: { textAlign: "center", marginTop: 18, fontSize: 15 },
  error: { textAlign: "center", marginTop: -10, fontSize: 14 },
  msg: { textAlign: "center", marginTop: 4, fontSize: 14 },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalBox: {
    padding: 30,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    alignItems: "center",
  },
  modalOtp: { fontSize: 34, fontWeight: "700", letterSpacing: 6 },
  modalInfo: {
    fontSize: 14,
    textAlign: "center",
    marginTop: 10,
    opacity: 0.7,
  },
  modalEmail: {
    fontSize: 15,
    fontWeight: "600",
    textAlign: "center",
    marginTop: 6,
  },
  closeText: { fontSize: 18, fontWeight: "600", marginTop: 14 },
});
