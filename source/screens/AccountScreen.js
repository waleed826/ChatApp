import {
  Alert,
  Dimensions,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import React from 'react'
import CustomButton from '../components/CustomButton'
import Line from '../components/Line'

const {width} = Dimensions.get('window')

const AccountScreen = ({navigation}) => {
  const socialComingSoon = () => {
    Alert.alert(
      'Coming soon',
      'Social sign-in is not configured yet. Please use email instead.',
    )
  }

  return (
    <View style={styles.main}>
      <ImageBackground
        source={require('../assets/images/ellipse1226.png')}
        style={styles.bcgimage}>
        <View>
          <View style={styles.logoview}>
            <Image
              source={require('../assets/images/logo.png')}
              style={{
                width: '10%',
                height: width * 0.1,
              }}
              resizeMode="contain"
            />
            <Text style={styles.T4}>ChatApp</Text>
          </View>
          <Text style={styles.T1}>
            Connect friends{'\n'}easily & quickly
          </Text>
        </View>
        <Text style={styles.T2}>
          Our chat app is the perfect way to stay connected with friends and
          family.
        </Text>
        <View style={styles.view1}>
          <CustomButton
            color={'white'}
            image={'facebook'}
            radius={25}
            borderColor={'white'}
            borderWidth={1}
            onPress={socialComingSoon}
          />
          <CustomButton
            color={'white'}
            image={'google'}
            radius={25}
            borderColor={'white'}
            borderWidth={1}
            onPress={socialComingSoon}
          />
          <CustomButton
            color={'white'}
            image={'apple'}
            radius={25}
            borderColor={'white'}
            borderWidth={1}
            onPress={socialComingSoon}
          />
        </View>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Line right={true} bcgcolor={'gray'} />
          <View>
            <Text style={{width: 50, textAlign: 'center', color: '#D6E4E0'}}>
              OR
            </Text>
          </View>
          <Line bcgcolor={'gray'} />
        </View>
        <CustomButton
          text={'SignUp with mail'}
          color={'black'}
          bcgcolor={'#FFFFFF'}
          radius={14}
          onPress={() => navigation.navigate('SignUp')}
        />
        <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
          <Text style={styles.T3}>
            Existing account? <Text style={styles.T4}>Log in</Text>
          </Text>
        </TouchableOpacity>
      </ImageBackground>
    </View>
  )
}

export default AccountScreen

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: '#1E1E1E',
  },
  bcgimage: {
    justifyContent: 'space-evenly',
    flex: 1,
  },
  logoview: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  T1: {
    color: '#FFFFFF',
    fontSize: 55,
    marginHorizontal: 17,
    fontStyle: 'italic',
  },
  T2: {color: '#B9C1BE', marginHorizontal: 25},
  T3: {color: '#B9C1BE', textAlign: 'center'},
  T4: {color: '#FFFFFF'},
  view1: {flexDirection: 'row', justifyContent: 'space-evenly'},
})
