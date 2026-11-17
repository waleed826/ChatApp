import {
  ActivityIndicator,
  Image,
  PermissionsAndroid,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import React, {useCallback, useEffect, useRef, useState} from 'react'
import Feather from 'react-native-vector-icons/Feather'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import InCallManager from 'react-native-incall-manager'
import {
  mediaDevices,
  RTCIceCandidate,
  RTCPeerConnection,
  RTCSessionDescription,
  RTCView,
} from 'react-native-webrtc'
import {useAuth} from '../context/AuthContext'
import {useCall} from '../context/CallContext'
import {
  addIceCandidate,
  CALL_STATUS,
  createCall,
  getCall,
  listenCall,
  listenRemoteCandidates,
  updateCallAnswer,
  updateCallStatus,
} from '../services/callService'
import {getAvatarById} from '../utils/avatars'

const ICE_SERVERS = {
  iceServers: [
    {urls: 'stun:stun.l.google.com:19302'},
    {urls: 'stun:stun1.l.google.com:19302'},
  ],
}

const formatDuration = seconds => {
  const m = Math.floor(seconds / 60)
    .toString()
    .padStart(2, '0')
  const s = Math.floor(seconds % 60)
    .toString()
    .padStart(2, '0')
  return `${m}:${s}`
}

const requestPermissions = async isVideo => {
  if (Platform.OS !== 'android') {
    return true
  }
  const permissions = [PermissionsAndroid.PERMISSIONS.RECORD_AUDIO]
  if (isVideo) {
    permissions.push(PermissionsAndroid.PERMISSIONS.CAMERA)
  }
  const result = await PermissionsAndroid.requestMultiple(permissions)
  return permissions.every(
    key => result[key] === PermissionsAndroid.RESULTS.GRANTED,
  )
}

const CallScreen = ({navigation, route}) => {
  const {
    name = 'User',
    mode: initialMode = 'audio',
    otherUserId = '',
    role: initialRole = 'caller',
    callId: existingCallId = null,
  } = route.params || {}

  const {user, profile} = useAuth()
  const {setActiveCallId, displayName} = useCall()

  const [callId, setCallId] = useState(existingCallId)
  const [role] = useState(initialRole)
  const [mode, setMode] = useState(initialMode)
  const [statusText, setStatusText] = useState(
    initialRole === 'caller' ? 'Calling…' : 'Connecting…',
  )
  const [muted, setMuted] = useState(false)
  const [speaker, setSpeaker] = useState(initialMode === 'video')
  const [cameraOn, setCameraOn] = useState(initialMode === 'video')
  const [localStream, setLocalStream] = useState(null)
  const [remoteStream, setRemoteStream] = useState(null)
  const [connected, setConnected] = useState(false)
  const [seconds, setSeconds] = useState(0)
  const [error, setError] = useState('')
  const [ending, setEnding] = useState(false)

  const pcRef = useRef(null)
  const localStreamRef = useRef(null)
  const callIdRef = useRef(existingCallId)
  const unsubscribers = useRef([])
  const startedRef = useRef(false)
  const hungUpRef = useRef(false)

  const cleanupMedia = useCallback(() => {
    try {
      InCallManager.stop()
    } catch (_) {}
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop())
      localStreamRef.current = null
    }
    setLocalStream(null)
    setRemoteStream(null)
    if (pcRef.current) {
      try {
        pcRef.current.close()
      } catch (_) {}
      pcRef.current = null
    }
    unsubscribers.current.forEach(unsub => {
      try {
        unsub()
      } catch (_) {}
    })
    unsubscribers.current = []
  }, [])

  const hangUp = useCallback(
    async (nextStatus = CALL_STATUS.ENDED) => {
      if (hungUpRef.current) {
        return
      }
      hungUpRef.current = true
      setEnding(true)
      const id = callIdRef.current
      cleanupMedia()
      setActiveCallId(null)
      if (id) {
        try {
          await updateCallStatus(id, nextStatus)
        } catch (err) {
          console.warn('End call update failed', err)
        }
      }
      if (navigation.canGoBack()) {
        navigation.goBack()
      }
    },
    [cleanupMedia, navigation, setActiveCallId],
  )

  const wireIce = useCallback((pc, id, localRole) => {
    const remoteRole = localRole === 'caller' ? 'callee' : 'caller'
    pc.onicecandidate = event => {
      if (event.candidate) {
        addIceCandidate(id, localRole, event.candidate).catch(err =>
          console.warn('ICE publish failed', err),
        )
      }
    }
    const unsub = listenRemoteCandidates(id, remoteRole, candidate => {
      if (!pcRef.current || !candidate) {
        return
      }
      pcRef.current
        .addIceCandidate(new RTCIceCandidate(candidate))
        .catch(err => console.warn('addIceCandidate failed', err))
    })
    unsubscribers.current.push(unsub)
  }, [])

  const createPeer = useCallback(async isVideo => {
    const granted = await requestPermissions(isVideo)
    if (!granted) {
      throw new Error('Camera/microphone permission denied')
    }

    const stream = await mediaDevices.getUserMedia({
      audio: true,
      video: isVideo
        ? {
            facingMode: 'user',
            width: 640,
            height: 480,
            frameRate: 30,
          }
        : false,
    })

    localStreamRef.current = stream
    setLocalStream(stream)

    const pc = new RTCPeerConnection(ICE_SERVERS)
    pcRef.current = pc

    stream.getTracks().forEach(track => {
      pc.addTrack(track, stream)
    })

    pc.ontrack = event => {
      if (event.streams && event.streams[0]) {
        setRemoteStream(event.streams[0])
      }
    }

    pc.onconnectionstatechange = () => {
      const state = pc.connectionState
      if (state === 'connected') {
        setConnected(true)
        setStatusText('Connected')
      } else if (state === 'failed' || state === 'disconnected') {
        setStatusText(state === 'failed' ? 'Connection failed' : 'Reconnecting…')
      } else if (state === 'closed') {
        setConnected(false)
      }
    }

    InCallManager.start({media: isVideo ? 'video' : 'audio'})
    InCallManager.setForceSpeakerphoneOn(isVideo)

    return {pc, stream}
  }, [])

  useEffect(() => {
    if (!connected) {
      return undefined
    }
    const timer = setInterval(() => setSeconds(s => s + 1), 1000)
    return () => clearInterval(timer)
  }, [connected])

  useEffect(() => {
    if (startedRef.current || !user?.uid) {
      return undefined
    }
    startedRef.current = true
    let cancelled = false

    const start = async () => {
      try {
        const isVideo = initialMode === 'video'
        const {pc} = await createPeer(isVideo)
        if (cancelled) {
          return
        }

        if (role === 'caller') {
          const offer = await pc.createOffer({
            offerToReceiveAudio: true,
            offerToReceiveVideo: true,
          })
          await pc.setLocalDescription(offer)

          const call = await createCall({
            callerId: user.uid,
            calleeId: otherUserId,
            callerName: displayName || profile?.name || 'You',
            calleeName: name,
            mode: initialMode,
            offer: pc.localDescription,
          })

          if (cancelled) {
            return
          }

          callIdRef.current = call.id
          setCallId(call.id)
          setActiveCallId(call.id)
          wireIce(pc, call.id, 'caller')

          const unsub = listenCall(call.id, async data => {
            if (!data) {
              return
            }
            if (
              data.status === CALL_STATUS.REJECTED ||
              data.status === CALL_STATUS.ENDED ||
              data.status === CALL_STATUS.MISSED
            ) {
              setStatusText(
                data.status === CALL_STATUS.REJECTED
                  ? 'Call declined'
                  : 'Call ended',
              )
              setTimeout(() => hangUp(data.status), 600)
              return
            }
            if (data.answer && pc.signalingState !== 'stable') {
              try {
                await pc.setRemoteDescription(
                  new RTCSessionDescription(data.answer),
                )
                setStatusText('Connecting…')
              } catch (err) {
                console.warn('Set remote answer failed', err)
              }
            }
          })
          unsubscribers.current.push(unsub)

          const ringTimeout = setTimeout(() => {
            if (!hungUpRef.current && pc.connectionState !== 'connected') {
              setStatusText('No answer')
              hangUp(CALL_STATUS.MISSED)
            }
          }, 45000)
          unsubscribers.current.push(() => clearTimeout(ringTimeout))
        } else {
          const id = existingCallId
          if (!id) {
            throw new Error('Missing call id')
          }
          callIdRef.current = id
          setActiveCallId(id)

          const callData = await getCall(id)
          if (!callData?.offer) {
            throw new Error('Call offer not found')
          }

          await pc.setRemoteDescription(
            new RTCSessionDescription(callData.offer),
          )
          wireIce(pc, id, 'callee')

          const answer = await pc.createAnswer()
          await pc.setLocalDescription(answer)
          await updateCallAnswer(id, pc.localDescription)
          setStatusText('Connecting…')

          const unsub = listenCall(id, data => {
            if (!data) {
              return
            }
            if (
              data.status === CALL_STATUS.ENDED ||
              data.status === CALL_STATUS.REJECTED ||
              data.status === CALL_STATUS.MISSED
            ) {
              setStatusText('Call ended')
              setTimeout(() => hangUp(data.status), 400)
            }
          })
          unsubscribers.current.push(unsub)
        }
      } catch (err) {
        console.warn('Call start failed', err)
        setError(err?.message || 'Unable to start call')
        setStatusText('Call failed')
        setTimeout(() => hangUp(CALL_STATUS.ENDED), 1200)
      }
    }

    start()

    return () => {
      cancelled = true
      if (!hungUpRef.current) {
        hungUpRef.current = true
        const id = callIdRef.current
        cleanupMedia()
        setActiveCallId(null)
        if (id && role === 'caller') {
          updateCallStatus(id, CALL_STATUS.ENDED).catch(() => {})
        }
      }
    }
  }, [
    user?.uid,
    role,
    initialMode,
    otherUserId,
    name,
    displayName,
    profile?.name,
    existingCallId,
    createPeer,
    wireIce,
    hangUp,
    cleanupMedia,
    setActiveCallId,
  ])

  const toggleMute = () => {
    const next = !muted
    setMuted(next)
    localStreamRef.current?.getAudioTracks().forEach(track => {
      track.enabled = !next
    })
  }

  const toggleSpeaker = () => {
    const next = !speaker
    setSpeaker(next)
    try {
      InCallManager.setForceSpeakerphoneOn(next)
    } catch (_) {}
  }

  const toggleCamera = () => {
    const next = !cameraOn
    setCameraOn(next)
    localStreamRef.current?.getVideoTracks().forEach(track => {
      track.enabled = next
    })
    setMode(next ? 'video' : 'audio')
  }

  const switchCamera = async () => {
    const videoTrack = localStreamRef.current?.getVideoTracks()?.[0]
    if (videoTrack && typeof videoTrack._switchCamera === 'function') {
      videoTrack._switchCamera()
    }
  }

  const showVideo = mode === 'video' || cameraOn

  return (
    <SafeAreaView style={styles.main}>
      {showVideo && remoteStream ? (
        <RTCView
          streamURL={remoteStream.toURL()}
          style={styles.remoteVideo}
          objectFit="cover"
          mirror={false}
        />
      ) : (
        <View style={styles.avatarStage}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.status}>
            {error || (connected ? formatDuration(seconds) : statusText)}
          </Text>
          <Image source={getAvatarById(otherUserId)} style={styles.avatar} />
          {!connected && !error ? (
            <ActivityIndicator color="#24786D" style={{marginTop: 16}} />
          ) : null}
        </View>
      )}

      {showVideo && remoteStream ? (
        <View style={styles.overlayInfo}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.status}>
            {connected ? formatDuration(seconds) : statusText}
          </Text>
        </View>
      ) : null}

      {showVideo && localStream && cameraOn ? (
        <RTCView
          streamURL={localStream.toURL()}
          style={styles.localVideo}
          objectFit="cover"
          mirror
          zOrder={1}
        />
      ) : null}

      <View style={styles.controls}>
        <TouchableOpacity style={styles.controlBtn} onPress={toggleMute}>
          <View style={[styles.controlCircle, muted && styles.controlActive]}>
            <Feather name={muted ? 'mic-off' : 'mic'} size={22} color="#fff" />
          </View>
          <Text style={styles.controlLabel}>{muted ? 'Unmute' : 'Mute'}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.controlBtn} onPress={toggleSpeaker}>
          <View style={[styles.controlCircle, speaker && styles.controlActive]}>
            <Feather
              name={speaker ? 'volume-2' : 'volume-1'}
              size={22}
              color="#fff"
            />
          </View>
          <Text style={styles.controlLabel}>Speaker</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.controlBtn} onPress={toggleCamera}>
          <View
            style={[styles.controlCircle, cameraOn && styles.controlActive]}>
            <MaterialIcons
              name={cameraOn ? 'videocam' : 'videocam-off'}
              size={24}
              color="#fff"
            />
          </View>
          <Text style={styles.controlLabel}>Video</Text>
        </TouchableOpacity>

        {cameraOn ? (
          <TouchableOpacity style={styles.controlBtn} onPress={switchCamera}>
            <View style={styles.controlCircle}>
              <MaterialIcons name="cameraswitch" size={22} color="#fff" />
            </View>
            <Text style={styles.controlLabel}>Flip</Text>
          </TouchableOpacity>
        ) : null}
      </View>

      <TouchableOpacity
        style={[styles.endCall, ending && {opacity: 0.6}]}
        disabled={ending}
        onPress={() => hangUp(CALL_STATUS.ENDED)}>
        <MaterialIcons name="call-end" size={30} color="#fff" />
      </TouchableOpacity>
    </SafeAreaView>
  )
}

export default CallScreen

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: '#1E1E1E',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 40,
  },
  remoteVideo: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000',
  },
  localVideo: {
    position: 'absolute',
    top: 48,
    right: 16,
    width: 110,
    height: 160,
    borderRadius: 12,
    backgroundColor: '#333',
    overflow: 'hidden',
  },
  avatarStage: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 120,
  },
  overlayInfo: {
    position: 'absolute',
    top: 48,
    left: 20,
  },
  name: {color: '#fff', fontSize: 28, fontWeight: '700'},
  status: {color: '#B9C1BE', marginTop: 8, fontSize: 15},
  avatar: {width: 140, height: 140, borderRadius: 70, marginTop: 28},
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '100%',
    paddingHorizontal: 12,
    marginBottom: 28,
  },
  controlBtn: {alignItems: 'center', gap: 8, minWidth: 64},
  controlCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  controlActive: {
    backgroundColor: '#24786D',
  },
  controlLabel: {color: '#B9C1BE', fontSize: 12},
  endCall: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#F04A4C',
    alignItems: 'center',
    justifyContent: 'center',
  },
})
