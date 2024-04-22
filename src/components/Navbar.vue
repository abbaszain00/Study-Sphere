<template>
  <nav class="navbar">
    <!-- Logo image leading to Home -->
    <router-link to="/" class="navbar-logo">
      <img src="./icons/black-writing-logo.png" alt="StudySphere Logo" />
    </router-link>
    <!--Container for navigation items-->
    <div class="nav-items">
      <router-link to="/faq" class="nav-link">FAQ</router-link>
      <router-link to="/contact" class="nav-link">CONTACT</router-link>

      <!-- Sign In Button -->
      <router-link to="/signin" class="nav-button">LOG IN</router-link>
    </div>
  </nav>
</template>

<script>
export default {
  name: "Navbar",
};
</script>

<style scoped>
.navbar {
  height: 120px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: white;
  color: white;
  top: 50px;
}

.navbar-logo img {
  height: 350px;
  width: auto;
  padding-top: 20px;
  padding-left: 100px;
}

.nav-items {
  display: flex;
  align-items: center;
  font-family: "Inter", sans-serif;
  font-weight: bold;
  font-size: 18px;
  padding: 100px;
  gap: 120px;
}

.nav-link,
.nav-button {
  margin-left: 20px;
  text-decoration: none;
  color: black;
  padding: 0.5rem;
  border-radius: 5px;
  transition: 0.3s;
}

.nav-link {
  position: relative;
  margin-left: 20px;
  text-decoration: none;
  color: black;
  padding: 0.5rem;
  border-radius: 5px;
  transition: color 0.3s;
}

.nav-link::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 2px;
  background-color: black;
  transition: width 0.3s ease;
}

.nav-link:hover::after {
  width: 100%;
}

.nav-link:hover {
  color: black;
}

.nav-button {
  background-color: black;
  color: white;
  padding: 10px 20px;
  margin-left: 20px;
  text-decoration: none;
  border: none;
  cursor: pointer;
  border-radius: 5px;
  transition: 0.3s;
}

.nav-button:hover {
  background-color: rgb(70, 70, 70);
}
</style>
