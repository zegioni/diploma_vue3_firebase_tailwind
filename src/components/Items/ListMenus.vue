<template>
  <div class="container mx-auto mb-2">
    <input
      id="select-menus"
      v-model="selectedMenusWithTitle"
      type="text"
      name="select-menus"
      readonly
      class="mt-1 px-3 py-2 bg-zinc-500 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md sm:text-sm focus:ring-1"
      @focus="showMenus"
      @blur="hideMenus"
    >
    <div
      v-show="showMenuList"
      class="mt-4 border border-zinc-500 rounded-md shadow-sm"
    >
      <template v-if="menuList.length">
        <div
          v-for="(menu, index) in menuList"
          :key="index"
          class="px-4 py-3"
        >
          <label
            :for="`menu-${index}`"
            class="flex menus-center justify-between"
          >
            <span class="text-lg font-medium text-emerald-50">{{ menu.title }}</span>
            <input
              :id="`menu-${index}`"
              v-model="selected"
              type="checkbox"
              :value="menu"
              class="h-4 w-4 text-zinc-500 focus:ring-indigo-500 rounded"
              @change="updateSelection"
            >
          </label>
        </div>
      </template>
      <template v-else>
        <div class="px-4 py-3 text-emerald-50">
          No such menus
        </div>
      </template>
    </div>
  </div>
</template>


<script setup>
import { ref } from 'vue';
import { defineEmits, onMounted, watch } from 'vue';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/firebase/config';
import { useRoute } from 'vue-router';

const route = useRoute();

const menuList = ref([]);
const selected = ref([]);
const selectedMenusWithTitle = ref('');
const showMenuList = ref(false);
const itemId = ref(route.params.id);
const emits = defineEmits(['on-menu-selected']);

const getMenuList = async () => {
  const querySnapshot = await getDocs(collection(db, 'menus'));
  const list = [];
  querySnapshot.forEach(doc => {
      const getList = {
        id: doc.data().id,
        title: doc.data().title,
        childId: doc.data().childId
      };
      list.push(getList);
      //console.log(doc.id, ' => ', doc.data())
  });
  menuList.value = list;
  // Get selected menus based on parentId
  const selectedMenus = list.filter(item => {
  // const parentIds = menu.parentId.map(parent => parent.id)
  const childIds = Array.isArray(item.childId) ? item.childId.map(child => child.id) : [];
  return childIds.indexOf(itemId.value) !== -1;
  });
  selected.value = selectedMenus;
};

onMounted(() => {
  getMenuList();
});

watch(() => route.params.id, newItemId => {
  itemId.value = newItemId;
  getMenuList();
});

const showMenus = () => {
  showMenuList.value = true;
};

const updateSelection = () => {
  selectedMenusWithTitle.value = selected.value.map(item => item.title).join(', ');
  showMenuList.value = false;
  emits('on-menu-selected', selected.value.map(item => ({ id: item.id, title: item.title })));
};

watch(selected, updateSelection);

const hideMenus = () => {
      setTimeout(() => {
       showMenuList.value = false;
      }, 200);
};

</script>