<template>
  <div>
    <div><HorizontalNav /></div>
    <div><VerticalNav /></div>
  </div>
</template>

<script>
import HorizontalNav from '@/components/layouts/HorizontalNav.vue'
import VerticalNav from '@/components/layouts/VerticalNav.vue'

// import ShowPosts from "@/components/Posts/ShowPosts.vue";
// import DeletePost from "@/components/Posts/DeletePost.vue";
// import CreatePost from "@/components/Posts/CreatePost.vue";

export default {
  components: {
    HorizontalNav,
    VerticalNav,
  },
}
</script>

<style lang="sass" scoped></style>
