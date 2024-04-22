<template>
  <div v-if="isChatBotVisible" class="chatbot-container">
    <!--Draggable header-->
    <div
      class="chat-header"
      @mousedown="dragStart"
      @mousemove="dragging"
      @mouseup="dragEnd"
    >
      AI Chatbot
      <!--Minimise button-->
      <button class="minimize-button" @click="toggleChatBotVisibility">
        -
      </button>
    </div>
    <!-- Container for chat messages -->
    <div class="chat-messages">
      <div
        v-for="(message, index) in chatMessages"
        :key="index"
        class="message"
        :class="message.type"
      >
        {{ message.text }}
      </div>
    </div>
    <!-- Input field for user to type messages -->
    <input
      type="text"
      v-model="userInput"
      @keyup.enter="sendMessage"
      placeholder="Ask me anything..."
    />
  </div>
</template>

<script>
import axios from "axios"; //Import AXIOS for HTTP requests
import { mapActions, mapState, mapMutations } from "vuex"; //Import actions, state and mutations from vuex store

export default {
  data() {
    return {
      userInput: "",
      isDragging: false,
      dragStartX: 0,
      dragStartY: 0,
    };
  },
  computed: {
    ...mapState(["chatMessages", "isChatBotVisible"]), // Map Vuex state to local computed properties for ease of access
  },
  methods: {
    ...mapMutations(["toggleChatBotVisibility"]), // Map Vuex mutations to local methods

    ...mapActions(["addChatMessage"]), // Map Vuex actions to local methods
    // Method to send a message and handle responses
    async sendMessage() {
      // Check if the input is not just empty spaces
      if (this.userInput.trim()) {
        const userMessage = { type: "user", text: this.userInput };
        this.addChatMessage(userMessage); // Add user message to chat

        try {
          const response = await axios.post("/api/chat", {
            message: this.userInput,
          });
          // Add bot's response to the chat
          this.addChatMessage({ type: "bot", text: response.data.message });
        } catch (error) {
          console.error("Error sending message:", error);
          // Add error message to the chat if the request fails
          this.addChatMessage({
            type: "bot",
            text: "Sorry, I can't respond at the moment.",
          });
        }

        this.userInput = ""; // Clear input after sending
      }
    },
    dragStart(event) {
      this.isDragging = true;
      const chatbox = this.$el;
      this.dragStartX = event.clientX - chatbox.offsetLeft;
      this.dragStartY = event.clientY - chatbox.offsetTop;
    },
    dragging(event) {
      if (this.isDragging) {
        this.$el.style.left = `${event.clientX - this.dragStartX}px`;
        this.$el.style.top = `${event.clientY - this.dragStartY}px`;
      }
    },
    dragEnd() {
      this.isDragging = false;
    },
  },
};
</script>

<style>
.chatbot-container {
  width: 300px;
  height: 400px;
  position: fixed;
  bottom: 20px;
  right: 20px;
  background-color: #fff;
  border: 1px solid #ccc;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  z-index: 1000;
  font-family: "Inter";
}

.chat-header {
  background-color: black;
  color: white;
  padding: 10px;
  cursor: move; /* Indicate the header is draggable */
  text-align: center;
}

.chat-messages {
  flex: 1;
  padding: 10px;
  overflow-y: auto;
}

.message {
  margin-bottom: 10px;
  padding: 5px;
  border-radius: 5px;
}

.user {
  align-self: flex-end;
  background-color: grey;
  color: black;
}

.bot {
  align-self: flex-start;
  background-color: #f1f1f1;
}

input[type="text"] {
  border: none;
  padding: 10px;
  width: calc(100% - 20px);
}
.minimize-button {
  background-color: transparent;
  border: none;
  color: white;
  cursor: pointer;
  font-size: 30px;
  position: absolute;
  right: 10px;
  top: 0px;
}
</style>
