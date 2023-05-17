import { createStore } from 'vuex';
import { auth } from '../firebase/config';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';

const store = createStore({
  state: {
    user: null, // считывание информации о пользователе из localStorage
    chosenItems: [],
  },
  getters: {
    user: state => state.user,
  },
  mutations: {
    init(state) {
      const userJSON = localStorage.getItem('user');
      if (userJSON) {
        state.user = JSON.parse(userJSON);
      }
    },
    setUser(state, payload) {
      state.user = payload;
      if (payload) {
        localStorage.setItem('user', JSON.stringify(payload));
      } else {
        localStorage.removeItem('user');
      }
    },
    updateChosenItems(state, payload) {
      state.chosenItems = payload;
    },
  },
  actions: {
    async signup(context, { email, password }) {
      const response = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      if (response) {
        context.commit('setUser', response.user);
      } else {
        throw new Error('signup failed');
      }
    },
    async login(context, { email, password }) {
      const response = await signInWithEmailAndPassword(auth, email, password);
      if (response) {
        context.commit('setUser', response.user);
      } else {
        throw new Error('login failed');
      }
    },
    async logout(context, redirect) {
      try {
        await signOut(auth);
        context.commit('setUser', null);
        if (redirect && redirect.router) {
          redirect.router.push('/login');
        }
      } catch (error) {
        throw new Error('login failed');
      }
    },
  },
  modules: {},
});

store.commit('init');

onAuthStateChanged(auth, user => {
  if (user) {
    store.commit('setUser', user);
  } else {
    store.commit('setUser', null);
  }
});

export default store;
