import {View, Text, SafeAreaView, Image, Pressable} from 'react-native';
import React from 'react';
import StoryBalance from '@components/common/StoryBalance';
import {getStore} from '@app/store/RootStore';
import StoryClose from '@components/common/StoryClose';
import {useNavigation} from '@react-navigation/native';

export default function GameSelectScreen() {
  const navigation = useNavigation();
  const store = getStore();
  return (
    <SafeAreaView className="flex-1 bg-black/50">
      <Image
        source={require('../../assets/images/story/story_bg_1.png')}
        className="absolute w-full h-full opacity-80"
        resizeMode="stretch"
      />

      <View className="flex-row m-4 items-center justify-between">
        <StoryBalance balance={store.balance.coins} />
        <StoryClose onPress={() => navigation.navigate('Home')} />
      </View>

      <View className="gap-4 m-4 my-auto">
        <View className="mx-auto mb-24">
          <Text className="text-[#FEED00] text-3xl font-bold">
            Select game to play
          </Text>
        </View>
        <Pressable
          className="p-6 rounded-2xl bg-[#453780] items-center justify-center"
          onPress={() => navigation.navigate('FishingGame')}>
          <Text className="font-bold text-white text-2xl">Fishing game</Text>
        </Pressable>

        <Pressable
          className="p-6 rounded-2xl bg-[#FF0000] items-center justify-center"
          onPress={() => navigation.navigate('SailGame')}>
          <Text className="font-bold text-white text-2xl">Sail game</Text>
        </Pressable>

        <Pressable
          className="p-6 rounded-2xl bg-[#FEED00] items-center justify-center"
          onPress={() => navigation.navigate('SequenceGame')}>
          <Text className="font-bold text-black text-2xl">Sequence Game</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
