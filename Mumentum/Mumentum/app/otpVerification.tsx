import { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  useColorScheme,
} from "react-native";

export default function OtpVerification() {
  const scheme = useColorScheme();
  const isDark = scheme === "dark";

  const [email] = useState("demo@email.com");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(60);
  const [isRunning, setIsRunning] = useState(true);

  const inputs = useRef<(TextInput | null)[]>([]);

  const colors = {
    bg: isDark ? "#020617" : "#F8FAFC",
    text: isDark ? "#FFFFFF" : "#020617",
    muted: isDark ? "#94A3B8" : "#64748B",
    border: isDark ? "#1E293B" : "#E2E8F0",
    primary: "#6366F1",
    danger: "#EF4444",
    disabled: "#A5B4FC",
  };

  useEffect(() => {
    if (!isRunning || timer === 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer, isRunning]);

  const handleChange = (value: string, index: number) => {
    if (!/^\d?$/.test(value)) return;

    const updated = [...otp];
    updated[index] = value;
    setOtp(updated);

    if (value && index < 5) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleBackspace = (index: number) => {
    if (index > 0 && otp[index] === "") {
      inputs.current[index - 1]?.focus();
    }
  };

  const handleVerify = () => {
    const code = otp.join("");
    if (code.length !== 6) return;
  };

  const handleResend = () => {
    setOtp(["", "", "", "", "", ""]);
    setTimer(60);
    setIsRunning(true);
    inputs.current[0]?.focus();
  };

  const isComplete = otp.every((d) => d !== "");

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.bg }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>
            Verify OTP
          </Text>
          <Text style={[styles.subtitle, { color: colors.muted }]}>
            Enter the 6-digit code sent to
          </Text>
          <Text style={[styles.email, { color: colors.text }]}>
            {email}
          </Text>
        </View>

        <View style={styles.otpRow}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => {
                inputs.current[index] = ref;
              }}
              value={digit}
              onChangeText={(v) => handleChange(v, index)}
              onKeyPress={({ nativeEvent }) => {
                if (nativeEvent.key === "Backspace") {
                  handleBackspace(index);
                }
              }}
              style={[
                styles.otpBox,
                {
                  borderColor: digit ? colors.primary : colors.border,
                  color: colors.text,
                },
              ]}
              keyboardType="number-pad"
              maxLength={1}
              textAlign="center"
            />
          ))}
        </View>

        <TouchableOpacity
          style={[
            styles.button,
            { backgroundColor: isComplete ? colors.primary : colors.disabled },
          ]}
          disabled={!isComplete}
          onPress={handleVerify}
        >
          <Text style={styles.buttonText}>Verify</Text>
        </TouchableOpacity>

        {timer > 0 ? (
          <Text style={[styles.timer, { color: colors.muted }]}>
            Resend OTP in 00:{timer.toString().padStart(2, "0")}
          </Text>
        ) : (
          <TouchableOpacity onPress={handleResend}>
            <Text style={[styles.resend, { color: colors.primary }]}>
              Resend OTP
            </Text>
          </TouchableOpacity>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 75,
    padding: 24,
    paddingTop: 90,
  },
  header: {
    marginBottom: 40,
  },
  title: {
    fontSize: 30,
    fontWeight: "700",
  },
  subtitle: {
    fontSize: 15,
    marginTop: 8,
  },
  email: {
    fontSize: 15,
    fontWeight: "600",
    marginTop: 6,
  },
  otpRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 36,
  },
  otpBox: {
    width: 48,
    height: 54,
    borderWidth: 1,
    borderRadius: 14,
    fontSize: 20,
    fontWeight: "700",
  },
  button: {
    height: 54,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  timer: {
    textAlign: "center",
    marginTop: 22,
    fontSize: 14,
  },
  resend: {
    textAlign: "center",
    marginTop: 22,
    fontSize: 14,
    fontWeight: "600",
  },
});
