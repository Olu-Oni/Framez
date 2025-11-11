import { ThemedButton } from '@/components/ThemedComponents/Buttons'
import { useAuthActions } from '@convex-dev/auth/react'
import React from 'react'
import { Text, View } from 'react-native'

const Profile = () => {
  const {signOut}= useAuthActions()
  return (
    <View>
      <Text>profilP</Text>
      <ThemedButton variant='ghost' onPress={()=>signOut()}>Sign out</ThemedButton>
    </View>
  )
}

export default Profile