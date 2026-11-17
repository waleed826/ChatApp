import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import {
  ensureUserProfile,
  listenAuthState,
  sendPasswordReset,
  signInWithEmail,
  signOutUser,
  signUpWithEmail,
  updateUserProfile,
} from '../services/authService'

const AuthContext = createContext(null)

export const AuthProvider = ({children}) => {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [initializing, setInitializing] = useState(true)

  useEffect(() => {
    const unsubscribe = listenAuthState(async firebaseUser => {
      try {
        if (firebaseUser) {
          const userProfile = await ensureUserProfile(firebaseUser)
          setUser(firebaseUser)
          setProfile(userProfile)
        } else {
          setUser(null)
          setProfile(null)
        }
      } catch (error) {
        console.warn('Auth profile sync failed', error)
        setUser(firebaseUser)
        setProfile(null)
      } finally {
        setInitializing(false)
      }
    })

    return unsubscribe
  }, [])

  const updateProfile = async data => {
    if (!user?.uid) {
      throw new Error('User is not signed in.')
    }
    const updated = await updateUserProfile(user.uid, data)
    setProfile(updated)
    return updated
  }

  const value = useMemo(
    () => ({
      user,
      profile,
      initializing,
      signIn: signInWithEmail,
      signUp: signUpWithEmail,
      signOut: signOutUser,
      resetPassword: sendPasswordReset,
      updateProfile,
    }),
    [user, profile, initializing],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
