<!-- eslint-disable prettier/prettier -->
<template>
  <nav class="flex my-8 h-[48rem]">
    <div class="bg-zinc-700 shadow-lg rounded-md">
      <div class="text-center p-4">
        Admin
      </div>
      <div class="w-230">
        <router-link
          to="/menus-management"
          class="space-y-2 mb-2 w-full w-230 p-2 block"
        >
          Menus
        </router-link>
      </div>
      <div class="w-230">
        <router-link
          to="/restaurant-settings"
          class="space-y-2 mb-2 w-full w-230 p-2 block"
        >
          Restaurant
        </router-link>
      </div>
    </div>
    <div v-if="$route.path.includes('/menus-management')">
      <ShowData />
    </div>
    <div
      v-if="$route.path.includes('/restaurant-settings')"
      class="grow"
    >
      <RestaurantSettings />
    </div>
  </nav>
</template>

<script>
import ShowData from '@/components/ShowData.vue';
import RestaurantSettings from '@/components/RestaurantSettings/RestaurantSettings.vue';

export default {
  components: {
    ShowData,
    RestaurantSettings,
  },
};
</script>

<style lang="sass" scoped>
/* Specific styles for the vertical menu */
.w-230
  width: 230px


.shadow-lg
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)


.py-8
  padding-top: 2rem
  padding-bottom: 2rem


.px-4
  padding-left: 1rem
  padding-right: 1rem


.text-gray-700
  color: #4a5568


.hover\:text-gray-900:hover
  color: #1a202c
</style>
