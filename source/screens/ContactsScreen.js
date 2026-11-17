import {
  ActivityIndicator,
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import React, {useCallback, useEffect, useState} from 'react'
import Feather from 'react-native-vector-icons/Feather'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import {useAuth} from '../context/AuthContext'
import {getOrCreateChat, searchUsers} from '../services/chatService'
import {getAvatarById} from '../utils/avatars'

const ContactsScreen = ({navigation}) => {
  const {user, profile} = useAuth()
  const [query, setQuery] = useState('')
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [openingId, setOpeningId] = useState(null)

  const loadUsers = useCallback(
    async search => {
      try {
        setLoading(true)
        const results = await searchUsers(search, user.uid)
        setUsers(results)
      } catch (error) {
        console.warn('Contacts load failed', error)
      } finally {
        setLoading(false)
      }
    },
    [user.uid],
  )

  useEffect(() => {
    loadUsers('')
  }, [loadUsers])

  useEffect(() => {
    const timer = setTimeout(() => loadUsers(query), 300)
    return () => clearTimeout(timer)
  }, [query, loadUsers])

  const openChat = async otherUser => {
    try {
      setOpeningId(otherUser.uid)
      const chatId = await getOrCreateChat({
        currentUser: {
          uid: user.uid,
          name: profile?.name || user.displayName || 'You',
          email: user.email,
        },
        otherUser: {
          uid: otherUser.uid,
          name: otherUser.name || otherUser.email || 'User',
          email: otherUser.email,
        },
      })
      navigation.navigate('Chat', {
        chatId,
        title: otherUser.name || otherUser.email || 'Chat',
        otherUserId: otherUser.uid,
      })
    } catch (error) {
      console.warn(error)
    } finally {
      setOpeningId(null)
    }
  }

  return (
    <SafeAreaView style={styles.main}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => navigation.navigate('Users')}>
          <Feather name="search" color="#fff" size={22} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Contacts</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
          <Image source={getAvatarById(user?.uid)} style={styles.avatar} />
        </TouchableOpacity>
      </View>

      <View style={styles.body}>
        <View style={styles.handle} />
        <TextInput
          style={styles.searchInput}
          value={query}
          onChangeText={setQuery}
          placeholder="Search contacts"
          placeholderTextColor="#999"
          autoCapitalize="none"
        />

        {loading ? (
          <ActivityIndicator color="#24786D" style={{marginTop: 30}} />
        ) : (
          <FlatList
            data={users}
            keyExtractor={item => item.uid}
            contentContainerStyle={{paddingBottom: 40}}
            ListEmptyComponent={
              <Text style={styles.empty}>
                No contacts yet. Invite friends to sign up.
              </Text>
            }
            renderItem={({item}) => (
              <TouchableOpacity
                style={styles.row}
                onPress={() => openChat(item)}
                disabled={openingId === item.uid}>
                <Image
                  source={getAvatarById(item.uid)}
                  style={styles.rowAvatar}
                />
                <View style={styles.rowInfo}>
                  <Text style={styles.name}>{item.name || 'User'}</Text>
                  <Text style={styles.email}>{item.email}</Text>
                </View>
                {openingId === item.uid ? (
                  <ActivityIndicator color="#24786D" />
                ) : (
                  <View style={styles.actions}>
                    <TouchableOpacity
                      style={styles.actionBtn}
                      onPress={() =>
                        navigation.navigate('Call', {
                          name: item.name || item.email || 'User',
                          mode: 'audio',
                          otherUserId: item.uid,
                          role: 'caller',
                        })
                      }>
                      <Feather name="phone" size={18} color="#24786D" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.actionBtn}
                      onPress={() =>
                        navigation.navigate('Call', {
                          name: item.name || item.email || 'User',
                          mode: 'video',
                          otherUserId: item.uid,
                          role: 'caller',
                        })
                      }>
                      <Feather name="video" size={18} color="#24786D" />
                    </TouchableOpacity>
                    <MaterialIcons
                      name="chat-bubble-outline"
                      size={22}
                      color="#24786D"
                    />
                  </View>
                )}
              </TouchableOpacity>
            )}
          />
        )}
      </View>
    </SafeAreaView>
  )
}

export default ContactsScreen

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
  searchInput: {
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 8,
    color: '#1E1E1E',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ececec',
  },
  rowAvatar: {width: 48, height: 48, borderRadius: 24, marginRight: 12},
  rowInfo: {flex: 1},
  name: {fontSize: 16, fontWeight: '600', color: '#1E1E1E'},
  email: {color: 'gray', marginTop: 2, fontSize: 13},
  actions: {flexDirection: 'row', alignItems: 'center', gap: 10},
  actionBtn: {padding: 4},
  empty: {textAlign: 'center', color: 'gray', marginTop: 40},
})
