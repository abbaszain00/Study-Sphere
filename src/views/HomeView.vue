<template>
  <div class="home-container">
    <div id="navbar">
      <!--Navbar component-->
      <Navbar />
    </div>
    <!-- Content section of the homepage -->
    <div class="homepage-section">
      <h2>All your study needs in one place</h2>
      <!-- Button that redirects to the signup page -->
      <div class="homepage-button">
        <router-link to="/signup" class="get-started">Get Started</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import Navbar from "@/components/Navbar.vue"; //Import Navbar component
export default {
  name: "HomeView",
  components: {
    Navbar, //Declare Navbar component
  },
};
</script>

<style>
.home-container {
  background: linear-gradient(white, #d3d0d0, #a1a1a1);
  height: 100vh;
  margin: 0px;
  overflow: scroll;
  font-family: "Inter", sans-serif;
}

.homepage-section {
  height: 100vh;
  overflow: hidden;
  align-items: center;
  justify-content: center;
  text-align: center;
  font-size: 28px;
  margin-top: 230px;
}

.get-started {
  background-color: black;
  color: white;
  padding: 10px 20px;
  text-decoration: none;
  border: none;
  cursor: pointer;
  border-radius: 5px;
  transition: 0.3s;
  font-size: 24px;
}

.get-started:hover {
  background-color: rgb(70, 70, 70);
}
</style>
