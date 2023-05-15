<template>
  <div v-if="!itemsIdMenu || itemsIdMenu.length === 0">
    <div class="text-center">
      Nothing is selected or the menu is empty
    </div>
  </div>
  <div v-else>
    <div class="text-center m-[15px] menu-description">
      {{ descriptionMenu }}
    </div>
    <div
      v-for="item in items"
      :key="item.id"
      class="card"
    >
      <div class="card-body">
        <div class="card-img">
          <img
            src="https://placehold.jp/72x72.png"
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
            <div class="card-add">
              +
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { watch, ref, onMounted } from 'vue';
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

const itemsIdMenu = ref(props.itemsIdMenu);
const items = ref([]);

watch(
  () => props.itemsIdMenu,
  newValue => {
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
        price: data.price
      });
    });
    itemsList.forEach(item => {
      if (!items.value.some(existingItem => existingItem.id === item.id)) {
        items.value.push(item);
      }
    });
  });
};
</script>

<style lang="scss" scoped>
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
  width: 72px;
  margin-top: 15px;
  margin-left: 15px;
  margin-bottom: 15px;
}
.card-img img {
  border-radius: 15px;
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
  border-radius: 50px;
  text-align: center;
}
</style>
