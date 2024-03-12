<template>
    <nav class="navbar">
    <!-- Logo image leading to Home -->
    <router-link to="/" class="navbar-logo">
      <img src="./icons/black-writing-logo.png" alt="StudySphere Logo" />
    </router-link>
    
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
  padding-left: 200px;
}

.nav-items {
  display: flex;
  align-items: center;
  font-family: 'Inter', sans-serif;
  font-weight: bold;
  font-size: 18px;
  padding: 100px;
  gap: 120px;
}



.nav-link, .nav-button {
  margin-left: 20px;
  text-decoration: none;
  color: black;
  padding: 0.5rem;
  border-radius: 5px;
  transition: 0.3s; /* Smooth transition for background color */
}

.nav-link {
  position: relative; /* Establish positioning context */
  margin-left: 20px; /* Adjust spacing as needed */
  text-decoration: none;
  color: black;
  padding: 0.5rem;
  border-radius: 5px;
  transition: color 0.3s; /* Smooth color transition */
}

/* Underline effect */
.nav-link::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 2px; /* Height of the underline */
  background-color: black; /* Color of the underline */
  transition: width 0.3s ease; /* Smooth width transition for the animation */
}

.nav-link:hover::after {
  width: 100%; /* Underline expands to full width on hover */
}

.nav-link:hover {
  color: black; /* Optional: change text color on hover */
}


.nav-button {
  background-color: black; /* Light gray background */
  color: white; /* White text */
  padding: 10px 20px; /* Increased padding to make the button bigger */
  margin-left: 20px; /* Adjusted margin */
  text-decoration: none;
  border: none;
  cursor: pointer;
  border-radius: 5px;
  transition: 0.3s; /* Smooth transition for hover effect */
}

.nav-button:hover {
  background-color: rgb(70, 70, 70); /* Darken the button when hovered */
}

</style>
