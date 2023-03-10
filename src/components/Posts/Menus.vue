<template>
  <div class="p-4 space-y-2 mb-2">
    <button @click="createPost">
      Create Post
    </button>
    <div
      v-if="posts"
      class="space-y-2 mb-2 flex flex-col"
    >
      <router-link
        v-for="post in showPost()"
        :key="post.id"
        :to="`/menus-management/menus/${post.id}`"
        class="text-truncate"
        @click="open(post)"
      >
        {{ post.title }}
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { useCollection } from 'vuefire'
import { collection, getDoc, doc, addDoc, updateDoc } from 'firebase/firestore'
import { db, auth } from '@/firebase/config'
import router from '@/router'
import { useRoute } from 'vue-router'
import { reactive, onMounted } from 'vue'
// import { ref } from "vue"
import { toast } from 'vue3-toastify'

const posts = useCollection(collection(db, 'posts'))
const route = useRoute()

const showPost = () => {
  if (posts.value) {
    const sortedPosts = [...posts.value].sort((a, b) => {
      const dateA = a.updatedAt ? a.updatedAt.toDate() : a.createdAt.toDate()
      const dateB = b.updatedAt ? b.updatedAt.toDate() : b.createdAt.toDate()
      return dateB - dateA
    })
    return sortedPosts
  }
  return null
}

const createPost = async () => {
  const user = auth.currentUser
  try {
    toast('Post Created !', {
      autoClose: 1000,
    })
    const postRef = collection(db, 'posts')
    const newPost = {
      id: '',
      title: 'New Title',
      description: '',
      createdAt: new Date(),
      createdBy: user.uid,
    }
    const docRef = await addDoc(postRef, newPost)
    await updateDoc(docRef, { id: docRef.id })
    newPost.id = docRef.id
    router.push({ name: 'menus-detail', params: { id: newPost.id } })
    open(newPost)
  } catch (error) {
    console.log(error)
    toast('Post Error !', {
      autoClose: 1000,
    })
  }
}

const state = reactive({
  selected: null,
})

const open = post => {
  state.selected = post
  router.push({ name: 'menus-detail', params: { id: post.id } })
}

onMounted(async () => {
  try {
    const postId = route.params.id
    if (postId) {
      const postDocRef = doc(db, 'posts', postId)
      const postDoc = await getDoc(postDocRef)

      if (postDoc.exists()) {
        const postData = postDoc.data()
        state.selected = postData
      } else {
        console.log('No such post!')
        router.push('/menus-management')
      }
    }
  } catch (error) {
    console.error(error)
  }
})
</script>

<style lang="sass" scoped></style>
