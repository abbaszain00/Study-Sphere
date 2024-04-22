<template>
  <div class="settings-container">
    <div class="Header">
      <Top />
      <!--Top navbar component-->
    </div>
    <div class="settings-content">
      <h1>Settings</h1>
      <div class="settings-section">
        <div>
          <!--Section for displaying account info-->
          <h2>Account Details</h2>
          <label>Email:</label>
          <input type="text" v-model="user.email" disabled />
          <label>First Name:</label>
          <input type="text" v-model="user.firstName" disabled />
          <label>Last Name:</label>
          <input type="text" v-model="user.lastName" disabled />
        </div>
        <!--Form for changing password-->
        <form @submit.prevent="changePassword">
          <div>
            <label>Current Password:</label>
            <input type="password" v-model="passwords.oldPassword" required />
          </div>
          <div>
            <label>New Password:</label>
            <input type="password" v-model="passwords.newPassword" required />
          </div>
          <div>
            <label>Confirm New Password:</label>
            <input
              type="password"
              v-model="passwords.confirmNewPassword"
              required
            />
          </div>
          <!--Submit button for changing password-->
          <button
            type="submit"
            :disabled="passwords.newPassword !== passwords.confirmNewPassword"
          >
            Change Password
          </button>
          <!--Button for deleting account-->
          <button type="button" @click="deleteAccount" class="delete-button">
            Delete Account
          </button>
          <!-- Message if passwords do not match -->
          <p v-if="passwords.newPassword !== passwords.confirmNewPassword">
            Passwords do not match.
          </p>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import Top from "@/components/Top.vue"; //Import Top component
import axios from "axios"; //Import axios for HTTP requests

export default {
  name: "Settings",
  components: {
    Top,
  },
  data() {
    return {
      user: {
        email: "",
        firstName: "",
        lastName: "",
      },
      passwords: {
        oldPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      },
    };
  },

  methods: {
    //Method for account deletion
    deleteAccount() {
      if (
        confirm(
          "Are you sure you want to delete your account? This cannot be undone."
        )
      ) {
        axios
          .delete("/api/delete-account", {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          })
          .then(() => {
            alert("Your account has been deleted.");
            localStorage.removeItem("token"); // Remove the stored token
            this.$router.push("/Signin"); // Redirect to login or home page
          })
          .catch((error) => {
            console.error("Failed to delete account:", error);
            alert("Failed to delete account.");
          });
      }
    },
    // Method to fetch user data from the server.
    fetchUserData() {
      axios
        .get("/api/user", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        // Assign the fetched user data to the user object.
        .then((response) => {
          this.user.email = response.data.email;
          this.user.firstName = response.data.firstName;
          this.user.lastName = response.data.lastName;
        })
        .catch((error) => {
          console.error("Failed to fetch user details:", error);
          alert("Failed to load user details.");
        });
    },
    // method to handle password change.
    async changePassword() {
      if (
        !this.passwords.oldPassword ||
        !this.passwords.newPassword ||
        !this.passwords.confirmNewPassword
      ) {
        alert("Please fill in all fields.");
        return;
      }
      // Check if the new passwords match.
      if (this.passwords.newPassword !== this.passwords.confirmNewPassword) {
        alert("The new passwords do not match.");
        return;
      }
      // Make a POST request to change the password.
      try {
        const response = await axios.post(
          "/api/change-password",
          {
            oldPassword: this.passwords.oldPassword,
            newPassword: this.passwords.newPassword,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        alert(response.data.message); // Notify user of successful password change.
        // Reset password fields.
        this.passwords.oldPassword = "";
        this.passwords.newPassword = "";
        this.passwords.confirmNewPassword = "";
      } catch (error) {
        console.error(
          "Failed to change password:",
          error.response ? error.response.data.message : error.message
        );
        alert("Failed to change password.");
      }
    },
  },
  mounted() {
    this.fetchUserData(); // Fetch user data when the component mounts.
  },
};
</script>

<style>
.settings-container {
  width: 100%;
  height: 100vh;
  font-family: "Inter", sans-serif;
  background: linear-gradient(white, #d3d0d0, #a1a1a1);
  font-family: "Inter";
}
.settings-content {
  padding: 20px;
  max-width: 600px;
  margin: 0 auto;
  font-family: "Inter";
}

.settings-section {
  background: #fff;
  padding: 20px;
  margin-top: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  font-family: "Inter";
}

.settings-section label {
  font-weight: bolder;
}

.settings-section button {
  font-family: "Inter";
  cursor: pointer;
  background-color: white;
  color: black;
  text-decoration: none;
  border-radius: 5px;
  transition: 0.3s;
  font-weight: bold;
  margin-top: 20px;
  height: 40px;
}
.settings-section button:hover {
  background-color: grey;
}
.settings-section input {
  width: 80%;
  padding: 12px 30px;
  margin: 8px 0;
  display: block;
  box-sizing: border-box;
  background-color: #d9d9d9;
  border: none;
  border-radius: 10px;
  height: 50px;
  font-family: "Inter";
}
.delete-button {
  background-color: red;
  color: white;
  padding: 10px 20px;
  border-radius: 5px;
  margin-left: 10px;
}
</style>
