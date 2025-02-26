import {Text, Pressable} from 'react-native';
import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import clsx from 'clsx';

interface Props {
  onPress: () => void;
  text: string;
  hideBorder?: boolean;
  size?: 'base' | 'lg';
}

export default function Button({
  onPress,
  text,
  hideBorder,
  size = 'base',
}: Props) {
  return (
    <LinearGradient
      colors={hideBorder ? ['#00BACA', '#00BACA'] : ['#FF0000', '#FEED00']}
      style={{borderRadius: 16, zIndex: 20}}>
      <Pressable
        onPress={onPress}
        className={clsx(
          'm-1 justify-center items-center rounded-2xl bg-[#00BACA] z-20',
          {
            'p-3': size === 'base',
            'p-6': size === 'lg',
          },
        )}>
        <Text
          className={clsx('text-white font-black text-center', {
            'text-lg': size === 'base',
            'text-2xl': size === 'lg',
          })}>
          {text}
        </Text>
      </Pressable>
    </LinearGradient>
  );
}
