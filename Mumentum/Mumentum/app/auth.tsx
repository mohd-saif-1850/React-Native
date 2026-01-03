import { useEffect } from "react";
import { Text, View } from "react-native";
import { useRouter } from "expo-router";
import * as Linking from "expo-linking";

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const handleUrl = (url: string) => {
      const parsed = Linking.parse(url);

      const token = parsed.queryParams?.token;
      const error = parsed.queryParams?.error;

      if (error) {
        console.log("GitHub login failed");
        router.replace("/"); // back to login
        return;
      }

      if (token && typeof token === "string") {
        // 🔐 Save token securely
        console.log("JWT:", token);

        // Example (recommended):
        // await SecureStore.setItemAsync("token", token);

        // router.replace("/home"); // or dashboard
      }
    };

    // Handle initial deep link
    Linking.getInitialURL().then((url) => {
      if (url) handleUrl(url);
    });

    // Handle future deep links
    const sub = Linking.addEventListener("url", (event) => {
      handleUrl(event.url);
    });

    return () => sub.remove();
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Signing you in…</Text>
    </View>
  );
}
