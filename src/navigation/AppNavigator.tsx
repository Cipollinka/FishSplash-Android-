import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {HomeScreen} from '../components/screens/HomeScreen';
import {StoryScreen} from '@components/screens/StoryScreen';
import FishingGameScreen from '@components/screens/FishingGameScreen';
import SailGameScreen from '@components/screens/SailGameScreen';
import FishingStoreScreen from '@components/screens/FishingStoreScreen';
import CollectionScreen from '@components/screens/CollectionScreen';
import SequenceGameScreen from '@components/screens/SequenceGame';
import GameSelectScreen from '@components/screens/GameSelectScreen';
import LeaderboardScreen from '@components/screens/LeaderboardScreen';

const Stack = createNativeStackNavigator();

export const AppNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Story"
        component={StoryScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="FishingGame"
        component={FishingGameScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="SailGame"
        component={SailGameScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="FishingStore"
        component={FishingStoreScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Collection"
        component={CollectionScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="SequenceGame"
        component={SequenceGameScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="GameSelect"
        component={GameSelectScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Scoreboard"
        component={LeaderboardScreen}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};
