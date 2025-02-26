import {types} from 'mobx-state-tree';

export const CollectionStore = types
  .model('CollectionStore', {
    ownedFishes: types.array(types.number),
  })
  .actions(self => ({
    addFish(fishId: number) {
      if (!self.ownedFishes.includes(fishId)) {
        self.ownedFishes.push(fishId);
      }
    },
    removeFish(fishId: number) {
      const index = self.ownedFishes.indexOf(fishId);
      if (index !== -1) {
        self.ownedFishes.splice(index, 1);
      }
    },
    isFishOwned(fishId: number) {
      return self.ownedFishes.includes(fishId);
    },
  }));
