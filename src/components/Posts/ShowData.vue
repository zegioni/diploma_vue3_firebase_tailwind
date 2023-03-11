<!-- eslint-disable prettier/prettier -->
<template>
  <div class="flex grow">
    <nav class="h-[40rem] flex ml-4">
      <div class="bg-white shadow-lg w-72">
        <div class="p-4 space-y-2 mb-2">
          <div class="flex justify-between">
            <button
              :class="{ 'bg-blue-600': activeButton === 'menus' }"
              @click="open('menus')"
            >
              Menus
            </button>
            <button
              :class="{ 'bg-blue-600': activeButton === 'items' }"
              @click="open('items')"
            >
              Items
            </button>
          </div>

          <div v-if="activeButton === 'menus'">
            <menus />
          </div>
        </div>
        <div v-if="activeButton === 'items'">
          <items />
        </div>
      </div>
    </nav>
    <PostDetail v-if="activeButton === 'menus'" />
  </div>
</template>

<script setup>
import menus from '@/components/Posts/Menus.vue'
import items from '@/components/Posts/Items.vue'
import PostDetail from './PostDetail.vue'
// import { useCollection } from "vuefire"
// import { collection, getDoc, doc, addDoc, updateDoc } from "firebase/firestore"
// import { db, auth } from "@/firebase/config"
import router from '@/router'
// import { useRoute } from "vue-router"
// import { reactive, onMounted } from "vue"
import { ref } from 'vue'
// import { toast } from "vue3-toastify"

const activeButton = ref('menus')

const open = click => {
  activeButton.value = 'menus'
  if (click === 'menus') {
    activeButton.value = 'menus'
  } else {
    activeButton.value = 'items'
    router.push('/menus-management')
  }
}

// const posts = useCollection(collection(db, "posts"))
// const route = useRoute()

// const showPost = () => {
//   if (posts.value) {
//     const sortedPosts = [...posts.value].sort((a, b) => {
//       const dateA = a.updatedAt ? a.updatedAt.toDate() : a.createdAt.toDate()
//       const dateB = b.updatedAt ? b.updatedAt.toDate() : b.createdAt.toDate()
//       return dateB - dateA
//     })
//     return sortedPosts
//   }
//   return null
// }

// const createPost = async () => {
//   const user = auth.currentUser
//   try {
//     toast("Post Created !", {
//       autoClose: 1000,
//     })
//     const postRef = collection(db, "posts")
//     const newPost = {
//       id: "",
//       title: "New Title",
//       description: "",
//       createdAt: new Date(),
//       createdBy: user.uid,
//     }
//     const docRef = await addDoc(postRef, newPost)
//     await updateDoc(docRef, { id: docRef.id })
//     newPost.id = docRef.id
//     router.push({ name: "posts-detail", params: { id: newPost.id } })
//     open(newPost)
//   } catch (error) {
//     console.log(error)
//     toast("Post Error !", {
//       autoClose: 1000,
//     })
//   }
// }

// const state = reactive({
//   selected: null,
// })

// const open = (post) => {
//   state.selected = post
//   router.push({ name: "posts-detail", params: { id: post.id } })
// }

// onMounted(async () => {
//   try {
//     const postId = route.params.id
//     if (postId) {
//       const postDocRef = doc(db, "posts", postId)
//       const postDoc = await getDoc(postDocRef)

//       if (postDoc.exists()) {
//         const postData = postDoc.data()
//         state.selected = postData
//       } else {
//         console.log("No such post!")
//         router.push("/post-management")
//       }
//     }
//   } catch (error) {
//     console.error(error)
//   }
// })
</script>

<style lang="sass" scoped></style>
