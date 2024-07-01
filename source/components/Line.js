import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const Line = (props) => {
  return (
   
    <View style={{ flex: 1, 
        height: 1, 
        backgroundColor: props.bcgcolor, 
        marginRight: props.right? 0 : 40 , 
        marginLeft: props.right? 40 : 0 }} />

  )
}

export default Line

const styles = StyleSheet.create({})