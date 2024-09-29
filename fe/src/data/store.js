import { createStore } from '@raiz/react-simple-store'

const state = {
  loggedIn: false,
  user: {},
  posts: [],
};

const actions = (set, get) => {
  return {
    login: (user) => set({ loggedIn: true, user }),
    logout: () => set({ loggedIn: false, user: {}, posts: [] }),
    setPosts: (posts) => set({ posts }),
  };
};

export const baseStore = createStore({ actions, state })
