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
              Add item to menus
            </div>
            <div class="space-y-2 mb-2">
              <!-- <listMenus @on-menu-selected="onItemSelected" /> -->
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
import listMenus from '@/components/Items/ListMenus.vue'

import { doc, getDoc, getDocs, writeBatch, arrayRemove, onSnapshot,updateDoc, arrayUnion, collection, where, query } from 'firebase/firestore'
import { ref, watch, onMounted } from 'vue'
import { useCollection, useDocument } from 'vuefire'
import { useRoute, useRouter } from 'vue-router'
import { db } from '@/firebase/config'
import { toast } from 'vue3-toastify'

const route = useRoute()
const router = useRouter()
const itemId = ref(route.params.id)


const item = ref(null)
const child = ref([])

const onItemSelected = selected => {
  console.log('selected', selected)
  child.value = selected
}
watch(child.value, (newValue, oldValue) => {
  console.log('child changed', newValue, oldValue)
})

const getItem = async () => {
  try {
    const docRef = doc(db, 'items', itemId.value)
    const itemDoc = await getDoc(docRef)
    if (!itemDoc.exists()) {
      console.log('No such document!')
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
    console.log('not such menu')
  }
}, { immediate: true })

const deleteItem = async item => {
  try {
    const batch = writeBatch(db)

    // Удаление элемента item из коллекции items
    batch.delete(doc(db, 'items', route.params.id))

    // Обновление childId в коллекции menus
    const menusRef = collection(db, 'menus')
    const querySnapshot = await getDocs(menusRef)

    querySnapshot.forEach(async doc => {
      const childId = doc.data().childId
      const indexToRemove = childId.findIndex(item => item.itemId === route.params.id)

      if (indexToRemove !== -1) {
        childId.splice(indexToRemove, 1)
        await updateDoc(doc.ref, { childId })
      }
    })

    await batch.commit()

    router.push('/menus-management')
    toast('Menu Deleted!', { autoClose: 1500 })
  } catch (error) {
    console.error(error)
  }
}


const saveChange = async menu => {
  const childIds = child.value.map(item => item.id)
  console.log('childIds', childIds)
  try {
    const batch = writeBatch(db)
    batch.update(doc(db, 'menus', menu.id), {
      title: menu.title,
      description: menu.description,
      updatedAt: new Date(),
      childId: child.value.map(item => ({ id: item.id, title: item.title }))
    })
    childIds.forEach(id => {
      batch.update(doc(db, 'items', id), {
        parentId: arrayUnion({id: menu.id, title: menu.title})
      })
    })
    await batch.commit()
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
