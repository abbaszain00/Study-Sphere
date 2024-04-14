<template>
  <div class="settings-container">
    <div class="Header">
      <Top />
    </div>
    <div class="settings-content">
      <h1>Settings</h1>
      <div class="settings-section">
        <div>
          <h2>Account Details</h2>
          <label>Email:</label>
          <input type="text" v-model="user.email" disabled />
          <label>First Name:</label>
          <input type="text" v-model="user.firstName" disabled />
          <label>Last Name:</label>
          <input type="text" v-model="user.lastName" disabled />
        </div>
        <form @submit.prevent="changePassword">
          <div>
            <label>Current Password:</label>
            <input type="password" v-model="passwords.oldPassword" required />
          </div>
          <div>
            <label>New Password:</label>
            <input type="password" v-model="passwords.newPassword" required />
          </div>
          <button type="submit">Change Password</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import Top from "@/components/Top.vue";
import axios from "axios";

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
      },
    };
  },

  methods: {
    fetchUserData() {
      axios
        .get("/api/user", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
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
    async changePassword() {
      if (!this.passwords.oldPassword || !this.passwords.newPassword) {
        alert("Please fill in all password fields.");
        return;
      }

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

        alert(response.data.message);
        this.passwords.oldPassword = "";
        this.passwords.newPassword = "";
      } catch (error) {
        console.error(
          "Failed to change password:",
          error.response.data.message
        );
        alert(error.response.data.message);
      }
    },
  },
  mounted() {
    this.fetchUserData();
  },
};
</script>

<style>
.settings-container {
  width: 100%;
  height: 100vh;
  font-family: "Inter", sans-serif;
  background-color: #f4f4f4;
}
.settings-content {
  padding: 20px;
  max-width: 600px;
  margin: 0 auto;
}
.settings-section {
  background: #fff;
  padding: 20px;
  margin-top: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
</style>
