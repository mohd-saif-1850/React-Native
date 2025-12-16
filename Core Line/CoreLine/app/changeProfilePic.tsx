import { useEffect, useState } from "react"
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  useColorScheme,
} from "react-native"
import { useRouter } from "expo-router"
import * as ImagePicker from "expo-image-picker"
import AsyncStorage from "@react-native-async-storage/async-storage"
import axios from "axios"
import * as SecureStore from "expo-secure-store"
import { Ionicons } from "@expo/vector-icons"

export default function ProfileSetupScreen() {
  const scheme = useColorScheme()
  const isDark = scheme === "dark"
  const router = useRouter()

  const [image, setImage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

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

  const handleContinue = async () => {
    if (!image) return
    setLoading(true)

    try {
      const token = await SecureStore.getItemAsync("token")

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

      await AsyncStorage.setItem("tutorial", "true")
      router.replace("/(tabs)")
    } catch (err) {
      setError("Failed to update profile picture")
    } finally {
      setLoading(false)
    }
  }

  const getUser = async () => {
    try {
      const token = await SecureStore.getItemAsync("token")

      const user = await axios.get(
        `${process.env.EXPO_PUBLIC_URL}/user/get-user`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      const imageUrl = user.data?.data?.profilePic
      if (imageUrl) {
        setImage(imageUrl)
      }
    } catch {
      setError("Failed to load user")
    }
  }

  useEffect(() => {
    getUser()
  }, [])

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: isDark ? "#0a0a0a" : "#f3f4f6",
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 24,
      }}
    >
      <Text
        style={{
          fontSize: 32,
          fontWeight: "800",
          color: isDark ? "#ffffff" : "#111827",
          marginBottom: 8,
        }}
      >
        Set up profile
      </Text>

      <Text
        style={{
          fontSize: 16,
          color: isDark ? "#9ca3af" : "#6b7280",
          marginBottom: 40,
          textAlign: "center",
        }}
      >
        Upload a profile picture to continue
      </Text>

      <TouchableOpacity
        onPress={pickImage}
        activeOpacity={0.9}
        style={{
          width: 180,
          height: 180,
          borderRadius: 90,
          backgroundColor: isDark ? "#111827" : "#ffffff",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 40,
          shadowColor: "#000",
          shadowOpacity: 0.18,
          shadowRadius: 12,
          elevation: 8,
        }}
      >
        {image ? (
          <Image
            source={{ uri: image }}
            style={{
              width: 180,
              height: 180,
              borderRadius: 90,
            }}
          />
        ) : (
          <Ionicons
            name="person-circle-outline"
            size={140}
            color="#9ca3af"
          />
        )}

        <View
          style={{
            position: "absolute",
            bottom: 8,
            right: 8,
            width: 42,
            height: 42,
            borderRadius: 21,
            backgroundColor: "#3b82f6",
            alignItems: "center",
            justifyContent: "center",
            elevation: 6,
          }}
        >
          <Ionicons name="camera" size={20} color="#fff" />
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={handleContinue}
        disabled={!image || loading}
        style={{
          width: "100%",
          backgroundColor: image ? "#3b82f6" : "#9ca3af",
          paddingVertical: 18,
          borderRadius: 22,
          alignItems: "center",
        }}
      >
        <Text
          style={{
            color: "#ffffff",
            fontSize: 17,
            fontWeight: "700",
          }}
        >
          {loading ? "Saving..." : "Continue"}
        </Text>
      </TouchableOpacity>

      {error ? (
        <Text
          style={{
            color: "#ef4444",
            fontSize: 14,
            marginTop: 10,
            textAlign: "center",
          }}
        >
          {error}
        </Text>
      ) : null}
    </View>
  )
}
