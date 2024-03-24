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
.dash-container {
    background-color: rgba(223, 222, 222, 0.637);
    height: 100vh;
  }
  
</style>
