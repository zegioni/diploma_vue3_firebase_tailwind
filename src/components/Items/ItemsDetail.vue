<template>
  <nav
    v-if="itemId"
    class="ml-4 grow w-full"
  >
    <div v-if="item">
      <div class="bg-zinc-700 shadow-lg rounded-md">
        <div class="flex justify-between p-4 space-y-2 mb-2">
          <div
            class="grow"
            space-y-2
            mb-2
          >
            <input
              id="title"
              v-model="item.title"
              class="mt-1 px-3 py-2 bg-zinc-500 text-emerald-50 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md text-xl focus:ring-1"
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
      <div class="bg-zinc-700 shadow-lg rounded-md">
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
                class="mt-1 px-3 py-2 bg-zinc-500 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md sm:text-sm focus:ring-1"
              >
            </div>

            <div class="space-y-2 mb-2">
              Add item to items
            </div>
            <div class="space-y-2 mb-2">
              <listMenus @on-menu-selected="onMenuSelected" />
            </div>

            <button @click="saveChange(item)">
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  </nav>
  <div
    v-else
    class="grow"
  >
    <p class="pr-4 p-4" >Select a item to see details</p>
  </div>
</template>

<script setup>
import listMenus from '@/components/Items/ListMenus.vue';
import {
  doc,
  getDoc,
  getDocs,
  writeBatch,
  arrayRemove,
  onSnapshot,
  updateDoc,
  arrayUnion,
  collection,
  where,
  query,
  deleteDoc,
collectionGroup,
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

const onMenuSelected = selected => {
  parent.value = selected.map(item => ({ id: item.id, title: item.title }));
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
    toast('Menu Deleted !', {
      autoClose: 1000,
    });
  } catch (error) {
    console.error(error);
    toast('Error !', {
      autoClose: 1000,
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
        updatedAt: new Date(),
        parentId: parentIds.map(id => ({ id })),
      });
      const menusRef = collection(db, 'menus');
      const menusQuerySnapshot = await getDocs(menusRef);
      menusQuerySnapshot.forEach(async doc => {
        const childId = doc.data().childId;
        const indexToUpdate = childId.findIndex(
          child => child.id === item.id
        );
        if (indexToUpdate !== -1) {
          const newChildId = [
            ...childId.slice(0, indexToUpdate),
            ...childId.slice(indexToUpdate + 1),
          ];
          await updateDoc(doc.ref, { childId: newChildId });
        }
      });

      const validChildIds = parentIds.filter(id => id !== undefined);
      validChildIds.forEach(id => {
        batch.update(doc(db, 'menus', id), {
          childId: arrayUnion({ id: item.id, title: item.title }),
        });
      });

      const MenusRef = collection(db, 'menus');
      const querySnapshot2 = await getDocs(MenusRef);
      querySnapshot2.forEach(async doc => {
        const childId = doc.data().childId;
        //console.log(`Document with ID ${doc.id} has parentId ${JSON.stringify(parentId)}`)
        if (!childId.length) {
          await updateDoc(doc.ref, { childId });
        } else {
          const indexToUpdate = childId.findIndex(
            item => item.id === item.id
          );
          if (indexToUpdate !== -1) {
            const newChildId = [
              ...childId.slice(0, indexToUpdate),
              ...childId.slice(indexToUpdate + 1),
            ];
            //console.log(`Document with ID ${doc.id} has parentId ${JSON.stringify(newParentId)} after removing ${menu.id}`)
            batch.update(doc.ref, { childId: newChildId });
          }
        }
      });

      await batch.commit();
      parent.value = [];
      toast('Success', {
        autoClose: 1000,
      });
    }
  } catch (error) {
    console.error(error);
    toast('Error', {
      autoClose: 1000,
    });
  }
};
</script>

<style lang="sass" scoped></style>
