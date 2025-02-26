import {types, onSnapshot, applySnapshot} from 'mobx-state-tree';
// import {MMKV} from 'react-native-mmkv';
import {StoryStore} from './StoryStore';
import {BalanceStore} from './BalanceStore';
import {CollectionStore} from './CollectionStore';
import {MMKVLoader} from 'react-native-mmkv-storage';

// Initialize MMKV
// export const storage = new MMKV({
//   id: 'app-storage',
// });
const storage = new MMKVLoader().initialize();

export const RootStore = types
  .model('RootStore', {
    story: types.optional(StoryStore, {currentSceneId: 'intro'}),
    balance: types.optional(BalanceStore, {coins: 0}),
    collection: types.optional(CollectionStore, {ownedFishes: []}),
  })
  .actions(self => ({
    // You can add actions here if needed
  }));

let store: any = null;

export function initializeStores() {
  // storage.delete('rootStore');
  const initialState = storage.getString('rootStore');
  const state = initialState ? JSON.parse(initialState) : null;
  console.log('state', state);

  if (state?.story?.currentSceneId) {
    state.story.currentSceneId = state?.story?.lastPlayedGame || 'intro';
  }
  store = RootStore.create(
    state || {
      story: {currentSceneId: 'intro'},
      balance: {coins: 0},
      collection: {ownedFishes: []},
    },
  );

  onSnapshot(store, snapshot => {
    try {
      console.log('snapshot', snapshot);

      const json = JSON.stringify(snapshot);
      console.log('json', json);

      storage.setString('rootStore', json);
    } catch (error) {
      console.error('Error saving snapshot:', error);
    }
  });
  return store;
}

export function getStore() {
  return store;
}
