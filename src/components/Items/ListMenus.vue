<template>
    <div>test</div>
</template>
<!-- <template>
  <div class="container">
    <label for="select-items">Выберите элементы:</label>
    <input
      v-model="selectedMenusWithTitle"
      type="text"
      @focus="showMenu"
    >
    <div
      v-show="showMenuList"
      class="item-list"
    >
      <div
        v-for="(item, index) in menuList"
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

const menuList = ref([])
const selected = ref([])
const selectedMenusWithTitle = ref('')
const showMenuList = ref(false)
const itemId = ref(route.params.id)
const emits = defineEmits(['onMenuSelected'])

const getMenuList = async () => {
  const querySnapshot = await getDocs(collection(db, 'menus'))
  const list = []
  querySnapshot.forEach(doc => {
      const getList = {
        id: doc.data().id,
        title: doc.data().title,
        childId: doc.data().childId
      }
      list.push(getList)
      console.log(doc.id, ' => ', doc.data())
  })
  menuList.value = list
  // Get selected items based on childId
  const selectedMenus = list.filter(item => {
    const childId = item.childId.map(child => child.id)
    return childId.indexOf(itemId.value) !== -1
  })
  selected.value = selectedMenus
  console.log(selected.value)
}

onMounted(() => {
  getMenuList()
})

watch(() => route.params.id, newItemId => {
  itemId.value = newItemId
  getMenuList()
})

const showMenu = () => {
  showMenuList.value = true
}

const updateSelection = () => {
  selectedMenusWithTitle.value = selected.value.map(item => item.title).join(', ')
  showMenuList.value = false
  emits('onMenuSelected', selected.value.map(item => ({ id: item.id, title: item.title })))
}

watch(selected, updateSelection)

</script> -->