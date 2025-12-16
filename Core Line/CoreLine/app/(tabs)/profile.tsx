import { useEffect, useState } from "react"
import {
  View,
  Text,
  Image,
  ActivityIndicator,
  StyleSheet,
  useColorScheme,
  TouchableOpacity,
  Modal,
  TextInput,
  ScrollView,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import * as SecureStore from "expo-secure-store"
import axios from "axios"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { router } from "expo-router"
import * as ImagePicker from "expo-image-picker"

type User = {
  name: string
  username: string
  bio?: string
  profilePic?: string
  gender?: string
}

export default function ProfileScreen() {
  const scheme = useColorScheme()
  const isDark = scheme === "dark"

  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [editOpen, setEditOpen] = useState(false)
  const [error,setError] = useState("")
  const [image,setImage] = useState<string | null>(null)

  const [name, setName] = useState("")
  const [username, setUsername] = useState("")
  const [bio, setBio] = useState("")
  const [gender, setGender] = useState("")

  const fetchUser = async () => {
    const token = await SecureStore.getItemAsync("token")
    const res = await axios.get(
      `${process.env.EXPO_PUBLIC_URL}/user/get-user`,
      { headers: { Authorization: `Bearer ${token}` } }
    )

    setUser(res.data.data)
    setName(res.data.data.name)
    setUsername(res.data.data.username)
    setBio(res.data.data.bio || "")
    setGender(res.data.data.gender || "")
    setLoading(false)
  }

  useEffect(() => {
    fetchUser()
  }, [])

  const validateProfile = () => {
    if (name.trim().length < 2 || name.trim().length > 50) {
      return "Name must be between 2 and 50 characters"
    }

    if (
      username.trim().length < 3 ||
      username.trim().length > 20
    ) {
      return "Username must be 3–20 characters"
    }

    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      return "Username can only contain letters, numbers and _"
    }

    if (bio.length > 160) {
      return "Bio cannot exceed 160 characters"
    }

    return null
  }

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    })

    if (result.canceled || !result.assets?.length) {
      return setError("File is Cancelled !")
    }

    const file = result.assets[0]

    if (file.fileSize && file.fileSize > 10 * 1024 * 1024) {
      return setError("Image must be less than 10Mb !")
    }

    setError("")
    setImage(file.uri)
  }

  const updateProfile = async () => {
    setLoading(true)
    const validationError = validateProfile()
    if (validationError) {
      setLoading(false)
      return setError(validationError)
    }

    try {
      const token = await SecureStore.getItemAsync("token")

      if (image) {
          const formData = new FormData()
        formData.append("file", {
          uri: image,
          name: "profile.jpg",
          type: "image/jpeg",
        } as any)

        await axios.patch(
          `${process.env.EXPO_PUBLIC_URL}/user/update-pic`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        )
      }

      await axios.patch(
        `${process.env.EXPO_PUBLIC_URL}/user/update-user`,{
          name,
          username,
          bio,
          gender
        },{
          headers: {
            Authorization: `Bearer ${token}`
          },
        }
      )

      fetchUser()
      setEditOpen(false)
      setError("")
      
    } catch (err) {
      setError("Failed to update profile picture")
    } finally {
      setLoading(false)
      setError("")
    }
  }

  const logout = async () => {
    await SecureStore.deleteItemAsync("token")
    await AsyncStorage.removeItem("tutorial")
    router.replace("/login")
  }

  if (loading) {
    return (
      <SafeAreaView
        style={[
          styles.center,
          { backgroundColor: isDark ? "#000" : "#fff" },
        ]}
      >
        <ActivityIndicator size="large" />
      </SafeAreaView>
    )
  }

  return (
    <ScrollView>
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: isDark ? "#000" : "#f3f4f6" },
      ]}
    >
      <View
        style={[
          styles.card,
          { backgroundColor: isDark ? "#0f172a" : "#ffffff" },
        ]}
      >
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => setEditOpen(true)}
          style={styles.avatarWrap}
        >
          <Image source={{ uri: user?.profilePic }} style={styles.avatar} />
          <View
            style={[
              styles.avatarOverlay,
              { backgroundColor: isDark ? "#020617" : "#111827" },
            ]}
          >
            <Text style={styles.avatarIcon}>✎</Text>
          </View>
        </TouchableOpacity>

        <View style={styles.infoBlock}>
          <Text style={[styles.label, { color: isDark ? "#94a3b8" : "#6b7280" }]}>
            Name
          </Text>
          <Text style={[styles.value, { color: isDark ? "#fff" : "#020617" }]}>
            {user?.name}
          </Text>
        </View>

        <View style={styles.infoBlock}>
          <Text style={[styles.label, { color: isDark ? "#94a3b8" : "#6b7280" }]}>
            Username
          </Text>
          <Text style={[styles.subValue, { color: isDark ? "#cbd5f5" : "#334155" }]}>
            @{user?.username}
          </Text>
        </View>

        {gender ? (
          <View style={styles.infoBlock}>
            <Text style={[styles.label, { color: isDark ? "#94a3b8" : "#6b7280" }]}>
              Gender
            </Text>
            <View
              style={[
                styles.genderBadge,
                { backgroundColor: isDark ? "#1e293b" : "#e5e7eb" },
              ]}
            >
              <Text
                style={[
                  styles.genderBadgeText,
                  { color: isDark ? "#e5e7eb" : "#020617" },
                ]}
              >
                {gender}
              </Text>
            </View>
          </View>
        ) : null}

        {user?.bio ? (
          <View style={styles.infoBlock}>
            <Text style={[styles.label, { color: isDark ? "#94a3b8" : "#6b7280" }]}>
              Bio
            </Text>
            <Text style={[styles.bio, { color: isDark ? "#d1d5db" : "#334155" }]}>
              {user.bio}
            </Text>
          </View>
        ) : null}

        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => setEditOpen(true)}
          style={[
            styles.editBtn,
            {
              backgroundColor: isDark ? "#1e293b" : "#2563eb",
              shadowColor: isDark ? "#000" : "#2563eb",
            },
          ]}
        >
          <Text style={styles.editText}>Edit Profile</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        activeOpacity={0.85}
        onPress={logout}
        style={[
          styles.logoutBtn,
          { backgroundColor: isDark ? "#dc2626" : "#ef4444" },
        ]}
      >
        <Text style={styles.logoutText}>Log out</Text>
      </TouchableOpacity>

      <Modal visible={editOpen} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modal,
              {
                backgroundColor: isDark ? "#020617" : "#ffffff",
                borderColor: isDark ? "#1e293b" : "#e5e7eb",
              },
            ]}
          >
            <TouchableOpacity style={styles.modalAvatar} onPress={pickImage}>
              <Image source={{ uri: user?.profilePic }} style={styles.modalAvatarImg} />
              <View style={styles.avatarOverlay}>
                <Text style={styles.avatarIcon}>✎</Text>
              </View>
            </TouchableOpacity>

            <Text style={[styles.inputLabel, { color: isDark ? "#9ca3af" : "#64748b" }]}>
              Name
            </Text>
            <TextInput
              value={name}
              onChangeText={setName}
              maxLength={20}
              style={[
                styles.input,
                {
                  backgroundColor: isDark ? "#111827" : "#f1f5f9",
                  color: isDark ? "#ffffff" : "#020617",
                },
              ]}
            />

            <Text style={[styles.inputLabel, { color: isDark ? "#9ca3af" : "#64748b" }]}>
              Username
            </Text>
            <TextInput
              value={username}
              onChangeText={setUsername}
              maxLength={20}
              style={[
                styles.input,
                {
                  backgroundColor: isDark ? "#111827" : "#f1f5f9",
                  color: isDark ? "#ffffff" : "#020617",
                },
              ]}
            />

            <Text style={[styles.inputLabel, { color: isDark ? "#9ca3af" : "#64748b" }]}>
              Bio
            </Text>
            <TextInput
              value={bio}
              onChangeText={setBio}
              maxLength={100}
              multiline
              style={[
                styles.input,
                styles.bioInput,
                {
                  backgroundColor: isDark ? "#111827" : "#f1f5f9",
                  color: isDark ? "#ffffff" : "#020617",
                },
              ]}
            />
            <Text style={{ opacity: 0.6, color: isDark ? "#ffffff" : "#020617", alignSelf: "flex-end", marginTop: 4 }}>
              {bio.length}/100
            </Text>

            <Text style={[styles.inputLabel, { color: isDark ? "#9ca3af" : "#64748b" }]}>
              Gender
            </Text>
            <View style={styles.genderRow}>
              {["Male", "Female", "Other"].map((g) => (
                <TouchableOpacity
                  key={g}
                  onPress={() => setGender(g)}
                  style={[
                    styles.genderBtn,
                    {
                      backgroundColor:
                        gender === g
                          ? "#2563eb"
                          : isDark
                          ? "#1f2933"
                          : "#e5e7eb",
                    },
                  ]}
                >
                  <Text
                    style={{
                      color: gender === g ? "#fff" : isDark ? "#9ca3af" : "#334155",
                      fontWeight: gender === g ? "600" : "500",
                    }}
                  >
                    {g}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {error && (
              <Text style={{
                color: "red",
                fontSize: 12,
                marginTop: 10

              }}>
                {error}
              </Text>
            )}

            <TouchableOpacity style={styles.saveBtn} onPress={() =>{ 
              updateProfile()
            }}>
              <Text style={styles.saveText}>Save Changes</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => {
              setEditOpen(false)
              setError("")
            }}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },

  card: {
    width: "90%",
    marginTop: 40,
    borderRadius: 26,
    padding: 24,
  },

  avatarWrap: { alignSelf: "center" },
  avatar: { width: 120, height: 120, borderRadius: 60 },
  avatarOverlay: {
    position: "absolute",
    bottom: 6,
    right: 6,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarIcon: { color: "#fff", fontSize: 12 },

  infoBlock: { marginTop: 16 },
  label: { fontSize: 13, marginBottom: 4 },
  value: { fontSize: 18, fontWeight: "700" },
  subValue: { fontSize: 15 },
  bio: { fontSize: 14, lineHeight: 20 },

  genderBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  genderBadgeText: { fontSize: 13, fontWeight: "600" },

  editBtn: {
    alignSelf: "center",
    marginTop: 24,
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 999,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 6,
  },
  editText: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "600",
    letterSpacing: 0.4,
  },

  logoutBtn: {
    width: "85%",
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: "center",
    marginTop: 30,
  },
  logoutText: { color: "#fff", fontSize: 16, fontWeight: "600" },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.65)",
    justifyContent: "center",
    alignItems: "center",
  },

  modal: {
    width: "92%",
    maxHeight: "90%",
    borderRadius: 24,
    padding: 22,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.35,
    shadowRadius: 20,
    elevation: 12,
  },

  modalAvatar: { alignSelf: "center", marginBottom: 18 },
  modalAvatarImg: { width: 96, height: 96, borderRadius: 48 },

  inputLabel: { fontSize: 13, marginTop: 12, marginBottom: 6 },
  input: {
    width: "100%",
    borderRadius: 14,
    padding: 14,
  },
  bioInput: { height: 90, textAlignVertical: "top" },

  genderRow: { flexDirection: "row", marginTop: 10 },
  genderBtn: {
    flex: 1,
    marginHorizontal: 4,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: "center",
  },

  saveBtn: {
    marginTop: 20,
    paddingVertical: 14,
    borderRadius: 16,
    backgroundColor: "#22c55e",
    alignItems: "center",
  },
  saveText: { color: "#000", fontSize: 16, fontWeight: "700" },

  cancelText: { color: "#ef4444", marginTop: 14, textAlign: "center" },
})
