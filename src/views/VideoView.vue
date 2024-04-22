<template>
  <div class="Header">
    <!--Top navbar component-->
    <Top />
  </div>
  <!-- Container for video playback and selection controls -->
  <div class="videos-page" @mousemove="handleMouseMove">
    <!-- Selector for videos -->
    <div class="video-selector" :class="{ 'is-visible': isVisible }">
      <!-- Dynamically creates buttons for each video in the videos array -->
      <button
        v-for="video in videos"
        :key="video.title"
        @click="selectVideo(video)"
        :class="{
          active: selectedVideo && selectedVideo.title === video.title,
        }"
      >
        {{ video.title }}
      </button>
      <!-- Volume control slider -->
      <input
        type="range"
        min="0"
        max="1"
        step="0.1"
        v-model="volume"
        @input="setVolume"
        class="volume-slider"
      />
    </div>
    <!-- Conditionally renders a video player if a video is selected -->
    <video
      v-if="selectedVideo"
      :src="selectedVideo.url"
      autoplay
      loop
      playsinline
      class="fullscreen-video"
      ref="videoElement"
    >
      Your browser does not support the video tag.
    </video>
  </div>
</template>

<script>
// Imports for video files stored in the assets directory
import fireplaceVideo from "@/assets/videos/fireplace.mp4";
import rainVideo from "@/assets/videos/rain.mp4";
import waveVideo from "@/assets/videos/waves.mp4";

import Top from "@/components/Top.vue"; // Import the Top component

export default {
  name: "Videos",
  components: {
    Top, // Declaration of the Top component
  },
  data() {
    return {
      videos: [
        // Array of video objects with titles and URLs
        { title: "Rain", url: rainVideo },
        { title: "Fireplace", url: fireplaceVideo },
        { title: "Wave", url: waveVideo },
      ],
      selectedVideo: null, // Stores the currently selected video object
      isVisible: true, // Controls the visibility of the video selector
      volume: 0.5, // Default volume level
    };
  },
  mounted() {
    // Automatically hide the video selector 5 seconds after the component is mounted
    setTimeout(() => {
      this.isVisible = false;
    }, 5000);
  },
  methods: {
    selectVideo(video) {
      this.selectedVideo = video; // Set the selected video
      this.$refs.videoElement.volume = this.volume; // Apply the current volume to the video
    },
    // Show the video selector if the mouse is near the bottom of the window
    handleMouseMove(e) {
      if (window.innerHeight - e.clientY <= 50) {
        this.isVisible = true;
      } else {
        this.isVisible = false;
      }
    },
    // Adjust the volume of the video element based on the slider
    setVolume() {
      if (this.$refs.videoElement) {
        this.$refs.videoElement.volume = this.volume;
      }
    },
  },
};
</script>

<style>
.Header {
  position: relative;
  z-index: 3;
}

.videos-page {
  position: relative;
  z-index: 1;
  width: 100%;
  height: 100vh;
}

.video-selector {
  position: fixed;
  display: flex;
  width: 100%;
  bottom: 0;
  left: 0;
  justify-content: center;
  z-index: 1000;
  background: rgba(0, 0, 0, 0.7);
  transform: translateY(100%);
  transition: transform 0.5s ease;
}

.video-selector.is-visible {
  transform: translateY(0);
}

.video-selector button {
  margin: 5px;
  padding: 10px 20px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 5px;
  border: 2px solid #000000;

  cursor: pointer;
  font-family: "Inter", sans-serif;
  font-weight: bold;
  transition: background-color 0.3s ease, color 0.3s ease;
}

.video-selector button:hover,
.video-selector button.active {
  background-color: grey;
  color: black;
}

.fullscreen-video {
  position: fixed;
  right: 0;
  bottom: 0;
  min-width: 100%;
  min-height: 100%;
  width: auto;
  height: auto;
  z-index: 0;
  object-fit: cover;
}
.volume-slider {
  width: 100px;
  vertical-align: middle;
  margin-left: 20px;
}
</style>
