import React from 'react'
import {
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import Feather from 'react-native-vector-icons/Feather'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import {useCall} from '../context/CallContext'
import {getAvatarById} from '../utils/avatars'

const IncomingCallModal = ({navigationRef}) => {
  const {incomingCall, acceptIncoming, rejectIncoming, activeCallId} = useCall()

  if (!incomingCall || activeCallId) {
    return null
  }

  const isVideo = incomingCall.mode === 'video'

  const onAccept = () => {
    const call = acceptIncoming()
    if (!call) {
      return
    }
    navigationRef?.current?.navigate('Call', {
      callId: call.id,
      role: 'callee',
      mode: call.mode,
      name: call.callerName,
      otherUserId: call.callerId,
    })
  }

  return (
    <Modal visible transparent animationType="fade" statusBarTranslucent>
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <Text style={styles.label}>
            Incoming {isVideo ? 'video' : 'voice'} call
          </Text>
          <Image
            source={getAvatarById(incomingCall.callerId)}
            style={styles.avatar}
          />
          <Text style={styles.name}>{incomingCall.callerName}</Text>
          <Text style={styles.hint}>
            {isVideo ? 'Video Call' : 'Voice Call'}
          </Text>

          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.btn, styles.reject]}
              onPress={rejectIncoming}>
              <MaterialIcons name="call-end" size={28} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.btn, styles.accept]}
              onPress={onAccept}>
              <Feather
                name={isVideo ? 'video' : 'phone'}
                size={26}
                color="#fff"
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  )
}

export default IncomingCallModal

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.72)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: '#1E1E1E',
    borderRadius: 28,
    paddingVertical: 32,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  label: {
    color: '#B9C1BE',
    fontSize: 14,
    marginBottom: 20,
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    marginBottom: 16,
  },
  name: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '700',
  },
  hint: {
    color: '#24786D',
    marginTop: 6,
    marginBottom: 28,
  },
  actions: {
    flexDirection: 'row',
    gap: 40,
  },
  btn: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reject: {
    backgroundColor: '#F04A4C',
  },
  accept: {
    backgroundColor: '#24786D',
  },
})
