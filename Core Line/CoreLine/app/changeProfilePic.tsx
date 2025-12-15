import { useState } from "react"
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

export default function ProfileSetupScreen() {
  const scheme = useColorScheme()
  const isDark = scheme === "dark"
  const router = useRouter()

  const [image, setImage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    })

    if (!result.canceled) {
      setImage(result.assets[0].uri)
    }
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

    const res = await axios.patch(
      `${process.env.EXPO_PUBLIC_URL}/user/update-pic`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    )
    // await AsyncStorage.setItem("tutorial","true")
    // router.replace("/(tabs)")
    setLoading(false)
  } catch (error) {
    setLoading(false)
    console.log("Error while Changing the Profile Picture:", error)
  }
}


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
        style={{
          width: 180,
          height: 180,
          borderRadius: 90,
          backgroundColor: isDark ? "#111827" : "#ffffff",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 40,
          shadowColor: "#000",
          shadowOpacity: 0.15,
          shadowRadius: 10,
          elevation: 6,
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
          <Text
            style={{
              color: "#3b82f6",
              fontSize: 16,
              fontWeight: "600",
            }}
          >
            Choose Photo
          </Text>
        )}
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
    </View>
  )
}
