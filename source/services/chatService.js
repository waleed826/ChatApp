import firestore from '@react-native-firebase/firestore'

const chatsCollection = () => firestore().collection('chats')
const usersCollection = () => firestore().collection('users')

const buildChatId = (uidA, uidB) => [uidA, uidB].sort().join('_')

export const listenUserChats = (uid, onChange, onError) => {
  return chatsCollection()
    .where('participants', 'array-contains', uid)
    .onSnapshot(
      snapshot => {
        const chats = snapshot.docs
          .map(doc => ({id: doc.id, ...doc.data()}))
          .sort((a, b) => {
            const aTime = a.updatedAt?.toMillis?.() || 0
            const bTime = b.updatedAt?.toMillis?.() || 0
            return bTime - aTime
          })
        onChange(chats)
      },
      onError,
    )
}

export const listenMessages = (chatId, onChange, onError) => {
  return chatsCollection()
    .doc(chatId)
    .collection('messages')
    .orderBy('createdAt', 'desc')
    .limit(100)
    .onSnapshot(
      snapshot => {
        const messages = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }))
        onChange(messages)
      },
      onError,
    )
}

export const getOrCreateChat = async ({
  currentUser,
  otherUser,
}) => {
  const chatId = buildChatId(currentUser.uid, otherUser.uid)
  const ref = chatsCollection().doc(chatId)
  const isSelfChat = currentUser.uid === otherUser.uid
  const participants = isSelfChat
    ? [currentUser.uid]
    : [currentUser.uid, otherUser.uid]

  // Participant-only read rules deny get() on missing docs, so create first
  // when the chat may not exist yet.
  let exists = false
  try {
    const snap = await ref.get()
    exists = snap.exists
  } catch (error) {
    if (error?.code !== 'firestore/permission-denied') {
      throw error
    }
  }

  if (!exists) {
    try {
      await ref.set({
        participants,
        participantNames: {
          [currentUser.uid]: currentUser.name || 'You',
          [otherUser.uid]: otherUser.name || 'User',
        },
        participantEmails: {
          [currentUser.uid]: currentUser.email || '',
          [otherUser.uid]: otherUser.email || '',
        },
        lastMessage: '',
        lastSenderId: '',
        unread: {
          [currentUser.uid]: 0,
          [otherUser.uid]: 0,
        },
        createdAt: firestore.FieldValue.serverTimestamp(),
        updatedAt: firestore.FieldValue.serverTimestamp(),
      })
    } catch (error) {
      // Race: another client created it, or rules still block create.
      if (error?.code !== 'firestore/permission-denied') {
        throw error
      }
      // If create was denied because it already exists under stricter get rules,
      // verify with a second read once the doc is there.
      const retry = await ref.get()
      if (!retry.exists) {
        throw error
      }
    }
  }

  return chatId
}

export const sendMessage = async ({chatId, senderId, text}) => {
  const trimmed = text.trim()
  if (!trimmed) {
    return
  }

  const chatRef = chatsCollection().doc(chatId)
  const chatSnap = await chatRef.get()
  if (!chatSnap.exists) {
    throw new Error('Chat not found')
  }

  const chat = chatSnap.data()
  const otherIds = (chat.participants || []).filter(id => id !== senderId)
  const unread = {...(chat.unread || {})}
  otherIds.forEach(id => {
    unread[id] = (unread[id] || 0) + 1
  })
  unread[senderId] = 0

  const messageRef = chatRef.collection('messages').doc()
  const batch = firestore().batch()

  batch.set(messageRef, {
    text: trimmed,
    senderId,
    createdAt: firestore.FieldValue.serverTimestamp(),
  })

  batch.update(chatRef, {
    lastMessage: trimmed,
    lastSenderId: senderId,
    unread,
    updatedAt: firestore.FieldValue.serverTimestamp(),
  })

  await batch.commit()
}

export const markChatRead = async (chatId, uid) => {
  await chatsCollection()
    .doc(chatId)
    .update({
      [`unread.${uid}`]: 0,
    })
}

export const searchUsers = async (query, currentUid) => {
  const snap = await usersCollection().limit(50).get()
  const q = query.trim().toLowerCase()

  return snap.docs
    .map(doc => ({id: doc.id, uid: doc.id, ...doc.data()}))
    .filter(user => user.uid !== currentUid)
    .filter(user => {
      if (!q) {
        return true
      }
      const name = (user.name || '').toLowerCase()
      const email = (user.email || '').toLowerCase()
      return name.includes(q) || email.includes(q)
    })
}

export const createSelfChat = async currentUser => {
  return getOrCreateChat({
    currentUser,
    otherUser: {
      uid: currentUser.uid,
      name: 'Message yourself',
      email: currentUser.email,
    },
  })
}
