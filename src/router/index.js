import { createRouter, createWebHistory } from 'vue-router';
import store from '@/store';

const routes = [
  {
    path: '/',
    name: 'Home',
    redirect: { name: 'Login' },
  },
  {
    path: '/menus-view',
    name: 'menus-view',
    component: () => import('../views/Home.vue'),
  },
  {
    path: '/menus-management',
    name: 'menus-management',
    component: () => import('../views/Loyouts.vue'),
    meta: {
      requiresAuth: true,
    },
    children: [
      {
        path: 'menus/:id',
        name: 'menus-detail',
        component: () => import('../components/Menus/MenusDetail.vue'),
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: 'items/:id',
        name: 'items-detail',
        component: () => import('../components/Items/ItemsDetail.vue'),
        meta: {
          requiresAuth: true,
        },
      },
    ],
  },
  {
    path: '/restaurant-settings',
    name: 'restaurant-settings',
    component: () => import('../views/Loyouts.vue'),
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/menu-preview',
    name: 'menu-preview',
    component: () => import('../views/Loyouts.vue'),
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/signup',
    name: 'Signup',
    component: () => import('../components/authentication/Signup.vue'),
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../components/authentication/Login.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach(async (to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const user = store.getters.user;

  if (requiresAuth && !user) {
    next('/login');
  } else {
    next();
  }
});

export default router;
