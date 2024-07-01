import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import Feather from 'react-native-vector-icons/Feather'

const HomeScreen = () => {
    const Status = [
        { id: 1, userImage: require('../assets/images/user1.png'), name: 'My status', messagenotify: '' },
        { id: 2, userImage: require('../assets/images/user2.png'), name: 'Gabrila', messagenotify: '4' },
        { id: 3, userImage: require('../assets/images/user3.png'), name: 'Johny', messagenotify: '3' },
        { id: 4, userImage: require('../assets/images/user4.png'), name: 'Dean', messagenotify: '' },
        { id: 5, userImage: require('../assets/images/user5.png'), name: 'John', messagenotify: '5' },
        { id: 6, userImage: require('../assets/images/user6.png'), name: 'Alex', messagenotify: '1' },
        { id: 7, userImage: require('../assets/images/user7.png'), name: 'John', messagenotify: '' },
        { id: 8, userImage: require('../assets/images/user8.png'), name: 'Sabila', messagenotify: '2' },
        { id: 9, userImage: require('../assets/images/user9.png'), name: 'Angel', messagenotify: '1' },
    ]
    const chat = [
        { id: 0, userImage: require('../assets/images/user1.png'), name: 'Message yourself', message: 'Wake up and go to for morning walk.', time: '2 min ago', messagenotify: '' },
        { id: 1, userImage: require('../assets/images/user2.png'), name: 'Gabrila', message: 'Can we go for a trip', time: '3 min ago', messagenotify: '4' },
        { id: 2, userImage: require('../assets/images/user3.png'), name: 'Johny', message: 'I will callback soon', time: '5 hours ago', messagenotify: '3' },
        { id: 3, userImage: require('../assets/images/user4.png'), name: 'Dean', message: 'Send the documents plz', time: '6 hours ago', messagenotify: '' },
        { id: 4, userImage: require('../assets/images/user5.png'), name: 'John Borino', message: 'Have a good day..!', time: '7 hours ago', messagenotify: '5' },
        { id: 5, userImage: require('../assets/images/user6.png'), name: 'Alex Linderson', message: 'How are you today', time: '8 hours ago', messagenotify: '1' },
        { id: 6, userImage: require('../assets/images/user7.png'), name: 'John Abraham', message: 'Hey! Can you join the meeting', time: '15 hours ago', messagenotify: '' },
        { id: 7, userImage: require('../assets/images/user8.png'), name: 'Sabila Sayma', message: 'Have you updated your status?', time: 'tomorrow', messagenotify: '2' },
        { id: 8, userImage: require('../assets/images/user9.png'), name: 'Angel Dayna', message: 'I will be there soon, wait for me!', time: 'tomorrow', messagenotify: '1' },
    ]
    return (
        <View style={styles.main}>
            <View style={styles.view1}>
                <View style={{ borderWidth: 1, borderColor: 'gray', padding: 8, borderRadius: 26 }}>
                    <Feather name={'search'} color={'white'} size={25} />
                </View>
                <Text style={styles.mainText}>Home</Text>
                <Image source={require('../assets/images/user1.png')} style={{ width: 45, height: 45 }} />
            </View>
            <View>
                <FlatList
                    data={Status}
                    keyExtractor={item => item.id.toString()}
                    horizontal={true}
                    renderItem={({ item }) => (
                        <TouchableOpacity style={styles.statusItem}>
                            <Image source={item.userImage} style={styles.statusImage} />
                            <Text style={styles.statusText}>{item.name}</Text>
                        </TouchableOpacity>
                    )}
                />
            </View>
            <View style={styles.chatview}>
                <FlatList
                    data={chat}
                    keyExtractor={item => item.id.toString()}
                    renderItem={({ item,index }) => (
                        <TouchableOpacity style={[styles.chatItem,{ marginBottom: chat.length - 1 == index ? 120 : 0,}]}>
                            <Image source={item.userImage} style={styles.chatImage} />
                            <View style={styles.chatnameview}>
                                <Text style={styles.chatText}>{item.name}</Text>
                                <Text style={{color:'gray',fontSize:12}}>{item.message}</Text>
                            </View>
                            <View style={styles.timeview}>
                                <Text style={styles.timetext}>{item.time}</Text>
{ item.messagenotify &&(
                                <View style={{backgroundColor:'#F04A4C',borderRadius:20,padding:10}}>
    <Text style={styles.notifytext}>{item?.messagenotify}</Text>
                                </View>
    )}
                            </View>
                        </TouchableOpacity>
                    )}
                />

            </View>
        </View>
    )
}

export default HomeScreen

const styles = StyleSheet.create({
    main: {
        flex: 1,
        backgroundColor: '#1E1E1E'
    },
    view1: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        margin: 25,

    },
    mainText: {
        color: 'white',
        fontSize: 18,
        fontWeight: '500'
    },
    statusItem: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
        marginVertical: 5,
        borderRadius: 10,
    },
    statusImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
        // marginRight: 10,
        marginHorizontal: 5,
    },
    statusText: {
        color: 'white',
        fontSize: 12,
    },
    chatview: {
        backgroundColor: 'white',
        borderTopLeftRadius: 50,
        borderTopRightRadius: 50,
    },
    chatItem:{
        // margin:5,
        flexDirection:'row',
        // alignItems:'center',
        justifyContent:'space-between',
        margin:10,
        padding:10,
    },
    chatImage:{
        height:40,
        width:40,
    },
    chatnameview:{
        // alignItems:'flex-start',
        // backgroundColor:'gray'
    },
    timeview:{
        alignItems:'center'
    },
    chatText:{
        color:'black',
        fontSize:14,
        fontWeight:'600'
    },
    timetext:{
        color:'gray',
        fontSize:10
    },
    notifytext:{
        color:'white',
        // padding:10,
        // borderRadius:25,
        fontSize:10,
        // backgroundColor:'#F04A4C',
    },
})