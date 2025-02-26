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

export default observer(function FishingStoreScreen() {
  const navigation = useNavigation();
  const store = getStore();

  const handleBuyFish = (fish: any) => {
    if (store.balance.coins >= 1000) {
      store.balance.removeCoins(1000);
      store.collection.addFish(fish.id);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-black">
      <Image
        source={require('@assets/images/store.png')}
        className="absolute w-full h-full opacity-60"
        resizeMode="stretch"
      />
      <View className="m-4">
        <View className="flex-row justify-between z-10 items-center mb-6">
          <StoryBalance balance={store.balance.coins} />
          <StoryClose onPress={() => navigation.navigate('Home')} />
        </View>

        <LinearGradient
          colors={['#FF0000', '#FEED00']}
          style={{borderRadius: 16}}>
          <View className="rounded-2xl p-4 gap-2 bg-[#00AABA] m-1 items-center">
            <Text className="text-white font-bold text-2xl">Fishing store</Text>
            <Text className="text-white text-lg">
              Buy rare fish to create a collection
            </Text>
          </View>
        </LinearGradient>

        <ScrollView className="my-4" showsVerticalScrollIndicator={false}>
          <View className="flex-row flex-wrap gap-2 justify-center">
            {FISHES_TO_SELL.map(fish => {
              const isAlreadyBought = store.collection.isFishOwned(fish.id);

              return (
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
                      onPress={() => !isAlreadyBought && handleBuyFish(fish)}
                      disabled={isAlreadyBought || store.balance.coins < 1000}
                      className={clsx(
                        'flex-row gap-1 items-center justify-center py-0.5 px-4 min-h-[35.5px]',
                        {
                          'bg-[#00AABA] justify-center rounded-2xl m-0.5':
                            isAlreadyBought,
                          'opacity-50': store.balance.coins < 1000,
                        },
                      )}>
                      {!isAlreadyBought && (
                        <>
                          <Image source={require('@assets/images/coin.png')} />
                          <Text className="text-white font-bold">1000</Text>
                        </>
                      )}
                      {isAlreadyBought && (
                        <Text className="text-white font-bold">Owned</Text>
                      )}
                    </TouchableOpacity>
                  </LinearGradient>
                </View>
              );
            })}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
});
