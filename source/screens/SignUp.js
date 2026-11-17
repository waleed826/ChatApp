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
import CustomButton from '../components/CustomButton'
import CustomInput from '../components/CustomInput'
import {useAuth} from '../context/AuthContext'
import {getFriendlyAuthError} from '../services/authService'

const SignUp = ({navigation}) => {
  const {signUp} = useAuth()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleCreateAccount = async () => {
    if (!name.trim() || !email.trim() || !password || !confirmPassword) {
      Alert.alert('Missing fields', 'Please fill in all fields.')
      return
    }
    if (password.length < 6) {
      Alert.alert('Weak password', 'Password must be at least 6 characters.')
      return
    }
    if (password !== confirmPassword) {
      Alert.alert('Password mismatch', 'Passwords do not match.')
      return
    }

    try {
      setLoading(true)
      await signUp({name, email, password})
    } catch (error) {
      Alert.alert('Sign up failed', getFriendlyAuthError(error))
    } finally {
      setLoading(false)
    }
  }

  return (
    <View style={styles.main}>
      <View style={{flex: 0.12, justifyContent: 'center', marginHorizontal: 10}}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name={'keyboard-backspace'} size={25} color={'black'} />
        </TouchableOpacity>
      </View>
      <View style={{flex: 0.68, zIndex: 1}}>
        <View style={styles.container}>
          <Text style={styles.texts}>Sign up with </Text>
          <View style={styles.underlineContainer}>
            <Text style={styles.text}>Email</Text>
            <View style={styles.underline} />
          </View>
        </View>
        <View style={{padding: 20}}>
          <Text style={styles.t3}>
            Get chatting with friends and family today by signing up for our
            chat app!
          </Text>
        </View>
        <View>
          <CustomInput
            label="Name"
            value={name}
            onChangeText={setName}
            placeholder="Enter your Name"
            autoCapitalize="words"
          />
          <CustomInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            placeholder="abc@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <CustomInput
            label="Password"
            value={password}
            onChangeText={setPassword}
            placeholder="********"
            secureTextEntry
          />
          <CustomInput
            label="Confirm password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="********"
            secureTextEntry
          />
        </View>
      </View>
      <View style={{flex: 0.2, justifyContent: 'center'}}>
        {loading ? (
          <ActivityIndicator color="#24786D" />
        ) : (
          <CustomButton
            color={'white'}
            text={'Create an Account'}
            bcgcolor={'#24786D'}
            radius={15}
            onPress={handleCreateAccount}
          />
        )}
      </View>
    </View>
  )
}

export default SignUp

const styles = StyleSheet.create({
  main: {
    flex: 1,
    zIndex: 1,
    backgroundColor: '#FFFFFF',
  },
  t3: {
    textAlign: 'center',
    color: 'gray',
    marginHorizontal: 18,
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
