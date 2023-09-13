<!-- eslint-disable prettier/prettier -->
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
          Войти
        </button>
        <span class="text-gray-700 text-sm">
          Нет аккаунта?
          <router-link
            to="/signup"
            class="font-semibold text-blue-500"
          >
            Зарегистрироваться
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
import { ref, onMounted } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

export default {
  setup() {
    const email = ref('');
    const password = ref('');
    const error = ref(null);

    const store = useStore();
    const router = useRouter();

    const handleSubmit = async () => {
      try {
        await store.dispatch('login', {
          email: email.value,
          password: password.value,
        });
        router.push('/menus-management');
      } catch (err) {
        error.value = err.message;
      }
    };
    const checkUser = store => {
      const user = localStorage.getItem('user');
      // console.log("userLogin", user);
      if (user) {
        store.commit('setUser', JSON.parse(user));
        router.push('/menus-management');
      }
    };

    onMounted(() => checkUser(store));

    return { handleSubmit, email, password, error };
  },
};
</script>

<style lang="sass" scoped>
form 
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  max-width: 500px;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 10px;

</style>
