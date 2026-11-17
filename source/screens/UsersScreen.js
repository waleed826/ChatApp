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
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import {useAuth} from '../context/AuthContext'
import {getOrCreateChat, searchUsers} from '../services/chatService'
import {getAvatarById} from '../utils/avatars'

const UsersScreen = ({navigation}) => {
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
        console.warn('User search failed', error)
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
    const timer = setTimeout(() => {
      loadUsers(query)
    }, 300)
    return () => clearTimeout(timer)
  }, [query, loadUsers])

  const openChatWithUser = async otherUser => {
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
      navigation.replace('Chat', {
        chatId,
        title: otherUser.name || otherUser.email || 'Chat',
        otherUserId: otherUser.uid,
      })
    } catch (error) {
      console.warn('Open chat failed', error)
    } finally {
      setOpeningId(null)
    }
  }

  return (
    <SafeAreaView style={styles.main}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="keyboard-backspace" size={26} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Find people</Text>
        <View style={{width: 26}} />
      </View>

      <View style={styles.body}>
        <TextInput
          style={styles.searchInput}
          value={query}
          onChangeText={setQuery}
          placeholder="Search by name or email"
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
              <Text style={styles.emptyText}>
                No users found. Ask a friend to sign up first.
              </Text>
            }
            renderItem={({item}) => (
              <TouchableOpacity
                style={styles.userRow}
                onPress={() => openChatWithUser(item)}
                disabled={openingId === item.uid}>
                <Image
                  source={getAvatarById(item.uid)}
                  style={styles.avatar}
                />
                <View style={styles.userInfo}>
                  <Text style={styles.name}>{item.name || 'User'}</Text>
                  <Text style={styles.email}>{item.email}</Text>
                </View>
                {openingId === item.uid ? (
                  <ActivityIndicator color="#24786D" />
                ) : (
                  <MaterialIcons name="chat" size={22} color="#24786D" />
                )}
              </TouchableOpacity>
            )}
          />
        )}
      </View>
    </SafeAreaView>
  )
}

export default UsersScreen

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: '#1E1E1E',
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
    paddingTop: 20,
    paddingHorizontal: 16,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 12,
    color: '#1E1E1E',
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ececec',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E1E1E',
  },
  email: {
    color: 'gray',
    marginTop: 2,
  },
  emptyText: {
    textAlign: 'center',
    color: 'gray',
    marginTop: 40,
  },
})
