import React from 'react'
import {NavigationContainer} from '@react-navigation/native'
import {createNativeStackNavigator} from '@react-navigation/native-stack'
import {useAuth} from '../context/AuthContext'
import SplashScreen from '../screens/SplashScreen'
import AccountScreen from '../screens/AccountScreen'
import SignIn from '../screens/SignIn'
import SignUp from '../screens/SignUp'
import ChatScreen from '../screens/ChatScreen'
import UsersScreen from '../screens/UsersScreen'
import ProfileScreen from '../screens/ProfileScreen'
import CallScreen from '../screens/CallScreen'
import MainTabs from './MainTabs'

const Stack = createNativeStackNavigator()

const AuthStack = () => (
  <Stack.Navigator screenOptions={{headerShown: false}}>
    <Stack.Screen name="Account" component={AccountScreen} />
    <Stack.Screen name="SignIn" component={SignIn} />
    <Stack.Screen name="SignUp" component={SignUp} />
  </Stack.Navigator>
)

const AppStack = () => (
  <Stack.Navigator screenOptions={{headerShown: false}}>
    <Stack.Screen name="MainTabs" component={MainTabs} />
    <Stack.Screen name="Chat" component={ChatScreen} />
    <Stack.Screen name="Users" component={UsersScreen} />
    <Stack.Screen name="Profile" component={ProfileScreen} />
    <Stack.Screen name="Call" component={CallScreen} />
  </Stack.Navigator>
)

const AppNavigator = () => {
  const {user, initializing} = useAuth()

  if (initializing) {
    return <SplashScreen />
  }

  return (
    <NavigationContainer>
      {user ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  )
}

export default AppNavigator
