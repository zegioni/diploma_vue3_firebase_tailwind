<template>
  <div class="flex items-center justify-center h-screen">
    <form
      class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
      @submit.prevent="handleSubmit"
    >
      <div class="mb-4">
        <label
          class="block text-gray-700 font-bold mb-2"
          for="username"
        >
          Имя пользователя
        </label>
        <input
          id="username"
          v-model="email"
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          type="text"
          placeholder="Введите имя пользователя"
          required
        >
      </div>
      <div class="mb-6">
        <label
          class="block text-gray-700 font-bold mb-2"
          for="password"
        >
          Пароль
        </label>
        <input
          id="password"
          v-model="password"
          class="shadow appearance-none border border-red-500 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          type="password"
          placeholder="Введите пароль"
          required
        >
      </div>
      <div class="flex items-center justify-between">
        <button
          class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="submit"
        >
          Зарегистрироваться
        </button>
        <span class="text-gray-700 text-sm">
          Есть аккаунта?
          <router-link
            to="/login"
            class="font-semibold text-blue-500"
          >
            Войти
          </router-link>
        </span>
        <div v-if="error">
          {{ error }}
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { toast } from 'vue3-toastify';

export default {
  setup() {
    const email = ref('');
    const password = ref('');
    const error = ref(null);

    const store = useStore();
    const router = useRouter();

    const handleSubmit = async () => {
      try {
        await store.dispatch('signup', {
          email: email.value,
          password: password.value,
        });
        router.push('/login');
        toast('Success', {
          autoClose: 1000,
        });
      } catch (err) {
        error.value = err.message;
      }
    };

    return { handleSubmit, email, password, error };
  },
};
</script>

<style lang="sass" scoped>
form 
  position: absolute
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  max-width: 500px;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 10px;

</style>
