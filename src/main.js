import { createApp } from 'vue';
import App from './App.vue';
import router from './router'; // Import the router configuration
import './assets/main.css';
import { QuillEditor } from '@vueup/vue-quill'; // Import the QuillEditor component

// Import Quill and VueQuill styles
import '@vueup/vue-quill/dist/vue-quill.snow.css';



const app = createApp(App)
app.use(router)
app.component('QuillEditor', QuillEditor);
app.mount('#app')
