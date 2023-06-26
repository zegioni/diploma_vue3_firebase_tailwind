<template>
  <div>
    <router-view />
  </div>
</template>

<script>
export default {};
</script>

<style lang="sass">
body
  background-color: #e2e8f0
  color: #0f172a

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
