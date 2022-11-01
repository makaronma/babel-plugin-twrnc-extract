import { View, Text } from 'react-native'
import React from 'react'

const Card = () => {
  return (
    <View className="bg-white rounded-md px-8 py-6 shadow-lg my-4 justify-center items-center">
      <Text className='font-medium mb-2'>shadow-lg</Text>
      <Text className='font-medium mb-2'>px-10 py-8 my-4</Text>
      <Text className='font-medium mb-2'>bg-white rounded-md</Text>
    </View>
  );
}

export default Card