import { StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import Line from '../components/Line'
import CustomButton from '../components/CustomButton'
import CustomInput from '../components/CustomInput'

const SignIn = () => {
    const [inputValue, setInputValue] = useState('')
    const [email, setEmail] = useState('')
    return (
        <View style={styles.main}>
            <View style={{ flex: 0.15, justifyContent: 'center', marginHorizontal: 10 }}>
                <MaterialIcons name={'keyboard-backspace'} size={25} color={'black'} />
            </View>
            <View style={{ flex: 0.65,zIndex:1 }}>
                    <View style={styles.container}>
                        <View style={styles.underlineContainer}>
                            <Text style={styles.text}>Log In</Text>
                            <View style={styles.underline} />
                        </View>
                        <Text style={styles.texts}> to ChatApp</Text>
                    </View>
                    <View style={{ padding: 20 }}>

                        <Text style={styles.t3}>Welcome back! Sign in using your social account or email to continue us</Text>
                    </View>
                <View style={styles.view1}>
                    <CustomButton color={'white'} image={"facebook"} radius={25} borderColor={'black'} borderWidth={1} />
                    <CustomButton color={'white'} image={"google"} radius={25} borderWidth={1} />
                    <CustomButton icon={'social-apple'} radius={25} iconcolor={'black'} borderWidth={1} />
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', padding: 20 }}>
                    <Line right={true} bcgcolor={'#CDD1D0'} />
                    <View>
                        <Text style={{ width: 50, textAlign: 'center', color: '#797C7B' }}>OR</Text>
                    </View>
                    <Line bcgcolor={'#CDD1D0'} />
                </View>
                <View>
                    <View >
                        <CustomInput
                            label="Email"
                            value={email}
                            onChangeText={setEmail}
                            placeholder="Enter your email"
                            keyboardType="email-address"
                        />
                        <CustomInput
                            label="password"
                            // value={email}
                            // onChangeText={setEmail}
                            placeholder="Enter Password"
                            keyboardType=""
                        />
                    </View>
                </View>
            </View>
            <View style={{ flex: 0.2, justifyContent: 'flex-end' }}>
                <CustomButton color={'white'} text={'Login'} bcgcolor={'#24786D'} radius={15} />
                <Text style={{ color: '#24786D', textAlign: 'center', padding: 20 }}>Forgot password</Text>
            </View>
        </View>

    )
}

export default SignIn

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
    t1view: {
        // borderBottomWidth: 11,
        // borderColor: '#58C3B6'
    },
    t12: {
        fontSize: 25,
        fontWeight: '800',
        color: 'black',
    },
    test: {

    },
    t3: {
        textAlign: 'center',
        color: 'gray',
        marginHorizontal: 20,
    },
    container:{
        zIndex:0.1,
    },
    // text: {
    //     fontSize: 20,
    //     fontWeight: '800',
    //     color: 'black',
    //     textAlign: 'center',
    // },
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