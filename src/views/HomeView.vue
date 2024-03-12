<template>
  <div class ="home-container">
    <div id="navbar">
      <Navbar />

    </div>
    <div class ="homepage-section">
      <h2>All your study needs in one place.</h2>
    </div>
  </div>
</template>

<script>
import Navbar from '@/components/Navbar.vue';
export default {
  name: 'HomeView',
  components: {
    Navbar,
  },
};
</script>

<style>
.home-container {
  background: linear-gradient(white, #D3D0D0,#A1A1A1);
  height: 100vh;
  margin: 0px;
  overflow: hidden;
  font-family: 'Inter', sans-serif;
}

.homepage-section {
  height: 100vh;
  overflow: hidden;
}
</style>
