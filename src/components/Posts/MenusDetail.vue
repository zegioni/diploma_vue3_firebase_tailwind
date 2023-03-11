<template>
  <nav
    v-if="menuId"
    class="ml-4 grow"
  >
    <div v-if="menu">
      <div class="bg-white shadow-lg">
        <div class="flex justify-between p-4 space-y-2 mb-2">
          <div
            class="flex"
            space-y-2
            mb-2
          >
            <input
              id="title"
              v-model="menu.title"
              class="mt-1 px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block rounded-md sm:text-sm focus:ring-1"
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
      <div class="bg-white shadow-lg">
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
                class="mt-1 px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md sm:text-sm focus:ring-1"
              >
            </div>

            <div class="space-y-2 mb-2">
              Add item to menus
            </div>
            <div class="space-y-2 mb-2">
              <listItem />
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
import listItem from '@/components/Posts/ListItems.vue'

import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore'
import { ref, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { db } from '@/firebase/config'
import { toast } from 'vue3-toastify'

const route = useRoute()
const router = useRouter()
const menuId = ref(route.params.id)
console.log(menuId)


const menu = ref(null)

const getMenu = async () => {
  try {
    const docRef = doc(db, 'menus', menuId.value)
    const menuDoc = await getDoc(docRef)
    if (!menuDoc.exists()) {
      console.log('No such document!')
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


watch(() => route.params.id, newId => {
  menuId.value = newId
  if(newId) {
    getMenu()
  } else {
    console.log('not such menu')
  }
}, { immediate: true })

const deleteMenu = async menu => {
  try {
    toast('Menu Deleted !', {
      autoClose: 1000,
    })
    await deleteDoc(doc(db, 'menus', menu.id))
    router.push('/menus-management')
  } catch (error) {
    console.error(error)
    toast('Error !', {
      autoClose: 1000,
    })
  }
}

const saveChange = async menu => {
  try {
    await updateDoc(doc(db, 'menus', menu.id), {
      title: menu.title,
      description: menu.description,
      updatedAt: new Date(),
    })
    toast('Wow so easy !', {
      autoClose: 1000,
    })
  } catch (error) {
    console.error(error)
    toast('FUCK!', {
      autoClose: 1000,
    })
  }
}
</script>

<style lang="sass" scoped></style>
