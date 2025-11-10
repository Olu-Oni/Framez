import { Link } from 'expo-router'
import React from 'react'
import { Text, View } from 'react-native'

const signup = () => {
  return (
    <View>
      <Text>signup</Text>
      <Link href={'/(tabs)/profile'}>To Profile</Link>
      <Link href={'/(auth)/login'}>To Login</Link>
    </View>
  )
}

export default signup