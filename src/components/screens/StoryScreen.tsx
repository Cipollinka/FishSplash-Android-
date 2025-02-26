import React from 'react';
import {View, Text, Pressable, Image, TouchableOpacity} from 'react-native';
import {observer} from 'mobx-react-lite';
import {SafeAreaView} from 'react-native-safe-area-context';
import Animated, {
  FadeIn,
  FadeOut,
  useAnimatedStyle,
  withTiming,
  useSharedValue,
} from 'react-native-reanimated';
import {getStore} from '@app/store/RootStore';
import LinearGradient from 'react-native-linear-gradient';
import Button from '@components/ui/Button';
import StoryBalance from '@components/common/StoryBalance';
import StoryClose from '@components/common/StoryClose';
import {useNavigation} from '@react-navigation/native';
import clsx from 'clsx';
import StoryPrize from '@components/common/StoryPrize';
import StoryReward from '@components/common/StoryReward';

export const StoryScreen = observer(() => {
  const navigation = useNavigation();

  const store = getStore();
  const currentScene = store?.story?.currentScene;
  const opacity = useSharedValue(1);

  const isStart = !!currentScene?.prize;
  const isReward = !!currentScene?.reward;
  const isFinish = currentScene?.id === 'finish';

  const textStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const handlePress = () => {
    console.log('currentScene', currentScene);

    if (currentScene?.choices?.length || isStart || isReward || isFinish)
      return;
    if (currentScene?.nextSceneId && store?.story?.goToScene) {
      store.story.goToScene(currentScene.nextSceneId);
    }
    opacity.value = withTiming(0, {}, () => {
      if (currentScene.nextSceneId) {
        opacity.value = withTiming(1);
      }
    });
  };

  const handleStart = () => {
    if (currentScene.id.includes('start_1')) {
      navigation.navigate('FishingGame');
    } else if (currentScene.id.includes('start_2')) {
      navigation.replace('SailGame');
    } else if (currentScene.id.includes('start_3')) {
      navigation.replace('SequenceGame');
    }
  };

  const handleContinue = () => {
    store.story.goToScene(currentScene.nextSceneId);
  };

  const handleFinishStory = () => {
    store.story.setStoryFinished();
    navigation.navigate('Home');
  };

  return (
    <SafeAreaView
      className={clsx('flex-1 relative', {
        'bg-black': isReward,
        'bg-blue': !isReward,
      })}>
      <Pressable className="flex-1" onPress={handlePress}>
        <View className="z-10 flex-row justify-between m-4">
          <StoryBalance balance={store.balance.coins} />
          <StoryClose onPress={() => navigation.navigate('Home')} />
        </View>

        <Image
          source={currentScene.backgroundImage}
          className={clsx('absolute w-full h-full', {
            'opacity-60': isReward,
          })}
          resizeMode="stretch"
        />

        <View
          className={clsx('flex-1 m-4', {
            'justify-end': !isStart || !isReward,
          })}>
          {isFinish && (
            <View className="my-auto mx-auto">
              <Image source={require('@assets/images/golden_carp.png')} />
            </View>
          )}
          {currentScene?.personName && (
            <View className="bg-[#FEED00] rounded-t-2xl items-center justify-center p-2 w-[150px] mx-auto">
              <Text className="text-[#420201] font-medium text-sm">
                {currentScene.personName}
              </Text>
            </View>
          )}

          <Animated.View
            entering={FadeIn}
            exiting={FadeOut}
            style={[textStyle]}>
            <LinearGradient
              colors={['#FF0000', '#FEED00']}
              style={{borderRadius: 16}}>
              <View className="bg-[#00AABA] p-4 m-1 gap-1 rounded-2xl">
                {currentScene?.title && (
                  <Text className="text-white text-2xl font-bold text-center z-10">
                    {currentScene.title}
                  </Text>
                )}
                <Text className="text-white text-lg text-center">
                  {currentScene.text}
                </Text>
              </View>
            </LinearGradient>
          </Animated.View>

          {isStart && (
            <StoryPrize
              style={[textStyle]}
              coins={currentScene?.prize?.coins}
              attempts={currentScene?.prize?.attempts}
              items={currentScene?.prize?.items}
            />
          )}

          {isReward && (
            <StoryReward
              text={currentScene?.reward?.text}
              image={currentScene?.reward?.image}
            />
          )}

          {currentScene.choices?.length > 0 && (
            <Animated.View
              className="mt-4 space-y-2 gap-4"
              entering={FadeIn}
              exiting={FadeOut}
              style={[textStyle]}>
              {currentScene.choices.map((choice, index) => (
                <Button
                  key={index}
                  text={choice.text}
                  onPress={() => store.story.goToScene(choice.nextSceneId)}
                />
              ))}
            </Animated.View>
          )}

          {isStart && (
            <Animated.View
              className="mb-4 mt-auto space-y-2 z-20"
              entering={FadeIn}
              exiting={FadeOut}
              style={[textStyle]}>
              <View>
                <Button text="Start" onPress={handleStart} />
              </View>
            </Animated.View>
          )}

          {isReward && (
            <Animated.View
              className="mb-4 mt-auto space-y-2 z-20"
              entering={FadeIn}
              exiting={FadeOut}
              style={[textStyle]}>
              <View>
                <Button text="Continue" onPress={handleContinue} />
              </View>
            </Animated.View>
          )}

          {isFinish && (
            <Animated.View
              className="mb-4 mt-auto space-y-2 z-20"
              entering={FadeIn}
              exiting={FadeOut}
              style={[textStyle]}>
              <TouchableOpacity onPress={handleFinishStory}>
                <LinearGradient
                  colors={['#FF0000', '#FEED00']}
                  style={{
                    borderRadius: 16,
                    height: 50,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Text className="text-white font-bold text-xl">
                    To finish the story
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>
          )}
        </View>
      </Pressable>
    </SafeAreaView>
  );
});
