import React from "react";
import {
  View,
  Text,
  StyleSheet,
  useColorScheme,
  TouchableOpacity,
  ScrollView,
  Linking,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import Navbar from "@/components/Navbar";
import { Feather, MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";

export default function TabsHome() {
  const theme = useColorScheme();

  const colors = {
    bg: theme === "dark" ? "#0D0D0D" : "#F8F9FA",
    text: theme === "dark" ? "#FFFFFF" : "#111111",
    sub: theme === "dark" ? "#A1A1A1" : "#666666",
    card: theme === "dark" ? "#1A1A1A" : "#FFFFFF",
    border: theme === "dark" ? "#292929" : "#E6E6E6",
    btn: "#4F46E5",
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]}>
      <Navbar title="Home" />

      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={[styles.heading, { color: colors.text }]}>
          Spend Mate
        </Text>

        <Text style={[styles.subheading, { color: colors.sub }]}>
          Your smart companion for effortless money tracking and mindful spending.
        </Text>

        <View
          style={[
            styles.card,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <View style={styles.row}>
            <Feather name="plus-circle" size={22} color={colors.text} />
            <Text style={[styles.feature, { color: colors.text }]}>
              Add expenses in seconds
            </Text>
          </View>

          <View style={styles.row}>
            <MaterialCommunityIcons
              name="chart-donut"
              size={22}
              color={colors.text}
            />
            <Text style={[styles.feature, { color: colors.text }]}>
              Clear monthly spending breakdown
            </Text>
          </View>

          <View style={styles.row}>
            <Ionicons
              name="trending-up-outline"
              size={22}
              color={colors.text}
            />
            <Text style={[styles.feature, { color: colors.text }]}>
              Smart insights to stay on track
            </Text>
          </View>

          <View style={styles.row}>
            <Feather name="shield" size={22} color={colors.text} />
            <Text style={[styles.feature, { color: colors.text }]}>
              Private and Secure
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.actionBtn, { backgroundColor: colors.btn }]}
          onPress={() => router.push("/(tabs)/add-expense")}
        >
          <Text style={styles.actionText}>Add Expense</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.secondaryBtn, { borderColor: colors.border }]}
          onPress={() => router.push("/(tabs)/all-expense")}
        >
          <Text style={[styles.secondaryText, { color: colors.text }]}>
            View All Expenses
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push("/subscription")}
          style={styles.linkBtn}
        >
          <Text style={[styles.linkText, { color: colors.sub }]}>
            Subscription & Pricing
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.footerBox}
          onPress={() => Linking.openURL("https://github.com/mohd-saif-1850")}
        >
          <Ionicons name="logo-github" size={20} color={colors.sub} />
          <Text style={[styles.footerText, { color: colors.sub }]}>
            Designed & Developed by{" "}
            <Text style={{ fontWeight: "700", color: colors.text }}>
              Mohd Saif
            </Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: {
    paddingHorizontal: 26,
    paddingTop: 20,
    paddingBottom: 50,
    alignItems: "center",
    gap: 26,
  },
  heading: {
    fontSize: 32,
    fontWeight: "800",
    letterSpacing: -0.5,
  },
  subheading: {
    fontSize: 16,
    textAlign: "center",
    maxWidth: 300,
    lineHeight: 22,
  },
  card: {
    width: "100%",
    paddingVertical: 26,
    paddingHorizontal: 22,
    borderRadius: 18,
    borderWidth: 1,
    gap: 18,
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
  actionBtn: {
    paddingVertical: 14,
    paddingHorizontal: 50,
    borderRadius: 12,
    marginTop: 10,
  },
  actionText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  secondaryBtn: {
    paddingVertical: 14,
    paddingHorizontal: 50,
    borderRadius: 12,
    borderWidth: 1,
  },
  secondaryText: {
    fontSize: 16,
    fontWeight: "600",
  },
  linkBtn: {
    marginTop: 10,
  },
  linkText: {
    fontSize: 15,
    fontWeight: "500",
    textDecorationLine: "underline",
  },

  footerBox: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  footerText: {
    fontSize: 14,
  },
});
