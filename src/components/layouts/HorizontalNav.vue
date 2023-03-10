<template>
  <nav class="bg-white shadow-lg mx-15 px-15 py-4">
    <div class="max-w-7xl mx-auto px-4">
      <div class="flex justify-between">
        <div class="flex-shrink-0">
          <div class="flex items-center h-full">
            <span class="text-center">Nikita</span>
            <RouterLink
              to="/post-view"
              class="ml-1"
            >
              POSTS
            </RouterLink>
          </div>
        </div>
        <div class="ml-4 flex-shrink-0">
          <button
            class="bg-gray-800 hover:bg-gray-700 text-white py-2 px-4 rounded"
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
import { mapGetters, mapActions } from 'vuex'

export default {
  computed: {
    ...mapGetters(['user']),
  },
  methods: {
    ...mapActions(['logout']),
    async logoutAndRedirect() {
      await this.$store.dispatch('logout', { router: this.$router })
    },
  },
}
</script>

<style lang="sass" scoped></style>
