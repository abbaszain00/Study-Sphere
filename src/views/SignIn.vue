<template>
  <div class="signin-container">
    <div id="navbar">
      <Navbar />
    </div>
    <div class="signin-section">
      <div class="signin-box">
        <h2>Login</h2>
        <div class="login-details">
          <form @submit.prevent="handleLogin">
            <!-- Email input -->
            <div class="input-group">
              <input type="email" placeholder="Email" v-model="email" required> <!-- Updated to type="email" -->
            </div>
            <!-- Password input -->
            <div class="input-group">
              <input type="password" placeholder="Password" v-model="password" required>
              <a href="#" class="forgot-pw">Forgot password?</a> <!-- Placeholder link -->
            </div>
            <!-- Submit button -->
            <div class="input-group">
              <button type="submit" class="login-button"><B>LOGIN</B></button>
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
 import Navbar from '@/components/Navbar.vue';
 export default {
   name: 'SignIn',
   components: {
     Navbar,
   },
   data() {
    return {
      email: '',
      password: '',
    };
  },
  methods: {
    async handleLogin() {
      try {
        const response = await fetch('http://localhost:3000/api/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: this.email,
            password: this.password,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Login failed');
        }

        alert(data.message); // Login successful
        this.$router.push({ name: 'dash' });// Here you can redirect the user to another page or save the login state
      } catch (error) {
        console.error('Error:', error);
        alert(error.message);
      }
    }
  }
}

 </script>
 
 <style>
 .signin-container {
   background: linear-gradient(white, #D3D0D0,#A1A1A1);
   height: 100vh;
   margin: 0px;
   overflow: hidden;
   font-family: 'Inter', sans-serif;  
   
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
  background-color: #FFFFFF;
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

input[type="email"], input[type="password"] {
  width: 80%; /* Input takes full width of its container */
  padding: 12px 30px;
  margin: 8px 0;
  display: block; /* Inputs are block-level by default, restated for clarity */
  box-sizing: border-box;
  background-color: #D9D9D9;
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

.signup, .signup a {
  font-size: 20px;  
  padding-top: 20px;
}

.signup a{
  text-decoration: underline;
  color: black;
}

.signup a:hover {
  color: grey;
}

</style>
 