<template>
  <div class="container">
    <label for="select-items">Выберите элементы:</label>
    <input
      v-model="selectedItemsWithTitle"
      type="text"
      @focus="showItems"
    >
    <div
      v-show="showItemList"
      class="item-list"
    >
      <div
        v-for="(item, index) in itemList"
        :key="index"
      >
        <input
          :id="`item-${index}`"
          v-model="selected"
          type="checkbox"
          :value="item"
          @change="updateSelection"
        >
        <label :for="`item-${index}`">{{ item.title }}</label>
      </div>
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
const emits = defineEmits(['onItemSelected'])

const getItemList = async () => {
  const querySnapshot = await getDocs(collection(db, 'items'))
  const list = []
  querySnapshot.forEach(doc => {
      const getList = {
        id: doc.data().id,
        title: doc.data().title,
        parentId: doc.data().parentId
      }
      list.push(getList)
      console.log(doc.id, ' => ', doc.data())
  })
  itemList.value = list
    // Get selected items based on parentId
  const selectedItems = list.filter(item => {
    // const parentIds = item.parentId.map(parent => parent.id)
    const parentIds = Array.isArray(item.parentId) ? item.parentId.map(parent => parent.id) : []
    return parentIds.indexOf(menuId.value) !== -1
  })
  selected.value = selectedItems
  console.log(selected.value)
}

onMounted(() => {
  getItemList()
})

watch(() => route.params.id, newMenuId => {
  menuId.value = newMenuId
  getItemList()
})

const showItems = () => {
  showItemList.value = true
}

const updateSelection = () => {
  selectedItemsWithTitle.value = selected.value.map(item => item.title).join(', ')
  showItemList.value = false
  emits('onItemSelected', selected.value.map(item => ({ id: item.id, title: item.title })))
}

watch(selected, updateSelection)

</script>