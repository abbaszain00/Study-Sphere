<template>
  <div class="Header">
    <Top />
  </div>
  <div class="videos-page" @mousemove="handleMouseMove">
    <div class="video-selector" :class="{ 'is-visible': isVisible }">
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
import fireplaceVideo from "@/assets/videos/fireplace.mp4";
import rainVideo from "@/assets/videos/rain.mp4";
import waveVideo from "@/assets/videos/waves.mp4";

import Top from "@/components/Top.vue";

export default {
  name: "Videos",
  components: {
    Top,
  },
  data() {
    return {
      videos: [
        { title: "Rain", url: rainVideo },
        { title: "Fireplace", url: fireplaceVideo },
        { title: "Wave", url: waveVideo },
      ],
      selectedVideo: null,
      isVisible: true,
      volume: 0.5, // Default volume level
    };
  },
  mounted() {
    setTimeout(() => {
      this.isVisible = false; // Hide after 5 seconds
    }, 5000);
  },
  methods: {
    selectVideo(video) {
      this.selectedVideo = video;
      this.$refs.videoElement.volume = this.volume; // Set volume for new video
    },
    handleMouseMove(e) {
      if (window.innerHeight - e.clientY <= 50) {
        this.isVisible = true;
      } else {
        this.isVisible = false;
      }
    },
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
  transform: translateY(100%); /* Hide by default */
  transition: transform 0.5s ease;
}

.video-selector.is-visible {
  transform: translateY(0); /* Visible when active */
}

.video-selector button {
  margin: 5px;
  padding: 10px 20px;
  background: rgba(
    255,
    255,
    255,
    0.8
  ); /* Light background for inactive buttons */
  border-radius: 5px;
  border: 2px solid #000000;

  cursor: pointer;
  font-family: "Inter", sans-serif; /* Ensuring the font family includes a fallback */
  font-weight: bold;
  transition: background-color 0.3s ease, color 0.3s ease; /* Smooth transition for background and color changes */
}

.video-selector button:hover,
.video-selector button.active {
  background-color: grey; /* White background for active/hover state */
  color: black; /* Black text for active/hover state */
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
  margin-left: 20px; /* Space it a bit from the last video button */
}
</style>
