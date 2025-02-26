import {View, Text, SafeAreaView, Image, ScrollView} from 'react-native';
import React from 'react';
import {getStore} from '@app/store/RootStore';
import {useNavigation} from '@react-navigation/native';
import StoryBalance from '@components/common/StoryBalance';
import StoryClose from '@components/common/StoryClose';
import LinearGradient from 'react-native-linear-gradient';

const MOCK_LEADERBOARD = [
  {id: 1, name: 'John Doe', score: 15000},
  {id: 2, name: 'Alice Smith', score: 12500},
  {id: 3, name: 'Bob Johnson', score: 10000},
  {id: 4, name: 'Emma Davis', score: 9500},
  {id: 5, name: 'Michael Brown', score: 8000},
  {id: 6, name: 'Sarah Wilson', score: 7500},
  {id: 7, name: 'David Miller', score: 7000},
  {id: 8, name: 'Lisa Anderson', score: 6500},
  {id: 9, name: 'James Taylor', score: 6000},
  {id: 10, name: 'Emily White', score: 5500},
];

export default function LeaderboardScreen() {
  const navigation = useNavigation();
  const store = getStore();

  return (
    <SafeAreaView className="flex-1 bg-black">
      <Image
        source={require('@assets/images/store.png')}
        className="absolute w-full h-full opacity-60"
        resizeMode="stretch"
      />
      <View className="m-4 flex-1">
        <View className="flex-row justify-between z-10 items-center mb-6">
          <StoryBalance balance={store.balance.coins} />
          <StoryClose onPress={() => navigation.navigate('Home')} />
        </View>

        <LinearGradient
          colors={['#FF0000', '#FEED00']}
          style={{borderRadius: 16}}>
          <View className="rounded-2xl p-4 gap-2 bg-[#00AABA] m-1 items-center">
            <Text className="text-white font-bold text-2xl">Leaderboard</Text>
            <Text className="text-white text-lg">
              Top players and their scores
            </Text>
          </View>
        </LinearGradient>

        <ScrollView className="mt-4 mb-4" showsVerticalScrollIndicator={false}>
          <View className="gap-2">
            {MOCK_LEADERBOARD.map((player, index) => (
              <View key={player.id} className="bg-black/50 rounded-2xl p-4">
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center gap-3">
                    <View className="w-8 h-8 rounded-full bg-[#00AABA] items-center justify-center">
                      <Text className="text-white font-bold">{index + 1}</Text>
                    </View>
                    <Text className="text-white text-lg">{player.name}</Text>
                  </View>
                  <View className="flex-row items-center gap-2">
                    <Image source={require('@assets/images/coin.png')} />
                    <Text className="text-white font-bold text-lg">
                      {player.score.toLocaleString()}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
