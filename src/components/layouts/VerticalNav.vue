<!-- eslint-disable prettier/prettier -->
<template>
  <nav class="flex my-8 h-[53rem]">
    <div class="bg-slate-100 shadow-lg rounded-md">
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
      <div class="w-230">
        <router-link
          to="/menu-preview"
          class="space-y-2 mb-2 w-full w-230 p-2 block"
        >
          Menu Preview
        </router-link>
      </div>
    </div>
    <div
      v-if="$route.path.includes('/menus-management')"
      class="grow"
    >
      <ShowData />
    </div>
    <div
      v-if="$route.path.includes('/restaurant-settings')"
      class="grow"
    >
      <RestaurantSettings />
    </div>
    <div
      v-if="$route.path.includes('/menu-preview')"
      class="grow"
    >
      <nav class="h-[53rem] flex ml-4">
        <div class="bg-slate-100 shadow-lg w-72 rounded-md">
          <div class="py-4 px-5">
            <div class="flex justify-evenly">
              Preview Menu
            </div>
            <div class="text-center">
              <button
                class="space-y-2 mt-4 border-2 rounded-lg border-emerald-500 p-2 w-[15rem]"
              >
                <router-link
                  :to="`/restaurant/${userId}`"
                  class="text-truncate p-2"
                  target="_blank"
                >
                  Link To App
                </router-link>
              </button>
            </div>
          </div>
        </div>
        <div class="ml-4 w-[370px] shadow-lg">
          <MenuPreview />
        </div>
      </nav>
    </div>
  </nav>
</template>

<script>
import ShowData from '@/components/ShowData.vue';
import RestaurantSettings from '@/components/RestaurantSettings/RestaurantSettings.vue';
import MenuPreview from '../preview/HomeV.vue';

export default {
  components: {
    ShowData,
    RestaurantSettings,
    MenuPreview
  },
  setup() {
    // Ваш код и логика компонента
    const user = JSON.parse(localStorage.getItem('user'));
    const userId = user ? user.uid : null;
    console.log('userId :>> ', userId);

    return {
      userId, // возвращаем хранилище в качестве результата функции setup
    };
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
