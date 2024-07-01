import { StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useState } from 'react'

const CustomInput = (props) => {
    const [isEmailValid, setIsEmailValid] = useState(true)

    const handleEmailChange = (text) => {
      props.onChangeText(text)
      if (props.label === 'Email') {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        setIsEmailValid(emailPattern.test(text))
      }
    }
  return (
    <View style={styles.container}>
      <Text style={[styles.label, !isEmailValid && styles.invalidLabel]}>
        {props.label}
      </Text>
      <TextInput
        style={[styles.input, !isEmailValid && styles.invalidInput]}
        value={props.value}
        onChangeText={handleEmailChange}
        placeholder={props.placeholder}
        keyboardType={props.keyboardType}
        secureTextEntry={props.secureTextEntry}
      />
      {!isEmailValid && <Text style={styles.errorText}>Please enter a valid email</Text>}
    </View>
  )
}

export default CustomInput

const styles = StyleSheet.create({
    container: {
        marginVertical: 1,
        marginHorizontal:20,
      },
      label: {
        fontSize: 15,
        marginBottom: 14,
        marginHorizontal:25,
        color: '#24786D',
      },
      input: {
        height: 40,
        borderColor: '#ccc',
        borderBottomWidth: 1,
        borderRadius: 5,
        marginHorizontal:18,
        paddingHorizontal: 10,
      },
      invalidLabel: {
        color: 'red',
      },
      invalidInput: {
        borderColor: 'red',
      },
      errorText: {
        color: 'red',
        marginTop: 5,
        fontSize: 12,
      },
})