import {View, Text, Image} from 'react-native';
import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import clsx from 'clsx';

interface Props {
  balance: number;
  size?: 'base' | 'lg';
}

export default function StoryBalance({balance, size = 'base'}: Props) {
  return (
    <LinearGradient
      colors={['#00E8F8', '#00AABA', '#008D9D']}
      style={{borderRadius: 9}}>
      <View
        className={clsx(
          'flex-row gap-2 border border-white rounded-lg items-center px-2 py-1 min-w-[80px]',
          {
            'justify-center': size === 'lg',
          },
        )}>
        <Image
          source={require('../../assets/images/coin.png')}
          width={32}
          height={32}
          className="w-[32px] h-[32px]"
        />

        <Text
          className={clsx('text-white font-black', {
            'text-lg': size === 'base',
            'text-xl': size === 'lg',
          })}>
          {balance}
        </Text>
      </View>
    </LinearGradient>
  );
}
