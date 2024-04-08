<template>
  <div class="modal-overlay" @click.self="close">
    <div class="modal-content">
      <h2>Create New Document</h2>
      <input type="text" v-model="documentName" placeholder="Document Name" />
      <button @click="save">Save</button>
      <button @click="close">Cancel</button>
    </div>
  </div>
</template>

<script>
export default {
  name: "DocumentNameModal",

  data() {
    return {
      documentName: "",
    };
  },
  methods: {
    close() {
      this.$emit("close");
    },
    save() {
      this.$emit("save", this.documentName);
      this.documentName = ""; // Reset the name field
    },
  },
};
</script>

<style>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}
.modal-content {
  background: white;
  padding: 20px;
  border-radius: 5px;
  text-align: center;
  font-family: "Inter";
}

/* Add styles for buttons within modal-content */
.modal-content button {
  margin: 10px; /* Adjust as needed */
  cursor: pointer;
  background-color: black; /* Light gray background */
  color: white; /* White text */
  padding: 10px 20px; /* Increased padding to make the button bigger */
  text-decoration: none;
  border: none;
  cursor: pointer;
  border-radius: 5px;
  transition: 0.3s; /* Smooth transition for hover effect */
  /* font-size: 24px; */
}
.modal-content button:hover {
  background-color: grey;
}

/* Style for the input field to match your design preferences */
.modal-content input[type="text"] {
  margin: 8px 0;
  background-color: #d9d9d9;
  border-radius: 10px;
  height: 50px;
  font-family: "Inter";
}
</style>
