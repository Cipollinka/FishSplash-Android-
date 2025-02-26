import {View, Text, Image} from 'react-native';
import React from 'react';

interface Props {
  text: string;
  image: any;
}

export default function StoryReward({text, image}: Props) {
  return (
    <View className="items-center gap-4 mt-14">
      <Text className="text-lg text-white font-medium text-center max-w-[250px]">
        {text}
      </Text>
      <View className="bg-black/50 rounded-3xl py-2 px-4">
        <Image source={image} />
      </View>
    </View>
  );
}
