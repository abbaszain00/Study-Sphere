import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView,
  },
  // Add more routes as needed
];

const router = createRouter({
  history: createWebHistory('/'),
  routes,
});


export default router;
