<template>
  <div class="image-uploader">
    <div class="image-uploader__images">
      <div
        v-for="(image, index) in imageObjects"
        :key="index"
        class="image-uploader__image"
      >
        <div class="image-uploader__preview">
          <img
            :src="image.url"
            alt="Uploaded Image"
          >
        </div>
        <button
          class="image-uploader__delete-button"
          @click="deleteObject(index, image)"
        >
          X
        </button>
      </div>
    </div>
    <label
      class="image-uploader__upload"
      :class="{ disabled: imageObjects.length >= maxImages }"
      :for="imageObjects.length < maxImages ? 'file-input' : ''"
      style="cursor: pointer;"
    >
      <div
        class="image-uploader__upload-button"
        :class="{ disabled: imageObjects.length >= maxImages }"
      >
        <i class="fas fa-plus">+</i>
      </div>
      <input
        id="file-input"
        type="file"
        accept="image/*"
        style="display: none;"
        :disabled="imageObjects.length >= maxImages"
        @change="uploadImage"
      >
    </label>
  </div>
</template>

<script>
import { ref, defineEmits } from 'vue';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { firebaseApp } from '@/firebase/config';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/firebase/config';

defineEmits(['imageAdded']);

export default {
  name: 'ImageUploader',
    props: {
    itemId: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      imageObjects: [],
      maxImages: 3,
    };
  },
    watch: {
    itemId() {
      this.fetchImages();
    },
  },
    mounted() {
    this.fetchImages();
  },
  methods: {
    async fetchImages() {
      const storage = getStorage(firebaseApp);
      const itemDocRef = doc(db, 'items', this.itemId);
      const itemDocSnap = await getDoc(itemDocRef);
      if (itemDocSnap.exists()) {
        const images = itemDocSnap.data().images;
        this.imageObjects = images;
      }
    },
async uploadImage(event) {
  const file = event.target.files[0];
  const storage = getStorage(firebaseApp);
  const uniqueFilename = Date.now() + '_' + file.name; // Добавление уникального идентификатора к имени файла
  const storageReference = storageRef(storage, uniqueFilename);

  try {
    await uploadBytes(storageReference, file);
    const downloadUrl = await getDownloadURL(storageReference);

    this.imageObjects.push({ url: downloadUrl });
    this.$emit('imageAdded', this.imageObjects); // отправляем событие imageAdded с данными изображений
  } catch (error) {
    console.error('Error uploading image: ', error);
  }
},
    async deleteObject(index, image) {
      try {
        const storage = getStorage(firebaseApp);
        const storageReference = storageRef(storage, image.url);

        // Удаление объекта из Firebase Storage
        await deleteObject(storageReference);

        // Удаление объекта из массива imageObjects
        this.imageObjects.splice(index, 1);

      } catch (error) {
        console.error('Error deleting image: ', error);
      }
    }
  },
};
</script>

<style>
.image-uploader {
  display: flex;
  align-items: flex-start;
}

.image-uploader__delete-button {
position: relative;
    top: -111px;
    right: -38px;
    background-color: #10b981;
    border: 2px solid white;
    border-radius: 24px;
    width: 35px;
    height: 35px;
    color: white;
}

.image-uploader__upload {
  width: 100px;
  height: 100px;
  border: 2px solid #10b981;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 25px;
  border-radius: 24px;
}

.image-uploader__upload.disabled {
  border: 2px solid #ddd;
  cursor: not-allowed;
}
.image-uploader__upload-button.disabled {
color: #ddd;
}

.image-uploader__upload-button {
  color: #10b981;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
  font-size: 27px;
}

.image-uploader__images {
  display: flex;
}

.image-uploader__image {
display: flex;
    align-items: center;
    flex-direction: column;
}

.image-uploader__preview {
  width: 100px;
  height: 100px;
  margin-right: 25px;
}

.image-uploader__preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 24px;
  border: 2px solid #10b981;
}
</style>
