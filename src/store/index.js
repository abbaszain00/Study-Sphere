import { createStore } from 'vuex';
import axios from 'axios';
import createPersistedState from 'vuex-persistedstate';
import rainSound from "@/assets/sounds/rain.mp3";
import brownSound from "@/assets/sounds/brown.wav";
import waveSound from "@/assets/sounds/waves.mp3";

export default createStore({
  state: {
    documents: [],
    chatMessages: [],
    tasks: [],
    playingSounds: {},
    isSidebarOpen: false, // Sidebar open/close state
    isToDoListVisible: false,
    isPomodoroTimerVisible: false, 
    isChatBotVisible: false, 
    isSoundMenuVisible: false, 
    timerRunning: false,
    timerSecondsLeft: 25 * 60, // Default Pomodoro duration
    timerStartTimestamp: null,
    currentMode: 'work', // 'work', 'shortBreak', 'longBreak'
    timerIntervalID: null, // To store the interval ID
    modeDurations: {
      work: 25 * 60,
      shortBreak: 5 * 60,
      longBreak: 15 * 60,
  },
  timerFinished: false,
  audioElements: {},
  soundUrls: {
    "Rain 🌧️": rainSound,
    "Brown 🟫": brownSound,
    "Waves 🌊": waveSound,
  },
  currentlyPlaying: null, // Track the name of the currently playing sound
  volume: 1, // Default volume (100%)

},
  mutations: {
    INITIALIZE_AUDIO(state, { name, url }) {
      if (!state.audioElements[name]) {
        const audio = new Audio(url);
        audio.loop = true;
        audio.volume = state.volume; // Set the volume for the new audio element
        state.audioElements[name] = { audio, playing: false };
      }
    },
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
    SET_SOUND_PLAYING(state, { soundName, isPlaying }) {
      if (isPlaying) {
        state.playingSounds[soundName] = true;
      } else {
        delete state.playingSounds[soundName];
      }
    },
    SET_VOLUME(state, volume) {
      state.volume = volume;
      // Apply the volume to all initialized audio elements
      Object.values(state.audioElements).forEach(({ audio }) => {
        audio.volume = volume;
      });
    },
    setDocuments(state, documents) {
      state.documents = documents;
    },
    addDocument(state, newDocument) {
      state.documents.push(newDocument);
    },
    removeDocument(state, documentId) {
      state.documents = state.documents.filter(doc => doc._id !== documentId);
    },
    addChatMessage(state, message) {
      state.chatMessages.push(message);
    },
    clearChatMessages(state) {
      state.chatMessages = [];
    },
    ADD_TASK(state, task) {
      state.tasks.push(task);
    },
    REMOVE_TASK(state, taskId) {
      state.tasks = state.tasks.filter(task => task.id !== taskId);
    },
    TOGGLE_TASK_DONE(state, taskId) {
      const task = state.tasks.find(task => task.id === taskId);
      if (task) {
        task.done = !task.done;
      }
    },
    toggleSidebar(state) {
      state.isSidebarOpen = !state.isSidebarOpen;
    },
    setSidebar(state, status) {
      state.isSidebarOpen = status;
    },
    toggleToDoListVisibility(state) {
      state.isToDoListVisible = !state.isToDoListVisible;
    },
    togglePomodoroTimerVisibility(state) { // Corrected mutation name to match state
      state.isPomodoroTimerVisible = !state.isPomodoroTimerVisible;
    },   
    toggleChatBotVisibility(state) { 
      state.isChatBotVisible = !state.isChatBotVisible;
    },
    toggleSoundMenuVisibility(state) { 
      state.isSoundMenuVisible = !state.isSoundMenuVisible;
    },
    SET_TIMER_RUNNING(state, { running, startTimestamp }) {
      state.timerRunning = running;
      state.timerStartTimestamp = running ? startTimestamp : null;
    },
    SET_TIMER_SECONDS_LEFT(state, secondsLeft) {
      state.timerSecondsLeft = secondsLeft;
    },
    SET_CURRENT_MODE(state, mode) {
      state.currentMode = mode;
      state.timerSecondsLeft = state.modeDurations[mode]; // Set initial time for mode

    },
    SET_TIMER_INTERVAL_ID(state, intervalId) {
      state.timerIntervalID = intervalId;
    },
    SET_TIMER_FINISHED(state, finished) {
      state.timerFinished = finished;
    }
  },
  actions: {
    setVolume({ commit }, volume) {
      commit("SET_VOLUME", volume);
    },
    toggleSound({ commit, state }, name) {
      const sound = state.audioElements[name];
      if (sound && sound.playing) {
        commit('PAUSE_SOUND', name);
      } else {
        commit('PLAY_SOUND', name);
      }
    },
    initializeSound({ commit }, payload) {
      commit('INITIALIZE_AUDIO', payload);
    },
    deleteDocumentById({ commit }, documentId) {
      const token = localStorage.getItem('token');
      axios.delete(`/api/documents/${documentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => commit('removeDocument', documentId))
      .catch(error => console.error("Error deleting document:", error));
    },
    fetchDocuments({ commit }) {
      const token = localStorage.getItem('token');
      axios.get('/api/documents', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(response => commit('setDocuments', response.data))
      .catch(error => console.error("Error fetching documents:", error));
    },
    async createDocument({ commit }, documentData) {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.post('/api/documents', documentData, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        commit('addDocument', response.data.document); // Ensure this matches the backend response structure
      } catch (error) {
        console.error("Error creating document:", error);
        throw error; // Rethrow to handle it in the component, if necessary
      }
    },
    
    
    addChatMessage({ commit }, message) {
      commit('addChatMessage', message);
    },
    clearChatMessages({ commit }) {
      commit('clearChatMessages');
    },
    addNewTask({ commit }, task) {
      commit("ADD_TASK", task);
    },
    removeTaskById({ commit }, taskId) {
      commit("REMOVE_TASK", taskId);
    },
    toggleTaskDone({ commit }, taskId) {
      commit("TOGGLE_TASK_DONE", taskId);
    },
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
          // Show notification...
        } else {
          commit('SET_TIMER_SECONDS_LEFT', updatedSecondsLeft);
        }
      }, 1000);
  
      // Store the interval ID in the state to clear it later
      commit('SET_TIMER_INTERVAL_ID', timerInterval); // You'll need to add this mutation
    },
    updateTimerSecondsLeft({ commit }, secondsLeft) {
      commit('SET_TIMER_SECONDS_LEFT', secondsLeft);
    },
    selectMode({ commit }, mode) {
      commit('SET_CURRENT_MODE', mode);
      // Consider stopping the timer without resetting time left if you want to change modes without auto-resetting
    },
    stopTimer({ commit, state }) {
      clearInterval(state.timerIntervalID);
      commit('SET_TIMER_RUNNING', { running: false, startTimestamp: null });
      commit('SET_TIMER_INTERVAL_ID', null); // Clear the interval but keep the timerSecondsLeft as is for pause functionality
    },
    resetTimer({ commit, state }) {
      commit('SET_TIMER_SECONDS_LEFT', state.modeDurations[state.currentMode]); // Reset to the mode's duration
      commit('SET_TIMER_RUNNING', { running: false, startTimestamp: null });
      commit('SET_TIMER_FINISHED', false); // Add this line to reset the finished state

      if (state.timerIntervalID) {
        clearInterval(state.timerIntervalID); // Clear any existing interval
        commit('SET_TIMER_INTERVAL_ID', null);
      }
    },
    // Correct `selectMode` action to reset the timer when changing modes
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
        paths: [ 'tasks', 'playingSounds','volume', 'isSidebarOpen', 'isSoundMenuVisible', 'isChatBotVisible', 'isToDoListVisible', 'isPomodoroTimerVisible', 'timerRunning', 'timerSecondsLeft', 'timerStartTimestamp', 'currentMode'],
        rehydrated(store) {
          Object.keys(store.state.playingSounds).forEach(name => {
            const url = store.state.soundUrls[name];
            if (url) {
              store.dispatch('initializeSound', { name, url }).then(() => {
                if (store.state.playingSounds[name]) {
                  store.dispatch('toggleSound', name);
                }
              });
            }
          });
        },
      }),
    ],
  });


