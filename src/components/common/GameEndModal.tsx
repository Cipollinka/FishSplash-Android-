import {View, Text, Image} from 'react-native';
import React from 'react';
import CustomModal from '@components/ui/Modal';
import Button from '@components/ui/Button';

interface Props {
  visible: boolean;
  onClose: () => void;
  isSuccess: boolean;
  reward: string | number;
  onContinue: () => void;
  onTryAgain: () => void;
}

export default function GameEndModal({
  visible,
  onClose,
  isSuccess,
  reward = 0,
  onContinue,
  onTryAgain,
}: Props) {
  return (
    <CustomModal visible={visible} onClose={onClose}>
      <View className="items-center w-full flex-1 justify-center">
        <Text className="text-white font-bold text-3xl mb-2 mt-auto">
          Game is ended!
        </Text>
        {isSuccess && (
          <Text className="text-white text-center text-lg">
            You have completed this game and get:
          </Text>
        )}
        {!isSuccess && (
          <Text className="text-white text-center text-lg">
            Oops! You missed this time. Try again!
          </Text>
        )}

        {isSuccess && (
          <View className="bg-[#00AABA] rounded-2xl p-4 min-w-[160px] gap-2 items-center mt-8">
            <Image
              source={require('../../assets/images/coin_big.png')}
              width={110}
              height={110}
              className="w-[110px] h-[110px]"
            />
            <Text className="text-white font-black text-3xl">+ {reward}</Text>
          </View>
        )}
        <View className="w-full mt-auto p-4 gap-4">
          {isSuccess && <Button text="Continue" onPress={onContinue} />}
          {!isSuccess && (
            <Button hideBorder text="Try again" onPress={onTryAgain} />
          )}
        </View>
      </View>
    </CustomModal>
  );
}
