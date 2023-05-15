<template>
  <div>
    <div
      class="m-auto w-[390px] pl-4"
    >
      <div
        class="bg-white shadow-lg rounded-md h-[48rem] flex flex-col justify-center"
      >
        <div class="bg-gray-300 h-[105px]">
          <div class="header-nav">
            <div class="rest-title">
              <div>{{ menuTitle }}</div>
            </div>
            <div class="rest-menu">
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
        </div>
        <div class="flex-grow bg-gray-300">
          <cardMenusItem
            :items-id-menu="itemsIdMenu"
            :description-menu="menuDescription"
          />
        </div>
        <div
          class="bg-white h-[75px] flex justify-between px-[25px] items-center rounded-t-[30px]"
          style="bottom: 33px; width: 375px"
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
          <div style="cursor: pointer;">
            <img
              class="w-[35px]"
              src="@/assets/img/menu.svg"
              alt=""
            >
          </div>
          <div style="cursor: pointer;">
            <img
              class="w-[35px]"
              src="@/assets/img/choice.svg"
              alt=""
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import cardMenusItem from '@/components/preview/cardMenusItem.vue';
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
</script>

<style lang="scss" scoped>
.rest-menu-btn--selected {
  background-color: red !important; /* здесь можно задать стили для выделенного меню */
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
  margin-right: 10px;
  background-color: #10b981;
  padding: 7px;
  border-radius: 20px;
  width: 120px;
  text-align: center;
  &__text {
    font-size: 15px;
    color: white;
  }
}
</style>