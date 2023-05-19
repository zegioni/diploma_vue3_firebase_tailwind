<template>
  <div>
    <div
      class="m-auto w-[390px] pl-4"
    >
      <div
        v-if="!showMenuV"
        class="shadow-lg rounded-md h-[48rem] flex flex-col justify-center relative"
        style="display: flex;
    align-items: flex-start;
    justify-content: flex-start;"
      >
        <div
          class="slider"
          style="cursor: pointer;"
        >
          <div
            class="background-img"
            :style="{ transform: `translateX(-${activeIndex.value * 100}%)` }"
          >
            <div
              v-for="(img, index) in restPhoto"
              :key="index"
              :class="{ active: index === activeIndex, next: index === nextIndex, prev: index === prevIndex }"
              class="images"
              :style="{ backgroundImage: `url(${img.url})` }"
            />
          </div>
        </div>
        <div class="bg-white absolutePos text-black rounded-t-[50px] h-[52%]">
          <div class="flex flex-col items-center mb-[15px]">
            <div
              v-for="(img, index) in restLogo"
              :key="index"
              class="rest-logo"
              style="margin-top: 15px;"
            >
              <img
                class="w-[120px]"
                :src="img.url"
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
import { ref, onMounted, computed } from 'vue';
import { getDoc, doc } from 'firebase/firestore';

import { db } from '@/firebase/config';

const title = ref('');
const description = ref('');
const emailAddress = ref('');
const phoneNumber = ref('');
const restLogo = ref([]);
const restPhoto = ref([]);

const user = JSON.parse(localStorage.getItem('user'));
const userId = user ? user.uid : null;
const docRef = doc(db, 'restaurants', userId);

const showMenuV = ref(false);

const getRestaurantData = async () => {
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    // Если документ существует, получите его данные и установите их в значения ввода
    const data = docSnap.data();
    title.value = data.title;
    description.value = data.description;
    emailAddress.value = data.emailAddress;
    phoneNumber.value = data.phoneNumber;
    restLogo.value = data.restLogo;
    restPhoto.value = data.restPhoto;
  } else {
    // Если документ не существует, создайте его и установите начальные значения ввода
    console.log('NO DATA: ');
  }
};

  const activeIndex = ref(0);
    const prevIndex = ref(restPhoto.value.length - 1);
    const nextIndex = ref(1);

    const nextSlide = () => {
      activeIndex.value = (activeIndex.value + 1) % restPhoto.value.length;
      prevIndex.value = (prevIndex.value + 1) % restPhoto.value.length;
      nextIndex.value = (nextIndex.value + 1) % restPhoto.value.length;
    };

    const previousSlide = () => {
      activeIndex.value =
        (activeIndex.value - 1 + restPhoto.value.length) % restPhoto.value.length;
      prevIndex.value =
        (prevIndex.value - 1 + restPhoto.value.length) % restPhoto.value.length;
      nextIndex.value =
        (nextIndex.value - 1 + restPhoto.value.length) % restPhoto.value.length;
    };

    const currentImage = computed(() => restPhoto.value[activeIndex.value]);

    const startSlideShow = () => {
      setInterval(nextSlide, 3000); // Переключение слайда каждые 3 секунды (настраиваемое)
    };

onMounted(() => {
  getRestaurantData();
        if (restPhoto.value.length > 0) {
        startSlideShow(); // Запуск слайдера только если есть изображения
      }
});
</script>

<style lang="scss" scoped>

.homeDescription::-webkit-scrollbar {
  display: none; /* для скрытия полосы прокрутки в Chrome, Safari и Opera */
}

.slider {
  width: 100%;
  overflow: hidden;
}

.background-img {
  display: flex;
  transition: transform 1s ease;
}

.active {
  display: block !important;
  animation: slide-in 1s;
}

.next {
  animation: slide-next 1s;
}

.prev {
  animation: slide-prev 1s;
}

.images {
  display: none;
  flex-shrink: 0;
  width: 100%;
  height: 100%;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  opacity: 0;
  animation-fill-mode: forwards;
}

@keyframes slide-in {
  0% {
    opacity: 0;
    transform: translateX(100%);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slide-next {
  0% {
    opacity: 0;
    transform: translateX(-100%);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slide-prev {
  0% {
    opacity: 0;
    transform: translateX(100%);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
}

.background-img {
  display: flex;
  width: 374px;
  height: 433px;
  /* Дополнительные стили для скрытия полосы прокрутки в Chrome, Safari и Opera */
  overflow: hidden;
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

.rest-logo img { 
    width: 80px;
    height: 80px;
    border: 2px solid #10b981;
    border-radius: 114px;
}
</style>
