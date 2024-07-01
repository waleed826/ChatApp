import { Dimensions, Image, ImageBackground, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import CustomButton from '../components/CustomButton'
import LinearGradient from 'react-native-linear-gradient'
import Line from '../components/Line';

const { width } = Dimensions.get('window');

const AccountScreen = () => {
  return (
    <View style={styles.main}>
      <ImageBackground source={require('../assets/images/ellipse1226.png')} 
      style={styles.bcgimage}>
        <View>

        
        <View style={styles.logoview}>
          <Image source={require('../assets/images/logo.png')}
          style={{
            width: '10%', // 80% of the container's width
            height: width * 0.1, // Maintain the aspect ratio
            // maxWidth: 512,
            // maxHeight: 512,
          }}
          resizeMode="contain"
          />
          <Text style={styles.T4}>ChatApp</Text>
        </View>
      <Text style={styles.T1}>Connect friends{'\n'}easily & quickly</Text>
        </View>
        {/* {/* <Text style={{color:'white'}}>Chat App with logo</Text> */}
      <Text style={styles.T2}>Our chat app is the perfect way to stay connected with friends and family.</Text>
      <View style={styles.view1}>
      <CustomButton  color={'white'} image={"facebook"} radius={25} borderColor={'white'} borderWidth={1} />
      <CustomButton  color={'white'}  image={"google"} radius={25} borderColor={'white'} borderWidth={1} />
      <CustomButton  color={'white'} image={"apple"} radius={25} borderColor={'white'} borderWidth={1} />
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Line right={true} bcgcolor={'gray'} />
        <View>
          <Text style={{ width: 50, textAlign: 'center', color: '#D6E4E0' }}>OR</Text>
        </View>
        <Line bcgcolor={'gray'}/>
      </View>
      <CustomButton text={'SignUp with mail'} color={'black'} bcgcolor={'#FFFFFF'} radius={14} />
      <Text style={styles.T3}>Existing account? <Text style={styles.T4}>Log in</Text></Text> 
      </ImageBackground>
    </View>
  )
}

export default AccountScreen

const styles = StyleSheet.create({
    main:{
        flex:1,
        // zIndex:1,
        // alignItems:'center',
        // justifyContent:'space-evenly',
        backgroundColor:'#1E1E1E',
    },
    bcgimage:{
      // alignItems:'center',
      justifyContent:'space-evenly',
      flex:1,
      resizeMode:''
    },
    logoview:{
      flexDirection:'row',
      alignItems:'center',
      justifyContent:'center',
    },
    T1:{color:'#FFFFFF', fontSize:55,marginHorizontal:17,fontStyle:'italic',},
    T2:{color:'#B9C1BE',marginHorizontal:25},
    T3:{color:'#B9C1BE',textAlign:'center'},
    T4:{color:'#FFFFFF'},
    view1:{flexDirection:'row', justifyContent:'space-evenly'},
  })