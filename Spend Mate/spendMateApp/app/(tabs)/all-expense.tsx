import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  useColorScheme,
  FlatList,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  Alert,
  Platform,
  LayoutAnimation,
  UIManager,
  Animated,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Navbar from "@/components/Navbar";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export interface Expense {
  _id: string;
  userId: string;
  title: string;
  amount: number;
  category: string;
  otherCategory?: string;
  date: string;
  time: string;
  discription?: string;
  createdAt: string;
  updatedAt: string;
}

export default function AllExpense() {
  const theme = useColorScheme();
  const colors = {
    bg: theme === "dark" ? "#060606" : "#F6F9FF",
    text: theme === "dark" ? "#F5F7FA" : "#0B1220",
    card: theme === "dark" ? "#0D1113" : "#FFFFFF",
    sub: theme === "dark" ? "#98A0A8" : "#6B7280",
    border: theme === "dark" ? "#121416" : "#E6EEF8",
    primary: "#4F46E5",
    accent: "#06B6D4",
  };

  // Data states
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [allExpenses, setAllExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [totalsLoading, setTotalsLoading] = useState<boolean>(false);
  const [totalExpenses, setTotalExpenses] = useState<number>(0);
  const [monthSpend, setMonthSpend] = useState<number>(0);

  // Search & filters
  const [searchText, setSearchText] = useState<string>("");
  const [selectedDateForSearch, setSelectedDateForSearch] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);

  // Popup
  const [popup, setPopup] = useState<string>("");

  // Create/Edit modal states
  const [editModalVisible, setEditModalVisible] = useState<boolean>(false);
  const [creating, setCreating] = useState<boolean>(false);
  const [editingItem, setEditingItem] = useState<Expense | null>(null);

  const [formTitle, setFormTitle] = useState<string>("");
  const [formAmount, setFormAmount] = useState<string>("");
  const [formCategory, setFormCategory] = useState<string>("Food");
  const [formOtherCategory, setFormOtherCategory] = useState<string>("");
  const [formDescription, setFormDescription] = useState<string>("");
  const [formDate, setFormDate] = useState<Date>(new Date());
  const [formTime, setFormTime] = useState<Date>(new Date());
  const [formLoading, setFormLoading] = useState<boolean>(false);

  // Inline pickers states in modal
  const [showEditDatePicker, setShowEditDatePicker] = useState<boolean>(false);
  const [showEditTimePicker, setShowEditTimePicker] = useState<boolean>(false);

  // View modal
  const [viewModalVisible, setViewModalVisible] = useState<boolean>(false);
  const [viewItem, setViewItem] = useState<Expense | null>(null);

  const categories = ["Food", "Travel", "Shopping", "Bills", "Health", "Entertainment", "Other"];

  // Animated header fade
  const headerFade = useRef(new Animated.Value(0)).current;

  // utils
  const getToken = async () => {
    const token = await SecureStore.getItemAsync("spendmate_token");
    if (!token) {
      setPopup("Login required");
      router.replace("/login");
      return null;
    }
    return token;
  };

  const formatTimeReadable = (timeStr: string) => {
    if (!timeStr) return "";
    if (/AM|PM/i.test(timeStr)) return timeStr;
    const parts = timeStr.split(":");
    if (parts.length < 2) return timeStr;
    const h = Number(parts[0]);
    const m = Number(parts[1]);
    const period = h >= 12 ? "PM" : "AM";
    const hr = h % 12 || 12;
    const mm = m < 10 ? `0${m}` : m;
    return `${hr}:${mm} ${period}`;
  };

  // Fetch totals and monthly
  const fetchTotalsAndMonthly = async () => {
    setTotalsLoading(true);
    try {
      const token = await getToken();
      if (!token) return;

      const monthRes = await axios.get(`${process.env.EXPO_PUBLIC_BACKEND}/expense/monthly-spend`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const monthData = monthRes?.data?.data ?? {};
      setMonthSpend(Number(monthData?.totalMonthSpend ?? 0));

      const totalRes = await axios.get(`${process.env.EXPO_PUBLIC_BACKEND}/expense/total-spend`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTotalExpenses(Number(totalRes?.data?.data?.total ?? 0));
    } catch (err: any) {
      setPopup(err?.response?.data?.message || "Unable to fetch totals/monthly");
    } finally {
      setTotalsLoading(false);
    }
  };

  // Fetch all expenses (main list)
  const fetchAllExpenses = async () => {
    setLoading(true);
    try {
      const token = await getToken();
      if (!token) return;
      const res = await axios.get(`${process.env.EXPO_PUBLIC_BACKEND}/expense/all-expenses`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = res?.data?.data ?? [];
      const sorted = Array.isArray(data)
        ? data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        : [];
      setExpenses(sorted);
      setAllExpenses(sorted);
    } catch (err: any) {
      setPopup(err?.response?.data?.message || "Failed to load expenses");
    } finally {
      setLoading(false);
    }
  };

  const refreshAll = async () => {
    setRefreshing(true);
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    await Promise.all([fetchAllExpenses(), fetchTotalsAndMonthly()]);
    setRefreshing(false);
  };

  useEffect(() => {
    (async () => {
      await Promise.all([fetchAllExpenses(), fetchTotalsAndMonthly()]);
      Animated.timing(headerFade, { toValue: 1, duration: 420, useNativeDriver: true }).start();
    })();
  }, []);

  // Search + date filter
  const applySearch = () => {
    const text = searchText.trim().toLowerCase();
    const filtered = allExpenses.filter((it) => {
      const title = (it.title || "").toLowerCase();
      const date = it.date || "";
      if (text && !title.includes(text) && !date.includes(text)) return false;
      if (selectedDateForSearch) {
        const d = selectedDateForSearch;
        const q = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
        if (it.date !== q) return false;
      }
      return true;
    });
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpenses(filtered);
  };

  const clearSearch = () => {
    setSearchText("");
    setSelectedDateForSearch(null);
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpenses(allExpenses);
  };

  // create / edit
  const openCreateModal = () => {
    // ensure we do NOT navigate — just open modal
    setEditingItem(null);
    setCreating(true);
    setFormTitle("");
    setFormAmount("");
    setFormCategory("Food");
    setFormOtherCategory("");
    setFormDescription("");
    setFormDate(new Date());
    setFormTime(new Date());
    setShowEditDatePicker(false);
    setShowEditTimePicker(false);
    setEditModalVisible(true);
  };

  const openEditModal = (item: Expense) => {
    setEditingItem(item);
    setCreating(false);
    setFormTitle(item.title || "");
    setFormAmount(String(item.amount ?? ""));
    setFormCategory(item.category || "Other");
    setFormOtherCategory(item.otherCategory || "");
    setFormDescription(item.discription || "");
    if (item.date) {
      const [y, m, d] = item.date.split("-");
      setFormDate(new Date(Number(y || new Date().getFullYear()), Number(m || 1) - 1, Number(d || 1)));
    } else {
      setFormDate(new Date());
    }
    if (item.time) {
      const tMatch = item.time.match(/(\d{1,2}):(\d{2})/);
      const dt = new Date();
      if (tMatch) {
        dt.setHours(Number(tMatch[1]));
        dt.setMinutes(Number(tMatch[2]));
      }
      setFormTime(dt);
    } else {
      setFormTime(new Date());
    }
    setShowEditDatePicker(false);
    setShowEditTimePicker(false);
    setEditModalVisible(true);
  };

  // view
  const openViewModal = (item: Expense) => {
    setViewItem(item);
    setViewModalVisible(true);
  };

  const submitForm = async () => {
    if (!formTitle.trim() || !formAmount.trim()) {
      setPopup("Please provide title and amount");
      return;
    }
    setFormLoading(true);
    try {
      const token = await getToken();
      if (!token) return;

      const d = formDate;
      const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
      const t = `${formTime.getHours()}:${String(formTime.getMinutes()).padStart(2, "0")}`;

      const payload = {
        title: formTitle,
        amount: formAmount,
        category: formCategory,
        otherCategory: formCategory === "Other" ? formOtherCategory : "",
        discription: formDescription,
        date: dateStr,
        time: t,
      };

      if (creating) {
        await axios.post(`${process.env.EXPO_PUBLIC_BACKEND}/expense/create-expense`, payload, { headers: { Authorization: `Bearer ${token}` } });
        setPopup("Expense created");
      } else if (editingItem) {
        await axios.patch(`${process.env.EXPO_PUBLIC_BACKEND}/expense/update-expense/${editingItem._id}`, payload, { headers: { Authorization: `Bearer ${token}` } });
        setPopup("Expense updated");
      }

      setEditModalVisible(false);
      await Promise.all([fetchAllExpenses(), fetchTotalsAndMonthly()]);
    } catch (err: any) {
      setPopup(err?.response?.data?.message || "Failed to submit");
    } finally {
      setFormLoading(false);
    }
  };

  // delete
  const deleteExpense = async (id: string) => {
    const token = await getToken();
    if (!token) return;
    try {
      await axios.delete(`${process.env.EXPO_PUBLIC_BACKEND}/expense/delete-expense/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPopup("Expense deleted");
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setExpenses((prev) => prev.filter((p) => p._id !== id));
      setAllExpenses((prev) => prev.filter((p) => p._id !== id));
      fetchTotalsAndMonthly();
    } catch {
      setPopup("Delete failed");
    }
  };

  const confirmDelete = (id: string) => {
    Alert.alert("Delete expense", "Are you sure you want to delete this expense?", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: () => deleteExpense(id) },
    ]);
  };

  // UI helpers
  const CategoryBadge = ({ category }: { category: string }) => {
    const bg =
      category === "Food"
        ? "#FEE2E2"
        : category === "Travel"
        ? "#DBEAFE"
        : category === "Shopping"
        ? "#FEF3C7"
        : category === "Bills"
        ? "#E6FFFA"
        : category === "Health"
        ? "#F0FDF4"
        : category === "Entertainment"
        ? "#F5F3FF"
        : "#EFF6FF";
    const color =
      category === "Food"
        ? "#B91C1C"
        : category === "Travel"
        ? "#1E40AF"
        : category === "Shopping"
        ? "#92400E"
        : category === "Bills"
        ? "#056162"
        : category === "Health"
        ? "#166534"
        : category === "Entertainment"
        ? "#6D28D9"
        : "#0369A1";
    return (
      <View style={[styles.badge, { backgroundColor: bg, borderColor: colors.border }]}>
        <Text style={[styles.badgeText, { color }]}>{category}</Text>
      </View>
    );
  };

  const renderExpense = ({ item }: { item: Expense }) => (
    <View style={[styles.premiumCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
        <View style={{ flex: 1 }}>
          <Text numberOfLines={1} style={[styles.premiumTitle, { color: colors.text }]}>{item.title}</Text>
          <Text style={[styles.premiumSub, { color: colors.sub }]}>{item.date} • {formatTimeReadable(item.time)}</Text>
          <Text numberOfLines={2} style={[styles.premiumDesc, { color: colors.text }]}>{item.discription || "No description"}</Text>
        </View>

        <View style={{ alignItems: "flex-end", marginLeft: 12 }}>
          <Text style={[styles.premiumAmount, { color: colors.primary }]}>₹{item.amount}</Text>
          <View style={{ height: 8 }} />
          <CategoryBadge category={item.category || item.otherCategory || "Other"} />
        </View>
      </View>

      <View style={{ flexDirection: "row", justifyContent: "flex-end", gap: 14, marginTop: 12 }}>
        {/* VIEW button (new) */}
        <TouchableOpacity style={[styles.actionLargeBtn, { backgroundColor: colors.card, borderColor: colors.border }]} onPress={() => openViewModal(item)}>
          <Ionicons name="eye-outline" size={18} color={colors.primary} />
          <Text style={[styles.actionLargeText, { color: colors.primary }]}>View</Text>
        </TouchableOpacity>

        {/* EDIT button */}
        <TouchableOpacity style={[styles.actionLargeBtn, { backgroundColor: colors.primary }]} onPress={() => openEditModal(item)}>
          <Ionicons name="create-outline" size={18} color="#fff" />
          <Text style={[styles.actionLargeText, { color: "#fff" }]}>Edit</Text>
        </TouchableOpacity>

        {/* DELETE button */}
        <TouchableOpacity style={[styles.actionLargeBtn, { backgroundColor: "#FEE2E2", borderColor: "#FBCACA" }]} onPress={() => confirmDelete(item._id)}>
          <Ionicons name="trash-outline" size={18} color="#B91C1C" />
          <Text style={[styles.actionLargeText, { color: "#B91C1C" }]}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const getMonthLabel = () => {
    const now = new Date();
    const monthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"];
    return `${monthNames[now.getMonth()]} ${now.getFullYear()}`;
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]}>
      <Navbar title="Expenses" />

      <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
        {/* totals row */}
        <View style={styles.headerRow}>
          <View style={[styles.cardStat, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.statLabel, { color: colors.sub }]}>Total</Text>
            {totalsLoading ? <ActivityIndicator /> : <Text style={[styles.statValue, { color: colors.text }]}>₹{totalExpenses}</Text>}
          </View>

          <View style={[styles.cardStat, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.statLabel, { color: colors.sub }]}>This Month</Text>
            {totalsLoading ? <ActivityIndicator /> : <Text style={[styles.statValue, { color: colors.text }]}>₹{monthSpend}</Text>}
            <Animated.Text style={{ opacity: headerFade, marginTop: 6, color: colors.sub, fontSize: 12 }}>
              {getMonthLabel()}
            </Animated.Text>
          </View>
        </View>

        {/* search + actions */}
        <View style={{ gap: 12 }}>
          <View style={[styles.searchContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Ionicons name="search-outline" size={20} color={colors.sub} />
            <TextInput
              placeholder="Search title or date (YYYY-MM-DD)"
              placeholderTextColor={colors.sub}
              value={searchText}
              onChangeText={setSearchText}
              onSubmitEditing={applySearch}
              style={[styles.searchInput, { color: colors.text }]}
            />
            <TouchableOpacity onPress={applySearch} style={[styles.primaryPill, { backgroundColor: colors.primary }]}>
              <Text style={styles.pillText}>Search</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={clearSearch} style={[styles.ghostPill]}>
              <Text style={styles.pillTextGhost}>Clear</Text>
            </TouchableOpacity>
          </View>

          <View style={{ flexDirection: "row", gap: 10 }}>
            <TouchableOpacity onPress={refreshAll} style={[styles.btnPrimary, { backgroundColor: colors.primary }]}>
              <Ionicons name="refresh-outline" size={16} color="#fff" />
              <Text style={styles.btnText}>Refresh</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={openCreateModal} style={[styles.btnAccent, { backgroundColor: colors.accent }]}>
              <Ionicons name="add" size={16} color="#fff" />
              <Text style={styles.btnText}>New Expense</Text>
            </TouchableOpacity>
          </View>

          <View style={[styles.datePickerRow]}>
            <TouchableOpacity style={[styles.datePickerBtn, { backgroundColor: colors.card, borderColor: colors.border }]} onPress={() => setShowDatePicker(true)}>
              <Ionicons name="calendar-outline" size={16} color={colors.sub} />
              <Text style={{ marginLeft: 8, color: colors.text }}>{selectedDateForSearch ? selectedDateForSearch.toISOString().slice(0,10) : "Filter by date"}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { setSelectedDateForSearch(null); clearSearch(); }} style={[styles.ghostPillSmall, { borderColor: colors.border }]}>
              <Text style={{ color: colors.sub }}>Reset Date</Text>
            </TouchableOpacity>
          </View>
        </View>

        {showDatePicker && (
          <DateTimePicker
            value={selectedDateForSearch ?? new Date()}
            mode="date"
            display={Platform.OS === "ios" ? "spinner" : "calendar"}
            onChange={(ev, d) => {
              setShowDatePicker(Platform.OS === "ios");
              if (d) {
                setSelectedDateForSearch(d);
                setTimeout(() => applySearch(), 80);
              }
            }}
          />
        )}

        {/* list */}
        <View>
          {loading ? (
            <ActivityIndicator style={{ marginTop: 28 }} />
          ) : expenses.length === 0 ? (
            <View style={{ marginTop: 40, alignItems: "center" }}>
              <Text style={{ color: colors.sub }}>No expenses yet. Press "New Expense" to add one.</Text>
            </View>
          ) : (
            <FlatList
              data={expenses}
              keyExtractor={(i) => i._id}
              renderItem={renderExpense}
              scrollEnabled={false}
              ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
              refreshing={refreshing}
              onRefresh={refreshAll}
            />
          )}
        </View>
      </ScrollView>

      {/* popup */}
      <Modal visible={!!popup} transparent animationType="fade">
        <View style={styles.popupOverlay}>
          <View style={[styles.popupBox, { backgroundColor: colors.card }]}>
            <Text style={[styles.popupText, { color: colors.text }]}>{popup}</Text>
            <TouchableOpacity onPress={() => setPopup("")} style={[styles.popupBtn, { backgroundColor: colors.primary }]}>
              <Text style={styles.popupBtnText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* view modal (centered read-only) */}
      {viewModalVisible && viewItem && (
        <Modal visible transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={[styles.modalBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>Expense Details</Text>

              <Text style={[styles.modalLabel, { color: colors.sub }]}>Title</Text>
              <Text style={[styles.modalText, { color: colors.text }]}>{viewItem.title}</Text>

              <Text style={[styles.modalLabel, { color: colors.sub }]}>Amount</Text>
              <Text style={[styles.modalText, { color: colors.text }]}>₹{viewItem.amount}</Text>

              <Text style={[styles.modalLabel, { color: colors.sub }]}>Category</Text>
              <Text style={[styles.modalText, { color: colors.text }]}>{viewItem.category || viewItem.otherCategory}</Text>

              <Text style={[styles.modalLabel, { color: colors.sub }]}>Date & Time</Text>
              <Text style={[styles.modalText, { color: colors.text }]}>{viewItem.date} • {formatTimeReadable(viewItem.time)}</Text>

              <Text style={[styles.modalLabel, { color: colors.sub }]}>Description</Text>
              <Text style={[styles.modalText, { color: colors.text }]}>{viewItem.discription || "—"}</Text>

              <View style={{ flexDirection: "row", gap: 10, marginTop: 12 }}>
                <TouchableOpacity onPress={() => { setViewModalVisible(false); }} style={[styles.btnSubmit, { flex: 1, backgroundColor: colors.primary }]}>
                  <Text style={styles.btnText}>Close</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { setViewModalVisible(false); openEditModal(viewItem); }} style={[styles.btnCancel, { flex: 1 }]}>
                  <Text style={styles.btnText}>Edit</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}

      {/* create/edit modal */}
      <Modal visible={editModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>{creating ? "New Expense" : "Edit Expense"}</Text>

            <TextInput value={formTitle} onChangeText={setFormTitle} placeholder="Title" placeholderTextColor={colors.sub} style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.text }]} />

            <TextInput value={formAmount} onChangeText={setFormAmount} placeholder="Amount" keyboardType="numeric" placeholderTextColor={colors.sub} style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.text }]} />

            <View style={[styles.pickerBox, { borderColor: colors.border }]}>
              <Picker selectedValue={formCategory} onValueChange={(v) => setFormCategory(String(v))} style={{ color: colors.text }}>
                {categories.map((c) => <Picker.Item key={c} label={c} value={c} />)}
              </Picker>
            </View>

            {formCategory === "Other" && (
              <TextInput value={formOtherCategory} onChangeText={setFormOtherCategory} placeholder="Specify other category" placeholderTextColor={colors.sub} style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.text }]} />
            )}

            <TextInput value={formDescription} onChangeText={setFormDescription} placeholder="Description" placeholderTextColor={colors.sub} style={[styles.input, { height: 80, textAlignVertical: "top", backgroundColor: colors.card, borderColor: colors.border, color: colors.text }]} multiline />

            <View style={{ flexDirection: "row", gap: 8 }}>
              <TouchableOpacity onPress={() => setShowEditDatePicker((s) => !s)} style={[styles.smallBtn, { backgroundColor: colors.primary, flex: 1 }]}>
                <Text style={styles.smallBtnText}>Pick Date</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setShowEditTimePicker((s) => !s)} style={[styles.smallBtn, { backgroundColor: "#6c757d", flex: 1 }]}>
                <Text style={styles.smallBtnText}>Pick Time</Text>
              </TouchableOpacity>
            </View>

            {showEditDatePicker && (
              <DateTimePicker
                value={formDate}
                mode="date"
                display={Platform.OS === "ios" ? "spinner" : "calendar"}
                onChange={(e, d) => {
                  if (d) setFormDate(d);
                  if (Platform.OS !== "ios") setShowEditDatePicker(false);
                }}
              />
            )}

            {showEditTimePicker && (
              <DateTimePicker
                value={formTime}
                mode="time"
                display={Platform.OS === "ios" ? "spinner" : "default"}
                onChange={(e, t) => {
                  if (t) setFormTime(t);
                  if (Platform.OS !== "ios") setShowEditTimePicker(false);
                }}
              />
            )}

            <View style={{ flexDirection: "row", gap: 10, marginTop: 12 }}>
              <TouchableOpacity onPress={submitForm} disabled={formLoading} style={[styles.btnSubmit, { backgroundColor: colors.primary, flex: 1 }]}>
                {formLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>{creating ? "Create" : "Save"}</Text>}
              </TouchableOpacity>

              <TouchableOpacity onPress={() => setEditModalVisible(false)} style={[styles.btnCancel, { flex: 1 }]}>
                <Text style={styles.btnText}>Cancel</Text>
              </TouchableOpacity>
            </View>

          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

// Styles
const styles = StyleSheet.create({
  container: { flex: 1 },

  headerRow: { flexDirection: "row", gap: 12, justifyContent: "space-between" },
  cardStat: { flex: 1, padding: 14, borderRadius: 12, borderWidth: 1 },
  statLabel: { fontSize: 12, fontWeight: "700" },
  statValue: { fontSize: 18, fontWeight: "900", marginTop: 8 },

  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
  },
  searchInput: { flex: 1, paddingVertical: 6, paddingHorizontal: 8 },

  primaryPill: { paddingVertical: 10, paddingHorizontal: 14, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  pillText: { color: "#fff", fontWeight: "700" },
  pillTextGhost: { fontWeight: "700" },

  ghostPill: { paddingVertical: 10, paddingHorizontal: 14, borderRadius: 10, alignItems: "center", justifyContent: "center", marginLeft: 6 },

  datePickerRow: { flexDirection: "row", alignItems: "center", gap: 8, marginTop: 6 },
  datePickerBtn: { flexDirection: "row", alignItems: "center", paddingVertical: 8, paddingHorizontal: 12, borderRadius: 10, borderWidth: 1 },

  btnPrimary: { flexDirection: "row", gap: 8, alignItems: "center", paddingVertical: 10, paddingHorizontal: 12, borderRadius: 10 },
  btnAccent: { flexDirection: "row", gap: 8, alignItems: "center", paddingVertical: 10, paddingHorizontal: 12, borderRadius: 10 },
  btnText: { color: "#fff", fontWeight: "700", marginLeft: 6 },

  ghostPillSmall: { paddingVertical: 8, paddingHorizontal: 10, borderRadius: 8, borderWidth: 1 },

  premiumCard: {
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 6,
  },
  premiumTitle: { fontSize: 16, fontWeight: "800" },
  premiumSub: { fontSize: 12, marginTop: 6 },
  premiumDesc: { fontSize: 13, marginTop: 8 },
  premiumAmount: { fontSize: 18, fontWeight: "900" },

  // larger action buttons (Edit / Delete / View)
  actionLargeBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
  },
  actionLargeText: {
    fontSize: 14,
    fontWeight: "700",
  },

  badge: { paddingVertical: 6, paddingHorizontal: 10, borderRadius: 999, borderWidth: 1 },
  badgeText: { fontSize: 12, fontWeight: "700" },

  iconBtnSmall: { padding: 8, borderRadius: 8 },

  popupOverlay: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.45)" },
  popupBox: { padding: 18, borderRadius: 12, width: "78%", alignItems: "center" },
  popupText: { fontSize: 15, fontWeight: "600", marginBottom: 12, textAlign: "center" },
  popupBtn: { paddingVertical: 10, paddingHorizontal: 22, borderRadius: 10 },
  popupBtnText: { color: "#fff", fontWeight: "700" },

  modalOverlay: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.45)" },
  modalBox: { width: "92%", borderRadius: 12, padding: 16, borderWidth: 1 },
  modalTitle: { fontSize: 18, fontWeight: "900", marginBottom: 12 },

  modalLabel: { fontSize: 13, fontWeight: "700", marginTop: 8 },
  modalText: { fontSize: 15, marginTop: 4 },

  input: { paddingVertical: 10, paddingHorizontal: 12, borderWidth: 1, borderRadius: 10, marginBottom: 8 },
  pickerBox: { borderWidth: 1, borderRadius: 10, overflow: "hidden", marginVertical: 6 },

  smallBtn: { paddingVertical: 10, paddingHorizontal: 12, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  smallBtnText: { color: "#fff", fontWeight: "700" },

  btnSubmit: { paddingVertical: 12, alignItems: "center", justifyContent: "center", borderRadius: 10 },
  btnCancel: { paddingVertical: 12, alignItems: "center", justifyContent: "center", borderRadius: 10, backgroundColor: "#6c757d" },
});
