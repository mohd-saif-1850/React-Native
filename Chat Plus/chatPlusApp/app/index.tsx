import { View, Text, TouchableOpacity, StyleSheet, useColorScheme, ActivityIndicator, Image } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { router } from "expo-router"
import React, { useEffect, useState } from "react"
import * as SecureStore from 'expo-secure-store'

export default function Index() {
  const theme = useColorScheme()
  const [loading, setLoading] = useState(true)

  const checktoken = async () => {
    const token = await SecureStore.getItem("token")

    if (token) {
      setLoading(false)
      return router.replace("/(tabs)")
    }

    setLoading(false)
  }

  useEffect(() => {
    checktoken()
  },[])

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: theme === "dark" ? "#0d0d0d" : "#f5f7fa",
      paddingHorizontal: 20,
    },
    logo: {
      width: 120,
      height: 120,
      marginBottom: 20,
    },
    title: {
      fontSize: 36,
      fontWeight: "800",
      color: theme === "dark" ? "#ffffff" : "#1a1a1a",
      marginBottom: 10,
      letterSpacing: 1,
    },
    subtitle: {
      fontSize: 16,
      color: theme === "dark" ? "#b3b3b3" : "#555",
      marginBottom: 40,
      textAlign: "center",
      width: "80%",
    },
    button: {
      backgroundColor: theme === "dark" ? "#2563eb" : "#3b82f6",
      paddingVertical: 14,
      paddingHorizontal: 40,
      borderRadius: 14,
      elevation: 4,
    },
    buttonText: {
      color: "white",
      fontSize: 18,
      fontWeight: "700",
    },
  })

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Image source={require("../assets/logo.png")} style={styles.logo} resizeMode="contain" />
        <ActivityIndicator size="large" color={theme === "dark" ? "#2563eb" : "#3b82f6"} />
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <Image source={require("../assets/logo.png")} style={styles.logo} resizeMode="contain" />
      <Text style={styles.title}>Chat Plus</Text>
      <Text style={styles.subtitle}>A fast and secure chat experience.</Text>

      <TouchableOpacity style={styles.button} onPress={() => router.replace("/login")}>
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>
    </SafeAreaView>
  )
}
