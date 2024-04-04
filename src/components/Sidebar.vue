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
        <button @click="closeSidebar">
          <font-awesome-icon icon="arrow-left" size="2x" />
        </button>
        <button @click="toggleToDoListVisibility">
          <font-awesome-icon icon="list" size="2x" />
          <p>To-Do</p>
        </button>
        <button @click="togglePomodoroTimerVisibility">
          <font-awesome-icon icon="clock" size="2x" />
          <p>Pomodoro</p>
        </button>
        <button @click="toggleSoundMenu">
          <font-awesome-icon icon="music" size="2x" />
          <p>Sounds</p>
        </button>
        <button @click="toggleChatBot">
          <font-awesome-icon icon="comment" size="2x" />
          <p>Chat-Bot</p>
        </button>
        <button>
          <font-awesome-icon icon="gear" size="2x" />
          <p>Settings</p>
        </button>
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

    <!-- Overlay to detect clicks outside -->
    <div v-show="isSidebarOpen" @click="closeSidebar"></div>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import ToDoList from "./ToDoList.vue";

export default {
  computed: {
    ...mapState(["isSidebarOpen"]),
  },
  methods: {
    ...mapMutations([
      "toggleSidebar",
      "setSidebar",
      "toggleToDoListVisibility", // Assuming you have this mutation
      "togglePomodoroTimerVisibility", // Assuming you have this mutation
      // Add similar mutations for other features as needed
    ]),
    closeSidebar() {
      this.setSidebar(false);
    },
    logoutUser() {
      localStorage.removeItem("token");
      axios.defaults.headers.common["Authorization"] = "";
      this.$router.push("/Signin");
    },
  },
};
</script>

<style>
/* Basic styling */
/* Updated styling */
.sidebar {
  width: 80px; /* Adjust based on your desired sidebar width */
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  background-color: white;
  transition: transform 0.3s ease;
  transform: translateX(-100%); /* Initially hide sidebar */
}

.sidebar-open {
  transform: translateX(0%); /* Show sidebar */
}

.icon-button {
  background: none; /* Remove default background */
  border: none; /* Remove default border */
  padding: 0; /* Remove default padding */
  cursor: pointer; /* Keep the pointer cursor to indicate it's clickable */
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
