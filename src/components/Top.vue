<template>
  <div class="header">
    <Sidebar
      @toggle-chat-bot="toggleChatBot"
      @toggle-pomodoro="togglePomodoroTimer"
      @toggle-to-do-list="toggleToDoList"
    />

    <Chatbot :isVisible="isChatBotVisible" />
    <ToDoList :isVisible="isToDoListVisible" />
    <!-- Pomodoro Timer component with conditional rendering -->
    <PomodoroTimer :isVisible="isPomodoroVisible" />
    <router-link to="/dashboard" class="dash-logo">
      <h1>StudySphere</h1>
    </router-link>
  </div>
</template>

<script>
import Sidebar from "./Sidebar.vue";
import Chatbot from "./Chatbot.vue";
import PomodoroTimer from "./PomodoroTimer.vue"; // Ensure correct spelling
import ToDoList from "./ToDoList.vue";

export default {
  name: "Top",
  components: {
    Sidebar,
    Chatbot,
    PomodoroTimer,
    ToDoList,
  },
  data() {
    return {
      isChatBotVisible: false,
      isPomodoroVisible: false, // Added visibility control for PomodoroTimer
      isToDoListVisible: false,
    };
  },
  methods: {
    toggleChatBot() {
      this.isChatBotVisible = !this.isChatBotVisible;
    },
    togglePomodoroTimer() {
      this.isPomodoroVisible = !this.isPomodoroVisible; // Toggle visibility of PomodoroTimer
    },
    toggleToDoList() {
      this.isToDoListVisible = !this.isToDoListVisible; // Toggle visibility of PomodoroTimer
    },
  },
};
</script>

<style>
.header {
  background-color: white; /* Light grey background */
  height: 50px;
  display: flex;
  border-bottom: 2px solid;
}
.dash-logo {
  text-decoration: none;
  font-family: "Inter";
  margin: auto;
  padding-right: 50px;
}

.dash-logo h1 {
  margin: auto;
  font-family: "Inter";
  color: black;
}
</style>
