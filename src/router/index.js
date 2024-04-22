// Import necessary vue-router methods and route views
import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import SignUp from '../views/SignUp.vue';
import ContactView from '@/views/ContactView.vue';
import FaqView from '@/views/FaqView.vue';
import SignIn from '@/views/SignIn.vue';
import Dashboard from '@/views/Dashboard.vue';
import VideoView from '@/views/VideoView.vue';
import { isTokenValid } from '@/utils/util'
import Settings from '@/views/Settings.vue';

// Define all routes for the application, each route maps to a Vue component/view
const routes = [
  {
    path: '/', // The URL path for the route
    name: 'Home', // A unique name for the route
    component: HomeView, // The component to render when this route is active
    meta: { public: true }, // Custom metadata indicating that the route is public
  },
  // Additional routes follow a similar pattern
  // Public routes allow access without authentication
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
  // Protected routes require authentication
  {
    path: '/dashboard',
    name: 'dash',
    component: Dashboard,
    meta: { public: false }, 
  },
  
  // Dynamically loaded component for better performance

  {
    path: '/edit/:id',
    name: 'EditDocument',
    component: () => import('@/views/EditDocument.vue'), 
    meta: { public: false },
  },
  {
    path: '/videos',
    name: 'videos',
    component: VideoView, 
    meta: { public: false },
  },
  {
    path: '/settings',
    name: 'settings',
    component: Settings, 
    meta: { public: false },
  },
];
// Create the router instance and pass the 'routes' array
const router = createRouter({
  history: createWebHistory(import.meta.env.VITE_BASE_URL),
  routes,
});

// Add a global beforeEach guard to check for route access
router.beforeEach((to, from, next) => {
  const isAuthenticated = isTokenValid(); // Check if user is authenticated
  const isPublicRoute = to.matched.some(record => record.meta.public); // Determine if the route is public

  if (!isPublicRoute && !isAuthenticated) {
    // Redirect to signin if the route is protected and user is not authenticated
    next({
      path: '/signin',
      query: { sessionExpired: 'true' }
    });
  } else if ((to.path === '/signin' || to.path === '/signup') && isAuthenticated) {
    // If already authenticated and trying to access signin/signup, redirect to dashboard
    next('/dashboard');
  } else {
    // Otherwise, proceed as normal
    next();
  }
});

export default router;
