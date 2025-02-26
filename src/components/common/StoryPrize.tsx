import {View, Text, Animated} from 'react-native';
import React from 'react';
import {FadeIn, FadeOut} from 'react-native-reanimated';
import {Image} from 'react-native';
import DangerIcon from '@assets/icons/danger.svg';

interface Props {
  style: any;
  coins: number;
  attempts?: number;
  items?: any[];
}

export default function StoryPrize({style, coins, attempts, items}: Props) {
  const isDangerShown = items?.length && items?.length > 1;
  return (
    <Animated.View entering={FadeIn} exiting={FadeOut} style={[style]}>
      <View className="bg-black/50 rounded-2xl gap-4 p-4 mt-4">
        <View className="flex-row justify-between items-center">
          <Text className="text-white font-bold text-xl">Prize:</Text>
          <View className="flex-row items-center gap-2">
            <Image
              source={require('../../assets/images/coin.png')}
              width={32}
              height={32}
              className="w-[32px] h-[32px]"
            />
            <Text className="text-white font-black text-lg">+ {coins}</Text>
          </View>
        </View>

        {attempts && (
          <View className="flex-row justify-between items-center">
            <Text className="text-white font-bold text-xl">Attempts:</Text>

            <Text className="text-white font-black text-lg">{attempts}</Text>
          </View>
        )}
      </View>
      {items && (
        <View className="flex-row gap-6 mx-auto mt-5 relative">
          {items?.map((image, index) => (
            <View className="bg-black/50 rounded-2xl p-4" key={index}>
              <Image source={image} />
            </View>
          ))}

          {isDangerShown && (
            <View className="absolute top-1/2 left-[40%] -translate-x-1/2 -translate-y-1/2">
              <DangerIcon />
            </View>
          )}
        </View>
      )}
    </Animated.View>
  );
}
