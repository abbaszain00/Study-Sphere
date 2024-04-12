<template>
  <div class="signin-container">
    <div id="navbar">
      <Navbar />
    </div>
    <div class="signin-section">
      <div class="signin-box">
        <p v-if="sessionExpiredMessage" class="session-expired-message">
          {{ sessionExpiredMessage }}
        </p>
        <h2>Login</h2>
        <div class="login-details">
          <form @submit.prevent="handleLogin">
            <!-- Email input -->
            <div class="input-group">
              <input
                type="email"
                placeholder="Email"
                v-model="email"
                required
              />
            </div>
            <!-- Password input -->
            <div class="input-group">
              <input
                type="password"
                placeholder="Password"
                v-model="password"
                required
              />
              <a href="#" class="forgot-pw">Forgot password?</a>
            </div>
            <!-- Submit button -->
            <div class="input-group">
              <button type="submit" class="login-button"><b>LOGIN</b></button>
            </div>
          </form>
          <div class="signup">
            <p>Don't have an account? <a href="/signup">Sign Up</a></p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Navbar from "@/components/Navbar.vue";
import axios from "axios"; // Ensure axios is imported

export default {
  name: "SignIn",
  components: {
    Navbar,
  },
  data() {
    return {
      email: "",
      password: "",
      sessionExpiredMessage: "",
    };
  },
  methods: {
    async handleLogin() {
      try {
        // Using axios instead of fetch for consistency and ease of setting headers globally
        const response = await axios.post("http://localhost:3000/api/login", {
          email: this.email,
          password: this.password,
        });

        const data = response.data; // With axios, the response is automatically parsed

        if (data.token) {
          // Store the token in localStorage
          localStorage.setItem("token", data.token);

          // Configure axios to use the token in future requests
          axios.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${data.token}`;

          alert(data.message); // Success message
          this.$router.push({ name: "dash" }); // Redirect to dashboard
        } else {
          throw new Error("Login failed");
        }
      } catch (error) {
        console.error("Error:", error);
        alert(error.response?.data?.message || "Login failed"); // Handle error responses from axios
      }
    },
  },
  created() {
    // Check for the query parameter upon component creation
    if (this.$route.query.sessionExpired === "true") {
      this.sessionExpiredMessage =
        "Your session has expired. Please log in again.";
    }
  },
};
</script>

<style>
.signin-container {
  background: linear-gradient(white, #d3d0d0, #a1a1a1);
  height: 100vh;
  margin: 0px;
  overflow: hidden;
  font-family: "Inter", sans-serif;
}

.signin-section {
  height: 100vh;
  overflow: hidden;
  align-items: center;
  justify-content: center;
  text-align: center;
  font-size: 28px;
  margin-top: 50px;
}
.signin-box {
  background-color: #ffffff;
  height: 700px;
  margin: auto;
  width: 600px;
  padding: 10px;
  border: 5px solid black;
  border-radius: 5%;
}
.input-group {
  display: flex; /* Continue using flexbox for layout */
  flex-direction: column; /* Stack items vertically */
  align-items: center; /* Align items to the start */
  margin-bottom: 0px; /* Increase or adjust spacing between groups as needed */
  padding-top: 50px;
}

.forgot-pw {
  font-size: 15px;
  padding: 0px;
  margin: 0px;
  padding-right: 320px;
  text-decoration: none;
  color: black;
}

.forgot-pw:hover {
  color: grey;
}

input[type="email"],
input[type="password"] {
  width: 80%; /* Input takes full width of its container */
  padding: 12px 30px;
  margin: 8px 0;
  display: block; /* Inputs are block-level by default, restated for clarity */
  box-sizing: border-box;
  background-color: #d9d9d9;
  border: none; /* Ensure there's no border */
  border-radius: 10px;
  height: 60px;
  font-family: "Inter";
}

.login-button {
  background-color: grey;
  height: 60px;
  width: 120px;
  border-radius: 10px;
  border: 0px;
  cursor: pointer;
  font-size: 15px;
  font-family: "Inter";
}

.signup,
.signup a {
  font-size: 20px;
  padding-top: 20px;
}

.signup a {
  text-decoration: underline;
  color: black;
}

.signup a:hover {
  color: grey;
}
.session-expired-message {
  color: #d9534f; /* Bootstrap 'danger' color */
  text-align: center;
  margin-top: 15px;
  font-size: 20px;
  font-weight: bold;
}
</style>
