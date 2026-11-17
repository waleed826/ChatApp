import {Dimensions, Image, StyleSheet, Text, View} from 'react-native'
import React from 'react'

const {width} = Dimensions.get('window')

const SplashScreen = () => {
  return (
    <View style={styles.main}>
      <Image
        source={require('../assets/images/logo.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.title}>ChatApp</Text>
      <Text style={styles.subtitle}>Connecting you with friends</Text>
    </View>
  )
}

export default SplashScreen

const styles = StyleSheet.create({
  main: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1E1E1E',
  },
  logo: {
    width: width * 0.18,
    height: width * 0.18,
    marginBottom: 16,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '700',
  },
  subtitle: {
    marginTop: 8,
    color: '#B9C1BE',
    fontSize: 14,
  },
})
