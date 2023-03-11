<template>
  <nav
    v-if="itemId"
    class="ml-4 grow"
  >
    <div v-if="item">
      <div class="bg-white shadow-lg">
        <div class="flex justify-between p-4 space-y-2 mb-2">
          <div
            class="flex"
            space-y-2
            mb-2
          >
            <input
              id="title"
              v-model="item.title"
              class="mt-1 px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block rounded-md sm:text-sm focus:ring-1"
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
      <div class="bg-white shadow-lg">
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
                class="mt-1 px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md sm:text-sm focus:ring-1"
              >
            </div>

            <div class="space-y-2 mb-2">
              Add item to items
            </div>
            <div class="space-y-2 mb-2">
              <listItem />
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
    class="text-center pr-4 p-4 grow"
  >
    <p>Select a item to see details</p>
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
const itemId = ref(route.params.id)
console.log(itemId)


const item = ref(null)

const getItem = async () => {
  try {
    const docRef = doc(db, 'items', itemId.value)
    const itemDoc = await getDoc(docRef)
    if (!itemDoc.exists()) {
      console.log('No such items!')
    } else {
      item.value = itemDoc.data()
    }
  } catch (err) {
    console.log(err)
  }
}

onMounted(() => {
  if (itemId.value) {
    getItem()
  }
})


watch(() => route.params.id, newId => {
  itemId.value = newId
  if(newId) {
    getItem()
  } else {
    console.log('not such item')
  }
}, { immediate: true })

const deleteItem = async item => {
  try {
    toast('Item Deleted !', {
      autoClose: 1000,
    })
    await deleteDoc(doc(db, 'items', item.id))
    router.push('/menus-management')
  } catch (error) {
    console.error(error)
    toast('Error !', {
      autoClose: 1000,
    })
  }
}

const saveChange = async item => {
  try {
    await updateDoc(doc(db, 'items', item.id), {
      title: item.title,
      description: item.description,
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
