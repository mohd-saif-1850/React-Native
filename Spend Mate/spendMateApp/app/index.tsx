import React from "react";
import {
  View,
  Text,
  StyleSheet,
  useColorScheme,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";

export default function Landing() {
  const theme = useColorScheme();

  const colors = {
    bg: theme === "dark" ? "#0D0D0D" : "#F8F9FA",
    text: theme === "dark" ? "#FFFFFF" : "#111111",
    card: theme === "dark" ? "#1A1A1A" : "#FFFFFF",
    subText: theme === "dark" ? "#A3A3A3" : "#555555",
    primary: ["#4F46E5", "#6D5DF6"],
    stroke: theme === "dark" ? "#2A2A2A" : "#E6E6E6",
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]}>
      <View style={styles.centerBox}>
        <Text style={[styles.title, { color: colors.text }]}>Spend Mate</Text>
        <Text style={[styles.subtitle, { color: colors.subText }]}>
          Track smarter. Spend better.
        </Text>

        {/* Primary Button */}
        <LinearGradient
          style={styles.primaryBtn}
          colors={["#4F46E5", "#6D5DF6"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <TouchableOpacity onPress={() => router.push("/login")}>
            <Text style={styles.primaryBtnText}>Login</Text>
          </TouchableOpacity>
        </LinearGradient>

        {/* Outline Button */}
        <TouchableOpacity
          style={[
            styles.outlineBtn,
            { borderColor: colors.stroke, backgroundColor: colors.card },
          ]}
          onPress={() => router.push("/register")}
        >
          <Text style={[styles.outlineBtnText, { color: colors.text }]}>
            Create Account
          </Text>
        </TouchableOpacity>

        {/* Small Footer Buttons */}
        <View style={styles.footerRow}>
          <TouchableOpacity onPress={() => router.push("/report")}>
            <Text style={[styles.footerText, { color: colors.subText }]}>
              Report Issue
            </Text>
          </TouchableOpacity>

          <View style={styles.dot} />

          <TouchableOpacity onPress={() => router.push("/contact")}>
            <Text style={[styles.footerText, { color: colors.subText }]}>
              Contact Us
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 28,
  },
  centerBox: {
    alignItems: "center",
    gap: 20,
  },
  title: {
    fontSize: 42,
    fontWeight: "800",
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 30,
  },
  primaryBtn: {
    width: "100%",
    paddingVertical: 16,
    borderRadius: 14,
  },
  primaryBtnText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 17,
    textAlign: "center",
  },
  outlineBtn: {
    width: "100%",
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 2,
    alignItems: "center",
  },
  outlineBtnText: {
    fontSize: 17,
    fontWeight: "600",
  },
  footerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 40,
  },
  footerText: {
    fontSize: 13,
    fontWeight: "500",
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 50,
    backgroundColor: "#888",
  },
});
