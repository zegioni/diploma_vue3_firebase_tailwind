<template>
  <div class="w-11/12 mx-auto mt-4 bg">
    <router-view />
  </div>
</template>

<script>
export default {}
</script>

<style lang="sass">
body
  background-color: #c7d2fe;
  color: #0f172a

a 
  color: #0f172a !important

.router-link-active
  color: #0f172a

.router-link-exact-active
  color: #0f172a

.text-truncate
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
</style>
