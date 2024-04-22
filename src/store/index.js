import { createStore } from 'vuex';
import axios from 'axios';
import createPersistedState from 'vuex-persistedstate';
//Import sounds
import rainSound from "@/assets/sounds/rain.mp3";
import brownSound from "@/assets/sounds/brown.wav";
import waveSound from "@/assets/sounds/waves.mp3";

// Create and export the Vuex store
export default createStore({
  // Define the initial state of the application
  state: {
    documents: [],  // Array to store documents
    chatMessages: [],  // Array to store chat messages
    tasks: [],  // Array to store tasks
    playingSounds: {},  // Object to manage playing sounds
    isSidebarOpen: false,  // Boolean to track if the sidebar is open
    isToDoListVisible: false,  // Boolean to track if the to-do list is visible
    isPomodoroTimerVisible: false,  // Boolean to track if the Pomodoro timer is visible
    isChatBotVisible: false,  // Boolean to track if the chatbot is visible
    isSoundMenuVisible: false,  // Boolean to track if the sound menu is visible
    timerRunning: false,  // Boolean to track if the timer is running
    timerSecondsLeft: 25 * 60,  // Integer to track seconds left on the timer
    timerStartTimestamp: null,  // Timestamp when the timer was started
    currentMode: 'work',  // Current mode of the timer ('work', 'shortBreak', 'longBreak')
    timerIntervalID: null,  // Interval ID for the timer
    modeDurations: {  // Durations for different timer modes
      work: 25 * 60,
      shortBreak: 5 * 60,
      longBreak: 15 * 60,
    },
  timerFinished: false, // Boolean to track if the timer has finished
  audioElements: {},  // Object to manage audio elements
  soundUrls: { // URLs for different sounds
    "Rain 🌧️": rainSound,
    "Brown 🟫": brownSound,
    "Waves 🌊": waveSound,
  },
  currentlyPlaying: null, // Track the name of the currently playing sound
  volume: 1, // Default volume (100%)

},
  // Define mutations to modify the state
  mutations: {
    // Initialize audio components
    INITIALIZE_AUDIO(state, { name, url }) {
      if (!state.audioElements[name]) {
        const audio = new Audio(url);
        audio.loop = true;
        audio.volume = state.volume; // Set the volume for the new audio element
        state.audioElements[name] = { audio, playing: false };
      }
    },
    // Play a sound
    PLAY_SOUND(state, name) {
      // Pause the currently playing sound
      if (state.currentlyPlaying && state.audioElements[state.currentlyPlaying]) {
        state.audioElements[state.currentlyPlaying].audio.pause();
        state.audioElements[state.currentlyPlaying].playing = false;
      }
  
      // Play the new sound
      const sound = state.audioElements[name];
      if (sound && !sound.playing) {
        sound.audio.play().then(() => {
          sound.playing = true;
          state.currentlyPlaying = name; // Update the currently playing sound
        }).catch((err) => console.error("Error playing sound:", err));
      }
    },
    // Pause a sound
    PAUSE_SOUND(state, name) {
      const sound = state.audioElements[name];
      if (sound && sound.playing) {
        sound.audio.pause();
        sound.playing = false;
        if (state.currentlyPlaying === name) {
          state.currentlyPlaying = null; // Clear the currently playing sound
        }
      }
    },
    // Set the playing state of a sound
    SET_SOUND_PLAYING(state, { soundName, isPlaying }) {
      if (isPlaying) {
        state.playingSounds[soundName] = true;
      } else {
        delete state.playingSounds[soundName];
      }
    },
    // Set the global volume
    SET_VOLUME(state, volume) {
      state.volume = volume;
      // Apply the volume to all initialized audio elements
      Object.values(state.audioElements).forEach(({ audio }) => {
        audio.volume = volume;
      });
    },
    // Sets the array of documents in the state.
    setDocuments(state, documents) {
      state.documents = documents;
    },
    // Adds a new document to the array of documents.
    addDocument(state, newDocument) {
      state.documents.push(newDocument);
    },
    // Removes a document from the array based on its ID.
    removeDocument(state, documentId) {
      state.documents = state.documents.filter(doc => doc._id !== documentId);
    },
    // Adds a new chat message to the chat messages array.
    addChatMessage(state, message) {
      state.chatMessages.push(message);
    },
    // Clears all chat messages from the state.
    clearChatMessages(state) {
      state.chatMessages = [];
    },
    // Adds a new task to the tasks array.
    ADD_TASK(state, task) {
      state.tasks.push(task);
    },
    // Removes a task from the tasks array based on its ID.
    REMOVE_TASK(state, taskId) {
      state.tasks = state.tasks.filter(task => task.id !== taskId);
    },
    // Toggles the 'done' status of a specific task.
    TOGGLE_TASK_DONE(state, taskId) {
      const task = state.tasks.find(task => task.id === taskId);
      if (task) {
        task.done = !task.done;
      }
    },
    // Toggles the visibility of the sidebar.
    toggleSidebar(state) {
      state.isSidebarOpen = !state.isSidebarOpen;
    },
    // Sets the visibility status of the sidebar.
    setSidebar(state, status) {
      state.isSidebarOpen = status;
    },
    // Toggles the visibility of the to-do list.
    toggleToDoListVisibility(state) {
      state.isToDoListVisible = !state.isToDoListVisible;
    },
    // Toggles the visibility of the Pomodoro timer.
    togglePomodoroTimerVisibility(state) { // Corrected mutation name to match state
      state.isPomodoroTimerVisible = !state.isPomodoroTimerVisible;
    },   
    // Toggles the visibility of the chatbot.
    toggleChatBotVisibility(state) { 
      state.isChatBotVisible = !state.isChatBotVisible;
    },
    // Toggles the visibility of the sound menu.
    toggleSoundMenuVisibility(state) { 
      state.isSoundMenuVisible = !state.isSoundMenuVisible;
    },
    // Sets whether the timer is running and records the start timestamp.
    SET_TIMER_RUNNING(state, { running, startTimestamp }) {
      state.timerRunning = running;
      state.timerStartTimestamp = running ? startTimestamp : null;
    },
    // Sets the remaining seconds on the timer.
    SET_TIMER_SECONDS_LEFT(state, secondsLeft) {
      state.timerSecondsLeft = secondsLeft;
    },
    // Sets the current mode of the timer and updates the seconds left according to the mode's duration.
    SET_CURRENT_MODE(state, mode) {
      state.currentMode = mode;
      state.timerSecondsLeft = state.modeDurations[mode]; // Set initial time for mode

    },
    // Stores the interval ID for managing the timer.
    SET_TIMER_INTERVAL_ID(state, intervalId) {
      state.timerIntervalID = intervalId;
    },
    // Sets whether the timer has finished running.
    SET_TIMER_FINISHED(state, finished) {
      state.timerFinished = finished;
    }
  },
  actions: {
    // Commits a mutation to set the volume level.
    setVolume({ commit }, volume) {
      commit("SET_VOLUME", volume);
    },
    // Toggles the play/pause state of a sound based on its current state.
    toggleSound({ commit, state }, name) {
      const sound = state.audioElements[name];
      if (sound && sound.playing) {
        commit('PAUSE_SOUND', name);
      } else {
        commit('PLAY_SOUND', name);
      }
    },
    // Initializes a new sound using its payload (includes name and URL).
    initializeSound({ commit }, payload) {
      commit('INITIALIZE_AUDIO', payload);
    },
    // Deletes a document by ID using an API call and commits the removal on success.
    deleteDocumentById({ commit }, documentId) {
      const token = localStorage.getItem('token');
      axios.delete(`/api/documents/${documentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => commit('removeDocument', documentId))
      .catch(error => console.error("Error deleting document:", error));
    },
    // Fetches documents from the API and commits them to the state.
    fetchDocuments({ commit }) {
      const token = localStorage.getItem('token');
      axios.get('/api/documents', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(response => commit('setDocuments', response.data))
      .catch(error => console.error("Error fetching documents:", error));
    },
    // Creates a new document by sending it to the API and commits the new document to the state.
    async createDocument({ commit }, documentData) {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.post('/api/documents', documentData, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        commit('addDocument', response.data.document); 
      } catch (error) {
        console.error("Error creating document:", error);
        throw error; 
      }
    },
    
    // Adds a new chat message to the state.
    addChatMessage({ commit }, message) {
      commit('addChatMessage', message);
    },
    // Clears all chat messages from the state.
    clearChatMessages({ commit }) {
      commit('clearChatMessages');
    },
    // Adds a new task to the state.
    addNewTask({ commit }, task) {
      commit("ADD_TASK", task);
    },
    // Removes a task by its ID.
    removeTaskById({ commit }, taskId) {
      commit("REMOVE_TASK", taskId);
    },
    // Toggles the completion state of a task.
    toggleTaskDone({ commit }, taskId) {
      commit("TOGGLE_TASK_DONE", taskId);
    },
    // Starts a timer and keeps track of time, committing updates to the state.
    startTimer({ commit, state, dispatch }) {
      if (state.timerRunning) {
        // If the timer is already running, return early to avoid multiple intervals
        return;
      }
      commit('SET_TIMER_RUNNING', { running: true, startTimestamp: Date.now() });
      
      // Start an interval to decrement the timerSecondsLeft every second
      const timerInterval = setInterval(() => {
        const elapsedTimeInSeconds = Math.floor((Date.now() - state.timerStartTimestamp) / 1000);
        const updatedSecondsLeft = state.modeDurations[state.currentMode] - elapsedTimeInSeconds;
        
        if (updatedSecondsLeft <= 0) {
          dispatch('stopTimer');
          commit('SET_TIMER_SECONDS_LEFT', 0);
          commit('SET_TIMER_FINISHED', true); // Indicate timer finished
          
        } else {
          commit('SET_TIMER_SECONDS_LEFT', updatedSecondsLeft);
        }
      }, 1000);
  
      // Store the interval ID in the state to clear it later
      commit('SET_TIMER_INTERVAL_ID', timerInterval); 
    },
    updateTimerSecondsLeft({ commit }, secondsLeft) {
      commit('SET_TIMER_SECONDS_LEFT', secondsLeft);
    },
    selectMode({ commit }, mode) {
      commit('SET_CURRENT_MODE', mode);
    },
    // Stops the timer and clears the interval.
    stopTimer({ commit, state }) {
      clearInterval(state.timerIntervalID);
      commit('SET_TIMER_RUNNING', { running: false, startTimestamp: null });
      commit('SET_TIMER_INTERVAL_ID', null); // Clear the interval but keep the timerSecondsLeft as is for pause functionality
    },
    // Resets the timer to its initial state.
    resetTimer({ commit, state }) {
      commit('SET_TIMER_SECONDS_LEFT', state.modeDurations[state.currentMode]); // Reset to the mode's duration
      commit('SET_TIMER_RUNNING', { running: false, startTimestamp: null });
      commit('SET_TIMER_FINISHED', false); 

      if (state.timerIntervalID) {
        clearInterval(state.timerIntervalID); // Clear any existing interval
        commit('SET_TIMER_INTERVAL_ID', null);
      }
    },
      // Selects a timer mode and resets the timer.
    selectMode({ commit, state }, mode) {
      commit('SET_CURRENT_MODE', mode);
      const newSecondsLeft = state.modeDurations[mode];
      commit('SET_TIMER_SECONDS_LEFT', newSecondsLeft);
      commit('SET_TIMER_RUNNING', { running: false, startTimestamp: null });
      if (state.timerIntervalID) {
        clearInterval(state.timerIntervalID);
        commit('SET_TIMER_INTERVAL_ID', null);
      }
    },
    },
    plugins: [
      createPersistedState({
        // Specifies which pieces of state to persist using the paths option
        paths: [ 'tasks', 'playingSounds','volume', 'isSidebarOpen', 'isSoundMenuVisible', 'isChatBotVisible', 'isToDoListVisible', 'isPomodoroTimerVisible', 'timerRunning', 'timerSecondsLeft', 'timerStartTimestamp', 'currentMode'],
        // A function called when the store is rehydrated from localStorage
        rehydrated(store) {
          // Iterates over each sound stored in the state
          Object.keys(store.state.playingSounds).forEach(name => {
            const url = store.state.soundUrls[name]; // Retrieves the URL of the sound file
            // Checks if the URL is valid
            if (url) {
              // Dispatches an action to initialize the sound with the given name and URL
              store.dispatch('initializeSound', { name, url }).then(() => {
                if (store.state.playingSounds[name]) {  // After initializing, checks if the sound should be playing
                  store.dispatch('toggleSound', name);               // dispatches an action to toggle the sound on

                }
              });
            }
          });
        },
      }),
    ],
  });


