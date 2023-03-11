<template>
  <div class="relative">
    <input
      v-model="selectedItemsTitle"
      type="text"
      class="mt-1 px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md sm:text-sm focus:ring-1"
      placeholder="Select a item"
      @focus="state.isOpen = true"
      @blur="onBlur"
    >
    <div
      v-if="state.isOpen"
      class="absolute top-12 left-0 w-full max-h-60 overflow-y-auto border shadow-sm border-slate-300 rounded-md bg-white z-50"
    >
      <ul class="py-1">
        <li
          v-for="item in filteredItems"
          :key="item.id"
          class="px-3 py-2 hover:bg-gray-200 cursor-pointer"
        >
          <label class="flex items-center">
            <input
              type="checkbox"
              class="form-checkbox h-5 w-5 text-sky-500"
              :checked="isSelected(item)"
              @change="onToggleSelect(item)"
            >
            <span class="ml-2 text-sm font-medium text-gray-700">{{ item.title }}</span>
          </label>
        </li>
      </ul>
    </div>
  </div>
</template>
<script setup>
import { useCollection, useDocument } from 'vuefire'
import { collection } from 'firebase/firestore'
import { db } from '@/firebase/config'
import { ref, reactive, computed } from 'vue'
import { doc } from 'firebase/firestore'

const items = useCollection(collection(db, 'menus'))

const state = reactive({
  isOpen: false,
  selectedItems: [],
})

const selectedItemsTitle = computed(() => {
  return state.selectedItems.map(item => item.title).join(', ')
})

const filteredItems = computed(() => {
  if (!state.searchTerm) {
    return items.value
  }
  return items.value.filter(item =>
    item.title.toLowerCase().includes(state.searchTerm.toLowerCase())
  )
})

const onToggleSelect = item => {
  const index = state.selectedItems.findIndex(selectedItem => selectedItem.id === item.id)
  if (index === -1) {
    state.selectedItems.push(item)
  } else {
    state.selectedItems.splice(index, 1)
  }
}

const isSelected = item => {
  return state.selectedItems.some(selectedItem => selectedItem.id === item.id)
}

const onBlur = () => {
  setTimeout(() => {
    state.isOpen = false
  }, 200)
}
</script>
<style lang="sass" scoped>
li:hover 
  background-color: #f5f5f5;
</style>