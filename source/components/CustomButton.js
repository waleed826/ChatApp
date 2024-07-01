import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import Foundation from 'react-native-vector-icons/Foundation'

const CustomButton = (props) => {
  const images = {
    facebook: require('../assets/images/facebook.png'),
    google: require('../assets/images/google.png'),
    apple: require('../assets/images/applelogo.png'),
  }
  return (
    <TouchableOpacity onPress={props.onPress} style={{
      backgroundColor:props.bcgcolor,
      borderColor:props.borderColor,
      borderRadius:props.radius,
      borderWidth:props.borderWidth,
      padding:10,
      marginHorizontal:20,
      }}>
        {props.icon && (          
          <Foundation name={props.icon} size={25} style={{paddingHorizontal:4}} color={props.iconcolor} />
        )}
         {props.image && (
        <Image source={images[props.image]} style={styles.image} />
      )}
      {props.text && (
        <Text style={[styles.text, { color: props.color,fontWeight:props.fontWeight }]}>
          {props.text}
        </Text>
      )}
      {/* <Image source={images[props.image]} resizeMode='stretch'/>
        <Text style={{color:props.color,textAlign:'center'}}>
            {props.Text}
        </Text> */}
    </TouchableOpacity>
  )
}

export default CustomButton

const styles = StyleSheet.create({
  text:{
    textAlign:'center'
  }
})