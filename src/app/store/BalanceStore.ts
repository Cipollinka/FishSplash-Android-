import {types} from 'mobx-state-tree';

export const BalanceStore = types
  .model('BalanceStore', {
    coins: types.number,
  })
  .actions(self => ({
    addCoins(amount: number) {
      self.coins += amount;
    },
    removeCoins(amount: number) {
      self.coins = Math.max(0, self.coins - amount); // Prevent negative balance
    },
    setCoins(amount: number) {
      self.coins = amount;
    },
  }))
  .views(self => ({
    get formattedBalance() {
      return `${self.coins} coins`;
    },
  }));

// Initial state
// export const createBalanceStore = () => BalanceStore.create({coins: 0});
