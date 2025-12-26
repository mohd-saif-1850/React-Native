import { View, Text, StyleSheet, Pressable, Linking, useColorScheme } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import axios from "axios"

export default function Index() {
  const scheme = useColorScheme();
  const dark = scheme === "dark";

  const githubLogin = async () => {
    const res = await axios.get(`${process.env.EXPO_PUBLIC_URL}/user/github-login`)
  }

  const colors = {
    background: dark ? "#0b0f1a" : "#f5f7fb",
    primaryText: dark ? "#ffffff" : "#0b0f1a",
    secondaryText: dark ? "#9aa4b2" : "#5f6c7b",
    card: dark ? "#11162a" : "#ffffff",
    github: "#24292e",
    accent: dark ? "#4cc9f0" : "#4361ee"
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.card, { backgroundColor: colors.card }]}>
        <Text style={[styles.appName, { color: colors.primaryText }]}>
          Momentum
        </Text>

        <Text style={[styles.tagline, { color: colors.secondaryText }]}>
          Get started with GitHub
        </Text>

        <Pressable
          style={[styles.githubButton, { backgroundColor: colors.github }]}
          onPress={githubLogin}
        >
          <FontAwesome name="github" size={22} color="#ffffff" />
          <Text style={styles.githubText}>Continue with GitHub</Text>
        </Pressable>
      </View>

      <Text style={[styles.footer, { color: colors.secondaryText }]}>
        Crafted by Mohd Saif
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24
  },
  card: {
    width: "100%",
    maxWidth: 420,
    borderRadius: 20,
    paddingVertical: 48,
    paddingHorizontal: 32,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 6
  },
  appName: {
    fontSize: 42,
    fontWeight: "800",
    letterSpacing: 0.5,
    marginBottom: 10
  },
  tagline: {
    fontSize: 16,
    marginBottom: 40
  },
  githubButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    width: "100%",
    paddingVertical: 16,
    borderRadius: 14
  },
  githubText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600"
  },
  footer: {
    position: "absolute",
    bottom: 28,
    fontSize: 14
  }
});
