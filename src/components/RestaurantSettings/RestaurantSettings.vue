<template>
  <div class="grow">
    <nav class="ml-4 mb-4">
      <div class="bg-slate-100 shadow-lg rounded-md">
        <div class="py-4 px-5">
          <div class="flex justify-evenly">
            <input
              id="RestaurantTitle"
              v-model="restaurantTitle"
              class="mt-1 px-3 py-2 bg-slate-50 text-slate-900 placeholder-zinc-300 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md text-xl focus:ring-1"
              type="text"
              placeholder="Restaurant Name"
            >
          </div>
        </div>
      </div>
    </nav>
    <nav class="ml-4">
      <div class="bg-slate-100 shadow-lg rounded-md">
        <div class="py-4 px-5">
          <div class="flex justify-evenly flex-col">
            <label class="mb-2">Restaurant Description</label>
            <input
              v-model="restaurantDescription"
              class="mt-1 px-3 py-2 bg-slate-50 text-slate-900 placeholder-slate-300 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md text-xl focus:ring-1"
              type="email"
              placeholder="Restaurant Description"
            >
            <label class="mb-2">Restaurant Address</label>
            <input
              v-model="restaurantEmailAddress"
              class="mt-1 px-3 py-2 bg-slate-50 text-slate-900 placeholder-slate-300 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md text-xl focus:ring-1"
              type="email"
              placeholder="Restaurant E-mail"
            >
            <label class="mb-2">Restaurant Phone Number</label>
            <input
              v-model="restaurantPhoneNumber"
              class="mt-1 px-3 py-2 bg-slate-50 text-slate-900 placeholder-slate-300 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md text-xl focus:ring-1"
              type="phone"
              placeholder="Restaurant Phone"
            >
            <label class="mb-2">Restaurant Type</label>
            <input
              v-model="restaurantType"
              class="mt-1 px-3 py-2 bg-slate-50 text-slate-900 placeholder-slate-300 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md text-xl focus:ring-1"
              type="text"
              placeholder="Restaurant Type"
            >
            <label class="mb-2">Type of Cuisine</label>
            <input
              v-model="cuisineType"
              class="mt-1 px-3 py-2 bg-slate-50 text-slate-900 placeholder-slate-300 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md text-xl focus:ring-1"
              type="text"
              placeholder="Restaurant Type of Cuisine"
            >
          </div>
        </div>
      </div>
    </nav>
    <nav class="ml-4 mt-4">
      <div class="bg-slate-100 shadow-lg rounded-md">
        <div class="py-4 px-5">
          <div class="flex flex-col items-center">
            <button
              class="space-y-2 border-2 rounded-lg border-emerald-500 p-2 w-[15rem]"
              @click="saveRestaurantSettings"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </nav>
  </div>
</template>

<script setup>
import {
  doc,
  getDoc,
  setDoc,
  updateDoc
} from 'firebase/firestore';

import { db, auth } from '@/firebase/config';
import { ref, onMounted } from 'vue';

const restaurantTitle = ref('');
const restaurantDescription = ref('');
const restaurantEmailAddress = ref('');
const restaurantPhoneNumber = ref('');
const restaurantType = ref('');
const cuisineType = ref('');

const user = JSON.parse(localStorage.getItem('user'));
const userId = user ? user.uid : null;
const docRef = doc(db, 'restaurants', userId);

const getRestaurantSettings = async () => {
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    // Если документ существует, получите его данные и установите их в значения ввода
    const data = docSnap.data();
    restaurantTitle.value = data.title;
    restaurantDescription.value = data.description;
    restaurantEmailAddress.value = data.emailAddress;
    restaurantPhoneNumber.value = data.phoneNumber;
    restaurantType.value = data.type;
    cuisineType.value = data.cuisine;
  } else {
    // Если документ не существует, создайте его и установите начальные значения ввода
    await setDoc(docRef, {
      title: 'New Restaurant',
      description: '',
      emailAddress: '',
      phoneNumber: '',
      type: '',
      cuisine: '',
      createdBy: user.uid,
      createdAt: new Date(),
    });
    console.log('Document created with ID: ', docRef.id);
  }
};

const saveRestaurantSettings = async () => {
  const user = auth.currentUser;
  const restaurantRef = doc(db, 'restaurants', user.uid);
  await updateDoc(restaurantRef, {
    title: restaurantTitle.value,
    description: restaurantDescription.value,
    emailAddress: restaurantEmailAddress.value,
    phoneNumber: restaurantPhoneNumber.value,
    type: restaurantType.value,
    cuisine: cuisineType.value,
  });
  console.log('Document updated');
};

onMounted(() => {
  getRestaurantSettings();
});

</script>

<style lang="scss" scoped></style>
