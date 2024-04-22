<template>
  <div class="signin-container">
    <div id="navbar">
      <!--Navbar component-->
      <Navbar />
    </div>
    <div class="signin-section">
      <div class="signin-box">
        <!-- Display a session expiration message if session expired -->
        <p v-if="sessionExpiredMessage" class="session-expired-message">
          {{ sessionExpiredMessage }}
        </p>
        <h2>Login</h2>
        <div class="login-details">
          <!-- Sign-in form -->
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
            </div>
            <!-- Submit button -->
            <div class="input-group">
              <button type="submit" class="login-button"><b>LOGIN</b></button>
            </div>
          </form>
          <!-- Link to the sign-up page if the user does not have an account -->
          <div class="signup">
            <p>Don't have an account? <a href="/signup">Sign Up</a></p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Navbar from "@/components/Navbar.vue"; //Navbar component imported
import axios from "axios"; // Axios is imported for HTTP requests

export default {
  name: "SignIn",
  components: {
    Navbar, // Declare Navbar component used in this view
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
        // Perform a POST request to the login API endpoint
        const response = await axios.post("http://localhost:3000/api/login", {
          email: this.email,
          password: this.password,
        });

        const data = response.data; // Extract data from response

        if (data.token) {
          // Store the token in localStorage
          localStorage.setItem("token", data.token);

          // Set the default axios authorization header to the received token
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
    // Check if the session expired message should be displayed
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
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 0px;
  padding-top: 50px;
}

input[type="email"],
input[type="password"] {
  width: 80%;
  padding: 12px 30px;
  margin: 8px 0;
  display: block;
  box-sizing: border-box;
  background-color: #d9d9d9;
  border: none;
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
  color: #d9534f;
  text-align: center;
  margin-top: 15px;
  font-size: 20px;
  font-weight: bold;
}
</style>
