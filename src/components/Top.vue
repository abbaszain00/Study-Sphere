<template>
  <div class="header">
    <!-- Sidebar component that manages various features like chatbot and pomodoro timer -->
    <Sidebar
      @toggle-chat-bot="toggleChatBot"
      @toggle-pomodoro="togglePomodoroTimer"
      @toggle-to-do-list="toggleToDoList"
      @toggle-sound="toggleSoundMenu"
    />
    <!-- Conditional rendering of the SoundMenu based on its visibility state -->
    <SoundMenu :isVisible="isSoundMenuVisible" />
    <!-- Conditional rendering of the Chatbot component -->
    <Chatbot :isVisible="isChatBotVisible" />
    <!-- ToDo list component shown based on its visibility state -->
    <ToDoList :isVisible="isToDoListVisible" />
    <!-- Pomodoro Timer component with conditional rendering -->
    <PomodoroTimer :isVisible="isPomodoroVisible" />
    <!-- Navigation link acting as the application logo directs to the dashboard -->
    <router-link to="/dashboard" class="dash-logo">
      <h1>StudySphere</h1>
    </router-link>
  </div>
</template>

<script>
//Importing necessary components
import Sidebar from "./Sidebar.vue";
import Chatbot from "./Chatbot.vue";
import PomodoroTimer from "./PomodoroTimer.vue";
import ToDoList from "./ToDoList.vue";
import SoundMenu from "./SoundMenu.vue";

export default {
  name: "Top",
  components: {
    //Declaring imported components
    Sidebar,
    Chatbot,
    PomodoroTimer,
    ToDoList,
    SoundMenu,
  },
  data() {
    return {
      // State variables to control the visibility of each component
      isChatBotVisible: false,
      isPomodoroVisible: false,
      isToDoListVisible: false,
      isSoundMenuVisible: false,
    };
  },
  methods: {
    toggleChatBot() {
      this.isChatBotVisible = !this.isChatBotVisible; // Toggle the visibility of the Chatbot component
    },
    togglePomodoroTimer() {
      this.isPomodoroVisible = !this.isPomodoroVisible; // Toggle visibility of PomodoroTimer
    },
    toggleToDoList() {
      this.isToDoListVisible = !this.isToDoListVisible; // Toggle visibility of ToDoList
    },
    toggleSoundMenu() {
      this.isSoundMenuVisible = !this.isSoundMenuVisible; // Toggle the visibility of the SoundMenu component
    },
  },
};
</script>

<style>
.header {
  background-color: white;
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
