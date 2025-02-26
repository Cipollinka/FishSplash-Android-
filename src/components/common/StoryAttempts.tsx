import {View, Text} from 'react-native';
import React from 'react';
import LinearGradient from 'react-native-linear-gradient';

interface Props {
  attempt: number;
  totalAttempts: number;
}

export default function StoryAttempts({attempt, totalAttempts}: Props) {
  return (
    <LinearGradient
      colors={['#00E8F8', '#00AABA', '#008D9D']}
      style={{borderRadius: 9}}>
      <View className="flex-row border border-white rounded-lg items-center justify-center px-2 flex-1 min-w-[80px]">
        <Text className="text-white font-black text-lg">
          {attempt}/{totalAttempts}
        </Text>
      </View>
    </LinearGradient>
  );
}
