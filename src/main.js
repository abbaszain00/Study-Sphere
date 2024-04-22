import { createApp } from 'vue'; //import Vue 3 createApp function to initialise application
import App from './App.vue'; //import App component
import router from './router'; // Import the router configuration
import './assets/main.css'; //Import styles for global styling
import { QuillEditor } from '@vueup/vue-quill'; // Import the QuillEditor component
import store from './store'; //Import Vuex store
import axios from 'axios'; //Import axios for HTTP requests

// Import Quill and VueQuill styles
import '@vueup/vue-quill/dist/vue-quill.snow.css';
// Import Font Awesome library for icons
import { library } from '@fortawesome/fontawesome-svg-core'
// Import specific icons
import { faArrowLeft, faBars, faCircleXmark, faClock, faComment, faGear, faImage, faList, faMusic } from '@fortawesome/free-solid-svg-icons'
// Import FontAwesome icon component
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
//Import FontAwesome icons used in project
library.add(faBars)
library.add(faList)
library.add(faClock)
library.add(faMusic)
library.add(faGear)
library.add(faCircleXmark)
library.add(faArrowLeft)
library.add(faComment)
library.add(faImage)

//Set axios default base URL for all HTTP requests
axios.defaults.baseURL = 'http://localhost:3000';

//Axios interceptor to handle responses globally
axios.interceptors.response.use(function (response) {
   
    return response;
  }, function (error) {
    
    if (error.response && error.response.status === 401) {
      alert('Your session has expired. Please log in again.');
      router.push('/Signin'); //Redirect user to Signin page if session expired
    }
    return Promise.reject(error);
  });

const app = createApp(App) //Create a new Vue application instance with main App component
app.use(router) //Register Vue Router with application
app.component('QuillEditor', QuillEditor); //Register QuillEditor componnent globally
app.component('font-awesome-icon', FontAwesomeIcon) //Register FontAwesome component globally
app.use(store) //Register Vuex store with application
app.mount('#app') //Mount Vue application to the #app div in the index.html
