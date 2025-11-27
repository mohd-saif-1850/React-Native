import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  useColorScheme,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";

export default function Tutorial() {
  const theme = useColorScheme();
  const [loading, setLoading] = useState(false);

  const colors = {
    bg: theme === "dark" ? "#050509" : "#F9FAFB",
    text: theme === "dark" ? "#F9FAFB" : "#111827",
    subText: theme === "dark" ? "#9CA3AF" : "#6B7280",
    card: theme === "dark" ? "#111827" : "#FFFFFF",
    cardBorder: theme === "dark" ? "#1F2937" : "#E5E7EB",
    chipBg: theme === "dark" ? "#1F2937" : "#E5E7EB",
  };

  const steps = [
    {
      title: "Add your expenses quickly",
      desc: "Record every spend in a few taps so you always know where your money is going.",
    },
    {
      title: "View clear monthly insights",
      desc: "Check spending by category without any manual calculations.",
    },
    {
      title: "Use the smart assistant",
      desc: "Ask for spending patterns, saving suggestions, and personalised insights.",
    },
    {
      title: "Stay in control effortlessly",
      desc: "Set limits, track progress, and avoid unwanted surprises at month end.",
    },
  ];

  const completeTutorial = async () => {
  try {
    setLoading(true);

    const token = await SecureStore.getItemAsync("spendmate_token");

    if (!token) {
      router.replace("/login");
      return;
    }

    await axios.patch(
      `${process.env.EXPO_PUBLIC_BACKEND}/user/tutorial`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    router.replace("/(tabs)");

  } catch (err : any) {
    console.log("Tutorial update error:", err?.response?.data || err);
  } finally {
    setLoading(false);
  }
};

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={[styles.badge, { backgroundColor: colors.chipBg }]}>
            Quick Tour
          </Text>

          <Text style={[styles.title, { color: colors.text }]}>
            Get started with Spend Mate
          </Text>

          <Text style={[styles.subtitle, { color: colors.subText }]}>
            A short walkthrough to help you understand how everything works.
          </Text>
        </View>

        <View style={styles.stepsContainer}>
          {steps.map((step, index) => (
            <View
              key={index}
              style={[
                styles.stepCard,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.cardBorder,
                },
              ]}
            >
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>{index + 1}</Text>
              </View>

              <Text style={[styles.stepTitle, { color: colors.text }]}>
                {step.title}
              </Text>

              <Text style={[styles.stepDesc, { color: colors.subText }]}>
                {step.desc}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.footer}>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={completeTutorial}
            disabled={loading}
            style={{ width: "100%" }}
          >
            <LinearGradient
              colors={["#4F46E5", "#6D5DF6"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.primaryBtn}
            >
              <Text style={styles.primaryBtnText}>
                {loading ? "Finishing..." : "Continue to App"}
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity onPress={completeTutorial} disabled={loading}>
            <Text style={[styles.skipText, { color: colors.subText }]}>
              Skip and continue
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 30,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 28,
    gap: 12,
  },
  badge: {
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    fontSize: 12,
    fontWeight: "500",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 20,
  },
  stepsContainer: {
    gap: 16,
    marginBottom: 30,
  },
  stepCard: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 18,
  },
  stepNumber: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#4F46E5",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  stepNumberText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 6,
  },
  stepDesc: {
    fontSize: 14,
    lineHeight: 20,
  },
  footer: {
    gap: 12,
    alignItems: "center",
  },
  primaryBtn: {
    width: "100%",
    paddingVertical: 16,
    borderRadius: 999,
  },
  primaryBtnText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  skipText: {
    fontSize: 14,
  },
});
