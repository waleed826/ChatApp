import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import {AppState} from 'react-native'
import {useAuth} from './AuthContext'
import {
  CALL_STATUS,
  listenIncomingCalls,
  updateCallStatus,
} from '../services/callService'

const CallContext = createContext(null)

export const CallProvider = ({children}) => {
  const {user, profile} = useAuth()
  const [incomingCall, setIncomingCall] = useState(null)
  const [activeCallId, setActiveCallId] = useState(null)
  const handledIds = useRef(new Set())
  const appState = useRef(AppState.currentState)

  useEffect(() => {
    const sub = AppState.addEventListener('change', next => {
      appState.current = next
    })
    return () => sub.remove()
  }, [])

  useEffect(() => {
    if (!user?.uid) {
      setIncomingCall(null)
      return undefined
    }

    const unsubscribe = listenIncomingCalls(
      user.uid,
      calls => {
        const next = calls.find(call => !handledIds.current.has(call.id))
        if (!next) {
          setIncomingCall(prev => {
            if (prev && !calls.some(c => c.id === prev.id)) {
              return null
            }
            return prev
          })
          return
        }
        if (activeCallId && activeCallId === next.id) {
          return
        }
        setIncomingCall(next)
      },
      error => console.warn('Incoming call listen failed', error),
    )

    return unsubscribe
  }, [user?.uid, activeCallId])

  const clearIncoming = useCallback(callId => {
    if (callId) {
      handledIds.current.add(callId)
    }
    setIncomingCall(null)
  }, [])

  const rejectIncoming = useCallback(async () => {
    const call = incomingCall
    if (!call) {
      return
    }
    clearIncoming(call.id)
    try {
      await updateCallStatus(call.id, CALL_STATUS.REJECTED)
    } catch (error) {
      console.warn('Reject call failed', error)
    }
  }, [incomingCall, clearIncoming])

  const acceptIncoming = useCallback(() => {
    const call = incomingCall
    if (!call) {
      return null
    }
    clearIncoming(call.id)
    setActiveCallId(call.id)
    return call
  }, [incomingCall, clearIncoming])

  const markMissedIfRinging = useCallback(async callId => {
    try {
      await updateCallStatus(callId, CALL_STATUS.MISSED)
    } catch (error) {
      console.warn('Mark missed failed', error)
    }
  }, [])

  const value = useMemo(
    () => ({
      incomingCall,
      activeCallId,
      setActiveCallId,
      clearIncoming,
      rejectIncoming,
      acceptIncoming,
      markMissedIfRinging,
      displayName: profile?.name || user?.displayName || 'You',
    }),
    [
      incomingCall,
      activeCallId,
      clearIncoming,
      rejectIncoming,
      acceptIncoming,
      markMissedIfRinging,
      profile?.name,
      user?.displayName,
    ],
  )

  return <CallContext.Provider value={value}>{children}</CallContext.Provider>
}

export const useCall = () => {
  const context = useContext(CallContext)
  if (!context) {
    throw new Error('useCall must be used within CallProvider')
  }
  return context
}
