import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import SignUp from '../views/SignUp.vue';
import ContactView from '@/views/ContactView.vue';
import FaqView from '@/views/FaqView.vue';
import SignIn from '@/views/SignIn.vue';
import Dashboard from '@/views/Dashboard.vue';

// Define routes, marking public ones with a meta field
const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView,
    meta: { public: true },
  },
  {
    path: '/signup',
    name: 'SignUp',
    component: SignUp,
    meta: { public: true },
  },
  {
    path: '/faq',
    name: 'FAQ',
    component: FaqView,
    meta: { public: true },
  },
  {
    path: '/contact',
    name: 'Contact',
    component: ContactView,
    meta: { public: true },
  },
  {
    path: '/signin',
    name: 'Signin',
    component: SignIn,
    meta: { public: true },
  },
  {
    path: '/dashboard',
    name: 'dash',
    component: Dashboard,
    meta: { public: false }, // This route is protected
  },
  {
    path: '/create',
    name: 'CreateDocument',
    component: () => import('@/views/CreateDocument.vue'), // Lazy load the CreateDocument view
    meta: { public: false }, // This route is protected
  },
  // {
  //   path: '/edit/:id',
  //   name: 'EditDocument',
  //   component: () => import('@/views/EditDocument.vue'), 
  //   meta: { public: false },
  // },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.VITE_BASE_URL),
  routes,
});

// Add a global beforeEach guard to check for route access
router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem('token'); // Or implement your authentication logic here
  const isPublicRoute = to.matched.some(record => record.meta.public);

  if (!isPublicRoute && !isAuthenticated) {
    // If trying to access a protected route and not authenticated, redirect to signin
    next('/signin');
  } else if ((to.path === '/signin' || to.path === '/signup') && isAuthenticated) {
    // If already authenticated, redirect from signin/signup to dashboard
    next('/dashboard');
  } else {
    // Otherwise, proceed as normal
    next();
  }
});

export default router;
