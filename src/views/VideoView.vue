<template>
  <div class="Header">
    <Top />
  </div>
  <div class="videos-page">
    <h1>Videos</h1>
    <!-- Content here for selecting and viewing videos -->
  </div>
</template>

<script>
import Top from "@/components/Top.vue";

export default {
  name: "Videos",
  components: {
    Top,
  },
};
</script>

<style>
.videos-page {
  /* Styles for your videos page */
}
</style>
