import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import React, {useState} from 'react'
import Feather from 'react-native-vector-icons/Feather'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import {getAvatarById} from '../utils/avatars'

const CallScreen = ({navigation, route}) => {
  const {name = 'User', mode = 'audio', otherUserId = ''} = route.params || {}
  const [muted, setMuted] = useState(false)
  const [speaker, setSpeaker] = useState(false)

  return (
    <SafeAreaView style={styles.main}>
      <Text style={styles.name}>{name}</Text>
      <Text style={styles.status}>
        {mode === 'video' ? 'Video calling…' : 'Calling…'}
      </Text>

      <Image source={getAvatarById(otherUserId)} style={styles.avatar} />

      <View style={styles.controls}>
        <TouchableOpacity
          style={styles.controlBtn}
          onPress={() => setMuted(prev => !prev)}>
          <Feather name={muted ? 'mic-off' : 'mic'} size={22} color="#fff" />
          <Text style={styles.controlLabel}>{muted ? 'Unmute' : 'Mute'}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.controlBtn}
          onPress={() => setSpeaker(prev => !prev)}>
          <Feather
            name={speaker ? 'volume-2' : 'volume-1'}
            size={22}
            color="#fff"
          />
          <Text style={styles.controlLabel}>Speaker</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.controlBtn}>
          <MaterialIcons
            name={mode === 'video' ? 'videocam' : 'videocam-off'}
            size={24}
            color="#fff"
          />
          <Text style={styles.controlLabel}>Video</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.endCall}
        onPress={() => navigation.goBack()}>
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
    justifyContent: 'space-evenly',
    paddingVertical: 40,
  },
  name: {color: '#fff', fontSize: 28, fontWeight: '700'},
  status: {color: '#B9C1BE', marginTop: -20},
  avatar: {width: 140, height: 140, borderRadius: 70},
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '100%',
    paddingHorizontal: 20,
  },
  controlBtn: {alignItems: 'center', gap: 8},
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
