import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import React, {useEffect, useState} from 'react'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import CustomButton from '../components/CustomButton'
import {useAuth} from '../context/AuthContext'
import {getAvatarById} from '../utils/avatars'

const ProfileField = ({label, value, onChangeText, editable = true, ...rest}) => (
  <View style={styles.field}>
    <Text style={styles.fieldLabel}>{label}</Text>
    {editable ? (
      <TextInput
        style={styles.fieldInput}
        value={value}
        onChangeText={onChangeText}
        placeholderTextColor="#9E9E9E"
        {...rest}
      />
    ) : (
      <Text style={styles.fieldValue}>{value || '—'}</Text>
    )}
  </View>
)

const ProfileScreen = ({navigation}) => {
  const {user, profile, signOut, updateProfile} = useAuth()
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [status, setStatus] = useState('')
  const [saving, setSaving] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)

  useEffect(() => {
    setName(profile?.name || user?.displayName || '')
    setPhone(profile?.phone || '')
    setAddress(profile?.address || '')
    setStatus(profile?.status || 'Hey there! I am using ChatApp')
  }, [profile, user])

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Missing name', 'Please enter a display name.')
      return
    }

    try {
      setSaving(true)
      await updateProfile({name, phone, address, status})
      Alert.alert('Saved', 'Your profile has been updated.')
    } catch (error) {
      Alert.alert('Update failed', error?.message || 'Try again.')
    } finally {
      setSaving(false)
    }
  }

  const handleLogout = () => {
    Alert.alert('Log out', 'Are you sure you want to log out?', [
      {text: 'Cancel', style: 'cancel'},
      {
        text: 'Log out',
        style: 'destructive',
        onPress: async () => {
          try {
            setLoggingOut(true)
            await signOut()
          } catch (error) {
            Alert.alert('Logout failed', error?.message || 'Try again.')
          } finally {
            setLoggingOut(false)
          }
        },
      },
    ])
  }

  return (
    <SafeAreaView style={styles.main}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="keyboard-backspace" size={26} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <View style={{width: 26}} />
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          style={styles.body}
          contentContainerStyle={styles.bodyContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <Image source={getAvatarById(user?.uid)} style={styles.avatar} />
          <Text style={styles.name}>{name.trim() || 'User'}</Text>
          <Text style={styles.email}>{user?.email}</Text>

          <View style={styles.card}>
            <ProfileField
              label="Display Name"
              value={name}
              onChangeText={setName}
              placeholder="Your name"
              autoCapitalize="words"
            />
            <ProfileField
              label="Email Address"
              value={user?.email}
              editable={false}
            />
            <ProfileField
              label="Address"
              value={address}
              onChangeText={setAddress}
              placeholder="Add your address"
            />
            <ProfileField
              label="Phone Number"
              value={phone}
              onChangeText={setPhone}
              placeholder="Add phone number"
              keyboardType="phone-pad"
            />
            <ProfileField
              label="Status"
              value={status}
              onChangeText={setStatus}
              placeholder="Hey there! I am using ChatApp"
            />
          </View>

          <CustomButton
            text={saving ? 'Saving...' : 'Save changes'}
            color="#fff"
            bcgcolor="#24786D"
            radius={14}
            onPress={handleSave}
          />
          <View style={{height: 12}} />
          <CustomButton
            text={loggingOut ? 'Logging out...' : 'Log out'}
            color="#fff"
            bcgcolor="#F04A4C"
            radius={14}
            onPress={handleLogout}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

export default ProfileScreen

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: '#1E1E1E',
  },
  flex: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  body: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  bodyContent: {
    alignItems: 'center',
    paddingTop: 40,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  name: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1E1E1E',
  },
  email: {
    marginTop: 6,
    color: 'gray',
    marginBottom: 24,
  },
  card: {
    width: '100%',
    backgroundColor: '#F7F7F7',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginBottom: 24,
  },
  field: {
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E6E6E6',
  },
  fieldLabel: {
    color: '#24786D',
    fontWeight: '600',
    marginBottom: 6,
    fontSize: 13,
  },
  fieldInput: {
    color: '#1E1E1E',
    fontSize: 16,
    fontWeight: '600',
    padding: 0,
  },
  fieldValue: {
    color: '#1E1E1E',
    fontSize: 16,
    fontWeight: '600',
  },
})
