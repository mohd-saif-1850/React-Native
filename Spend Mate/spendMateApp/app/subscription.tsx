import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Subscription() {
  const theme = useColorScheme();

  const colors = {
    bg: theme === "dark" ? "#0D0D0D" : "#F8F9FA",
    text: theme === "dark" ? "#FFFFFF" : "#111111",
    sub: theme === "dark" ? "#A1A1A1" : "#555555",
    card: theme === "dark" ? "#16161A" : "#FFFFFF",
    stroke: theme === "dark" ? "#2A2A2A" : "#E0E0E0",
    primary: "#4F46E5",
    disabled: theme === "dark" ? "#3A3A3A" : "#D4D4D4",
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]}>
      <TouchableOpacity
        style={styles.backBtn}
        onPress={() => router.back()}
      >
        <Ionicons name="chevron-back" size={26} color={colors.text} />
      </TouchableOpacity>

      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>
          Spend Mate Premium
        </Text>
        <Text style={[styles.subtitle, { color: colors.sub }]}>
          Unlock upcoming features and smarter insights
        </Text>
      </View>

      <View
        style={[
          styles.card,
          { backgroundColor: colors.card, borderColor: colors.stroke },
        ]}
      >
        <View style={styles.row}>
          <MaterialCommunityIcons
            name="robot-outline"
            size={22}
            color={colors.primary}
          />
          <Text style={[styles.feature, { color: colors.text }]}>
            AI powered spending analysis
          </Text>
        </View>

        <View style={styles.row}>
          <Feather name="trending-up" size={22} color={colors.primary} />
          <Text style={[styles.feature, { color: colors.text }]}>
            Advanced monthly insights
          </Text>
        </View>

        <View style={styles.row}>
          <Ionicons
            name="shield-checkmark-outline"
            size={22}
            color={colors.primary}
          />
          <Text style={[styles.feature, { color: colors.text }]}>
            Priority data security and backup
          </Text>
        </View>

        <View style={styles.row}>
          <Feather name="bell" size={22} color={colors.primary} />
          <Text style={[styles.feature, { color: colors.text }]}>
            Custom budget alerts
          </Text>
        </View>

        <View style={styles.priceWrap}>
          <Text style={[styles.price, { color: colors.text }]}>₹99</Text>
          <Text style={[styles.period, { color: colors.sub }]}>per month</Text>
        </View>

        <TouchableOpacity
          disabled
          style={[styles.disabledBtn, { backgroundColor: colors.disabled }]}
        >
          <Text style={styles.disabledText}>14-Days Free</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.noteBox}>
        <Text style={[styles.note, { color: colors.sub }]}>
          Your 14-day trial has started. Enjoy premium features and explore everything freely.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 26,
  },
  backBtn: {
    paddingVertical: 6,
    width: 40,
  },
  header: {
    marginTop: 10,
    marginBottom: 24,
    gap: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 20,
  },
  card: {
    width: "100%",
    paddingVertical: 30,
    paddingHorizontal: 22,
    borderRadius: 20,
    borderWidth: 1,
    gap: 20,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  feature: {
    fontSize: 15,
    fontWeight: "500",
  },
  priceWrap: {
    alignItems: "center",
    marginTop: 10,
  },
  price: {
    fontSize: 34,
    fontWeight: "700",
  },
  period: {
    fontSize: 14,
    marginTop: -4,
  },
  disabledBtn: {
    width: "100%",
    paddingVertical: 16,
    borderRadius: 14,
    marginTop: 12,
  },
  disabledText: {
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
    color: "#606060",
  },
  noteBox: {
    marginTop: 26,
    alignItems: "center",
    paddingHorizontal: 10,
  },
  note: {
    fontSize: 13,
    textAlign: "center",
    maxWidth: 280,
  },
});
