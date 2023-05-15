<template>
  <div class="template">
    <div class="header-choices">
      <div class="header-item-choices flex items-center">
        <button class="header-choices-back flex items-center justify-center rounded-full text-white w-10 h-10">
          &lt;
        </button>
        <div class="header-choices-text flex-grow flex items-center justify-center">
          Your Choices
        </div>
      </div>
    </div>
    <div class="data-choices">
      <div class="card-choices-text">
        <div class="choices-text">
          Text
        </div>
      </div>
      <div class="card-choices-data">
        <div class="card-choices-items">
          <div class="card-choices-value">
            <button class="choices-value-left flex items-center justify-center rounded-full text-white w-10 h-10">
              -
            </button>
            <div class="choices-value-center">
              30
            </div>
            <button class="choices-value-right flex items-center justify-center rounded-full text-white w-10 h-10">
              +
            </button>
          </div>
          <div class="choices-price">
            $0.50
          </div>
        </div>
      </div>
    </div>
    <div class="order">
      <div class="order-text">
        Total
      </div>
      <div class="order-price">
        <div class="order-price-symbol">
          $
        </div>
        <div class="order-price-price">
          5
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>

</script>

<style lang="scss" scoped>
.header-item-choices {
    margin-top: 5px;
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
  position: relative;
  top: 420px;

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