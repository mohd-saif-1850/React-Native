import React, { useEffect, useState, useMemo, useRef } from "react"
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Easing,
  useColorScheme,
  LayoutAnimation,
  Platform,
  UIManager,
  Linking
} from "react-native"
import { AntDesign, Feather, MaterialCommunityIcons } from "@expo/vector-icons"
import * as Haptics from "expo-haptics"
import { StatusBar } from "expo-status-bar"

if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true)
}

export default function Index() {
  const scheme = useColorScheme()
  const isDark = scheme === "dark"
  const [loading, setLoading] = useState(true)
  const spinValue = useRef(new Animated.Value(0)).current

  const colors = useMemo(
    () => ({
      bg: isDark ? "#000000" : "#FDFDFF",
      text: isDark ? "#FFFFFF" : "#0A0A0B",
      muted: isDark ? "#71717A" : "#64748B",
      border: isDark ? "#1A1A1E" : "#E2E8F0",
      accent: "#6366F1",
      secondary: "#10B981",
      card: isDark ? "#09090B" : "#F8FAFC"
    }),
    [isDark]
  )

  useEffect(() => {
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 900,
        easing: Easing.linear,
        useNativeDriver: true
      })
    ).start()

    const init = async () => {
      await new Promise(r => setTimeout(r, 1400))
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
      setLoading(false)
    }
    init()
  }, [])

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"]
  })

  const haptic = () =>
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)

  if (loading) {
    return (
      <View style={[styles.loader, { backgroundColor: colors.bg }]}>
        <Animated.View
          style={[
            styles.loaderRing,
            {
              borderColor: colors.border,
              borderTopColor: colors.accent,
              transform: [{ rotate: spin }]
            }
          ]}
        />
        <Text style={[styles.loadingText, { color: colors.muted }]}>
          Initializing Mumentum
        </Text>
      </View>
    )
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <StatusBar style={isDark ? "light" : "dark"} />

      <View style={[styles.momentumBg, { borderColor: colors.border }]} />

      <View style={styles.content}>
        <View style={styles.nav}>
          <Text style={[styles.navTitle, { color: colors.text }]}>
            MUMENTUM
          </Text>
          <View
            style={[
              styles.devBadge,
              { backgroundColor: colors.card, borderColor: colors.border }
            ]}
          >
            <View
              style={[styles.pulseDot, { backgroundColor: colors.secondary }]}
            />
            <Text style={[styles.devBadgeText, { color: colors.muted }]}>
              v0.1
            </Text>
          </View>
        </View>

        <View style={styles.hero}>
          <Text style={[styles.heroTitle, { color: colors.text }]}>
            Code.
            {"\n"}Challenge.
            {"\n"}
            <Text style={{ color: colors.accent }}>Repeat.</Text>
          </Text>

          <Text style={[styles.heroSub, { color: colors.muted }]}>
            Mumentum helps developers stay consistent with challenges,
            task flow, and GitHub insights — without overthinking productivity.
          </Text>
        </View>

        <View style={styles.featureGrid}>
          <Feature icon="github" label="Insights" colors={colors} />
          <Feature icon="target" label="Challenges" colors={colors} />
          <Feature icon="check-circle" label="Tasks" colors={colors} />
        </View>

        <View style={styles.ctaArea}>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={haptic}
            style={[styles.primaryAction, { backgroundColor: colors.text }]}
          >
            <AntDesign name="github" size={20} color={colors.bg} />
            <Text
              style={[styles.primaryActionText, { color: colors.bg }]}
            >
              Continue with GitHub
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.75}
            onPress={haptic}
            style={[
              styles.secondaryAction,
              { borderColor: colors.border, backgroundColor: colors.card }
            ]}
          >
            <Feather name="corner-down-right" size={18} color={colors.text} />
            <Text
              style={[styles.secondaryActionText, { color: colors.text }]}
            >
              Login with Email
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => Linking.openURL("https://github.com/mohd-saif-1850")}
          style={styles.footerBrand}
        >
          <AntDesign name="github" size={14} color={colors.muted} />
          <Text style={[styles.githubUser, { color: colors.muted }]}>
            mohd-saif-1850
          </Text>
        </TouchableOpacity>

        <Text style={[styles.footerTagline, { color: colors.muted }]}>
          consistency &gt; motivation · build momentum
        </Text>
      </View>
    </View>
  )
}

function Feature({ icon, label, colors }: any) {
  return (
    <View
      style={[
        styles.featureItem,
        { backgroundColor: colors.card, borderColor: colors.border }
      ]}
    >
      <Feather name={icon} size={18} color={colors.accent} />
      <Text style={[styles.featureLabel, { color: colors.text }]}>
        {label}
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  loaderRing: {
    width: 46,
    height: 46,
    borderRadius: 23,
    borderWidth: 2
  },
  loadingText: {
    marginTop: 14,
    fontSize: 11,
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
    letterSpacing: 1
  },
  momentumBg: {
    position: "absolute",
    top: -120,
    alignSelf: "center",
    width: 360,
    height: 360,
    borderRadius: 180,
    borderWidth: 1,
    opacity: 0.15
  },
  content: { flex: 1, paddingHorizontal: 32, paddingTop: 60 },
  nav: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 80
  },
  navTitle: { fontSize: 12, fontWeight: "900", letterSpacing: 4 },
  devBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
    gap: 6
  },
  pulseDot: { width: 6, height: 6, borderRadius: 3 },
  devBadgeText: { fontSize: 9, fontWeight: "800" },
  hero: { marginBottom: 48 },
  heroTitle: {
    fontSize: 50,
    fontWeight: "800",
    lineHeight: 56,
    letterSpacing: -2.5
  },
  heroSub: {
    fontSize: 16,
    marginTop: 20,
    lineHeight: 24,
    opacity: 0.9
  },
  featureGrid: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 52
  },
  featureItem: {
    flex: 1,
    paddingVertical: 18,
    alignItems: "center",
    borderRadius: 20,
    borderWidth: 1,
    gap: 10
  },
  featureLabel: {
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase"
  },
  ctaArea: { gap: 16 },
  primaryAction: {
    height: 64,
    borderRadius: 22,
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
    justifyContent: "center"
  },
  primaryActionText: { fontSize: 17, fontWeight: "700" },
  secondaryAction: {
    height: 64,
    borderRadius: 22,
    borderWidth: 1,
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
    justifyContent: "center"
  },
  secondaryActionText: { fontSize: 16, fontWeight: "600" },
  footer: {
    paddingBottom: 46,
    alignItems: "center"
  },
  footerBrand: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 8
  },
  githubUser: {
    fontSize: 13,
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
    fontWeight: "600"
  },
  footerTagline: {
    fontSize: 12,
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
    opacity: 0.6
  }
})
