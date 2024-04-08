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
import { faArrowLeft, faBars, faCircleXmark, faClock, faComment, faGear, faImage, faList, faMusic } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
library.add(faBars)
library.add(faList)
library.add(faClock)
library.add(faMusic)
library.add(faGear)
library.add(faCircleXmark)
library.add(faArrowLeft)
library.add(faComment)
library.add(faImage)
axios.defaults.baseURL = 'http://localhost:3000';

axios.interceptors.response.use(function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
  }, function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    if (error.response && error.response.status === 401) {
      // Handle token expiration (401 Unauthorized)
      alert('Your session has expired. Please log in again.');
      router.push('/Signin'); // Replace '/signin' with your login route path
    }
    return Promise.reject(error);
  });

const app = createApp(App)
app.use(router)
app.component('QuillEditor', QuillEditor);
app.component('font-awesome-icon', FontAwesomeIcon)
app.use(store)
app.mount('#app')
