import { View, Text, TouchableOpacity, useColorScheme } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

const Index = () => {
  const scheme = useColorScheme()
  const isDark = scheme === "dark"

  const bg = isDark ? "#0a0a0a" : "#f4f4f5"
  const card = isDark ? "#121212" : "#ffffff"
  const text = isDark ? "#ffffff" : "#0a0a0a"
  const subText = isDark ? "#9ca3af" : "#6b7280"
  const accent = "#3b82f6"

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: bg }}>
      <View
        style={{
          flex: 1,
          padding: 20,
          justifyContent: "center",
        }}
      >
        {/* Card */}
        <View
          style={{
            backgroundColor: card,
            borderRadius: 18,
            padding: 22,
            gap: 18,
          }}
        >
          {/* Header */}
          <View>
            <Text
              style={{
                color: text,
                fontSize: 22,
                fontWeight: "600",
              }}
            >
              Core Line
            </Text>

            <Text
              style={{
                color: subText,
                marginTop: 6,
                fontSize: 14,
                lineHeight: 20,
              }}
            >
              This is a global message for everyone.  
              Keep conversations respectful and friendly.  
              This message isn’t saved — once you leave, it’s gone.
            </Text>
          </View>

          {/* Options */}
          <View style={{ gap: 12 }}>
            <Option title="Profile" desc="Manage your identity" color={subText} />
            <Option title="Global Chat" desc="Talk with everyone" color={accent} />
            <Option title="1-1 Chat" desc="Private conversations" color={accent} />
          </View>
        </View>
      </View>
    </SafeAreaView>
  )
}

const Option = ({
  title,
  desc,
  color,
}: {
  title: string
  desc: string
  color: string
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      style={{
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderRadius: 14,
        backgroundColor: "rgba(59,130,246,0.08)",
      }}
    >
      <Text style={{ fontSize: 16, fontWeight: "500", color }}>
        {title}
      </Text>
      <Text style={{ fontSize: 13, marginTop: 4, color: "#9ca3af" }}>
        {desc}
      </Text>
    </TouchableOpacity>
  )
}

export default Index
