<template>
  <div>
    <div
      class="m-auto w-[390px] pl-4"
    >
      <div
        v-if="!showMenuV"
        class="shadow-lg rounded-md h-[48rem] flex flex-col justify-center relative"
      >
        <div class="flex-grow images" />
        <div class="bg-white absolutePos text-black rounded-t-[50px] h-[52%]">
          <div class="flex flex-col items-center mb-[15px]">
            <div class="rest-logo">
              <img
                class="w-[120px]"
                src="@/assets/logo.png"
                alt=""
              >
            </div>
            <div class="rest-title text-center mt-4">
              {{ title }}
            </div>
            <div
              class="rest-description text-center mt-4 h-[50px] overflow-hidden"
            >
              <p
                class="h-full w-[350px] flex-wrap homeDescription"
                style="overflow-wrap: anywhere display: flex; overflow-y: scroll; scrollbar-width: none; padding-left: 15px; padding-right: 15px;"
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
                v-if="phoneNumber"
                :href="'tel:' + phoneNumber"
                class="rest-phone mr-6"
              >
                <img
                  src="@/assets/img/rest-phone.svg"
                  class="w-[35px]"
                  alt=""
                >
              </a>
              <a
                v-if="emailAddress"
                :href="'mailto:' + emailAddress"
                class="rest-email"
              >
                <img
                  src="@/assets/img/rest-email.svg"
                  class="w-[35px]"
                  alt=""
                >
              </a>
            </div>
            <div
              class="menu mt-4 text-center bg-emerald-500 hover:bg-emerald-600 text-emerald-50 rounded-full p-2 w-[225px]"
              style="cursor: pointer;"
              @click="showMenuV = true"
            >
              MENUS
            </div>
          </div>
        </div>
      </div>
      <div v-else>
        <MenuV
          :menu-title="title"
          @closeMenuV="showMenuV = false"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import MenuV from './MenuV.vue';
import { ref, onMounted } from 'vue';
import { getDoc, doc } from 'firebase/firestore';

import { db } from '@/firebase/config';

const title = ref('');
const description = ref('');
const emailAddress = ref('');
const phoneNumber = ref('');

const user = JSON.parse(localStorage.getItem('user'));
const userId = user ? user.uid : null;
const docRef = doc(db, 'restaurants', userId);

const showMenuV = ref(true);

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

onMounted(() => {
  getRestaurantData();
});
</script>

<style lang="scss" scoped>

.homeDescription::-webkit-scrollbar {
  display: none; /* для скрытия полосы прокрутки в Chrome, Safari и Opera */
}
.images {
  background-image: url(@/assets/img/bg-rest.jpg);
  background-position: center;
  background-repeat: no-repeat;
  background-position-y: -100px;
  background-size: contain;
}

.absolutePos {
  position: absolute;
  width: 100%;
  top: 48%;
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
