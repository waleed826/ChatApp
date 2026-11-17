import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import React, {useState} from 'react'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import Line from '../components/Line'
import CustomButton from '../components/CustomButton'
import CustomInput from '../components/CustomInput'
import {useAuth} from '../context/AuthContext'
import {getFriendlyAuthError} from '../services/authService'

const SignIn = ({navigation}) => {
  const {signIn, resetPassword} = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const socialComingSoon = () => {
    Alert.alert(
      'Coming soon',
      'Social sign-in is not configured yet. Please use email instead.',
    )
  }

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      Alert.alert('Missing fields', 'Enter email and password to continue.')
      return
    }

    try {
      setLoading(true)
      await signIn({email, password})
    } catch (error) {
      Alert.alert('Login failed', getFriendlyAuthError(error))
    } finally {
      setLoading(false)
    }
  }

  const handleForgotPassword = async () => {
    if (!email.trim()) {
      Alert.alert('Email required', 'Enter your email above, then try again.')
      return
    }

    try {
      await resetPassword(email)
      Alert.alert('Check your inbox', 'Password reset email sent.')
    } catch (error) {
      Alert.alert('Reset failed', getFriendlyAuthError(error))
    }
  }

  return (
    <View style={styles.main}>
      <View style={{flex: 0.15, justifyContent: 'center', marginHorizontal: 10}}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name={'keyboard-backspace'} size={25} color={'black'} />
        </TouchableOpacity>
      </View>
      <View style={{flex: 0.65, zIndex: 1}}>
        <View style={styles.container}>
          <View style={styles.underlineContainer}>
            <Text style={styles.text}>Log In</Text>
            <View style={styles.underline} />
          </View>
          <Text style={styles.texts}> to ChatApp</Text>
        </View>
        <View style={{padding: 20}}>
          <Text style={styles.t3}>
            Welcome back! Sign in using your social account or email to continue
            us
          </Text>
        </View>
        <View style={styles.view1}>
          <CustomButton
            color={'white'}
            image={'facebook'}
            radius={25}
            borderColor={'black'}
            borderWidth={1}
            onPress={socialComingSoon}
          />
          <CustomButton
            color={'white'}
            image={'google'}
            radius={25}
            borderWidth={1}
            onPress={socialComingSoon}
          />
          <CustomButton
            icon={'social-apple'}
            radius={25}
            iconcolor={'black'}
            borderWidth={1}
            onPress={socialComingSoon}
          />
        </View>
        <View
          style={{flexDirection: 'row', alignItems: 'center', padding: 20}}>
          <Line right={true} bcgcolor={'#CDD1D0'} />
          <View>
            <Text style={{width: 50, textAlign: 'center', color: '#797C7B'}}>
              OR
            </Text>
          </View>
          <Line bcgcolor={'#CDD1D0'} />
        </View>
        <View>
          <CustomInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            placeholder="Enter your email"
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <CustomInput
            label="Password"
            value={password}
            onChangeText={setPassword}
            placeholder="Enter Password"
            secureTextEntry
          />
        </View>
      </View>
      <View style={{flex: 0.2, justifyContent: 'flex-end'}}>
        {loading ? (
          <ActivityIndicator color="#24786D" style={{marginBottom: 20}} />
        ) : (
          <CustomButton
            color={'white'}
            text={'Login'}
            bcgcolor={'#24786D'}
            radius={15}
            onPress={handleLogin}
          />
        )}
        <TouchableOpacity onPress={handleForgotPassword}>
          <Text style={{color: '#24786D', textAlign: 'center', padding: 20}}>
            Forgot password
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default SignIn

const styles = StyleSheet.create({
  main: {
    flex: 1,
    zIndex: 1,
    backgroundColor: '#FFFFFF',
  },
  view1: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  t3: {
    textAlign: 'center',
    color: 'gray',
    marginHorizontal: 20,
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  underlineContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    zIndex: 0.1,
  },
  text: {
    fontSize: 25,
    fontWeight: '800',
    color: 'black',
    zIndex: 9,
  },
  texts: {
    fontSize: 25,
    fontWeight: '800',
    color: 'black',
  },
  underline: {
    width: '100%',
    height: 10,
    zIndex: 0.9,
    backfaceVisibility: 'hidden',
    backgroundColor: 'rgba(88, 195, 182,0.9)',
    marginTop: -11,
  },
})
