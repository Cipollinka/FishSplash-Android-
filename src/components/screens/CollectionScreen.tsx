import {
  View,
  Text,
  SafeAreaView,
  Image,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import {getStore} from '@app/store/RootStore';
import {useNavigation} from '@react-navigation/native';
import StoryBalance from '@components/common/StoryBalance';
import StoryClose from '@components/common/StoryClose';
import LinearGradient from 'react-native-linear-gradient';
import {FISHES_TO_SELL} from '@app/config/fishStoreItems';
import clsx from 'clsx';
import {observer} from 'mobx-react-lite';

export default observer(function CollectionScreen() {
  const navigation = useNavigation();
  const store = getStore();

  const ownedFishes = FISHES_TO_SELL.filter(fish =>
    store.collection.isFishOwned(fish.id),
  );
  const isEmpty = ownedFishes.length === 0;

  const handleSellFish = (fish: any) => {
    store.collection.removeFish(fish.id);
    store.balance.addCoins(500);
  };

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
            <Text className="text-white font-bold text-2xl">
              Your collection
            </Text>
            <Text className="text-white text-lg">
              Create your own collection of fishes
            </Text>
          </View>
        </LinearGradient>

        {isEmpty && (
          <View className="my-auto gap-6 max-w-[250px] mx-auto">
            <View className="bg-black/20 py-4 px-2 rounded-xl items-center">
              <Text className="text-white font-bold text-lg">
                There aren't any fishes yet
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => navigation.navigate('FishingStore')}>
              <LinearGradient
                colors={['#FF0000', '#FEED00']}
                style={{
                  borderRadius: 9999,
                  width: '100%',
                  alignItems: 'center',
                  justifyContent: 'center',
                  // paddingVertical: 14,
                  minHeight: 40,
                }}>
                <Text className="text-white font-bold text-lg">
                  Go to the store
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}

        {!isEmpty && (
          <ScrollView className="mt-4">
            <View className="flex-row flex-wrap gap-2 justify-center">
              {ownedFishes.map(fish => (
                <View
                  key={fish.id}
                  className="bg-black/50 rounded-2xl p-4 items-center gap-1 w-[47%]">
                  <Image source={fish.image} />
                  <Text className="text-white">{fish.title}</Text>

                  <LinearGradient
                    colors={['#FF0000', '#FEED00']}
                    style={{
                      borderRadius: 16,
                      width: '100%',
                    }}>
                    <TouchableOpacity
                      onPress={() => handleSellFish(fish)}
                      className="flex-row gap-1 items-center py-0.5 px-4 min-h-[35.5px] bg-[#00AABA] justify-center rounded-2xl m-0.5">
                      <Image source={require('@assets/images/coin.png')} />
                      <Text className="text-white font-bold">Sell for 500</Text>
                    </TouchableOpacity>
                  </LinearGradient>
                </View>
              ))}
            </View>
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
});
