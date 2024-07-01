import { Image, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import SplashScreen from './source/screens/SplashScreen'
import AccountScreen from './source/screens/AccountScreen'
import SignIn from './source/screens/SignIn'
import SignUp from './source/screens/SignUp'
import HomeScreen from './source/screens/HomeScreen'

const App = () => {
  return (
    // <View>
    //   <Text>Abc</Text>
    //   {/* <Image source={require('./src/assets/images/playstore.png')} /> */}
    //   <Image source={{uri: 'https://reactjs.org/logo-og.png'}}
    //    style={{width: 200, height: 200}} />
    //    {/* <Image source={require('./src/logoimage.png')}
       
    //    style={{width: 200, height: 200}}/> */}
    // </View>
      //  <SplashScreen/>
      // <AccountScreen/>
      // <SignIn/>
      // <SignUp/>
      <HomeScreen/>
  )
}

export default App

const styles = StyleSheet.create({})