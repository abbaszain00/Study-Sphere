<template>
  <div>
    <!-- Sidebar toggle button -->
    <button @click="toggleSidebar" class="icon-button">
      <font-awesome-icon icon="bars" size="2x"/>
    </button>
<!-- Sidebar content -->
<div v-if="isSidebarOpen" class="sidebar" @click.stop>
      <!-- Sidebar icons -->
      <nav class="sidebar-icons">
        <button @click="closeSidebar"><font-awesome-icon icon="arrow-left" size="2x"/></button>
        <button><font-awesome-icon icon="list" size="2x"/><p>To-Do</p></button>
        <button><font-awesome-icon icon="clock" size="2x"/><p>Pomodoro</p></button>
        <button><font-awesome-icon icon="music" size="2x"/><p>Sounds</p></button>
        <button><font-awesome-icon icon="gear" size="2x"/><p>Settings</p></button>
        <button @click="logoutUser"><font-awesome-icon icon="circle-xmark" size="2x"/><p>Log out</p></button>
      </nav>
    </div>

    <!-- Overlay to detect clicks outside -->
    <div v-show="isSidebarOpen"  @click="closeSidebar"></div>
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
    },
    logoutUser() {
      // Example: Clear user data stored in localStorage or Vuex
      localStorage.removeItem('token'); // Assuming you store a token

      // Redirect to the homepage
      this.$router.push({ name: 'Home' });
    }
  }
} 
</script>

<style>
/* Basic styling */
.sidebar {
  width: 80px;
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  background-color: white;
  /* Adjust transition for the animation */
  transition: transform 0.3s ease;
}



.icon-button {
  background: none; /* Remove default background */
  border: none; /* Remove default border */
  padding: 0; /* Remove default padding */
  cursor: pointer; /* Keep the pointer cursor to indicate it's clickable */
  height: 50px;
  width: 50px;
}

.icon-button:hover {
  background-color: rgba(231, 231, 231, 0.877);
}

.sidebar-icons {
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding-top: 20px;
  margin: 0px;
  cursor: pointer;

}

.sidebar-icons button {
  height: 80px;
  width: 80px;
  background: none;
  border: none;
  cursor: pointer;
  font-weight: bold;
  font-family: 'Inter', sans-serif;

}

.sidebar-icons button:hover {
  background-color: rgba(231, 231, 231, 0.877);
}


</style>
