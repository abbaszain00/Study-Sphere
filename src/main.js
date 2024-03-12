import { createApp } from 'vue';
import App from './App.vue';
import router from './router'; // Import the router configuration
import './assets/main.css';

createApp(App)
  .use(router) // Tell Vue to use the Vue Router plugin
  .mount('#app');
