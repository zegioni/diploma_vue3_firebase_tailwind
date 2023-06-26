<template>
  <div
    class="template"
    style="white-space: nowrap;"
  >
    <div style="margin-bottom: 100px;">
      <div
        v-for="item in store.state.chosenItems"
        :key="item.id"
        class="data-choices"
        style="overflow-x: scroll; white-space: nowrap; scrollbar-width: none;"
      >
        <div class="card-choices-text">
          <div class="choices-text">
            {{ item.title }}
          </div>
        </div>
        <div class="card-choices-data">
          <div class="card-choices-items">
            <div class="card-choices-value">
              <button
                class="choices-value-left flex items-center justify-center rounded-full text-white size-circle"
                @click="decreaseQuantity(item)"
              >
                -
              </button>
              <div class="choices-value-center">
                {{ item.quantity || 1 }}
              </div>
              <button
                class="choices-value-right flex items-center justify-center rounded-full text-white size-circle"
                @click="increaseQuantity(item)"
              >
                +
              </button>
            </div>
            <div class="choices-price">
              $ {{ item.totalPrice ? item.totalPrice : item.price }}
            </div>
          </div>
        </div>
      </div>
      <div
        v-if="totalOrderPrice > 0"
        class="order"
      >
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
</template>

<script setup>
import { computed } from 'vue';

import { useStore } from 'vuex';

const store = useStore();

const sendNotification = () => {
  store.commit('setNotification', store.state.chosenItems);
};

const increaseQuantity = item => {
  item.quantity++;
  item.totalPrice = item.price * item.quantity;
  store.commit('updateChosenItems', store.state.chosenItems);
};

const decreaseQuantity = item => {
  if (item.quantity > 1) {
    item.quantity--;
    item.totalPrice = item.price * item.quantity;
    store.commit('updateChosenItems', store.state.chosenItems);
  } else {
    removeItem(item);
  }
};

const removeItem = item => {
  const index = store.state.chosenItems.findIndex(i => i.id === item.id);
  if (index !== -1) {
    store.state.chosenItems.splice(index, 1);
    store.commit('updateChosenItems', store.state.chosenItems);
  }
};

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

</script>

<style lang="scss" scoped>

.template {
  height: 695px;
}

.size-circle {
  width: 35px;
  height: 35px;
}

.data-choices {
    background-color: white;
    margin: 15px;
    padding: 15px;
    height: auto;
    color: black;
    border-radius: 24px;
}

.card-choices-text {
    margin-bottom: 10px;
}
.choices-text {
    font-size: 18px;
    font-weight: 600;
}
.card-choices-data {
    font-size: 20px;
}
.card-choices-items {
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.card-choices-value {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    align-items: center;
}
.choices-value-left {
    background-color: #10b981;
    color: white;
}

.choices-value-center {
    margin-right: 10px;
    margin-left: 10px;
}

.choices-value-right {
    background-color: #10b981;
    color: white;
}
.choices-price {
    background-color: transparent;
}

.order {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: space-between;
    align-items: center;
    background-color: #10b981;
    border-radius: 24px;
    padding: 15px;
    margin: 15px;
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

</style>