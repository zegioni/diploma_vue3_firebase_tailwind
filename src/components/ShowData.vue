<template>
  <div class="flex">
    <nav class="h-[48rem] flex ml-4">
      <div class="bg-slate-100 shadow-lg w-72 rounded-md">
        <div class="py-4 px-5">
          <div class="flex justify-evenly">
            <button
              :class="{
                'border-b-4 border-b-emerald-500 w-[7.75rem]':
                  activeButton === 'menus',
              }"
              class="w-[7.75rem]"
              @click="open('menus')"
            >
              Menus
            </button>
            <button
              class="w-[7.75rem]"
              :class="{
                'border-b-4 border-b-emerald-500 w-[7.75rem]':
                  activeButton === 'items',
              }"
              @click="open('items')"
            >
              Items
            </button>
          </div>
        </div>
        <div v-if="activeButton === 'menus'">
          <menus />
        </div>
        <div v-if="activeButton === 'items'">
          <items />
        </div>
      </div>
    </nav>
    <MenuDetail v-if="activeButton === 'menus'" />
    <ItemsDetail v-if="activeButton === 'items'" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

import menus from '@/components/Menus/Menus.vue';
import items from '@/components/Items/Items.vue';
import MenuDetail from '@/components/Menus/MenusDetail.vue';
import ItemsDetail from '@/components/Items/ItemsDetail.vue';
import router from '@/router';

const activeButton = ref('menus');
const route = useRoute();

const open = click => {
  if (click === 'menus') {
    activeButton.value = 'menus';
    router.push('/menus-management');
  } else {
    activeButton.value = 'items';
    router.push('/menus-management');
  }
};

onMounted(() => {
  try {
    const { id, type } = route.params;
    if (type === 'menus') {
      router.push(`/menus-management/menus/${id}`);
    } else if (type === 'items') {
      router.push(`/menus-management/items/${id}`);
    }
  } catch (error) {
    console.error(error);
  }
});
</script>

<style lang="sass" scoped></style>
