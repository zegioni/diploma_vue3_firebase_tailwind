<template>
  <div class="template">
    <div class="header-сhoices">
      <div class="header-item-choices flex items-center">
        <button class="header-сhoices__back flex items-center justify-center rounded-full text-white w-10 h-10">
          &lt;
        </button>
        <div class="header-сhoices__text flex-grow flex items-center justify-center">
          Your Choices
        </div>
      </div>
    </div>
    <div class="data-choices">
      <div class="card-choices__text">
        <div class="choices__text">
          Text
        </div>
      </div>
      <div class="card-choices__data">
        <div class="card-choices__items">
          <div class="card-choices__value">
            <button class="choices__value__left flex items-center justify-center rounded-full text-white w-10 h-10">
              -
            </button>
            <div class="choices__value__center">
              30
            </div>
            <button class="choices__value__right flex items-center justify-center rounded-full text-white w-10 h-10">
              +
            </button>
          </div>
          <div class="choices__price">
            $0.50
          </div>
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

.header-сhoices__back {
    margin: 10px;
    box-shadow: 0 2px 14px rgba(0, 0, 0, 0.1);
    background-color: #10b981;
}

.header-сhoices__text {
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

.card-choices__text {
    margin-bottom: 10px
}
.choices__text {
    font-size: 18px;
    font-weight: 600;
}
.card-choices__data {
    font-size: 20px;
}
.card-choices__items {
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.card-choices__value {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    align-items: center;
}
.choices__value__left {
    background-color: #10b981;
    color: white;
}

.choices__value__center {
    margin-right: 10px;
    margin-left: 10px;
}

.choices__value__right {
    background-color: #10b981;
    color: white;
}
.choices__price {
    background-color: transparent;
}

</style>