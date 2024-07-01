import { StyleSheet, Text, View, Image } from 'react-native'
import React from 'react'

const SplashScreen = () => {
  return (
    <View style={styles.main}>
      <Text>SplashScreen</Text>
      <Text>Image</Text>
      <Text>Text</Text>
    </View>
  )
}

export default SplashScreen

const styles = StyleSheet.create({
  main:{
    flex:1,
    alignItems:'center',
  justifyContent:'center',
  },
})