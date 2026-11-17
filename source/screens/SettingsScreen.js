import {
  Alert,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import React from 'react'
import Feather from 'react-native-vector-icons/Feather'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import {useAuth} from '../context/AuthContext'
import {getAvatarById} from '../utils/avatars'

const SETTINGS = [
  {id: 'account', icon: 'person-outline', label: 'Account'},
  {id: 'chat', icon: 'chat-bubble-outline', label: 'Chat'},
  {id: 'notifications', icon: 'notifications-none', label: 'Notifications'},
  {id: 'data', icon: 'storage', label: 'Data and storage'},
  {id: 'help', icon: 'help-outline', label: 'Help'},
  {id: 'invite', icon: 'mail-outline', label: 'Invite a friend'},
]

const SettingsScreen = ({navigation}) => {
  const {user, profile, signOut} = useAuth()

  const handleLogout = () => {
    Alert.alert('Log out', 'Are you sure you want to log out?', [
      {text: 'Cancel', style: 'cancel'},
      {
        text: 'Log out',
        style: 'destructive',
        onPress: () => signOut().catch(() => {}),
      },
    ])
  }

  return (
    <SafeAreaView style={styles.main}>
      <View style={styles.header}>
        <View style={styles.iconButton}>
          <Feather name="more-horizontal" color="#fff" size={22} />
        </View>
        <Text style={styles.headerTitle}>Settings</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
          <Image source={getAvatarById(user?.uid)} style={styles.avatar} />
        </TouchableOpacity>
      </View>

      <View style={styles.body}>
        <View style={styles.handle} />
        <TouchableOpacity
          style={styles.profileCard}
          onPress={() => navigation.navigate('Profile')}>
          <Image source={getAvatarById(user?.uid)} style={styles.profileAvatar} />
          <View style={{flex: 1}}>
            <Text style={styles.profileName}>
              {profile?.name || user?.displayName || 'User'}
            </Text>
            <Text style={styles.profileStatus}>
              {profile?.status || 'Hey there! I am using ChatApp'}
            </Text>
          </View>
          <MaterialIcons name="qr-code-2" size={24} color="#24786D" />
        </TouchableOpacity>

        {SETTINGS.map(item => (
          <TouchableOpacity
            key={item.id}
            style={styles.row}
            onPress={() => {
              if (item.id === 'account') {
                navigation.navigate('Profile')
              } else {
                Alert.alert(item.label, 'This section will be available soon.')
              }
            }}>
            <MaterialIcons name={item.icon} size={22} color="#24786D" />
            <Text style={styles.rowLabel}>{item.label}</Text>
            <MaterialIcons name="chevron-right" size={22} color="#C4C4C4" />
          </TouchableOpacity>
        ))}

        <TouchableOpacity style={styles.logoutRow} onPress={handleLogout}>
          <MaterialIcons name="logout" size={22} color="#F04A4C" />
          <Text style={styles.logoutText}>Log out</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

export default SettingsScreen

const styles = StyleSheet.create({
  main: {flex: 1, backgroundColor: '#1E1E1E'},
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  iconButton: {
    borderWidth: 1,
    borderColor: 'gray',
    padding: 8,
    borderRadius: 26,
  },
  headerTitle: {color: '#fff', fontSize: 20, fontWeight: '600'},
  avatar: {width: 45, height: 45, borderRadius: 23},
  body: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  handle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E0E0E0',
    marginBottom: 16,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
    paddingBottom: 18,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ececec',
  },
  profileAvatar: {width: 60, height: 60, borderRadius: 30, marginRight: 14},
  profileName: {fontSize: 18, fontWeight: '700', color: '#1E1E1E'},
  profileStatus: {color: 'gray', marginTop: 4},
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ececec',
    gap: 12,
  },
  rowLabel: {flex: 1, fontSize: 16, color: '#1E1E1E'},
  logoutRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 24,
    gap: 12,
  },
  logoutText: {color: '#F04A4C', fontSize: 16, fontWeight: '600'},
})
