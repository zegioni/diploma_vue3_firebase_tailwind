<template>
  <div>
    <div class="m-auto w-[390px] pl-4">
      <div
        v-if="currentNavItem === 'menu'"
        class="shadow-lg rounded-md h-[48rem] flex flex-col justify-center"
        style="background-color: #e2e8f0;"
      >
        <div class="h-[110px] mt-2 mb-2">
          <div class="header-nav">
            <div class="rest-title">
              <div>{{ menuTitle }}</div>
            </div>
          </div>
          <div
            ref="menuContainer"
            class="rest-menu"
            style="display: flex; overflow-x: scroll; white-space: nowrap; scrollbar-width: none; padding-left: 15px; padding-right: 15px;"
            @mousedown="onMouseDown"
            @mousemove="onMouseMove"
            @mouseup="onMouseUp"
          >
            <div
              v-for="menu in menus"
              :key="menu.id"
              class="rest-menu-btn"
              :class="{ 'rest-menu-btn--selected': menu === selectedMenu }"
            >
              <span class="rest-menu-btn__text">
                <div
                  style="cursor: pointer"
                  @click="selectMenu(menu)"
                >
                  {{ menu.title }}
                </div>
              </span>
            </div>
          </div>
        </div>
        <div
          class="flex-grow itemsList"
          style="overflow-x: scroll; white-space: nowrap; scrollbar-width: none;"
        >
          <cardMenusItem
            :items-id-menu="itemsIdMenu"
            :description-menu="menuDescription"
          />
        </div>
      </div>
      <div
        class="bg-white h-[75px] flex justify-between px-[25px] items-center rounded-t-[30px]"
        style="bottom: 33px; width: 375px; position: absolute;"
      >
        <div
          style="cursor: pointer;"
          @click="$emit('closeMenuV')"
        >
          <img
            class="w-[35px]"
            src="@/assets/img/home.svg"
            alt=""
          >
        </div>
        <div
          style="cursor: pointer;"
          @click="navigate('menu')"
        >
          <img
            class="w-[35px]"
            :src="currentNavItem === 'menu' ? require('@/assets/img/menuActive.svg') : require('@/assets/img/menu.svg')"
            alt=""
          >
        </div>
        <div
          style="cursor: pointer;"
          @click="navigate('choice')"
        >
          <img
            class="w-[35px]"
            :src="currentNavItem === 'choice' ? require('@/assets/img/choiceActive.svg') : require('@/assets/img/choice.svg')"
            alt=""
          >
        </div>
      </div>
      <div
        v-if="currentNavItem === 'choice'"
        class="shadow-lg rounded-md h-[48rem] flex flex-col justify-center"
        style="background-color: #e2e8f0;"
      >
        <div class="flex-grow">
          <Choice />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import cardMenusItem from '@/components/preview/cardMenusItem.vue';
import Choice from './Choice.vue';
import { ref, onMounted, defineProps } from 'vue';
import { collection, getDocs, getDoc, doc } from 'firebase/firestore';
import { db } from '@/firebase/config';

const props = defineProps({
  menuTitle: {
    type: String,
    required: true,
  },
});

const menus = ref([]);
const selectedMenu = ref(null);
const itemsIdMenu = ref(null);
const menuDescription = ref(null);

const user = JSON.parse(localStorage.getItem('user'));
const userId = user ? user.uid : null;
const docRef = doc(db, 'restaurants', userId);

const getRestaurantMenus = async () => {
  const querySnapshot = await getDocs(collection(db, 'menus'));
  const list = [];
  querySnapshot.forEach(doc => {
    const createdBy = doc.data().createdBy;
    if (createdBy === userId) {
      const getList = {
        title: doc.data().title,
        description: doc.data().description,
        id: doc.data().id,
        childId: doc.data().childId
      };
      list.push(getList);
    } else {
      console.log('no such item');
    }
  });
  menus.value = list;
};

onMounted(() => {
  getRestaurantMenus();
});


function selectMenu(menu) {
  selectedMenu.value = menu;
  itemsIdMenu.value = menu.childId;
  menuDescription.value = menu.description;
}

const menuContainer = ref(null);
let isDragging = false;
let startX = 0;
let scrollLeft = 0;

function onMouseDown(event) {
  if (!menuContainer.value) return;
  isDragging = true;
  startX = event.pageX - menuContainer.value.offsetLeft;
  scrollLeft = menuContainer.value.scrollLeft;
}

function onMouseMove(event) {
  if (!menuContainer.value || !isDragging) return;
  event.preventDefault();
  const x = event.pageX - menuContainer.value.offsetLeft;
  const walk = (x - startX) * 1.5;
  menuContainer.value.scrollLeft = scrollLeft - walk;
}

function onMouseUp() {
  isDragging = false;
}

const currentNavItem = ref('menu');

const navigate = navItem => {
  if(navItem == 'menu') {
    currentNavItem.value = 'menu';
  } else {
    selectedMenu.value = [];
    itemsIdMenu.value = [];
    menuDescription.value = '';
    currentNavItem.value = 'choice';
  }
};
</script>

<style lang="scss" scoped>
.rest-menu::-webkit-scrollbar {
  display: none; /* Hide the scrollbar in Chrome, Safari, and Opera */
}

.itemsList::-webkit-scrollbar {
  display: none;
}

.rest-menu-btn--selected {
  background-color: #4fd6aa !important; /* Styles for the selected menu */
}

.header-nav {
  margin-left: 15px;
  margin-right: 15px;
  margin-top: 15px;
  margin-bottom: 15px;
  color: black;
}

.rest-title {
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 10px;
}

.rest-menu {
  display: flex;
}

.rest-menu-btn {
  margin-right: 15px;
  background-color: #10b981;
  padding: 10px;
  border-radius: 22px;
  width: auto;
  text-align: center;
}

.rest-menu-btn__text {
  font-size: 15px;
  color: white;
}
</style>