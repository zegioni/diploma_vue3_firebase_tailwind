<template>
  <div>
    <div
      v-if="showMenu"
      class="m-auto w-[390px] pl-4"
    >
      <div
        class="bg-white shadow-lg rounded-md h-[48rem] flex flex-col justify-center relative"
      >
        <div class="flex-grow">
          <img
            class="absolute h-[300px]"
            src="@/assets/img/bg-rest.jpg"
          >
        </div>
        <div class="bg-white relative text-black rounded-t-[50px] h-[75%]">
          <div class="flex flex-col items-center mb-[50px]">
            <div class="rest-logo">
              <img
                class="w-24 pt-[50px]"
                src="@/assets/logo.png"
                alt=""
              >
            </div>
            <div class="rest-title text-center mt-4">
              {{ title }}
            </div>
            <div
              class="rest-description text-center mt-4 h-[130px] overflow-hidden"
            >
              <p
                class="h-full w-[300px] m-[15px] flex-wrap"
                style="overflow-wrap: anywhere"
              >
                {{ description }}
              </p>
            </div>
          </div>
          <div class="flex flex-col items-center">
            <div
              class="rest-information flex justify-center mt-4 px-15 mb-[15px]"
            >
              <a
                :href="'tel:' + phoneNumber"
                class="rest-phone mr-6"
              >
                <img
                  src="@/assets/img/rest-phone.png"
                  class="w-[35px]"
                  alt=""
                >
              </a>
              <a
                :href="'mailto:' + emailAddress"
                class="rest-email"
              >
                <img
                  src="@/assets/img/rest-email.png"
                  class="w-[35px]"
                  alt=""
                >
              </a>
            </div>
            <div
              class="menu mt-4 text-center bg-emerald-500 hover:bg-emerald-600 text-emerald-50 rounded-full p-2 w-[225px]"
              @click="showMenu = false"
            >
              MENU
            </div>
          </div>
        </div>
      </div>
    </div>

    <div
      v-else
      class="m-auto w-[390px] pl-4"
    >
      <div
        class="bg-white shadow-lg rounded-md h-[48rem] flex flex-col justify-center"
      >
        <div class="bg-gray-300 h-[105px]">
          <div class="header-nav">
            <div class="rest-title">
              {{ title }}
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
          class="bg-white h-[75px] flex justify-between px-[25px] items-center rounded-t-[30px] fixed"
          style="bottom: 33px; width: 375px"
        >
          <div
            style="cursor: pointer;"
            @click="showMenu = true"
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
import { ref, onMounted } from 'vue';
import { collection, getDocs, getDoc, doc } from 'firebase/firestore';

import { db } from '@/firebase/config';

const title = ref('');
const description = ref('');
const emailAddress = ref('');
const phoneNumber = ref('');
const menus = ref([]);

const user = JSON.parse(localStorage.getItem('user'));
const userId = user ? user.uid : null;
const docRef = doc(db, 'restaurants', userId);

const selectedMenu = ref(null);
const itemsIdMenu = ref(null);
const menuDescription = ref(null);

const getRestaurantData = async () => {
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    // Если документ существует, получите его данные и установите их в значения ввода
    const data = docSnap.data();
    title.value = data.title;
    description.value = data.description;
    emailAddress.value = data.emailAddress;
    phoneNumber.value = data.phoneNumber;
  } else {
    // Если документ не существует, создайте его и установите начальные значения ввода
    console.log('NO DATA: ');
  }
};

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
  getRestaurantData();
  getRestaurantMenus();
});

const showMenu = ref(false);

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
