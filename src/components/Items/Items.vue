<template>
  <div>
    <div class="text-center">
      <button
        class="space-y-2 mb-4 border-2 rounded-lg border-emerald-500 p-2 w-[15rem]"
        @click="createItem"
      >
        Create Item
      </button>
    </div>
    <div
      v-if="items"
      class="space-y-2 mb-2 flex flex-col"
    >
      <router-link
        v-for="item in showItem()"
        :key="item.id"
        :to="`/menus-management/items/${item.id}`"
        class="text-truncate p-2"
        :class="{
          'space-y-2 bg-emerald-500': item.id === activeItem,
          'text-emerald-50': item.id !== activeItem,
        }"
        @click="open(item)"
      >
        {{ item.title }}
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

const items = useCollection(collection(db, 'items'));
const route = useRoute();
const activeItem = ref(null);

const showItem = () => {
  if (items.value) {
    const sortedItem = [...items.value].sort((a, b) => {
      const dateA = a.updatedAt ? a.updatedAt.toDate() : a.createdAt.toDate();
      const dateB = b.updatedAt ? b.updatedAt.toDate() : b.createdAt.toDate();
      return dateB - dateA;
    });
    return sortedItem;
  }
  return null;
};

const createItem = async () => {
  const user = auth.currentUser;
  try {
    toast('Item Created !', {
      autoClose: 1000,
    });
    const itemRef = collection(db, 'items');
    const newItem = {
      id: '',
      parentId: [],
      title: 'New Item',
      description: '',
      createdAt: new Date(),
      createdBy: user.uid,
    };
    const docRef = await addDoc(itemRef, newItem);
    await updateDoc(docRef, { id: docRef.id });
    newItem.id = docRef.id;
    router.push({ name: 'items-detail', params: { id: newItem.id } });
    open(newItem);
  } catch (error) {
    console.log(error);
    toast('Item Created Error !', {
      autoClose: 1000,
    });
  }
};

const state = reactive({
  selected: null,
});

const open = item => {
  state.selected = item;
  activeItem.value = item.id;
  router.push({ name: 'items-detail', params: { id: item.id } });
};

onMounted(async () => {
  try {
    const itemId = route.params.id;
    if (itemId) {
      const itemDocRef = doc(db, 'items', itemId);
      const itemDoc = await getDoc(itemDocRef);
      if (itemDoc.exists()) {
        const itemData = itemDoc.data();
        state.selected = itemData;
        open(itemData);
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
      activeItem.value = null;
    }
  }
);
</script>

<style lang="sass" scoped></style>
