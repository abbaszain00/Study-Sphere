<template>
  <div>
    <!-- Sidebar toggle button -->
    <button @click="toggleSidebar">Toggle Sidebar</button>

    <!-- Sidebar content -->
    <div v-if="isSidebarOpen" class="sidebar" @click.stop>
      <!-- Sidebar content goes here -->
      <p>This is the sidebar content!</p>
    </div>

    <!-- Overlay to detect clicks outside -->
    <div v-if="isSidebarOpen" class="overlay" @click="closeSidebar"></div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isSidebarOpen: false,
    };
  },
  methods: {
    toggleSidebar() {
      this.isSidebarOpen = !this.isSidebarOpen;
    },
    closeSidebar() {
      this.isSidebarOpen = false;
    }
  }
};
</script>

<style>
/* Basic styling */
.sidebar {
  width: 250px;
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  background-color: #f4f4f4;
  /* Adjust transition for the animation */
  transition: transform 0.3s ease;
}

.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  /* background: rgba(0, 0, 0, 0.5); */
}
</style>
