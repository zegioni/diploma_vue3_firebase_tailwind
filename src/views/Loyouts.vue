<template>
  <div class="w-11/12 mx-auto mt-4 bg">
    <div><HorizontalNav /></div>
    <div><VerticalNav /></div>
  </div>
</template>

<script>
import HorizontalNav from '@/components/layouts/HorizontalNav.vue';
import VerticalNav from '@/components/layouts/VerticalNav.vue';

export default {
  components: {
    HorizontalNav,
    VerticalNav,
  },
};
</script>

<style lang="sass" scoped></style>
