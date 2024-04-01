<template>
  <div class="header">
    <Sidebar @toggle-chat-bot="toggleChatBot" />
    <Chatbot :isVisible="isChatBotVisible" />
    <router-link to="/dashboard" class="dash-logo">
      <h1>StudySphere</h1>
    </router-link>
  </div>
</template>

<script>
import Sidebar from "./Sidebar.vue";
import Chatbot from "./Chatbot.vue";

export default {
  name: "Top",
  components: {
    Sidebar,
    Chatbot,
  },
  data() {
    return {
      isChatBotVisible: false,
    };
  },
  methods: {
    toggleChatBot() {
      this.isChatBotVisible = !this.isChatBotVisible;
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
