import React from 'react'
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import HomeScreen from '../screens/HomeScreen'
import CallsScreen from '../screens/CallsScreen'
import ContactsScreen from '../screens/ContactsScreen'
import SettingsScreen from '../screens/SettingsScreen'

const Tab = createBottomTabNavigator()

const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        headerShown: false,
        tabBarActiveTintColor: '#24786D',
        tabBarInactiveTintColor: '#797C7B',
        tabBarStyle: {
          height: 64,
          paddingBottom: 8,
          paddingTop: 6,
          borderTopWidth: 0,
          elevation: 8,
        },
        tabBarIcon: ({color, size}) => {
          const icons = {
            Messages: 'chat-bubble',
            Calls: 'call',
            Contacts: 'people',
            Settings: 'settings',
          }
          return (
            <MaterialIcons
              name={icons[route.name] || 'circle'}
              size={size}
              color={color}
            />
          )
        },
      })}>
      <Tab.Screen name="Messages" component={HomeScreen} />
      <Tab.Screen name="Calls" component={CallsScreen} />
      <Tab.Screen name="Contacts" component={ContactsScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  )
}

export default MainTabs
