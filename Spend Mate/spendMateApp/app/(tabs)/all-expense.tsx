import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  useColorScheme,
  FlatList,
} from "react-native";
import Navbar from "@/components/Navbar";
import axios from "axios";
import * as SecureStore from "expo-secure-store";

export default function AllExpense() {
  const theme = useColorScheme();
  const [data, setData] = useState([]);

  const colors = {
    bg: theme === "dark" ? "#0D0D0D" : "#FFFFFF",
    text: theme === "dark" ? "#FFFFFF" : "#111111",
    card: theme === "dark" ? "#1A1A1A" : "#F8F9FA",
    sub: theme === "dark" ? "#A1A1A1" : "#555555",
    border: theme === "dark" ? "#292929" : "#E6E6E6",
  };

  useEffect(() => {
    const fetchData = async () => {
      const token = await SecureStore.getItemAsync("spendmate_token");
      const res = await axios.get(
        `${process.env.EXPO_PUBLIC_BACKEND}/expense/get-all-expenses`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setData(res.data?.data || []);
    };

    fetchData();
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <Navbar title="All Expenses" />
      <FlatList
        data={data}
        keyExtractor={(item: any) => item._id}
        contentContainerStyle={styles.list}
        renderItem={({ item }: any) => (
          <View
            style={[
              styles.card,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <Text style={[styles.title, { color: colors.text }]}>
              {item.title}
            </Text>
            <Text style={[styles.amount, { color: colors.text }]}>
              ₹{item.amount}
            </Text>
            <Text style={[styles.sub, { color: colors.sub }]}>
              {item.category}
            </Text>
            <Text style={[styles.sub, { color: colors.sub }]}>
              {item.date}
            </Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  list: { padding: 20, gap: 16 },
  card: {
    padding: 18,
    borderRadius: 16,
    borderWidth: 1,
    gap: 6,
  },
  title: { fontSize: 18, fontWeight: "600" },
  amount: { fontSize: 20, fontWeight: "700" },
  sub: { fontSize: 14 },
});
