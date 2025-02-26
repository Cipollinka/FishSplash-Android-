import React from 'react';
import {View, Text, Image, Pressable, TouchableOpacity} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {observer} from 'mobx-react-lite';
import {RootStackScreenProps} from '../../navigation/types';
import GradientText from '@components/ui/GradientText';
import {getStore} from '@app/store/RootStore';
import StoryBalance from '@components/common/StoryBalance';
import LinearGradient from 'react-native-linear-gradient';
import Button from '@components/ui/Button';
import {useNavigation} from '@react-navigation/native';

export const HomeScreen: React.FC<RootStackScreenProps<'Home'>> = observer(
  () => {
    const stores = getStore();
    const navigation = useNavigation();

    const isStoryFinished = stores?.story?.isStoryFinished;

    const handleNavigateStory = () => {
      if (isStoryFinished) {
        navigation.navigate('GameSelect');
        return;
      }
      if (stores?.story?.currentSceneId) {
        stores.story.goToScene(stores?.story?.lastPlayedGame || 'intro');
      }
      navigation.navigate('Story');
    };

    const handleShowLeaderboard = async () => {
      navigation.navigate('Scoreboard');
    };

    return (
      <SafeAreaView className="flex-1 items-center bg-black">
        <Image
          source={require('../../assets/images/story/story_bg_1.png')}
          className="absolute w-full h-full opacity-80"
          resizeMode="stretch"
        />

        <View className="my-auto pt-8">
          <Text className=" text-[#FEED00] font-black text-[32px] max-w-[280px] text-center">
            Big Splash: Fishing Adventure
          </Text>

          <View className="min-w-[100px] mt-4">
            <StoryBalance balance={stores.balance.coins} size="lg" />
          </View>
        </View>

        <View className="gap-5 w-full mx-4 mt-auto mb-6 px-4 pb-4">
          <TouchableOpacity onPress={handleNavigateStory}>
            <LinearGradient
              colors={['#FF0000', '#FEED00']}
              style={{borderRadius: 16}}>
              <View className="h-[90px] justify-center items-center">
                <Text className="font-bold text-white text-2xl">
                  {isStoryFinished ? 'Game select' : 'Golden Carp story'}
                </Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>

          <Button
            text="Fishing store"
            onPress={() => navigation.navigate('FishingStore')}
            size="lg"
          />

          <Pressable
            className="p-6 rounded-2xl bg-[#453780] items-center justify-center"
            onPress={() => navigation.navigate('Collection')}>
            <Text className="font-bold text-white text-2xl">Collection</Text>
          </Pressable>

          {/* <Pressable
            className="p-6 rounded-2xl bg-[#FF0000] items-center justify-center"
            onPress={handleShowAchievements}>
            <Text className="font-bold text-white text-2xl">Achievements</Text>
          </Pressable> */}

          <Pressable
            className="p-6 rounded-2xl bg-[#FEED00] items-center justify-center"
            onPress={handleShowLeaderboard}>
            <Text className="font-bold text-black text-2xl">Leaderboard</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  },
);
