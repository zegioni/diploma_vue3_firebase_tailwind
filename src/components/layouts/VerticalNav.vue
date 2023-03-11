<!-- eslint-disable prettier/prettier -->
<template>
  <nav class="flex my-8">
    <div class="bg-white shadow-lg">
      <div class="text-center p-4">
        Admin
      </div>
      <div class="w-230">
        <router-link
          to="/menus-management"
          class="space-y-2 mb-2 w-full w-230 bg-purple-500 p-2 block" 
        >
          Menus
        </router-link>
      </div>
    </div>
    <ShowPosts />
  </nav>
</template>

<script>
import ShowPosts from '../Posts/ShowData.vue'

export default {
  components: {
    ShowPosts,
  },
}
</script>

<style lang="sass" scoped>
/* Specific styles for the vertical menu */
.w-230
  width: 230px


.shadow-lg
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)


.py-8
  padding-top: 2rem
  padding-bottom: 2rem


.px-4
  padding-left: 1rem
  padding-right: 1rem


.text-gray-700
  color: #4a5568


.hover\:text-gray-900:hover
  color: #1a202c
</style>
