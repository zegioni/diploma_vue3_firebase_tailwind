<template>
  <div>
    <div class="text-center">
      <button
        class="space-y-2 mb-4 border-2 rounded-lg border-emerald-500 p-2 w-[15rem]"
        @click="createMenu"
      >
        Create Menu
      </button>
    </div>
    <div
      v-if="menus"
      class="space-y-2 mb-2 flex flex-col"
    >
      <router-link
        v-for="menu in showMenu()"
        :key="menu.id"
        :to="`/menus-management/menus/${menu.id}`"
        class="text-truncate p-2"
        :class="{
          'space-y-2 bg-emerald-500': menu.id === activeMenu,
          'text-emerald-50': menu.id !== activeMenu,
        }"
        @click="open(menu)"
      >
        {{ menu.title }}
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { useCollection } from 'vuefire';
import { collection, getDoc, doc, addDoc, updateDoc } from 'firebase/firestore';
import { db, auth } from '@/firebase/config';
import router from '@/router';
import { useRoute } from 'vue-router';
import { reactive, onMounted } from 'vue';
import { ref, watch } from 'vue';
import { toast } from 'vue3-toastify';

const menus = useCollection(collection(db, 'menus'));
const route = useRoute();
const activeMenu = ref(null);

const showMenu = () => {
  if (menus.value) {
    const sortedMenus = [...menus.value].sort((a, b) => {
      const dateA = a.updatedAt ? a.updatedAt.toDate() : a.createdAt.toDate();
      const dateB = b.updatedAt ? b.updatedAt.toDate() : b.createdAt.toDate();
      return dateB - dateA;
    });
    return sortedMenus;
  }
  return null;
};

const createMenu = async () => {
  const user = auth.currentUser;
  try {
    toast('Menu Created !', {
      autoClose: 1000,
    });
    const menuRef = collection(db, 'menus');
    const newMenu = {
      id: '',
      childId: [],
      title: 'New Menu',
      description: '',
      createdAt: new Date(),
      createdBy: user.uid,
    };
    const docRef = await addDoc(menuRef, newMenu);
    await updateDoc(docRef, { id: docRef.id });
    newMenu.id = docRef.id;
    router.push({ name: 'menus-detail', params: { id: newMenu.id } });
    open(newMenu);
  } catch (error) {
    console.log(error);
    toast('Menu Created Error !', {
      autoClose: 1000,
    });
  }
};

const state = reactive({
  selected: null,
});

const open = menu => {
  state.selected = menu;
  activeMenu.value = menu.id;
  router.push({ name: 'menus-detail', params: { id: menu.id } });
};

onMounted(async () => {
  try {
    const menuId = route.params.id;
    if (menuId) {
      const menuDocRef = doc(db, 'menus', menuId);
      const menuDoc = await getDoc(menuDocRef);
      if (menuDoc.exists()) {
        const menuData = menuDoc.data();
        state.selected = menuData;
        open(menuData);
      } else {
        //console.log('No such menu!')
        router.push('/menus-management');
      }
    }
  } catch (error) {
    console.error(error);
  }
});

watch(
  () => route.path,
  newVal => {
    if (newVal === '/menus-management') {
      activeMenu.value = null;
    }
  }
);
</script>

<style lang="sass" scoped></style>
