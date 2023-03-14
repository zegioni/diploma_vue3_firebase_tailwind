<template>
  <div class="grow">
    <nav class="ml-4 mb-4">
      <div class="bg-zinc-700 shadow-lg rounded-md">
        <div class="py-4 px-5">
          <div class="flex justify-evenly">
            <input
              id="RestaurantTitle"
              class="mt-1 px-3 py-2 bg-zinc-500 text-emerald-50 placeholder-zinc-300 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md text-xl focus:ring-1"
              type="text"
              placeholder="Restaurant Name"
            >
          </div>
        </div>
      </div>
    </nav>
    <nav class="ml-4">
      <div class="bg-zinc-700 shadow-lg rounded-md">
        <div class="py-4 px-5">
          <div class="flex justify-evenly flex-col">
            <label class="mb-4">Business Information</label>
            <label class="mb-2">Restaurant Address</label>
            <input
              class="mt-1 px-3 py-2 bg-zinc-500 text-emerald-50 placeholder-zinc-300 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md text-xl focus:ring-1"
              type="email"
            >
            <label class="mb-2">Restaurant Phone Number</label>
            <input
              class="mt-1 px-3 py-2 bg-zinc-500 text-emerald-50 placeholder-zinc-300 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md text-xl focus:ring-1"
              type="phone"
            >
            <label class="mb-2">Restaurant Type</label>
            <input
              class="mt-1 px-3 py-2 bg-zinc-500 text-emerald-50 placeholder-zinc-300 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md text-xl focus:ring-1"
              type="text"
            >
            <label class="mb-2">Type(s) of Cuisine</label>
            <input
              class="mt-1 px-3 py-2 bg-zinc-500 text-emerald-50 placeholder-zinc-300 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md text-xl focus:ring-1"
              type="text"
            >
          </div>
        </div>
      </div>
    </nav>
  </div>
</template>

<script setup>

</script>

<style lang="scss" scoped>

</style>