import { createApp } from 'vue';
import App from './App.vue';
import router from './router'; // Import the router configuration
import './assets/main.css';
import { QuillEditor } from '@vueup/vue-quill'; // Import the QuillEditor component
import store from './store';
import axios from 'axios';

// Import Quill and VueQuill styles
import '@vueup/vue-quill/dist/vue-quill.snow.css';
import { library } from '@fortawesome/fontawesome-svg-core'
import { faArrowLeft, faBars, faCircleXmark, faClock, faGear, faList, faMusic } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
library.add(faBars)
library.add(faList)
library.add(faClock)
library.add(faMusic)
library.add(faGear)
library.add(faCircleXmark)
library.add(faArrowLeft)
axios.defaults.baseURL = 'http://localhost:3000';



const app = createApp(App)
app.use(router)
app.component('QuillEditor', QuillEditor);
app.component('font-awesome-icon', FontAwesomeIcon)
app.use(store)
app.mount('#app')
