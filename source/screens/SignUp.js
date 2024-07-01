import { StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import Line from '../components/Line'
import CustomButton from '../components/CustomButton'
import CustomInput from '../components/CustomInput'

const SignUp = () => {
    const [inputValue, setInputValue] = useState('')
    const [email, setEmail] = useState('')
    return (
        <View style={styles.main}>
            <View style={{ flex: 0.15, justifyContent: 'center', marginHorizontal: 10 }}>
                <MaterialIcons name={'keyboard-backspace'} size={25} color={'black'} />
            </View>
            <View style={{ flex: 0.65,zIndex:1 }}>
                    <View style={styles.container}>
                        <Text style={styles.texts}>Sign up with </Text>
                        <View style={styles.underlineContainer}>
                            <Text style={styles.text}>Email</Text>
                            <View style={styles.underline} />
                        </View>
                    </View>
                    <View style={{ padding: 20 }}>

                        <Text style={styles.t3}>Get chatting with friends and family today by signing up for our chat app!</Text>
                    </View>
                <View>
                    <View >
                        <CustomInput
                            label="Name"
                            // value={email}
                            // onChangeText={setEmail}
                            placeholder="Enter your Name"
                            keyboardType="email-address"
                        />
                        <CustomInput
                            label="Email"
                            value={email}
                            onChangeText={setEmail}
                            placeholder="abc@example.com"
                            keyboardType="email-address"
                        />
                        <CustomInput
                            label="password"
                            // value={email}
                            // onChangeText={setEmail}
                            placeholder="********"
                            
                            secureTextEntry={true}
                        />
                        <CustomInput
                            label="Confirm password"
                            // value={email}
                            // onChangeText={setEmail}
                            placeholder="********"
                            
                            secureTextEntry={true}
                        />
                    </View>
                </View>
            </View>
            <View style={{ flex: 0.2, justifyContent: 'center' }}>
            <CustomButton color={'white'} text={'Create an Account'} bcgcolor={'#24786D'} radius={15} />
            </View>
        </View>

    )
}

export default SignUp

const styles = StyleSheet.create({
    main: {
        flex: 1,
        zIndex:1,
        // alignContent
    },
    view1: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    t1: {
        fontSize: 20,
        fontWeight: '800',
        color: 'black',
        textAlign: 'center',
        textShadowColor: 'rgba(88, 195, 182,1)',
        shadowOpacity: 10,
        shadowRadius: 3.05,
        textShadowOffset: { width: 0, height: 10 },
        textShadowRadius: 40
    },
    t3: {
        textAlign: 'center',
        color: 'gray',
        marginHorizontal: 18,
    },
    container:{
        zIndex:0.1,
    },
    outline: {
        // position: 'absolute',
        left: 0,
        top: 0,
        color: 'transparent',
        textShadowColor: 'rgba(88, 195, 182,1)',
        textShadowOffset: { width: -1, height: -1 },
        textShadowRadius: 1,
        textShadowOpacity: 1,
    },
    container: {
        flexDirection: 'row',
        // alignItems: 'center',
        justifyContent:'center',
        // backgroundColor:'blue'
    },
    underlineContainer: {
        flexDirection: 'column',
        alignItems: 'center',
        zIndex:0.1,
    },
    text: {
        fontSize: 25,
        fontWeight: '800',
        color: 'black',
        zIndex:9,
        // marginTop:5,
    },
    texts: {
        fontSize: 25,
        fontWeight: '800',
        color: 'black',
    },
    underline: {
        width: '100%',
        height: 10,
        zIndex:0.9,
        // borderBottomWidth:2,
        // backgroundColor: '#58C3B6',
        backfaceVisibility:'hidden',
        backgroundColor:'rgba(88, 195, 182,0.9)',
        marginTop: -11, // Adjust this value if needed to position the underline correctly
    },

})