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
        <button @click="toggleSound(sound.url)">{{ sound.name }}</button>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";

export default {
  data() {
    return {
      isDragging: false,
      startX: 0,
      startY: 0,
      sounds: [
        {
          name: "Rain",
          url: "@/assets/sounds/rain.mp3",
        },
        { name: "Ocean", url: "path/to/ocean.mp3" },
        { name: "Forest", url: "path/to/forest.mp3" },
        // Add more sounds as needed
      ],
      audioElements: {},
    };
  },
  computed: {
    ...mapState(["isSoundMenuVisible"]),
  },
  methods: {
    toggleSound(url) {
      // Initialize audio element if it doesn't exist
      if (!this.audioElements[url]) {
        const audio = new Audio(url);
        audio.loop = true; // Ensure the sound loops
        this.audioElements[url] = audio;
      }

      // Play or pause the audio based on its current state
      const sound = this.audioElements[url];
      if (sound.paused) {
        sound.play();
      } else {
        sound.pause();
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
    toggleVisibility() {
      this.isVisible = !this.isVisible;
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
