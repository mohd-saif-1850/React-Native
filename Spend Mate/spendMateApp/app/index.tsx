import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  useColorScheme,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { Feather, MaterialIcons, Ionicons } from "@expo/vector-icons";

export default function Landing() {
  const theme = useColorScheme();
  const [checking, setChecking] = useState(true);

  const colors = {
    bg: theme === "dark" ? "#0B0B0E" : "#F5F6FA",
    text: theme === "dark" ? "#FFFFFF" : "#0F0F0F",
    sub: theme === "dark" ? "#A6A6A6" : "#555555",
    card: theme === "dark" ? "#16161A" : "#FFFFFF",
    stroke: theme === "dark" ? "#26262C" : "#E2E3E7",
    loader: theme === "dark" ? "#FFFFFF" : "#4F46E5",
    primary: "#4F46E5",
  };

  useEffect(() => {
    const checkUser = async () => {
      const token = await SecureStore.getItemAsync("spendmate_token");

      if (!token) {
        setChecking(false);
        return;
      }

      try {
        const res = await axios.get(
          `${process.env.EXPO_PUBLIC_BACKEND}/user/get-user`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (res.data?.data?.tutorial === false) {
          router.replace("/(tabs)");
        } else {
          router.replace("/tutorial");
        }
      } catch {
      } finally {
        setChecking(false);
      }
    };

    checkUser();
  }, []);

  if (checking) {
    return (
      <SafeAreaView style={[styles.loaderContainer, { backgroundColor: colors.bg }]}>
        <Image
          source={require("../assets/logo.png")}
          style={styles.loaderLogo}
          resizeMode="contain"
        />
        <ActivityIndicator size="large" color={colors.loader} />
        <Text style={[styles.loaderText, { color: colors.sub }]}>
          Preparing your dashboard
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]}>
      <View style={styles.topSection}>
        <Image
          source={require("../assets/logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={[styles.heading, { color: colors.text }]}>
          Welcome to Spend Mate
        </Text>
        <Text style={[styles.tagline, { color: colors.sub }]}>
          Take control of your money without changing your lifestyle.
        </Text>
      </View>

      <View
        style={[
          styles.card,
          { backgroundColor: colors.card, borderColor: colors.stroke },
        ]}
      >
        <View style={styles.featureRow}>
          <Feather name="plus-circle" size={22} color={colors.primary} />
          <Text style={[styles.featureText, { color: colors.sub }]}>
            Add expenses in seconds
          </Text>
        </View>

        <View style={styles.featureRow}>
          <MaterialIcons name="donut-small" size={22} color={colors.primary} />
          <Text style={[styles.featureText, { color: colors.sub }]}>
            Clear monthly breakdowns
          </Text>
        </View>

        <View style={styles.featureRow}>
          <Ionicons name="sparkles-outline" size={22} color={colors.primary} />
          <Text style={[styles.featureText, { color: colors.sub }]}>
            Smart spending insights
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.primaryBtn, { backgroundColor: colors.primary }]}
          onPress={() => router.push("/login")}
        >
          <View style={styles.btnRow}>
            <Feather name="log-in" size={20} color="#FFFFFF" />
            <Text style={styles.primaryBtnText}>Login</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.secondaryBtn, { borderColor: colors.stroke }]}
          onPress={() => router.push("/register")}
        >
          <View style={styles.btnRow}>
            <Ionicons name="person-add-outline" size={20} color={colors.text} />
            <Text style={[styles.secondaryBtnText, { color: colors.text }]}>
              Create Account
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.linkRow}
          onPress={() => router.push("/report")}
        >
          <Feather name="alert-circle" size={18} color={colors.sub} />
          <Text style={[styles.link, { color: colors.sub }]}>
            Report an Issue
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.linkRow}
          onPress={() => router.push("/contact")}
        >
          <Feather name="mail" size={18} color={colors.sub} />
          <Text style={[styles.link, { color: colors.sub }]}>
            Contact Support
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 14,
  },
  loaderLogo: {
    width: 120,
    height: 120,
    marginBottom: 6,
  },
  loaderText: {
    fontSize: 14,
    fontWeight: "500",
    marginTop: 4,
  },
  container: {
    flex: 1,
    justifyContent: "space-between",
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 26,
  },
  topSection: {
    alignItems: "center",
    gap: 16,
  },
  logo: {
    width: 150,
    height: 150,
  },
  heading: {
    fontSize: 28,
    fontWeight: "700",
    textAlign: "center",
  },
  tagline: {
    fontSize: 15,
    textAlign: "center",
    maxWidth: 300,
    lineHeight: 21,
  },
  card: {
    width: "100%",
    paddingVertical: 32,
    paddingHorizontal: 22,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: "center",
    gap: 22,
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  featureText: {
    fontSize: 14,
    fontWeight: "500",
  },
  btnRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  primaryBtn: {
    width: "100%",
    paddingVertical: 16,
    borderRadius: 14,
  },
  primaryBtnText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "600",
  },
  secondaryBtn: {
    width: "100%",
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 2,
    alignItems: "center",
  },
  secondaryBtnText: {
    fontSize: 16,
    fontWeight: "600",
  },
  linkRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  link: {
    fontSize: 14,
    fontWeight: "500",
  },
});
