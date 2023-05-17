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
          style="overflow-y: scroll; white-space: nowrap; scrollbar-width: none;"
        >
          <cardMenusItem
            :items-id-menu="itemsIdMenu"
            :description-menu="menuDescription"
            @addItem="addItemToChoice"
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
          <div class="quantity" v-if="totalQuantity >= 1">
            {{ totalQuantity }}
          </div>
          <img
            class="w-[35px]"
            :src="currentNavItem === 'choice' ? require('@/assets/img/choiceActive.svg') : require('@/assets/img/choice.svg')"
            alt=""
          >
        </div>
      </div>
      <div
        v-if="currentNavItem === 'choice'"
        class="shadow-lg rounded-md h-[48rem] flex flex-col justify-start"
        style="background-color: #e2e8f0;"
      >
        <div class="header-choices">
          <div class="header-item-choices flex items-center">
            <button
              class="header-choices-back flex items-center justify-center rounded-full text-white w-10 h-10"
              @click="navigate('menu')"
            >
              &lt;
            </button>
            <div class="header-choices-text flex-grow flex items-center justify-center">
              Your Choices
            </div>
          </div>
        </div>
        <Choice />
        <div class="order">
          <div class="order-text">
            Total
          </div>
          <div class="order-price">
            <div class="order-price-symbol">
              $
            </div>
            <div class="order-price-price">
              {{ totalOrderPrice }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import cardMenusItem from '@/components/preview/cardMenusItem.vue';
import store from '@/store/index';
import Choice from './Choice.vue';
import { ref, onMounted, defineProps, computed } from 'vue';
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
    currentNavItem.value = 'choice';
  }
};

function addItemToChoice(item) {
  // Запись выбранного айтема в хранилище
  store.commit('setSelectedItem', item);
}

const totalOrderPrice = computed(() => {
  const chosenItems = store.state.chosenItems;
  let totalPrice = 0;
  
  chosenItems.forEach(item => {
    const itemPrice = item.price !== null ? parseFloat(item.price) : 0;
    const itemTotalPrice = item.totalPrice !== null ? parseFloat(item.totalPrice) : 0;
    totalPrice += itemTotalPrice ? itemTotalPrice : itemPrice;
  });

  return totalPrice;
});
const totalQuantity = computed(() => {
  let total = 0;
  store.state.chosenItems.forEach(item => {
    total += item.quantity || 0;
  });
  return total;
});
</script>

<style lang="scss" scoped>
.rest-menu::-webkit-scrollbar {
  display: none; /* Hide the scrollbar in Chrome, Safari, and Opera */
}

.quantity {
    position: absolute;
    color: white;
    background-color: black;
    left: 328px;
    top: 8px;
    width: 35px;
    height: 35px;
    text-align: center;
    border: 3px solid white;
    font-size: 19px;
    border-radius: 34px;

}

.itemsList::-webkit-scrollbar {
  display: none;
}

.header-item-choices {
    margin-top: 15px;
}

.header-choices-back {
    margin: 10px;
    box-shadow: 0 2px 14px rgba(0, 0, 0, 0.1);
    background-color: #10b981;
}

.header-choices-text {
    font-size: 24px;
    margin-right: 45px;
    font-weight: 700;
}

.order {
    position: fixed;
    top: 79%;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: space-between;
    align-items: center;
    background-color: #10b981;
    border-radius: 24px;
    padding: 15px;
    margin: 15px;
    width: 344px;
}

.order-text {
    /* Add your styles here */
    color: white;
    font-size: 18px;
    font-weight: 700;
}

.order-price {
    display: flex;
    flex-direction: row;

    color: white;
    font-size: 18px;
}

.order-price-symbol {
  /* Add your styles here */
  margin-right: 2px;
}

.order-price-price {
    /* Add your styles here */
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