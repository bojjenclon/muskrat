import { createStore } from '@raiz/react-simple-store'

const state = {
  loggedIn: false,
  user: {},
};

const actions = (set, get) => {
  return {
    login: (user) => set({ loggedIn: true, user }),
    logout: () => set({ loggedIn: false, user: {} }),
  };
};

export const baseStore = createStore({ actions, state })
