<template>
  <div v-if="isPomodoroTimerVisible" class="pomodoro-container">
    <div
      class="pomodoro-header"
      @mousedown="dragStart"
      @mousemove="dragging"
      @mouseup="dragEnd"
    >
      Pomodoro Timer
      <button class="minimize-button" @click="togglePomodoroTimerVisibility">
        -
      </button>
    </div>
    <div class="tabs">
      <button @click="selectMode('work')">Timer</button>
      <button @click="selectMode('shortBreak')">Short Break</button>
      <button @click="selectMode('longBreak')">Long Break</button>
    </div>
    <div class="timer-display">
      <h2>{{ currentModeFormatted }}</h2>
      <div>{{ displayTime }}</div>
    </div>
    <div class="timer-controls">
      <button @click="startTimer">Start</button>
      <button @click="stopTimer">Stop</button>
      <button @click="resetTimer">Reset</button>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState, mapMutations } from "vuex";

export default {
  computed: {
    ...mapState({
      isPomodoroTimerVisible: (state) => state.isPomodoroTimerVisible,
      secondsLeft: (state) => state.timerSecondsLeft,
      currentMode: (state) => state.currentMode,
    }),
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
    ...mapMutations(["togglePomodoroTimerVisibility"]),
    ...mapActions([
      "startTimer",
      "stopTimer",
      "selectMode", // Use selectMode action to also reset timer automatically when changing modes
      "resetTimer", // Ensure this is correctly dispatched to reset the timer
    ]),
    resetTimer() {
      this.$store.dispatch("resetTimer"); // Assuming this action resets the timer to the mode's start duration
    },
    selectMode(mode) {
      this.$store.dispatch("selectMode", mode); // Dispatch the selectMode action
    },
    dragStart(event) {
      this.isDragging = true;
      this.dragStartX = event.clientX - this.$el.offsetLeft;
      this.dragStartY = event.clientY - this.$el.offsetTop;
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
  font-family: "Inter";
  text-align: center;
}

.pomodoro-header {
  background-color: black;
  color: white;
  padding: 10px;
  margin-bottom: 10px;
  cursor: move; /* Indicate the header is draggable */
}

.tabs button {
  margin: 0 5px;
  font-family: "Inter";
  cursor: pointer;
  background-color: grey;
}
.tabs button:hover {
  background-color: lightgrey;
}
.timer-display {
  font-size: 40px;
  font-weight: bold;
}

.timer-display h2 {
  margin: 10px 0;
  font-size: 16px;
  font-weight: lighter;
  text-transform: uppercase;
}

.timer-controls button {
  margin: 5px;
  font-family: "Inter";
  border: none;
  border-radius: 10px;
  background-color: grey;
  padding: 5px;
  cursor: pointer;
}

.timer-controls button:hover {
  background-color: lightgray;
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
