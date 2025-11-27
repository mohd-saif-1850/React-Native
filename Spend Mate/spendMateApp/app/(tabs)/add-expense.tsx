import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  Platform,
  Modal,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { router } from "expo-router";
import Navbar from "@/components/Navbar";

export default function AddExpense() {
  const theme = useColorScheme();

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [otherCategory, setOtherCategory] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date());
  const [openDate, setOpenDate] = useState(false);
  const [time, setTime] = useState(new Date());
  const [openTime, setOpenTime] = useState(false);
  const [popup, setPopup] = useState("");
  const [refining, setRefining] = useState(false);
  const [creating, setCreating] = useState(false);

  const colors = {
    bg: theme === "dark" ? "#0D0D0D" : "#F8F9FA",
    text: theme === "dark" ? "#FFFFFF" : "#111111",
    sub: theme === "dark" ? "#A1A1A1" : "#555555",
    card: theme === "dark" ? "#141416" : "#FFFFFF",
    stroke: theme === "dark" ? "#232326" : "#E6E6E6",
    primary: "#4F46E5",
    popupBg: theme === "dark" ? "#111111" : "#FFFFFF",
    popupText: theme === "dark" ? "#FFFFFF" : "#111111",
  };

  const categories = [
    "Food",
    "Travel",
    "Shopping",
    "Bills",
    "Health",
    "Entertainment",
    "Other",
  ];

  const refineWithAI = async () => {
    if (!title.trim()) {
      setPopup("Enter a title first");
      return;
    }
    setRefining(true);
    try {
      const token = await SecureStore.getItemAsync("spendmate_token");
      const res = await axios.post(
        `${process.env.EXPO_PUBLIC_BACKEND}/api/v1/refine-title`,
        { title },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const refined = res?.data?.data?.refined;
      if (refined) {
        setTitle(refined);
        setPopup("Title refined");
      } else {
        const msg = res?.data?.message || "AI did not return a refined title";
        setPopup(msg);
      }
    } catch (err : any) {
      const msg = err?.response?.data?.message || err?.message || "AI refine failed";
      if (msg === "Only the Subscribed Users can use this Feature !") {
        router.push("/subscription");
      } else {
        setPopup(msg);
      }
    } finally {
      setRefining(false);
    }
  };

  const handleCreate = async () => {
    if (!title.trim() || !amount.trim() || !category) {
      setPopup("Please fill required fields: title, amount and category");
      return;
    }
    setCreating(true);
    try {
      const token = await SecureStore.getItemAsync("spendmate_token");
      const formattedDate = date.toISOString().split("T")[0];
      const formattedTime = time.toLocaleTimeString();
      await axios.post(
        `${process.env.EXPO_PUBLIC_BACKEND}/api/v1/expense/create-expense`,
        {
          title,
          amount,
          category,
          otherCategory,
          discription: description,
          date: formattedDate,
          time: formattedTime,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      router.replace("/(tabs)/all-expense");
    } catch (err : any) {
      const msg = err?.response?.data?.message || err?.message || "Failed to create expense";
      setPopup(msg);
    } finally {
      setCreating(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]}>
      <Navbar title="Add Expense" />
      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.stroke }]}>
        <Text style={[styles.label, { color: colors.text }]}>Title</Text>
        <TextInput
          value={title}
          onChangeText={setTitle}
          placeholder="Enter title"
          placeholderTextColor={colors.sub}
          style={[styles.input, { color: colors.text, borderColor: colors.stroke, backgroundColor: colors.card }]}
        />
        <TouchableOpacity
          style={[styles.aiBtn, { backgroundColor: colors.primary }]}
          onPress={refineWithAI}
          disabled={refining}
        >
          {refining ? (
            <ActivityIndicator size="small" color="#ffffff" style={{ marginRight: 8 }} />
          ) : (
            <Ionicons name="sparkles-outline" size={18} color="#FFF" style={{ marginRight: 8 }} />
          )}
          <Text style={styles.aiText}>Refine</Text>
        </TouchableOpacity>

        <Text style={[styles.label, { color: colors.text }]}>Amount</Text>
        <TextInput
          value={amount}
          onChangeText={setAmount}
          placeholder="Enter amount"
          keyboardType="numeric"
          placeholderTextColor={colors.sub}
          style={[styles.input, { color: colors.text, borderColor: colors.stroke, backgroundColor: colors.card }]}
        />

        <Text style={[styles.label, { color: colors.text }]}>Category</Text>
        <View style={[styles.pickerBox, { borderColor: colors.stroke, backgroundColor: colors.card }]}>
          <Picker
            selectedValue={category}
            onValueChange={(v) => setCategory(v)}
            dropdownIconColor={colors.text}
            style={{ color: colors.text, width: "100%" }}
            itemStyle={{ color: colors.text }}
          >
            <Picker.Item label="Select category" value="" />
            {categories.map((c) => (
              <Picker.Item key={c} label={c} value={c} />
            ))}
          </Picker>
        </View>

        {category === "Other" && (
          <>
            <Text style={[styles.label, { color: colors.text }]}>Other Category</Text>
            <TextInput
              value={otherCategory}
              onChangeText={setOtherCategory}
              placeholder="Enter custom category"
              placeholderTextColor={colors.sub}
              style={[styles.input, { color: colors.text, borderColor: colors.stroke, backgroundColor: colors.card }]}
            />
          </>
        )}

        <Text style={[styles.label, { color: colors.text }]}>Description</Text>
        <TextInput
          value={description}
          onChangeText={setDescription}
          placeholder="Optional notes"
          placeholderTextColor={colors.sub}
          style={[styles.input, { color: colors.text, borderColor: colors.stroke, backgroundColor: colors.card }]}
        />

        <TouchableOpacity style={[styles.selector, { borderColor: colors.stroke }]} onPress={() => setOpenDate(true)}>
          <Ionicons name="calendar-outline" size={20} color={colors.sub} />
          <Text style={[styles.selectorText, { color: colors.text }]}>{date.toDateString()}</Text>
        </TouchableOpacity>

        {openDate && (
          <DateTimePicker
            value={date}
            mode="date"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={(e, d) => {
              setOpenDate(Platform.OS === "ios");
              if (d) setDate(d);
            }}
          />
        )}

        <TouchableOpacity style={[styles.selector, { borderColor: colors.stroke }]} onPress={() => setOpenTime(true)}>
          <Ionicons name="time-outline" size={20} color={colors.sub} />
          <Text style={[styles.selectorText, { color: colors.text }]}>{time.toLocaleTimeString()}</Text>
        </TouchableOpacity>

        {openTime && (
          <DateTimePicker
            value={time}
            mode="time"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={(e, t) => {
              setOpenTime(Platform.OS === "ios");
              if (t) setTime(t);
            }}
          />
        )}

        <TouchableOpacity onPress={handleCreate} style={[styles.createBtn, { backgroundColor: colors.primary }]} disabled={creating}>
          {creating ? <ActivityIndicator color="#fff" /> : <Text style={styles.createText}>Save Expense</Text>}
        </TouchableOpacity>
      </View>

      <Modal visible={!!popup} transparent animationType="fade">
        <View style={styles.popupOverlay}>
          <View style={[styles.popupBox, { backgroundColor: colors.popupBg }]}>
            <Text style={[styles.popupText, { color: colors.popupText }]}>{popup}</Text>
            <TouchableOpacity onPress={() => setPopup("")} style={[styles.popupBtn, { backgroundColor: colors.primary }]}>
              <Text style={styles.popupBtnText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  card: {
    marginTop: 20,
    marginHorizontal: 16,
    borderRadius: 14,
    borderWidth: 1,
    padding: 18,
    gap: 12,
  },
  label: { fontSize: 13, fontWeight: "600" },
  input: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    fontSize: 16,
    borderRadius: 10,
    borderWidth: 1,
  },
  pickerBox: {
    borderWidth: 1,
    borderRadius: 10,
    overflow: "hidden",
  },
  selector: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    marginTop: 6,
  },
  selectorText: { fontSize: 15 },
  aiBtn: {
    flexDirection: "row",
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 999,
    alignSelf: "flex-start",
    marginTop: 6,
  },
  aiText: { color: "#FFF", fontSize: 14, fontWeight: "600" },
  createBtn: { marginTop: 8, paddingVertical: 14, borderRadius: 12 },
  createText: { color: "#FFF", fontSize: 16, fontWeight: "700", textAlign: "center" },
  popupOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.45)", justifyContent: "center", alignItems: "center" },
  popupBox: { padding: 22, borderRadius: 14, width: "78%", alignItems: "center" },
  popupText: { fontSize: 15, fontWeight: "500", marginBottom: 14, textAlign: "center" },
  popupBtn: { paddingVertical: 10, paddingHorizontal: 22, borderRadius: 10 },
  popupBtnText: { color: "#FFF", fontSize: 15, fontWeight: "600" },
});
