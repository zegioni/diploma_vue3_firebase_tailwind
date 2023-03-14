<template>
  <nav class="bg-zinc-700 shadow-lg mx-15 px-15 py-4 rounded-md">
    <div class="max-w- px-4">
      <div class="flex justify-between">
        <div class="flex-shrink-0">
          <div class="flex items-center h-full">
            <span class="text-center"><img src="@/assets/icons/free-animated-icon-settings-87-unscreen.gif" style="width: 50px;"></span>
            <input
              class="ml-3 mt-1 px-3 py-2 bg-zinc-600 text-emerald-50 placeholder-zinc-300 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md text-xl focus:ring-1"
              type="email"
              value="Resturant"
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
  </nav>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  computed: {
    ...mapGetters(['user']),
  },
  methods: {
    ...mapActions(['logout']),
    async logoutAndRedirect() {
      await this.$store.dispatch('logout', { router: this.$router });
    },
  },
};
</script>

<style lang="sass" scoped></style>
