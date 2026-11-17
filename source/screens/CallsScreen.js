import {
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import React, {useMemo} from 'react'
import Feather from 'react-native-vector-icons/Feather'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import {useAuth} from '../context/AuthContext'
import {getAvatarById} from '../utils/avatars'

const CallsScreen = ({navigation}) => {
  const {user} = useAuth()

  const recentCalls = useMemo(
    () => [
      {
        id: '1',
        name: 'Alex Linderson',
        type: 'incoming',
        mode: 'audio',
        time: 'Today, 09:25 AM',
        userId: 'alex',
      },
      {
        id: '2',
        name: 'John Abraham',
        type: 'outgoing',
        mode: 'video',
        time: 'Yesterday, 08:10 PM',
        userId: 'john',
      },
      {
        id: '3',
        name: 'Sabila Sayma',
        type: 'missed',
        mode: 'audio',
        time: 'Monday, 07:40 PM',
        userId: 'sabila',
      },
    ],
    [],
  )

  const iconForCall = item => {
    if (item.mode === 'video') {
      return 'video'
    }
    return 'phone'
  }

  const colorForType = type => {
    if (type === 'missed') {
      return '#F04A4C'
    }
    if (type === 'incoming') {
      return '#24786D'
    }
    return '#1E1E1E'
  }

  return (
    <SafeAreaView style={styles.main}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => navigation.navigate('Users')}>
          <Feather name="search" color="#fff" size={22} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Calls</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
          <Image source={getAvatarById(user?.uid)} style={styles.avatar} />
        </TouchableOpacity>
      </View>

      <View style={styles.body}>
        <View style={styles.handle} />
        <Text style={styles.sectionTitle}>Recent</Text>
        <FlatList
          data={recentCalls}
          keyExtractor={item => item.id}
          contentContainerStyle={{paddingBottom: 30}}
          ListEmptyComponent={
            <Text style={styles.empty}>No recent calls yet.</Text>
          }
          renderItem={({item}) => (
            <TouchableOpacity
              style={styles.row}
              onPress={() =>
                navigation.navigate('Call', {
                  name: item.name,
                  mode: item.mode,
                  otherUserId: item.userId,
                })
              }>
              <Image
                source={getAvatarById(item.userId)}
                style={styles.rowAvatar}
              />
              <View style={styles.rowInfo}>
                <Text style={styles.name}>{item.name}</Text>
                <View style={styles.metaRow}>
                  <MaterialIcons
                    name={
                      item.type === 'outgoing' ? 'call-made' : 'call-received'
                    }
                    size={14}
                    color={colorForType(item.type)}
                  />
                  <Text style={[styles.meta, {color: colorForType(item.type)}]}>
                    {item.type === 'missed' ? 'Missed' : item.type} · {item.time}
                  </Text>
                </View>
              </View>
              <Feather
                name={iconForCall(item)}
                size={20}
                color="#24786D"
              />
            </TouchableOpacity>
          )}
        />
      </View>
    </SafeAreaView>
  )
}

export default CallsScreen

const styles = StyleSheet.create({
  main: {flex: 1, backgroundColor: '#1E1E1E'},
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  iconButton: {
    borderWidth: 1,
    borderColor: 'gray',
    padding: 8,
    borderRadius: 26,
  },
  headerTitle: {color: '#fff', fontSize: 20, fontWeight: '600'},
  avatar: {width: 45, height: 45, borderRadius: 23},
  body: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  handle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E0E0E0',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E1E1E',
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ececec',
  },
  rowAvatar: {width: 48, height: 48, borderRadius: 24, marginRight: 12},
  rowInfo: {flex: 1},
  name: {fontSize: 16, fontWeight: '600', color: '#1E1E1E'},
  metaRow: {flexDirection: 'row', alignItems: 'center', marginTop: 4, gap: 4},
  meta: {fontSize: 12, marginLeft: 4},
  empty: {textAlign: 'center', color: 'gray', marginTop: 40},
})
