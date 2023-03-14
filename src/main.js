import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import { VueFire } from 'vuefire';

import { initializeApp } from 'firebase/app';
import { firebaseConfig } from '@/firebase/config';

const firebaseApp = initializeApp(firebaseConfig);

import './css/index.css';
import 'vue3-toastify/dist/index.css';

const app = createApp(App).use(store).use(router);
app.use(VueFire, {
  // imported above but could also just be created here
  firebaseApp,
  modules: [
    // we will see other modules later on
  ],
});
app.mount('#app');
