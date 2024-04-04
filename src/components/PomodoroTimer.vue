<template>
  <div v-if="isPomodoroTimerVisible" class="pomodoro-container">
    <!-- Draggable Header -->
    <div
      class="pomodoro-header"
      @mousedown="dragStart"
      @mousemove="dragging"
      @mouseup="dragEnd"
    >
      Pomodoro Timer
    </div>

    <!-- Tab Selection -->
    <div class="tabs">
      <button @click="selectMode('work')">Timer</button>
      <button @click="selectMode('shortBreak')">Short Break</button>
      <button @click="selectMode('longBreak')">Long Break</button>
    </div>

    <!-- Timer Display -->
    <div class="timer-display">
      <h2>{{ currentModeFormatted }}</h2>
      <div>{{ displayTime }}</div>
    </div>

    <!-- Timer Controls -->
    <div class="timer-controls">
      <button @click="startTimer">Start</button>
      <button @click="stopTimer">Stop</button>
      <button @click="resetTimer">Reset</button>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";

export default {
  data() {
    return {
      timer: null,
      secondsLeft: 20 * 60, // Default to 20 minutes
      modeDurations: {
        work: 20 * 60,
        shortBreak: 5 * 60,
        longBreak: 15 * 60,
      },
      currentMode: "work",
      isVisible: false,
      isDragging: false,
      dragStartX: 0,
      dragStartY: 0,
    };
  },
  computed: {
    ...mapState(["isPomodoroTimerVisible"]), // Use Vuex state for visibility

    displayTime() {
      const minutes = Math.floor(this.secondsLeft / 60);
      const seconds = this.secondsLeft % 60;
      return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
    },
    currentModeFormatted() {
      switch (this.currentMode) {
        case "work":
          return "Work Timer";
        case "shortBreak":
          return "Short Break";
        case "longBreak":
          return "Long Break";
      }
    },
  },

  methods: {
    startTimer() {
      if (this.timer === null) {
        this.timer = setInterval(() => {
          if (this.secondsLeft > 0) {
            this.secondsLeft--;
          } else {
            this.stopTimer(); // Automatically stop timer when time runs out
          }
        }, 1000);
      }
    },
    stopTimer() {
      clearInterval(this.timer);
      this.timer = null;
    },
    resetTimer() {
      this.stopTimer();
      this.secondsLeft = this.modeDurations[this.currentMode];
    },
    selectMode(mode) {
      this.stopTimer(); // Stop any running timer
      this.currentMode = mode;
      this.secondsLeft = this.modeDurations[mode];
    },
    // toggleVisibility() {
    //   this.isVisible = !this.isVisible;
    // },
    dragStart(event) {
      this.isDragging = true;
      const chatbox = this.$el; // This should reference the chatbot container now
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
.pomodoro-container {
  width: 400px;
  height: 200px;
  position: fixed;
  bottom: 20px;
  right: 20px;
  background-color: #fff;
  border: 1px solid #ccc;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  z-index: 1000;
}

.pomodoro-header {
  background-color: black;
  color: white;
  padding: 10px;
  cursor: move; /* Indicate the header is draggable */
}

.tabs button {
  margin: 0 5px;
}

.timer-display h2 {
  margin: 10px 0;
}

.timer-controls button {
  margin: 5px;
}
</style>
