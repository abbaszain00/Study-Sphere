<template>
  <div
    v-if="isSoundMenuVisible"
    class="sound-menu"
    @mousedown="dragStart"
    @mousemove="dragging"
    @mouseup="dragEnd"
    @mouseleave="dragEnd"
  >
    <div class="sound-header">Nature Sounds</div>
    <ul class="sound-list">
      <li v-for="(sound, index) in sounds" :key="index">
        <button @click="toggleSound(sound.name)">{{ sound.name }}</button>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import rainSound from "@/assets/sounds/rain.mp3";

export default {
  data() {
    return {
      isDragging: false,
      startX: 0,
      startY: 0,
      sounds: [{ name: "Rain", url: rainSound }],
      audioElements: {},
    };
  },
  computed: {
    ...mapState(["isSoundMenuVisible"]),
  },
  methods: {
    toggleSound(soundName) {
      const sound = this.sounds.find((s) => s.name === soundName);
      if (!sound) return;

      // Initialize audio element if it doesn't exist
      if (!this.audioElements[soundName]) {
        const audio = new Audio(sound.url);
        audio.loop = true; // Ensure the sound loops
        this.audioElements[soundName] = audio;
      }

      const audioElement = this.audioElements[soundName];
      if (audioElement.paused) {
        audioElement
          .play()
          .catch((err) => console.error("Error playing sound:", err));
      } else {
        audioElement.pause();
      }
    },
    dragStart(event) {
      this.isDragging = true;
      this.startX = event.clientX - this.$el.offsetLeft;
      this.startY = event.clientY - this.$el.offsetTop;
      event.preventDefault(); // Prevent text selection or other default actions
    },
    dragging(event) {
      if (!this.isDragging) return;
      this.$el.style.left = `${event.clientX - this.startX}px`;
      this.$el.style.top = `${event.clientY - this.startY}px`;
    },
    dragEnd() {
      this.isDragging = false;
    },
  },
  beforeDestroy() {
    // Pause all sounds and clean up before destroying the component
    Object.values(this.audioElements).forEach((audio) => audio.pause());
  },
};
</script>

<style>
.sound-menu {
  position: fixed;
  width: 250px;
  background: #fff;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  cursor: grab; /* Indicates the component can be dragged */
}

.sound-header {
  background: #f7f7f7;
  padding: 10px;
  border-bottom: 1px solid #eee;
  cursor: grabbing; /* Changes cursor style during dragging */
}

.sound-list {
  list-style: none;
  padding: 10px;
}

.sound-list li {
  margin-bottom: 10px;
}
</style>
