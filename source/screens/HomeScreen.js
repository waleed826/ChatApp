import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import React, {useEffect, useMemo, useState} from 'react'
import Feather from 'react-native-vector-icons/Feather'
import {useAuth} from '../context/AuthContext'
import {
  createSelfChat,
  listenUserChats,
} from '../services/chatService'
import {formatMessageTime, getAvatarById} from '../utils/avatars'

const HomeScreen = ({navigation}) => {
  const {user, profile} = useAuth()
  const [chats, setChats] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user?.uid) {
      return undefined
    }

    const unsubscribe = listenUserChats(
      user.uid,
      nextChats => {
        setChats(nextChats)
        setLoading(false)
      },
      error => {
        console.warn('Chat listen error', error)
        setLoading(false)
        Alert.alert('Unable to load chats', error?.message || 'Try again later.')
      },
    )

    return unsubscribe
  }, [user?.uid])

  const statusItems = useMemo(() => {
    const self = {
      id: 'self',
      name: 'My status',
      userImage: getAvatarById(user?.uid),
    }
    const others = chats.slice(0, 8).map(chat => {
      const otherId =
        (chat.participants || []).find(id => id !== user.uid) || user.uid
      const name =
        otherId === user.uid
          ? 'You'
          : chat.participantNames?.[otherId] || 'User'
      return {
        id: chat.id,
        name,
        userImage: getAvatarById(otherId),
        chatId: chat.id,
        otherName: name,
        otherId,
      }
    })
    return [self, ...others]
  }, [chats, user?.uid])

  const openChat = chat => {
    const otherId =
      (chat.participants || []).find(id => id !== user.uid) || user.uid
    const title =
      otherId === user.uid
        ? 'Message yourself'
        : chat.participantNames?.[otherId] || 'Chat'

    navigation.navigate('Chat', {
      chatId: chat.id,
      title,
      otherUserId: otherId,
    })
  }

  const openSelfChat = async () => {
    try {
      const chatId = await createSelfChat({
        uid: user.uid,
        name: profile?.name || user.displayName || 'You',
        email: user.email,
      })
      navigation.navigate('Chat', {
        chatId,
        title: 'Message yourself',
        otherUserId: user.uid,
      })
    } catch (error) {
      Alert.alert('Could not open chat', error?.message || 'Try again.')
    }
  }

  const renderChatItem = ({item}) => {
    const otherId =
      (item.participants || []).find(id => id !== user.uid) || user.uid
    const name =
      otherId === user.uid
        ? 'Message yourself'
        : item.participantNames?.[otherId] || 'User'
    const unread = item.unread?.[user.uid] || 0

    return (
      <TouchableOpacity style={styles.chatItem} onPress={() => openChat(item)}>
        <Image source={getAvatarById(otherId)} style={styles.chatImage} />
        <View style={styles.chatContent}>
          <View style={styles.nameTimeRow}>
            <Text style={styles.chatName}>{name}</Text>
            <Text style={styles.timeText}>
              {formatMessageTime(item.updatedAt)}
            </Text>
          </View>
          <View style={styles.messageRow}>
            <Text style={styles.messageText} numberOfLines={1}>
              {item.lastMessage || 'Say hello 👋'}
            </Text>
            {unread > 0 ? (
              <View style={styles.notificationBadge}>
                <Text style={styles.notifytext}>{unread}</Text>
              </View>
            ) : null}
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  return (
    <SafeAreaView style={styles.main}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.searchButton}
          onPress={() => navigation.navigate('Users')}>
          <Feather name={'search'} color={'white'} size={25} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Home</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
          <Image
            source={getAvatarById(user?.uid)}
            style={styles.profileImage}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.statusContainer}>
        <FlatList
          data={statusItems}
          keyExtractor={item => item.id.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.statusList}
          renderItem={({item}) => (
            <TouchableOpacity
              style={styles.statusItem}
              onPress={() => {
                if (item.id === 'self') {
                  openSelfChat()
                  return
                }
                navigation.navigate('Chat', {
                  chatId: item.chatId,
                  title: item.otherName,
                  otherUserId: item.otherId,
                })
              }}>
              <Image source={item.userImage} style={styles.statusImage} />
              <Text style={styles.statusText} numberOfLines={1}>
                {item.name}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      <View style={styles.chatContainer}>
        <View style={styles.handle} />
        {loading ? (
          <ActivityIndicator color="#24786D" style={{marginTop: 40}} />
        ) : (
          <FlatList
            data={chats}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.chatList}
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <Text style={styles.emptyTitle}>No conversations yet</Text>
                <Text style={styles.emptySubtitle}>
                  Tap search to find people and start chatting.
                </Text>
                <TouchableOpacity
                  style={styles.emptyButton}
                  onPress={() => navigation.navigate('Users')}>
                  <Text style={styles.emptyButtonText}>Find people</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={openSelfChat}>
                  <Text style={styles.selfChatLink}>Message yourself</Text>
                </TouchableOpacity>
              </View>
            }
            renderItem={renderChatItem}
          />
        )}
      </View>
    </SafeAreaView>
  )
}

export default HomeScreen

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: '#1E1E1E',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  searchButton: {
    borderWidth: 1,
    borderColor: 'gray',
    padding: 8,
    borderRadius: 26,
  },
  headerTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: '600',
  },
  profileImage: {
    width: 45,
    height: 45,
    borderRadius: 25,
  },
  statusContainer: {
    height: 110,
    paddingVertical: 10,
  },
  statusList: {
    paddingHorizontal: 15,
  },
  statusItem: {
    alignItems: 'center',
    marginRight: 15,
  },
  statusImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#F04A4C',
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    marginTop: 6,
    maxWidth: 70,
  },
  chatContainer: {
    flex: 1,
    backgroundColor: 'white',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    overflow: 'hidden',
  },
  handle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E0E0E0',
    marginTop: 12,
    marginBottom: 4,
  },
  chatList: {
    paddingTop: 10,
    paddingBottom: 100,
    flexGrow: 1,
  },
  chatItem: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 12,
    alignItems: 'center',
  },
  chatImage: {
    width: 50,
    height: 50,
    borderRadius: 30,
    marginRight: 15,
  },
  chatContent: {
    flex: 1,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ececec',
    paddingBottom: 12,
  },
  nameTimeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  chatName: {
    color: 'black',
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  timeText: {
    color: 'gray',
    fontSize: 12,
    marginLeft: 10,
  },
  messageRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  messageText: {
    color: 'gray',
    fontSize: 14,
    flex: 1,
    marginRight: 10,
  },
  notificationBadge: {
    backgroundColor: '#F04A4C',
    borderRadius: 15,
    minWidth: 22,
    height: 22,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 5,
  },
  notifytext: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingTop: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E1E1E',
  },
  emptySubtitle: {
    marginTop: 8,
    textAlign: 'center',
    color: 'gray',
  },
  emptyButton: {
    marginTop: 20,
    backgroundColor: '#24786D',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 14,
  },
  emptyButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  selfChatLink: {
    marginTop: 16,
    color: '#24786D',
    fontWeight: '600',
  },
})
