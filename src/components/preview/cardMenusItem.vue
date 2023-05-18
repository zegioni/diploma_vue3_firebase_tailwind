<template>
  <div
    v-if="!itemsIdMenu || itemsIdMenu.length === 0"
    class="m-[15px]"
  >
    <div class="text-center">
      Empty 🥺
    </div>
  </div>
  <div v-else>
    <div style="margin-bottom: 100px;">
      <div class="text-center m-[15px] menu-description">
        {{ descriptionMenu }}
      </div>
      <div
        v-for="(item, index) in items"
        :key="index"
        class="card"
      >
        <div class="card-body">
          <div class="card-img">
            <img
              :src="item.images[0].url"
              alt=""
            >
          </div>
          <div class="card-information">
            <div class="card-title">
              {{ item.title }}
            </div>
            <div class="card-description">
              {{ item.description }}
            </div>
            <div class="card-group">
              <div class="card-price">
                $ {{ item.price }}
              </div>
              <button
                class="card-add"
                :class="{ 'clicked': index === buttonClicked }"
                @click="addToChosenItems(item,index)"
              >
                +
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { watch, ref, onMounted } from 'vue';
import store from '@/store/index';
import {
  collection,
  query,
  where,
  onSnapshot,
  getDocs,
} from 'firebase/firestore';

import { db } from '@/firebase/config';

const props = defineProps({
  itemsIdMenu: {
    type: Array,
    default: () => [],
  },
  descriptionMenu: {
      type: String,
      required: false,
      default: '',
    },
});

let buttonClicked = ref(null);

const addToChosenItems = (item, index) => {
  const existingItem = store.state.chosenItems.find(i => i.id === item.id);
  if (existingItem) {
    existingItem.quantity += 1;
    existingItem.totalPrice = existingItem.price * existingItem.quantity;
  } else {
     store.state.chosenItems.push({ ...item, quantity: 1, price: item.price });
  }

  buttonClicked.value = index;
      setTimeout(() => {
        buttonClicked.value = null;
      }, 500);
};

const itemsIdMenu = ref(props.itemsIdMenu);
const items = ref([]);

watch(
  () => props.itemsIdMenu,
  newValue => {
    console.log('newValue :>> ', newValue);
    itemsIdMenu.value = newValue;
    itemsIdMenu.value &&
      itemsIdMenu.value.forEach(item => {
        items.value = [];
        getItems(item.id);
      });
  }
);


const user = JSON.parse(localStorage.getItem('user'));
const userId = user ? user.uid : null;

const getItems = async id => {
  console.log('id :>> ', id);
  const q = query(collection(db, 'items'), where('id', '==', id));
  const unsubscribe = onSnapshot(q, querySnapshot => {
    const itemsList = [];
    querySnapshot.forEach(doc => {
      const data = doc.data();
      itemsList.push({
        id: doc.id,
        title: data.title,
        description: data.description,
        price: data.price,
        images: data.images
      });
    });
    itemsList.forEach(item => {
      if (!items.value.some(existingItem => existingItem.id === item.id)) {
        items.value.push(item);
      }
    });
  });
};

onMounted(() => {
  // Выполнить функцию getItems для получения элементов при монтировании компонента
  itemsIdMenu.value &&
    itemsIdMenu.value.forEach(item => {
      items.value = [];
      getItems(item.id);
    });
});
</script>

<style lang="scss" scoped>

.clicked {
    transition: 0.5s;
    transform: scale(1.1);
}
.menu-description {
  color: black;
  font-size: 17px;
  font-weight: 500;
  text-align: left;
}
.card-body {
  background-color: white;
  margin: 15px;
  height: auto;
  display: flex;
  color: black;
  border-radius: 24px;
}
.card-img {
  width: 105px;
  margin-top: 15px;
  margin-left: 15px;
  margin-bottom: 15px;
}
.card-img img {
    width: 80px;
    height: 80px;
  border-radius: 15px;
  object-fit: cover;
}

.card-information {
  width: 90%;
  margin-top: 10px;
  margin-left: 10px;
  margin-bottom: 10px;
}
.card-title {
  font-size: 17px;
  font-weight: 700;
}
.card-description {
  font-size: 13px;
  font-weight: 400;
}
.card-group {
  display: flex;
  justify-content: space-between;
  margin-right: 10px;
}
.card-price {
  font-size: 17px;
  font-weight: 400;
}
.card-add {
  font-size: 17px;
  font-weight: 400;
  background-color: #10b981;
  color: white;
  width: 35px;
  height: 35px;
  border-radius: 50px;
  text-align: center;
}
</style>
