<template>
  <nav
    v-if="itemId"
    class="ml-4 grow w-full"
  >
    <div v-if="item">
      <div class="bg-slate-100 shadow-lg rounded-md">
        <div class="flex justify-between p-4 space-y-2 mb-2">
          <div
            class="grow"
            space-y-2
            mb-2
          >
            <input
              id="title"
              v-model="item.title"
              class="mt-1 px-3 py-2 bg-slate-50 text-slate-900 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md text-xl focus:ring-1"
              type="text"
            >
          </div>
          <div class="flex">
            <button
              type="button"
              class="ml-2"
              @click="deleteItem(item)"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
      <div class="bg-slate-100 shadow-lg rounded-md">
        <div class="p-4 space-y-2 mb-2">
          <div class="">
            <div class="space-y-2 mb-2">
              Description
            </div>
            <div class="space-y-2 mb-2">
              <input
                id="title"
                v-model="item.description"
                type="text"
                class="mt-1 px-3 py-2 bg-slate-50 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md sm:text-sm focus:ring-1"
              >
            </div>
            <div class="space-y-2 mb-2">
              Price
            </div>
            <div class="space-y-2 mb-2">
              <input
                id="title"
                v-model="item.price"
                type="text"
                class="mt-1 px-3 py-2 bg-slate-50 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md sm:text-sm focus:ring-1"
              >
            </div>
            <div class="space-y-2 mb-2">
              IMG
            </div>
            <div class="space-y-2 mb-2">
              <uploadImg :itemId="item.id" @imageAdded="handleImageAdded" />
            </div>
          </div>
        </div>
      </div>
      <nav class="mt-4">
        <div class="bg-slate-100 shadow-lg rounded-md">
          <div class="py-4 px-5">
            <div class="flex flex-col items-center">
              <button
                class="space-y-2 border-2 rounded-lg border-emerald-500 p-2 w-[15rem]"
                @click="saveChange(item)"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </nav>
    </div>
  </nav>
  <div
    v-else
    class="grow"
  >
    <p class="pr-4 p-4">
      Select a item to see details
    </p>
  </div>
</template>

<script setup>
import uploadImg from '../uploadImg.vue';

import {
  doc,
  getDoc,
  getDocs,
  writeBatch,
  updateDoc,
  arrayUnion,
  collection,
} from 'firebase/firestore';
import { ref, watch, onMounted} from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { db } from '@/firebase/config';
import { toast } from 'vue3-toastify';

const route = useRoute();
const router = useRouter();
const itemId = ref(route.params.id);
const item = ref(null);
const parent = ref([]);
const images = ref([]);

    const handleImageAdded = imageObjects => {
      images.value = imageObjects; // сохраняем данные изображений в свойство item.images
    };

watch(parent, (newValue, oldValue) => {
  console.log(
    'parent value change out oldValue: ',
    oldValue,
    'to newValue: ',
    newValue
  );
});

const getItem = async () => {
  try {
    const docRef = doc(db, 'items', itemId.value);
    const itemDoc = await getDoc(docRef);
    if (!itemDoc.exists()) {
      //console.log('No such document!')
    } else {
      item.value = itemDoc.data();
      if (itemDoc.data().images) {
        // Проверяем, есть ли изображения для элемента
        item.images = itemDoc.data().images;
      }
    }
  } catch (err) {
    console.log(err);
  }
};

onMounted(() => {
  if (itemId.value) {
    getItem();
  }
});

watch(
  () => route.params.id,
  newId => {
    itemId.value = newId;
    if (newId) {
      getItem();
    } else {
      //console.log('not such item')
    }
  },
  { immediate: true }
);

const deleteItem = async item => {
    try {
    const batch = writeBatch(db);
    batch.delete(doc(db, 'items', item.id));

    const MenusRef = collection(db, 'menus');
    const querySnapshot = await getDocs(MenusRef);
    console.log(querySnapshot, 'snapshot');
    const promises = querySnapshot.docs.map(async doc => {
      const childId = doc.data().childId;
      console.trace(childId);
      const indexToRemove = childId.findIndex(item => item.id === item.id);
      if (indexToRemove !== -1) {
        const newChildId= [
          ...childId.slice(0, indexToRemove),
          ...childId.slice(indexToRemove + 1),
        ];
        return updateDoc(doc.ref, { childId: newChildId });
      }
    });
    await Promise.all(promises);

    await batch.commit();
    router.push('/menus-management');
    toast.success('Item Delete!', {
      autoClose: 700,
      theme: 'dark',
    });
  } catch (error) {
    console.error(error);
    toast.error('Item Delete Error!', {
      autoClose: 700,
      theme: 'dark',
    });
  }
};

const saveChange = async item => {
    const parentIds = parent.value
    .filter(item => item !== undefined)
    .map(item => item.id);
    try {
    const batch = writeBatch(db);
    const itemDocRef = doc(db, 'items', item.id);
    const itemDocSnap = await getDoc(itemDocRef);
    if (itemDocSnap.exists()) {
      batch.update(itemDocRef, {
        title: item.title,
        description: item.description,
        price: item.price,
        images: images.value,
        updatedAt: new Date(),
      });

      await batch.commit();
      parent.value = [];
      toast.success('Save Success!', {
      autoClose: 700,
      theme: 'dark',
    });
    }
  } catch (error) {
    console.error(error);
    toast.error('Save Error!', {
      autoClose: 700,
      theme: 'dark',
    });
  }
};
</script>

<style lang="sass" scoped></style>
