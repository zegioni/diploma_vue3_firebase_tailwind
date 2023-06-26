<template>
  <nav class="bg-slate-100 shadow-lg mx-15 px-15 py-4 rounded-md">
    <div class="max-w- px-4">
      <div class="flex justify-between">
        <div class="flex-shrink-0">
          <div class="flex items-center h-full">
            <span class="text-center"><img
              src="@/assets/icons/free-animated-icon-settings-87-unscreen.gif"
              style="width: 50px"
            ></span>
            <input
              v-model="state.restaurantTitle"
              class="ml-3 mt-1 px-3 py-2 bg-slate-50 text-slate-900 placeholder-zinc-300 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md text-xl focus:ring-1"
              type="text"
              disabled
            >
          </div>
        </div>
        <div class="ml-4 flex-shrink-0">
          <button
            class="bg-emerald-500 hover:bg-emerald-600 text-emerald-50 py-2 px-4 rounded"
            @click="logoutAndRedirect"
          >
            Log Out
          </button>
        </div>
      </div>
    </div>
    <!-- <div class="relative flex justify-end px-4">
      <button
        class="flex items-center space-x-1 bg-emerald-500 hover:bg-emerald-600 text-emerald-50 py-2 px-4 rounded w-[150px]"
        @click="toggleDropdown"
      >
        <span>Уведомление</span>
        <svg
          class="w-4 h-4 text-white transform transition-transform"
          :class="{ 'rotate-180': isDropdownOpen }"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fill-rule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 011.32-.083l.094.083a1 1 0 010 1.414l-4 4a1 1 0 01-1.32.083l-.094-.083-4-4a1 1 0 010-1.414z"
            clip-rule="evenodd"
          />
        </svg>
      </button>

      <div
        v-if="isDropdownOpen"
        class="absolute right-0 mt-[55px] w-[270px] bg-white rounded shadow-lg z-10 grid grid-cols-1 gap-4 px-4 py-2"
      >
        <div v-if="notification.length">
          <p class="text-sm font-medium">
            Столик 1
          </p>
          <div
            v-for="notification in notification"
            :key="notification.id"
            class="flex"
          >
            <div class="ml-2">
              <div class="flex">
                <div class="mr-[10px]">
                  {{ notification.title }}
                </div>
                <div class="pr-4">
                  {{ notification.quantity }}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-else> 
          no order
        </div>
      </div>
    </div> -->
  </nav>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import { doc, getDoc } from 'firebase/firestore';

import { db } from '@/firebase/config';
import { reactive, onMounted } from 'vue';

export default {
 setup() {
    const state = reactive({
      restaurantTitle: '',
    });

    const user = JSON.parse(localStorage.getItem('user'));
    const userId = user ? user.uid : null;
    const docRef = doc(db, 'restaurants', userId);

    const getRestaurantSettings = async () => {
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        state.restaurantTitle = data.title;
      } else {
        console.log('Document NOT FOUND ');
      }
    };

    onMounted(() => {
      getRestaurantSettings();
    });

    return { 
      state
    };
  },
    data() {
    return {
      isDropdownOpen: false,
    };
  },
  computed: {
    ...mapGetters(['user', 'notification']),
  },
  methods: {
    ...mapActions(['logout']),
    async logoutAndRedirect() {
      await this.$store.dispatch('logout', { router: this.$router });
    },
    toggleDropdown() {
      this.isDropdownOpen = !this.isDropdownOpen;
    },
  },
};
</script>

<style lang="sass" scoped></style>
