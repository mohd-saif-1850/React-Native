import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Pressable,
  useColorScheme,
} from "react-native";
import { BlurView } from "expo-blur";
import { useRouter, usePathname } from "expo-router";
import { Ionicons, Feather, MaterialIcons } from "@expo/vector-icons";
import axios from "axios";
import * as SecureStore from "expo-secure-store";

export default function Navbar({ title }: { title?: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const theme = useColorScheme();
  const [open, setOpen] = useState(false);

  const isHome =
    pathname === "/(tabs)" ||
    pathname === "/(tabs)/index" ||
    pathname === "/";

  const colors = {
    bg: theme === "dark" ? "#0D0D0D" : "#F8F9FA",
    text: theme === "dark" ? "#FFFFFF" : "#111111",
    icon: theme === "dark" ? "#FFFFFF" : "#111111",
    sheet: theme === "dark" ? "rgba(20,20,20,0.85)" : "rgba(255,255,255,0.9)",
    divider: theme === "dark" ? "#2C2C2C" : "#E5E5E5",
    logout: theme === "dark" ? "#E53935" : "#D32F2F",
  };

  const handleLogout = async () => {
    try {
      const token = await SecureStore.getItemAsync("spendmate_token");

      if (token) {
        await axios.post(
          `${process.env.EXPO_PUBLIC_BACKEND}/user/logout-user`,
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      }
    } catch (error: any) {
      console.log("Logout error:", error?.response?.data || error);
    } finally {
      await SecureStore.deleteItemAsync("spendmate_token");
      router.dismissAll();
      router.replace("/login");
    }
  };

  return (
    <>
      <View style={[styles.nav, { backgroundColor: colors.bg }]}>
        {!isHome ? (
          <TouchableOpacity onPress={() => router.back()} style={styles.leftBtn}>
            <Ionicons name="chevron-back" size={26} color={colors.icon} />
          </TouchableOpacity>
        ) : (
          <View style={{ width: 26 }} />
        )}

        <Text style={[styles.title, { color: colors.text }]}>
          {isHome ? "" : title || ""}
        </Text>

        <TouchableOpacity onPress={() => setOpen(true)} style={styles.rightBtn}>
          <Feather name="menu" size={26} color={colors.icon} />
        </TouchableOpacity>
      </View>

      <Modal transparent visible={open} animationType="fade">
        <Pressable style={styles.overlay} onPress={() => setOpen(false)} />

        <BlurView
          intensity={100}
          tint={theme === "dark" ? "dark" : "light"}
          style={styles.sheet}
        >
          <TouchableOpacity onPress={() => setOpen(false)} style={styles.closeBtn}>
            <Ionicons name="close" size={28} color={colors.text} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.row}
            onPress={() => {
              setOpen(false);
              router.push("/contact");
            }}
          >
            <MaterialIcons name="support-agent" size={22} color={colors.text} />
            <Text style={[styles.rowText, { color: colors.text }]}>
              Contact Support
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.row}
            onPress={() => {
              setOpen(false);
              router.push("/report");
            }}
          >
            <Ionicons name="alert-circle-outline" size={22} color={colors.text} />
            <Text style={[styles.rowText, { color: colors.text }]}>
              Report an Issue
            </Text>
          </TouchableOpacity>

          <View style={[styles.line, { backgroundColor: colors.divider }]} />

          <TouchableOpacity
            style={styles.row}
            onPress={() => {
              setOpen(false);
              router.push("/subscription");
            }}
          >
            <Feather name="dollar-sign" size={22} color={colors.text} />
            <Text style={[styles.rowText, { color: colors.text }]}>
              Subscription & Pricing
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.row, { marginTop: 10 }]}
            onPress={() => {
              setOpen(false);
              handleLogout();
            }}
          >
            <Ionicons name="log-out-outline" size={22} color={colors.logout} />
            <Text style={[styles.rowText, { color: colors.logout }]}>
              Logout
            </Text>
          </TouchableOpacity>
        </BlurView>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  nav: {
    height: 58,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
  },
  leftBtn: { padding: 4 },
  rightBtn: { padding: 4 },
  title: { fontSize: 18, fontWeight: "600" },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
  },
  sheet: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    paddingVertical: 28,
    paddingHorizontal: 24,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    gap: 22,
  },
  closeBtn: {
    alignSelf: "flex-end",
    marginBottom: 6,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  rowText: {
    fontSize: 17,
    fontWeight: "500",
  },
  line: {
    height: 1,
    width: "100%",
  },
});
