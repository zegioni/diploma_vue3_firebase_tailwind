<template>
  <!-- <nav class="grow ml-4" v-if="post"> -->
  <nav>
    <div class="bg-white shadow-lg">
      <div class="flex justify-between p-4 space-y-2 mb-2">
        <div
          class="flex"
          space-y-2
          mb-2
        >
          <input
            id="title"
            class="mt-1 px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block rounded-md sm:text-sm focus:ring-1"
            type="text"
          >
          <!-- v-model="post.title" -->
        </div>
        <div class="flex">
          <!-- <button type="button" class="ml-2" @click="deletePost(post)">
            Delete
          </button> -->
        </div>
      </div>
    </div>
    <div class="bg-white shadow-lg">
      <div class="p-4 space-y-2 mb-2 h-[53rem]">
        <div class="">
          <div class="space-y-2 mb-2">
            Description
          </div>
          <div class="space-y-2 mb-2">
            <input
              id="title"
              type="text"
              class="mt-1 px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md sm:text-sm focus:ring-1"
            >
            <!-- v-model="post.description" -->
          </div>
          <!-- <button @click="saveChange(post)">Save</button> -->
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
// import { defineProps } from "vue"
// import { useDocument } from "vuefire"
// import { doc, deleteDoc, updateDoc } from "firebase/firestore"
// import { db } from "@/firebase/config"
// import { ref } from "vue"
// import router from "@/router"
// import { toast } from "vue3-toastify"

// const props = defineProps({
//   post: {
//     type: Object,
//     required: true,
//   },
// })
// const { data: post } = useDocument(doc(db, "posts", props.post.id))

// // console.log(post)

// const title = ref("")
// title.value = post.value ? post.value.title : ""
// const description = ref("")
// description.value = post.value ? post.value.description : ""

// const deletePost = async (post) => {
//   try {
//     toast("Post Deleted !", {
//       autoClose: 1000,
//     })
//     await deleteDoc(doc(db, "posts", post.id))
//     router.push("/menus-management")
//   } catch (error) {
//     console.error(error)
//     toast("Error !", {
//       autoClose: 1000,
//     })
//   }
// }

// const saveChange = async (post) => {
//   try {
//     await updateDoc(doc(db, "posts", post.id), {
//       title: post.title,
//       description: post.description,
//       updatedAt: new Date(),
//     })
//     toast("Wow so easy !", {
//       autoClose: 1000,
//     })
//   } catch (error) {
//     console.error(error)
//     toast("FUCK!", {
//       autoClose: 1000,
//     })
//   }
// }
</script>

<style lang="sass" scoped></style>
