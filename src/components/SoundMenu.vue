<template>
  <div v-if="isSoundMenuVisible" class="sound-menu">
    <div
      class="sound-header"
      @mousedown="dragStart"
      @mousemove="dragging"
      @mouseup="dragEnd"
      @mouseleave="dragEnd"
    >
      Nature Sounds
      <button class="minimize-button" @click="toggleSoundMenuVisibility">
        -
      </button>
    </div>
    <ul class="sound-list">
      <li v-for="(sound, index) in sounds" :key="index">
        <button @click="toggleSound(sound.name)">{{ sound.name }}</button>
      </li>
    </ul>
    <div class="volume-control">
      <input type="range" min="0" max="1" step="0.01" v-model="volumeLevel" />
    </div>
  </div>
</template>

<script>
import { mapActions, mapState, mapMutations } from "vuex";
import rainSound from "@/assets/sounds/rain.mp3";
import brownSound from "@/assets/sounds/brown.wav";
import waveSound from "@/assets/sounds/waves.mp3";

export default {
  data() {
    return {
      volume: 1, // Default volume set to maximum (100%)
      isDragging: false,
      startX: 0,
      startY: 0,
      sounds: [
        { name: "Rain 🌧️", url: rainSound },
        { name: "Brown 🟫", url: brownSound },
        { name: "Waves 🌊", url: waveSound },
      ],
    };
  },
  computed: {
    ...mapState(["isSoundMenuVisible"]),
    volumeLevel: {
      get() {
        return this.$store.state.volume;
      },
      set(value) {
        this.$store.dispatch("setVolume", parseFloat(value));
      },
    },
  },
  methods: {
    ...mapMutations(["toggleSoundMenuVisibility"]),
    ...mapActions(["toggleSound", "initializeSound"]),
    updateVolume() {
      this.$store.dispatch("setVolume", this.volume);
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
  mounted() {
    this.sounds.forEach((sound) => {
      this.initializeSound({ name: sound.name, url: sound.url });
    });
  },
};
</script>

<style>
.sound-menu {
  right: 20px;
  position: fixed;
  height: 180px;
  width: 250px;
  background: #fff;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  font-family: "Inter";
}

.sound-header {
  background-color: black;
  color: white;
  padding: 10px;
  cursor: move; /* Indicate the header is draggable */
  text-align: center;
  font-family: "Inter";
}

.sound-list {
  list-style: none;
  padding: 10px;
  display: flex;
  gap: 10px;
  text-align: center;
}

.sound-list button {
  font-family: "Inter";
  font-weight: bolder;
  cursor: pointer;
  background-color: lightgray;
  border-radius: 15px;
}

.sound-list button:hover {
  background-color: rgb(173, 169, 169);
}

.sound-list li {
  margin-bottom: 5px;
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
.volume-control input[type="range"] {
  -webkit-appearance: none;
  appearance: none;
  height: 5px;
  background: #000000;
  border-radius: 15px;
  outline: none;
}

.volume-control input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 20px;
  background: rgb(3, 3, 3);
  cursor: pointer;
}

.volume-control input[type="range"]::-moz-range-thumb {
  width: 20px;
  height: 20px;
  border-radius: 20px;
  background: #fff;
  cursor: pointer;
}

.volume-control {
  text-align: center;
}
</style>
