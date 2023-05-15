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
          'text-slate-900': item.id !== activeItem,
        }"
        @click="open(item)"
      >
        {{ item.title }}
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { collection, getDoc, doc, addDoc, updateDoc, query, where, onSnapshot } from 'firebase/firestore';
import { db, auth } from '@/firebase/config';
import router from '@/router';
import { useRoute } from 'vue-router';
import { reactive, onMounted } from 'vue';
import { ref, watch } from 'vue';
import { toast } from 'vue3-toastify';

const user = JSON.parse(localStorage.getItem('user'));
const userId = user ? user.uid : null;

const items = ref([]);

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
    toast.success('Item Create Success!', {
      autoClose: 700,
      theme: 'dark',
    });
    const itemRef = collection(db, 'items');
    const newItem = {
      id: '',
      parentId: [],
      title: 'New Item',
      description: '',
      price: null,
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
    toast.error('Item Create Error!', {
      autoClose: 700,
      theme: 'dark',
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
    const q = query(collection(db, 'items'), where('createdBy', '==', userId));
  const unsubscribe = onSnapshot(q, querySnapshot => {
    const itemList = [];
    querySnapshot.forEach(doc => {
      const data = doc.data();
      itemList.push({
        id: doc.id,
        parentId: data.parentId,
        title: data.title,
        description: data.description,
        price: data.price,
        createdAt: data.createdAt,
        createdBy: data.createdBy,
      });
    });
    items.value = itemList;
  });
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
   return unsubscribe;
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
