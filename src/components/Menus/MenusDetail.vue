<template>
  <nav
    v-if="menuId"
    class="ml-4 grow"
  >
    <div v-if="menu">
      <div class="bg-indigo-50 shadow-lg">
        <div class="flex justify-between p-4 space-y-2 mb-2">
          <div
            class="grow"
            space-y-2
            mb-2
          >
            <input
              id="title"
              v-model="menu.title"
              class="mt-1 px-3 py-2 bg-indigo-300 border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md text-xl focus:ring-1"
              type="text"
            >
          </div>
          <div class="flex">
            <button
              type="button"
              class="ml-2"
              @click="deleteMenu(menu)"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
      <div class="bg-indigo-50 shadow-lg">
        <div class="p-4 space-y-2 mb-2">
          <div class="">
            <div class="space-y-2 mb-2">
              Description
            </div>
            <div class="space-y-2 mb-2">
              <input
                id="title"
                v-model="menu.description"
                type="text"
                class="mt-1 px-3 py-2 bg-indigo-300 border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md sm:text-sm focus:ring-1"
              >
            </div>

            <div class="space-y-2 mb-2">
              Add item to menus
            </div>
            <div class="space-y-2 mb-2">
              <listItem @on-item-selected="onItemSelected" />
            </div>

            <button @click="saveChange(menu)">
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  </nav>
  <div
    v-else
    class="text-center pr-4 p-4 grow"
  >
    <p>Select a menu to see details</p>
  </div>
</template>

<script setup>
import listItem from '@/components/Menus/ListItems.vue'
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
  update,
} from 'firebase/firestore'
import { ref, watch, onMounted, computed } from 'vue'
import { useCollection, useDocument } from 'vuefire'
import { useRoute, useRouter } from 'vue-router'
import { db } from '@/firebase/config'
import { toast } from 'vue3-toastify'

const route = useRoute()
const router = useRouter()
const menuId = ref(route.params.id)
const menu = ref(null)
const child = ref([])

const onItemSelected = selected => {
  //console.log('selected onItemSelected', selected)
  child.value = selected.map(item => ({ id: item.id, title: item.title }))
}

const getMenu = async () => {
  try {
    const docRef = doc(db, 'menus', menuId.value)
    const menuDoc = await getDoc(docRef)
    if (!menuDoc.exists()) {
      //console.log('No such document!')
    } else {
      menu.value = menuDoc.data()
    }
  } catch (err) {
    console.log(err)
  }
}

onMounted(() => {
  if (menuId.value) {
    getMenu()
  }
})

watch(
  () => route.params.id,
  newId => {
    menuId.value = newId
    if (newId) {
      getMenu()
    } else {
      //console.log('not such menu')
    }
  },
  { immediate: true }
)

const deleteMenu = async menu => {
  try {
    const batch = writeBatch(db)
    batch.delete(doc(db, 'menus', menu.id))

    const itemsRef = collection(db, 'items')
    const querySnapshot = await getDocs(itemsRef)
    querySnapshot.forEach(async doc => {
      const parentId = doc.data().parentId
      const indexToRemove = parentId.findIndex(item => item.id === menu.id)
      if (indexToRemove !== -1) {
        const newParentId = [
          ...parentId.slice(0, indexToRemove),
          ...parentId.slice(indexToRemove + 1),
        ]
        await updateDoc(doc.ref, { parentId: newParentId })
      }
    })

    await batch.commit()
    router.push('/menus-management')
    toast('Menu Deleted !', {
      autoClose: 1000,
    })
  } catch (error) {
    console.error(error)
    toast('Error !', {
      autoClose: 1000,
    })
  }
}

const saveChange = async menu => {
  const childIds = child.value
    .filter(item => item !== undefined)
    .map(item => item.id)
  //console.log('childIds', childIds)
  try {
    const batch = writeBatch(db)
    batch.update(doc(db, 'menus', menu.id), {
      title: menu.title,
      description: menu.description,
      updatedAt: new Date(),
      childId: childIds.map(id => ({ id })),
    })

    const itemsRef = collection(db, 'items')
    const querySnapshot = await getDocs(itemsRef)
    querySnapshot.forEach(async doc => {
      const parentId = doc.data().parentId
      const indexToUpdate = parentId.findIndex(item => item.id === menu.id)
      if (indexToUpdate !== -1) {
        const newParentId = [
          ...parentId.slice(0, indexToUpdate),
          ...parentId.slice(indexToUpdate + 1),
        ]
        await updateDoc(doc.ref, { parentId: newParentId })
      }
    })

    const validChildIds = childIds.filter(id => id !== undefined)
    validChildIds.forEach(id => {
      batch.update(doc(db, 'items', id), {
        parentId: arrayUnion({ id: menu.id, title: menu.title }),
      })
    })

    const itemsRef2 = collection(db, 'items')
    const querySnapshot2 = await getDocs(itemsRef2)
    querySnapshot2.forEach(async doc => {
      const parentId = doc.data().parentId
      //console.log(`Document with ID ${doc.id} has parentId ${JSON.stringify(parentId)}`)
      if (!parentId.length) {
        await updateDoc(doc.ref, { parentId })
      } else {
        const indexToUpdate = parentId.findIndex(item => item.id === menu.id)
        if (indexToUpdate !== -1) {
          const newParentId = [
            ...parentId.slice(0, indexToUpdate),
            ...parentId.slice(indexToUpdate + 1),
          ]
          //console.log(`Document with ID ${doc.id} has parentId ${JSON.stringify(newParentId)} after removing ${menu.id}`)
          batch.update(doc.ref, { parentId: newParentId })
        }
      }
    })
    await batch.commit()
    child.value = []
    toast('Success', {
      autoClose: 1000,
    })
  } catch (error) {
    console.error(error)
    toast('Error', {
      autoClose: 1000,
    })
  }
}
</script>

<style lang="sass" scoped></style>
