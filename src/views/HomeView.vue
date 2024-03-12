<template>
  <div class ="home-container">
    <div id="navbar">
      <Navbar />

    </div>
    <div class ="homepage-section">
      <h2>All your study needs in one place</h2>
      <div class= "homepage-button">
        <router-link to="/signin" class="get-started">Get Started</router-link>
      </div>
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
  align-items: center;
  justify-content: center;
  text-align: center;
  font-size: 28px;
  margin-top: 30px;
}

.get-started {
  background-color: black; /* Light gray background */
  color: white; /* White text */
  padding: 10px 20px; /* Increased padding to make the button bigger */
  text-decoration: none;
  border: none;
  cursor: pointer;
  border-radius: 5px;
  transition: 0.3s; /* Smooth transition for hover effect */
  font-size: 24px;
}

.get-started:hover {
  background-color: rgb(70, 70, 70); /* Darken the button when hovered */
}
</style>
