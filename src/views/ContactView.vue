<template>
  <div class="contact-container">
    <div id="navbar">
      <Navbar />
    </div>
    <div class="contact-section">
      <div class="contact-box">
        <h2>Contact Us</h2>
        <div class="contact-details">
          <form @submit.prevent="handleSubmit">
            <!-- Name input -->
            <div class="input-group">
              <input
                type="text"
                placeholder="Your Name"
                v-model="name"
                required
              />
            </div>
            <!-- Email input -->
            <div class="input-group">
              <input
                type="email"
                placeholder="Your Email"
                v-model="email"
                required
              />
            </div>
            <!-- Subject input -->
            <div class="input-group">
              <input
                type="text"
                placeholder="Subject"
                v-model="subject"
                required
              />
            </div>
            <!-- Message input -->
            <div class="input-group">
              <textarea
                placeholder="Your Message"
                v-model="message"
                required
              ></textarea>
            </div>
            <!-- Submit button -->
            <div class="input-group">
              <button type="submit" class="submit-button">
                <b>SEND MESSAGE</b>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios"; // Import Axios for making HTTP requests
import Navbar from "@/components/Navbar.vue"; //Import navbar component

export default {
  name: "Contact",
  components: {
    Navbar,
  },
  data() {
    return {
      name: "",
      email: "",
      subject: "",
      message: "",
    };
  },
  methods: {
    handleSubmit() {
      const formData = {
        name: this.name,
        email: this.email,
        subject: this.subject,
        message: this.message,
      };

      // Make a POST request to the backend using Axios
      axios
        .post("http://localhost:3000/api/contact", formData)
        .then((response) => {
          // Handle success
          alert(response.data.message);
          // Clear form fields
          this.name = "";
          this.email = "";
          this.subject = "";
          this.message = "";
        })
        .catch((error) => {
          // Handle error
          console.error("There was an error!", error);
          alert("Failed to send message.");
        });
    },
  },
};
</script>

<style>
.contact-container {
  background: linear-gradient(white, #d3d0d0, #a1a1a1);
  height: 100vh;
  margin: 0px;
  overflow: scroll;
  font-family: "Inter", sans-serif;
}

.contact-section {
  height: 100vh;
  overflow: hidden;
  align-items: center;
  justify-content: center;
  text-align: center;
  font-size: 28px;
  margin-top: 50px;
}

.contact-box {
  background-color: #ffffff;
  height: 750px;
  margin: auto;
  width: 600px;
  padding: 10px;
  border: 5px solid black;
  border-radius: 5%;
}
.contact-box h2 {
  margin-bottom: -50px;
}
.contact-details {
  margin-top: 100px;
}

.input-group {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 10px; /* Reduced from 10px to 5px */
  width: 100%; /* Ensure input group spans the full width of its container */
  padding-top: 20px;
}

.input-group input[type="text"],
.input-group input[type="email"],
.input-group input[type="password"],
.input-group textarea {
  width: 80%; /* Set the width of the inputs and textarea */
  padding: 12px 30px;
  box-sizing: border-box;
  background-color: #d9d9d9;
  border: none;
  border-radius: 10px;
  font-family: "Inter";
  height: 50px; /* Ensures uniform height for all input fields */
}

.input-group textarea {
  height: 120px; /* Set a fixed height for textarea */
  margin-top: 10px; /* Optional: add if textarea is too close to the input above */
}

.submit-button {
  background-color: grey;
  height: 60px;
  width: 120px;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  font-size: 15px;
  font-family: "Inter";
  margin-top: 10px; /* Increase top margin for better spacing from the last input */
  transition: 0.3s;
}
.submit-button:hover {
  background-color: rgb(180, 180, 180);
}
</style>
