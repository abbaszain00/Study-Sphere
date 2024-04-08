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
}
</style>
