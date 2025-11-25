import { View, Text, useColorScheme, StyleSheet } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

const index = () => {
  return (
    <SafeAreaView>
    <View>
      <Text style={styles.text}>Index</Text>
    </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  text: {
    fontSize: 20,
    color: "white"
  }
})
export default index