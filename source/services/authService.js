import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'

const usersCollection = () => firestore().collection('users')

export const getFriendlyAuthError = error => {
  const code = error?.code || ''
  switch (code) {
    case 'auth/email-already-in-use':
      return 'This email is already registered. Try logging in.'
    case 'auth/invalid-email':
      return 'Please enter a valid email address.'
    case 'auth/weak-password':
      return 'Password should be at least 6 characters.'
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Incorrect email or password.'
    case 'auth/too-many-requests':
      return 'Too many attempts. Please try again later.'
    case 'auth/network-request-failed':
      return 'Network error. Check your connection.'
    default:
      return error?.message || 'Something went wrong. Please try again.'
  }
}

export const ensureUserProfile = async (user, extra = {}) => {
  if (!user?.uid) {
    return null
  }

  const ref = usersCollection().doc(user.uid)
  const snap = await ref.get()
  const payload = {
    uid: user.uid,
    email: user.email || '',
    name: extra.name || user.displayName || user.email?.split('@')[0] || 'User',
    updatedAt: firestore.FieldValue.serverTimestamp(),
  }

  if (!snap.exists) {
    await ref.set({
      ...payload,
      createdAt: firestore.FieldValue.serverTimestamp(),
      avatarIndex: Math.floor(Math.random() * 9),
    })
  } else if (Object.keys(extra).length) {
    await ref.update(payload)
  }

  const updated = await ref.get()
  return {id: updated.id, ...updated.data()}
}

export const signUpWithEmail = async ({name, email, password}) => {
  const credential = await auth().createUserWithEmailAndPassword(
    email.trim(),
    password,
  )
  await credential.user.updateProfile({displayName: name.trim()})
  const profile = await ensureUserProfile(credential.user, {name: name.trim()})
  return {user: credential.user, profile}
}

export const signInWithEmail = async ({email, password}) => {
  const credential = await auth().signInWithEmailAndPassword(
    email.trim(),
    password,
  )
  const profile = await ensureUserProfile(credential.user)
  return {user: credential.user, profile}
}

export const sendPasswordReset = async email => {
  await auth().sendPasswordResetEmail(email.trim())
}

export const signOutUser = async () => {
  await auth().signOut()
}

export const updateUserProfile = async (uid, data = {}) => {
  if (!uid) {
    throw new Error('User is not signed in.')
  }

  const name = (data.name || '').trim()
  if (!name) {
    throw new Error('Display name is required.')
  }

  const payload = {
    name,
    phone: (data.phone || '').trim(),
    address: (data.address || '').trim(),
    status: (data.status || '').trim() || 'Hey there! I am using ChatApp',
    updatedAt: firestore.FieldValue.serverTimestamp(),
  }

  const ref = usersCollection().doc(uid)
  await ref.set(payload, {merge: true})

  const currentUser = auth().currentUser
  if (currentUser && currentUser.uid === uid) {
    await currentUser.updateProfile({displayName: name})
  }

  const updated = await ref.get()
  return {id: updated.id, ...updated.data()}
}

export const listenAuthState = callback => auth().onAuthStateChanged(callback)
