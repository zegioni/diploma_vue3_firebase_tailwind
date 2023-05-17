<template>
  <div
    class="template"
    style="overflow-y: scroll; white-space: nowrap; scrollbar-width: none; margin-bottom: 80px; padding-bottom: 65px;"
  >
    <div
      class="scroll"
    >
      <div
        v-for="item in store.state.chosenItems"
        :key="item.id"
        class="data-choices"
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
    </div>
    <!-- <div style="white-space: normal;">
      {{ store.state.chosenItems }}
    </div> -->
  </div>
</template>

<script setup>
import store from '@/store/index';

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

</script>

<style lang="scss" scoped>

.size-circle {
  width: 35px;
  height: 35px;
}
.template::-webkit-scrollbar {
  display: none;
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

</style>