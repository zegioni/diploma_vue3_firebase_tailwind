<template>
  <div class="container mx-auto mb-2">
    <input
      id="select-items"
      v-model="selectedItemsWithTitle"
      type="text"
      name="select-items"
      readonly
      class="mt-1 px-3 py-2 bg-indigo-300 border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md sm:text-sm focus:ring-1"
      @focus="showItems"
      @blur="hideItems"
    >
    <div
      v-show="showItemList"
      class="mt-4 border border-gray-300 rounded-md shadow-sm"
    >
      <template v-if="itemList.length">
        <div
          v-for="(item, index) in itemList"
          :key="index"
          class="px-4 py-3"
        >
          <label
            :for="`item-${index}`"
            class="flex items-center justify-between"
          >
            <span class="text-lg font-medium text-gray-700">{{
              item.title
            }}</span>
            <input
              :id="`item-${index}`"
              v-model="selected"
              type="checkbox"
              :value="item"
              class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              @change="updateSelection"
            >
          </label>
        </div>
      </template>
      <template v-else>
        <div class="px-4 py-3 text-gray-500">
          No such items
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { defineEmits, onMounted, watch } from 'vue'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '@/firebase/config'
import { useRoute } from 'vue-router'

const route = useRoute()

const itemList = ref([])
const selected = ref([])
const selectedItemsWithTitle = ref('')
const showItemList = ref(false)
const menuId = ref(route.params.id)
const emits = defineEmits(['on-item-selected'])

const getItemList = async () => {
  const querySnapshot = await getDocs(collection(db, 'items'))
  const list = []
  querySnapshot.forEach(doc => {
    const getList = {
      id: doc.data().id,
      title: doc.data().title,
      parentId: doc.data().parentId,
    }
    list.push(getList)
    //console.log(doc.id, ' => ', doc.data())
  })
  itemList.value = list
  // Get selected items based on parentId
  const selectedItems = list.filter(item => {
    // const parentIds = item.parentId.map(parent => parent.id)
    const parentIds = Array.isArray(item.parentId)
      ? item.parentId.map(parent => parent.id)
      : []
    return parentIds.indexOf(menuId.value) !== -1
  })
  selected.value = selectedItems
  //console.log('selected.value', selected.value)
}

onMounted(() => {
  getItemList()
})

watch(
  () => route.params.id,
  newMenuId => {
    menuId.value = newMenuId
    getItemList()
  }
)

const showItems = () => {
  showItemList.value = true
}

const updateSelection = () => {
  selectedItemsWithTitle.value = selected.value
    .map(item => item.title)
    .join(', ')
  showItemList.value = false
  emits(
    'on-item-selected',
    selected.value.map(item => ({ id: item.id, title: item.title }))
  )
}

watch(selected, updateSelection)

const hideItems = () => {
  setTimeout(() => {
    showItemList.value = false
  }, 200)
}
</script>
