<template>
  <div class="Header">
  <Top />
  </div>
          <div class="dash-container">
        </div>
</template>

<script>
import Top from '@/components/Top.vue';

export default {
  components: {
    Top,
  },
};
</script>

<style>
body {
  overflow: hidden;
}
.dash-container {
    background-color: white;
    height: 100vh;
  }
  
</style>
