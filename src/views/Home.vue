<template>
  <div
    v-if="posts"
    class="mt-4"
  >
    <h3 class="text-xl underline text-center">
      Posts
    </h3>
    <div class="text-center">
      <RouterLink
        class="text-xl underline text-center ml-1"
        to="/post-management"
      >
        Post Management
      </RouterLink>
    </div>

    <div>
      <div
        v-for="post in posts"
        :key="post.id"
        class="mt-4 mb-4 box"
      >
        <h2>{{ post.title }}</h2>
        <p>{{ post.description }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useCollection } from 'vuefire';
import { collection } from 'firebase/firestore';
import { db } from '@/firebase/config';

const posts = useCollection(collection(db, 'posts'));
</script>

<style lang="sass" scoped>
.box 
  margin-right: 15px;
  margin-left: 15px;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
  padding: 15px;
</style>
