import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  useColorScheme,
  TextInput,
  Modal,
  Platform
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Navbar from "@/components/Navbar";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as ImagePicker from "expo-image-picker";

export default function Profile() {
  const theme = useColorScheme();

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [mobileNo, setMobileNo] = useState("");
  const [gender, setGender] = useState("");
  const [dob, setDob] = useState("");
  const [dateObj, setDateObj] = useState(new Date());

  const [showDobPicker, setShowDobPicker] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openImageEdit, setOpenImageEdit] = useState(false);
  const [save, setSave] = useState(false);

  const [errors, setErrors] = useState({
    name: "",
    username: "",
    mobileNo: ""
  });

  const [user, setUser] = useState<any>(null);

  const colors = {
    bg: theme === "dark" ? "#0D0D0D" : "#FFFFFF",
    card: theme === "dark" ? "#141416" : "#F8F9FA",
    text: theme === "dark" ? "#FFFFFF" : "#0B1220",
    sub: theme === "dark" ? "#A1A1A1" : "#585A60",
    border: theme === "dark" ? "#232326" : "#E6E6E6",
    primary: "#4F46E5"
  };

  const modalColors = {
    bg: theme === "dark" ? "#1A1A1A" : "#FFFFFF",
    text: theme === "dark" ? "#FFFFFF" : "#0B1220",
    border: theme === "dark" ? "#333" : "#DDD"
  };

  const getToken = async () => SecureStore.getItemAsync("spendmate_token");

  const fetchUser = async () => {
    const token = await getToken();
    if (!token) return router.replace("/login");

    const res = await axios.get(
      `${process.env.EXPO_PUBLIC_BACKEND}/user/get-user`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setUser(res.data.data);
  };

  const updateUser = async () => {
    if (errors.name || errors.username || errors.mobileNo) return;

    try {
      setSave(true);
      const token = await getToken();
      if (!token) return;

      await axios.patch(
        `${process.env.EXPO_PUBLIC_BACKEND}/user/update-user`,
        { name, username, mobileNo },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setOpenEdit(false);
      setSave(false);
      fetchUser();
    } catch (error) {
      setSave(false);
    }
  };

  const updateNPG = async (g?: string, d?: string) => {
    const token = await getToken();
    if (!token) return;

    const form = new FormData();

    if (g) form.append("gender", g);
    if (d) form.append("dob", d);

    const res = await axios.patch(
      `${process.env.EXPO_PUBLIC_BACKEND}/user/update-npg`,
      form,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
        }
      }
    );

    setUser(res.data.data);
  };

  const updateImage = async (uri: string) => {
    const token = await getToken();
    if (!token) return;

    const form = new FormData();

    form.append("profileUrl", {
      uri,
      name: "profile.jpg",
      type: "image/jpeg"
    } as any);

    const res = await axios.patch(
      `${process.env.EXPO_PUBLIC_BACKEND}/user/update-npg`,
      form,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
        }
      }
    );

    setUser(res.data.data);
    setOpenImageEdit(false);
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8
    });

    if (!result.canceled) {
      updateImage(result.assets[0].uri);
    }
  };

  const openEditModal = () => {
    setName(user?.name);
    setUsername(user?.username);
    setMobileNo(user?.mobileNo);
    setGender(user?.gender === "Not Specified" ? "" : user?.gender);
    setDob(user?.dob ?? "");

    if (user?.dob) setDateObj(new Date(user.dob + "T00:00:00"));

    setErrors({ name: "", username: "", mobileNo: "" });
    setOpenEdit(true);
  };

  const handleDobChange = (event: any, selected: Date | undefined) => {
    if (Platform.OS !== "ios") setShowDobPicker(false);

    if (selected) {
      setDateObj(selected);

      const y = selected.getFullYear();
      const m = String(selected.getMonth() + 1).padStart(2, "0");
      const d = String(selected.getDate()).padStart(2, "0");

      const formatted = `${y}-${m}-${d}`;
      setDob(formatted);

      updateNPG(undefined, formatted);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]}>
      <Navbar title="Profile" />

      <ScrollView contentContainerStyle={{ padding: 20, gap: 18 }}>
        <View style={styles.center}>
          <View>
            <Image source={{ uri: user?.profileUrl }} style={styles.profileImg} />
            <TouchableOpacity
              style={styles.editIcon}
              onPress={() => setOpenImageEdit(true)}
            >
              <Ionicons name="camera" size={20} color="#fff" />
            </TouchableOpacity>
          </View>

          <Text style={[styles.name, { color: colors.text }]}>{user?.name}</Text>
          <Text style={[styles.username, { color: colors.sub }]}>
            @{user?.username}
          </Text>

          <TouchableOpacity
            style={[styles.editBtn, { backgroundColor: colors.primary }]}
            onPress={openEditModal}
          >
            <Text style={styles.editBtnTxt}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Info Cards */}
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.label, { color: colors.sub }]}>Email</Text>
          <Text style={[styles.value, { color: colors.text }]}>{user?.email}</Text>
        </View>

        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.label, { color: colors.sub }]}>Mobile No</Text>
          <Text style={[styles.value, { color: colors.text }]}>{user?.mobileNo}</Text>
        </View>

        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.label, { color: colors.sub }]}>Gender</Text>
          <Text style={[styles.value, { color: colors.text }]}>
            {user?.gender}
          </Text>
        </View>

        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.label, { color: colors.sub }]}>Date of Birth</Text>
          <Text style={[styles.value, { color: colors.text }]}>
            {user?.dob || "Not added"}
          </Text>
        </View>

        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.label, { color: colors.sub }]}>Subscription</Text>
          <Text
            style={[
              styles.value,
              { color: user?.subscription ? "#32D74B" : "#D93C3C" }
            ]}
          >
            {user?.subscription ? "Active" : "Not Active"}
          </Text>
        </View>
      </ScrollView>

      {/* IMAGE MODAL */}
      {openImageEdit && (
        <Modal visible transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={[styles.modalBox, { backgroundColor: modalColors.bg }]}>
              <Text style={[styles.modalTitle, { color: modalColors.text }]}>
                Change Profile Image
              </Text>

              <TouchableOpacity style={styles.imageUploadBtn} onPress={pickImage}>
                <Ionicons name="image-outline" size={20} color="#fff" />
                <Text style={styles.imageUploadText}>Choose from Gallery</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.btn, { backgroundColor: "#6C757D", marginTop: 10 }]}
                onPress={() => setOpenImageEdit(false)}
              >
                <Text style={styles.btnText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}

      {/* EDIT MODAL */}
      {openEdit && (
        <Modal visible transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={[styles.modalBox, { backgroundColor: modalColors.bg }]}>
              <Text style={[styles.modalTitle, { color: modalColors.text }]}>
                Edit Profile
              </Text>

              {/* Name */}
              <Text style={[styles.inputLabel, { color: modalColors.text }]}>
                Full Name
              </Text>

              <TextInput
                style={[styles.input, { color: modalColors.text }]}
                value={name}
                onChangeText={(text) => {
                  if (text.length < 2) {
                    setErrors((p) => ({ ...p, name: "Name is too short" }));
                  } else {
                    setErrors((p) => ({ ...p, name: "" }));
                  }
                  setName(text);
                }}
                placeholder="Full Name"
                placeholderTextColor="#888"
              />

              {errors.name ? <Text style={styles.error}>{errors.name}</Text> : null}

              {/* Username */}
              <Text style={[styles.inputLabel, { color: modalColors.text }]}>
                Username
              </Text>

              <TextInput
                style={[styles.input, { color: modalColors.text }]}
                value={username}
                onChangeText={(text) => {
                  let cleaned = text.toLowerCase();
                  cleaned = cleaned.replace(/\s+/g, "_");
                  cleaned = cleaned.replace(/_+/g, "_");
                  if (cleaned.startsWith("_"))
                    cleaned = cleaned.replace(/^_+/, "");
                  if (cleaned.length > 15) {
                    setErrors((p) => ({
                      ...p,
                      username: "Max 15 characters allowed"
                    }));
                    return;
                  }
                  setErrors((p) => ({ ...p, username: "" }));
                  setUsername(cleaned);
                }}
                placeholder="Username"
                placeholderTextColor="#888"
              />

              {errors.username ? (
                <Text style={styles.error}>{errors.username}</Text>
              ) : null}

              {/* Mobile */}
              <Text style={[styles.inputLabel, { color: modalColors.text }]}>
                Mobile Number
              </Text>

              <TextInput
                style={[styles.input, { color: modalColors.text }]}
                value={mobileNo}
                keyboardType="number-pad"
                onChangeText={(text) => {
                  const cleaned = text.replace(/[^0-9]/g, "");
                  if (cleaned.length > 10) return;

                  if (cleaned.length < 10) {
                    setErrors((p) => ({
                      ...p,
                      mobileNo: "Must be 10 digits"
                    }));
                  } else {
                    setErrors((p) => ({ ...p, mobileNo: "" }));
                  }

                  setMobileNo(cleaned);
                }}
                placeholder="Mobile Number"
                placeholderTextColor="#888"
              />

              {errors.mobileNo ? (
                <Text style={styles.error}>{errors.mobileNo}</Text>
              ) : null}

              {/* Gender */}
              <Text style={[styles.inputLabel, { color: modalColors.text }]}>
                Gender
              </Text>

              <View style={[styles.pickerBox, { borderColor: modalColors.border }]}>
                <Picker
                  selectedValue={gender}
                  onValueChange={(v) => {
                    setGender(v);
                    updateNPG(v, dob);
                  }}
                  style={[styles.picker, { color: modalColors.text }]}
                >
                  <Picker.Item label="Select Gender" value="" />
                  <Picker.Item label="Male" value="Male" />
                  <Picker.Item label="Female" value="Female" />
                  <Picker.Item label="Other" value="Other" />
                </Picker>
              </View>

              {/* DOB */}
              <Text style={[styles.inputLabel, { color: modalColors.text }]}>
                Date of Birth
              </Text>

              <TouchableOpacity
                style={styles.dateBtn}
                onPress={() => setShowDobPicker(true)}
              >
                <Ionicons name="calendar-outline" size={18} color="#fff" />
                <Text style={styles.dateBtnText}>
                  {dob || "Select DOB"}
                </Text>
              </TouchableOpacity>

              {showDobPicker && (
                <DateTimePicker
                  value={dateObj}
                  mode="date"
                  display={Platform.OS === "ios" ? "spinner" : "default"}
                  onChange={handleDobChange}
                />
              )}

              {/* Buttons */}
              <View style={styles.row}>
                <TouchableOpacity
                  style={[
                    styles.btn,
                    { backgroundColor: save ? "#0C3B74" : "#4F46E5" }
                  ]}
                  onPress={updateUser}
                  disabled={save}
                >
                  <Text style={styles.btnText}>
                    {save ? "Saving..." : "Save"}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.btn, { backgroundColor: "#6C757D" }]}
                  onPress={() => setOpenEdit(false)}
                >
                  <Text style={styles.btnText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { alignItems: "center", gap: 8 },
  profileImg: { width: 120, height: 120, borderRadius: 80 },
  editIcon: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#4F46E5",
    width: 38,
    height: 38,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center"
  },
  name: { fontSize: 22, fontWeight: "800" },
  username: { fontSize: 15, fontWeight: "600" },
  editBtn: {
    marginTop: 10,
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderRadius: 12
  },
  editBtnTxt: { color: "#fff", fontSize: 15, fontWeight: "700" },
  card: { padding: 16, borderRadius: 14, borderWidth: 1 },
  label: { fontSize: 13, fontWeight: "700", marginBottom: 4 },
  value: { fontSize: 16, fontWeight: "600" },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.4)"
  },
  modalBox: {
    width: "90%",
    padding: 20,
    borderRadius: 12
  },
  modalTitle: { fontSize: 20, fontWeight: "700", marginBottom: 14 },
  inputLabel: { fontSize: 13, fontWeight: "700", marginBottom: 4 },
  input: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    fontSize: 15,
    marginBottom: 6,
    borderColor: "#ddd"
  },
  pickerBox: {
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 10
  },
  picker: {
    height: 50,
    width: "100%"
  },
  dateBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#4F46E5",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    marginBottom: 14
  },
  dateBtnText: { color: "#fff", fontWeight: "600", fontSize: 14 },
  error: {
    fontSize: 12,
    color: "#D93C3C",
    marginBottom: 10,
    marginTop: -4
  },
  row: { flexDirection: "row", gap: 10, marginTop: 14 },
  btn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center"
  },
  btnText: { color: "#fff", fontWeight: "700", fontSize: 15 },
  imageUploadBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#4F46E5",
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 10
  },
  imageUploadText: { color: "#fff", fontSize: 15, fontWeight: "700" }
});
