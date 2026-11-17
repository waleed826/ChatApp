import {
  ActivityIndicator,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import React, {useEffect, useState} from 'react'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import Feather from 'react-native-vector-icons/Feather'
import {useAuth} from '../context/AuthContext'
import {
  listenMessages,
  markChatRead,
  sendMessage,
} from '../services/chatService'
import {formatMessageTime, getAvatarById} from '../utils/avatars'

const SHARE_OPTIONS = [
  {id: 'camera', icon: 'camera-alt', label: 'Camera', hint: 'Take a photo'},
  {id: 'documents', icon: 'insert-drive-file', label: 'Documents', hint: 'Share your files'},
  {id: 'media', icon: 'photo-library', label: 'Media', hint: 'Share photos & videos'},
  {id: 'contact', icon: 'person', label: 'Contact', hint: 'Share contacts'},
  {id: 'location', icon: 'location-on', label: 'Location', hint: 'Share a location'},
]

const ChatScreen = ({navigation, route}) => {
  const {chatId, title, otherUserId} = route.params
  const {user} = useAuth()
  const [messages, setMessages] = useState([])
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [shareVisible, setShareVisible] = useState(false)

  useEffect(() => {
    const unsubscribe = listenMessages(
      chatId,
      nextMessages => {
        setMessages(nextMessages)
        setLoading(false)
      },
      () => setLoading(false),
    )

    markChatRead(chatId, user.uid).catch(() => {})

    return unsubscribe
  }, [chatId, user.uid])

  const handleSend = async () => {
    if (!text.trim() || sending) {
      return
    }

    const outgoing = text
    setText('')
    try {
      setSending(true)
      await sendMessage({
        chatId,
        senderId: user.uid,
        text: outgoing,
      })
    } catch (error) {
      setText(outgoing)
      console.warn('Send failed', error)
    } finally {
      setSending(false)
    }
  }

  const renderMessage = ({item}) => {
    const mine = item.senderId === user.uid
    return (
      <View
        style={[
          styles.bubbleRow,
          mine ? styles.bubbleRowMine : styles.bubbleRowOther,
        ]}>
        {!mine ? (
          <Image
            source={getAvatarById(otherUserId)}
            style={styles.messageAvatar}
          />
        ) : null}
        <View style={[styles.bubble, mine ? styles.bubbleMine : styles.bubbleOther]}>
          <Text style={[styles.bubbleText, mine && styles.bubbleTextMine]}>
            {item.text}
          </Text>
          <Text style={[styles.bubbleTime, mine && styles.bubbleTimeMine]}>
            {formatMessageTime(item.createdAt)}
          </Text>
        </View>
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.main}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="keyboard-backspace" size={26} color="#fff" />
        </TouchableOpacity>
        <Image source={getAvatarById(otherUserId)} style={styles.headerAvatar} />
        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {title}
          </Text>
          <Text style={styles.headerSubtitle}>Active now</Text>
        </View>
        <TouchableOpacity
          style={styles.headerAction}
          onPress={() =>
            navigation.navigate('Call', {
              name: title,
              mode: 'audio',
              otherUserId,
              role: 'caller',
            })
          }>
          <Feather name="phone" size={20} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.headerAction}
          onPress={() =>
            navigation.navigate('Call', {
              name: title,
              mode: 'video',
              otherUserId,
              role: 'caller',
            })
          }>
          <Feather name="video" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        style={styles.body}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={10}>
        <View style={styles.handle} />
        {loading ? (
          <ActivityIndicator color="#24786D" style={{marginTop: 30}} />
        ) : (
          <FlatList
            data={messages}
            keyExtractor={item => item.id}
            inverted
            contentContainerStyle={styles.messageList}
            ListEmptyComponent={
              <View style={styles.emptyWrap}>
                <Text style={styles.emptyText}>
                  No messages yet. Say hello!
                </Text>
              </View>
            }
            renderItem={renderMessage}
          />
        )}

        <View style={styles.composer}>
          <TouchableOpacity
            style={styles.attachButton}
            onPress={() => setShareVisible(true)}>
            <Feather name="plus" size={22} color="#24786D" />
          </TouchableOpacity>
          <TextInput
            style={styles.input}
            value={text}
            onChangeText={setText}
            placeholder="Type a message..."
            placeholderTextColor="#999"
            multiline
          />
          <TouchableOpacity
            style={[styles.sendButton, !text.trim() && styles.sendDisabled]}
            onPress={handleSend}
            disabled={!text.trim() || sending}>
            <Feather name="send" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      <Modal
        visible={shareVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setShareVisible(false)}>
        <TouchableOpacity
          style={styles.modalBackdrop}
          activeOpacity={1}
          onPress={() => setShareVisible(false)}>
          <View style={styles.shareSheet}>
            <View style={styles.shareHeader}>
              <Text style={styles.shareTitle}>Share Content</Text>
              <TouchableOpacity onPress={() => setShareVisible(false)}>
                <Feather name="x" size={22} color="#1E1E1E" />
              </TouchableOpacity>
            </View>
            {SHARE_OPTIONS.map(option => (
              <TouchableOpacity
                key={option.id}
                style={styles.shareRow}
                onPress={() => setShareVisible(false)}>
                <View style={styles.shareIconWrap}>
                  <MaterialIcons name={option.icon} size={22} color="#24786D" />
                </View>
                <View>
                  <Text style={styles.shareLabel}>{option.label}</Text>
                  <Text style={styles.shareHint}>{option.hint}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  )
}

export default ChatScreen

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: '#1E1E1E',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 10,
  },
  headerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  headerInfo: {
    flex: 1,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
  },
  headerSubtitle: {
    color: '#B9C1BE',
    fontSize: 12,
    marginTop: 2,
  },
  headerAction: {
    padding: 6,
  },
  body: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    overflow: 'hidden',
  },
  handle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E0E0E0',
    marginTop: 10,
    marginBottom: 4,
  },
  messageList: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  bubbleRow: {
    flexDirection: 'row',
    marginVertical: 6,
    alignItems: 'flex-end',
  },
  bubbleRowMine: {
    justifyContent: 'flex-end',
  },
  bubbleRowOther: {
    justifyContent: 'flex-start',
  },
  messageAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    marginRight: 8,
  },
  bubble: {
    maxWidth: '75%',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  bubbleMine: {
    backgroundColor: '#24786D',
    borderBottomRightRadius: 4,
  },
  bubbleOther: {
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 4,
  },
  bubbleText: {
    color: '#1E1E1E',
    fontSize: 15,
  },
  bubbleTextMine: {
    color: '#FFFFFF',
  },
  bubbleTime: {
    marginTop: 4,
    fontSize: 10,
    color: '#888',
    alignSelf: 'flex-end',
  },
  bubbleTimeMine: {
    color: 'rgba(255,255,255,0.8)',
  },
  composer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#ddd',
  },
  attachButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  input: {
    flex: 1,
    maxHeight: 110,
    minHeight: 42,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginRight: 10,
    color: '#1E1E1E',
  },
  sendButton: {
    backgroundColor: '#24786D',
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendDisabled: {
    opacity: 0.5,
  },
  emptyWrap: {
    transform: [{scaleY: -1}],
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    color: '#888',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'flex-end',
  },
  shareSheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 30,
  },
  shareHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  shareTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E1E1E',
  },
  shareRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 14,
  },
  shareIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#E8F5F2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shareLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E1E1E',
  },
  shareHint: {
    color: 'gray',
    marginTop: 2,
    fontSize: 12,
  },
})
