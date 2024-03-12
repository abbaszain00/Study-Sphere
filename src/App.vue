<template>
  <div id="app">
    <HomeView />
    <!-- <Navbar /> -->
  </div>
</template>

<script>
import HomeView from './views/HomeView.vue';
// import Navbar from './components/Navbar.vue';

export default {
  name: 'App',
  components: {
    HomeView,
    // Navbar,
  },
};
</script>

<style scoped>

</style>