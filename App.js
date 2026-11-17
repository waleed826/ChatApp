import React from 'react'
import {StatusBar} from 'react-native'
import {SafeAreaProvider} from 'react-native-safe-area-context'
import {AuthProvider} from './source/context/AuthContext'
import AppNavigator from './source/navigation/AppNavigator'

const App = () => {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <StatusBar barStyle="light-content" backgroundColor="#1E1E1E" />
        <AppNavigator />
      </AuthProvider>
    </SafeAreaProvider>
  )
}

export default App
