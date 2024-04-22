<template>
  <div>
    <!-- Sidebar toggle button -->
    <button @click="toggleSidebar" class="icon-button">
      <font-awesome-icon icon="bars" size="2x" />
    </button>
    <!-- Sidebar content -->
    <div class="sidebar" :class="{ 'sidebar-open': isSidebarOpen }" @click.stop>
      <!-- Sidebar icons -->
      <nav class="sidebar-icons">
        <!-- Button to close the sidebar -->
        <button @click="closeSidebar">
          <font-awesome-icon icon="arrow-left" size="2x" />
        </button>
        <!-- Toggle button for To-Do list visibility -->
        <button @click="toggleToDoListVisibility">
          <font-awesome-icon icon="list" size="2x" />
          <p>To-Do</p>
        </button>
        <!-- Toggle button for Pomodoro timer visibility -->
        <button @click="togglePomodoroTimerVisibility">
          <font-awesome-icon icon="clock" size="2x" />
          <p>Pomodoro</p>
        </button>
        <!-- Toggle button for Sound menu visibility -->
        <button @click="toggleSoundMenuVisibility">
          <font-awesome-icon icon="music" size="2x" />
          <p>Sounds</p>
        </button>
        <!-- Navigation to videos page -->
        <button @click="goToVideosPage">
          <font-awesome-icon icon="image" size="2x" />
          <p>Videos</p>
        </button>
        <!-- Toggle button for Chat-Bot visibility -->
        <button @click="toggleChatBotVisibility">
          <font-awesome-icon icon="comment" size="2x" />
          <p>Chat-Bot</p>
        </button>
        <!-- Navigation to settings page -->
        <button @click="goToSettingsPage">
          <font-awesome-icon icon="gear" size="2x" />
          <p>Settings</p>
        </button>
        <!-- Button to log out the user -->
        <button @click="logoutUser">
          <font-awesome-icon
            icon="circle-xmark"
            size="2x"
            :style="{ color: '#ff0000' }"
          />
          <p>Log out</p>
        </button>
      </nav>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex"; //Import state and mutations from vuex store
import axios from "axios";

export default {
  computed: {
    ...mapState(["isSidebarOpen"]), // Maps the sidebar open state from Vuex store
  },
  methods: {
    ...mapMutations([
      "toggleSidebar", // Toggles the sidebar open state
      "setSidebar", // Sets the sidebar state explicitly
      "toggleToDoListVisibility", // Toggles visibility of To-Do list
      "togglePomodoroTimerVisibility", // Toggles visibility of Pomodoro timer
      "toggleChatBotVisibility", // Toggles visibility of Chat bot
      "toggleSoundMenuVisibility", // Toggles visibility of Sound menu
    ]),
    // Closes the sidebar
    closeSidebar() {
      this.setSidebar(false);
    },
    //Logout the user
    logoutUser() {
      localStorage.removeItem("token"); // Removes the token from local storage
      axios.defaults.headers.common["Authorization"] = ""; // Resets the authorization header
      this.$router.push("/Signin"); // Redirects to the Sign-in page
    },
    // Navigates to the Videos page
    goToVideosPage() {
      this.$router.push("/Videos");
    },
    // Navigates to the Settings page
    goToSettingsPage() {
      this.$router.push("/Settings");
    },
  },
};
</script>

<style>
.sidebar {
  width: 80px;
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  background-color: white;
  transition: transform 0.3s ease;
  transform: translateX(-100%);
}

.sidebar-open {
  transform: translateX(0%);
}

.icon-button {
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  height: 50px;
  width: 50px;
}

.icon-button:hover {
  background-color: rgba(231, 231, 231, 0.877);
}

.sidebar-icons {
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding-top: 20px;
  cursor: pointer;
}

.sidebar-icons button {
  height: 80px;
  width: 80px;
  background: none;
  border: none;
  cursor: pointer;
  font-weight: bold;
  font-family: "Inter", sans-serif;
}

.sidebar-icons button:hover {
  background-color: rgba(231, 231, 231, 0.877);
}
</style>
