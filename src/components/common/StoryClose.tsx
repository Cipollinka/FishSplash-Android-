import {View, Text, Pressable} from 'react-native';
import React from 'react';
import CloseBtnIcon from '@assets/icons/close_btn.svg';

interface Props {
  onPress: () => void;
}

export default function StoryClose({onPress}: Props) {
  return (
    <Pressable
      onPress={onPress}
      className="bg-[#00AABA] rounded-full border border-white justify-center items-center w-[44px] h-[44px]">
      <CloseBtnIcon />
    </Pressable>
  );
}
