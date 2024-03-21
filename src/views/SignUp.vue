<template>
  <div class="signup-container">
    <div id="navbar">
      <Navbar />
    </div>
    <div class="signup-section">
      <div class="signup-box">
        <div class="left">
          <h2>Create your own StudySphere account</h2>
          <img src="@/components/icons/white-logo.png">
        </div>
        <div class="right">
          <h2>Sign Up</h2>
          <form @submit.prevent="createAccount">
            <div class ="names">
            <input type="text" placeholder="First Name" v-model="firstName" required>
            <input type="text" placeholder="Last Name" v-model="lastName" required>
            </div>
              <input type="email" placeholder="Email" v-model="email" required>
              <input type="password" placeholder="Password" v-model="password" required>
            <button type="submit">Create Account</button>
          </form>
          <p>
            Already have an account? <a href="/signin">Login</a>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import Navbar from '@/components/Navbar.vue';
import SignIn from './SignIn.vue';

export default {
  name: 'SignUp',
  components: {
    Navbar,
  },
  data() {
    return {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
    };
  },
  methods: {
    async createAccount() {
  try {
    const response = await fetch('http://localhost:3000/api/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email,
        password: this.password,
      }),
    });

    const data = await response.json(); // Assuming the server always sends a JSON response

    if (!response.ok) {
      throw new Error(data.message || 'Signup failed');
    }

    alert(data.message); // Show success message or redirect
    this.$router.push({ name: 'Signin' });// Redirect to login page or dashboard as appropriate
  } catch (error) {
    console.error('Error:', error);
    alert(error.message); // Display the actual error message from the server or the default 'Signup failed'
  }
}
  }
}
</script>

<style>
.signup-container {
  background: linear-gradient(white, #D3D0D0,#A1A1A1);
  height: 100vh;
  margin: 0px;
  overflow: hidden;
  font-family: 'Inter', sans-serif;  
}

.signup-section {
  height: 100vh;
  overflow: hidden;
  align-items: center;
  justify-content: center;
  text-align: center;
  font-size: 28px;
  margin-top: 30px;
}

.signup-box {
  background: linear-gradient(
    to left, 
    #FFF 0%, 
    #FFF 55%, 
    #000000 30%, 
    #000000 100%
  );  
  height: 700px;
  margin: auto;
  width: 1000px;
  padding: 10px;
  border: 5px solid black;
  border-radius: 5%;
  display: flex;
}

.left {
  height: 650px;
  width: 450px;
  text-align: center;
  align-items: center;
  display: block;
  margin-left: 20px;
}

.left h2 {
  color: white;
  margin-right: 10px;
  margin-top: 100px;
  
}

.left img{
  height: 350px;
  width: 350px;
}

.right {
  height: 650px;
  width: 600px;
  display: flex;
  flex-direction: column;
  /* align-items: flex-start;  */
  padding-left: 50px; /* Adjust as needed for internal spacing */
}


.names {
  display: flex;
  gap: 20px; /* Adjust the gap between the inputs */
  width: 100%; /* Take up full width to align with other inputs */
  margin-bottom: 15px; 
}

.names input {
  flex: 1; /* Allows both inputs to share the available space equally */
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
}

/* Ensure email and password inputs align with name inputs */
.right input[type="email"], .right input[type="password"] {
  width: 100%; /* Adjust width to match name inputs considering padding */
  margin-bottom: 15px; /* Consistent spacing */

}

.right input[type="email"], .right input[type="text"] {
  margin-right: 20px;
  width: 100%;
  padding: 12px 30px;
  margin: 8px 0;
  display: block;
  box-sizing: border-box;
  background-color: #D9D9D9;
  border: none;
  border-radius: 10px;
  height: 60px;
  font-family: "Inter";
}
.right input[type="email"] {
  margin-bottom: 20px;
}

.right input[type="password"] {
  margin-bottom: 30px;
}

.right button {
  background-color: rgb(0, 0, 0);
  color: white;
  height: 60px;
  width: 150px;
  border-radius: 10px;
  border: 0px;
  cursor: pointer;
  font-size: 15px;
  font-family: "Inter";
}

.right p {
  font-size: 15px;
  font-weight: bold;
}

.right a {
  color: black;
}

.right a:hover {
  color: grey;
}

</style>
