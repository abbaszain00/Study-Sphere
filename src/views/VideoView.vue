<template>
  <div class="Header">
    <Top />
  </div>
  <div class="videos-page">
    <div class="video-selector">
      <button
        v-for="video in videos"
        :key="video.title"
        @click="selectVideo(video)"
      >
        {{ video.title }}
      </button>
    </div>
    <video
      v-if="selectedVideo"
      :src="selectedVideo.url"
      autoplay
      loop
      playsinline
      class="fullscreen-video"
    >
      Your browser does not support the video tag.
    </video>
  </div>
</template>

<script>
import fireplaceVideo from "@/assets/videos/fireplace.mp4";
import rainVideo from "@/assets/videos/rain.mp4";

import Top from "@/components/Top.vue";

export default {
  name: "Videos",
  components: {
    Top,
  },
  data() {
    return {
      videos: [
        // { title: "Cafe", url: "@/assets/videos/cafe.mp4" },
        { title: "Rain", url: rainVideo },
        { title: "Fireplace", url: fireplaceVideo },
        // Add more videos as needed
      ],
      selectedVideo: null,
    };
  },
  methods: {
    selectVideo(video) {
      this.selectedVideo = video;
    },
  },
};
</script>

<style>
.Header {
  position: relative;
  z-index: 3; /* Ensure the top bar is above the video and selector */
}

.videos-page {
  position: relative;
  z-index: 1; /* Video selector is clickable, but below the header */
}

.video-selector {
  position: fixed;
  display: flex;
  /* height: 100px; */
  width: 200px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000; /* Temporarily set a high value for testing */
}
.video-selector button {
  margin: 0 2px;
  padding: 10px 20px;
  background: rgba(255, 255, 255, 0.8);
  border: none;
  cursor: pointer;
}

.fullscreen-video {
  position: fixed;
  right: 0;
  bottom: 0;
  min-width: 100%;
  min-height: 100%;
  width: auto;
  height: auto;
  z-index: 0; /* Stays behind everything else */
  object-fit: cover; /* Cover the full page */
}
</style>
