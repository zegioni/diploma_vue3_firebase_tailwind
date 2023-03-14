<template>
  <div class="w-11/12 mx-auto mt-4 bg">
    <router-view />
  </div>
</template>

<script>
export default {};
</script>

<style lang="sass">
body
  background-color: #18181b
  color: #f0fdfa

a 
  color: #f0fdfa !important

.router-link-active
  color: #f0fdfa
  background-color: #10b981

.router-link-exact-active
  color: #f0fdfa
  background-color: #10b981


.text-truncate
  white-space: nowrap
  overflow: hidden
  text-overflow: ellipsis
</style>
