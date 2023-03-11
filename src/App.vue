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
  background-color: #f8f8f8;

.router-link-active
  color: #f8f8f8;

.router-link-exact-active
  color: #f8f8f8;

.text-truncate
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
</style>
