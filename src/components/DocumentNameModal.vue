<template>
  <!-- Modal overlay that closes the modal if clicked outside the modal content -->
  <div class="modal-overlay" @click.self="close">
    <div class="modal-content">
      <h2>Create New Document</h2>
      <!-- Input field for the document name, bound to the documentName data property -->
      <input
        type="text"
        v-model="documentName"
        placeholder="Document Name"
        required
      />
      <!-- Save button that triggers the save method -->
      <button @click="save">Save</button>
      <!-- Cancel button that triggers the close method -->
      <button @click="close">Cancel</button>
    </div>
  </div>
</template>

<script>
export default {
  name: "DocumentNameModal",

  data() {
    return {
      documentName: "", // Data property for storing the document name input
    };
  },
  methods: {
    // Emits a 'close' event to the parent component to signal that the modal should be closed
    close() {
      this.$emit("close");
    },
    // Method to handle saving the document
    save() {
      // Checks if the document name is not just empty spaces
      if (this.documentName.trim()) {
        this.$emit("save", this.documentName); // Emits a 'save' event with the document name as a payload
        this.documentName = ""; // Resets the document name after saving
      } else {
        alert("Document name is required.");
      }
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

.modal-content button {
  margin: 10px;
  cursor: pointer;
  background-color: black;
  color: white;
  padding: 10px 20px;
  text-decoration: none;
  border: none;
  cursor: pointer;
  border-radius: 5px;
  transition: 0.3s;
  font-family: "Inter";
}
.modal-content button:hover {
  background-color: grey;
}

.modal-content input[type="text"] {
  margin: 8px 0;
  background-color: #d9d9d9;
  border-radius: 10px;
  height: 50px;
  font-family: "Inter";
}
</style>
