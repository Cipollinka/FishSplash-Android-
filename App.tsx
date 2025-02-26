import React from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {NavigationContainer} from '@react-navigation/native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {AppNavigator} from '@navigation/AppNavigator';
import {initializeStores} from '@app/store/RootStore';
// import {} from 'mobx-react-lite';
import './global.css';

// Initialize stores
const stores = initializeStores();

export const App = () => {
  return (
    // <Provider store={stores}>
    <SafeAreaProvider>
      <GestureHandlerRootView style={{flex: 1}}>
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </GestureHandlerRootView>
    </SafeAreaProvider>
    // </Provider>
  );
};

export default App;
