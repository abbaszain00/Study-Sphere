<template>
  <div class="create-document">
    <h2>Create New Document</h2>
    <div class="form-group">
      <!-- Label for the document title input -->
      <label for="documentTitle">Title</label>
      <!-- Ensure the input's id matches the label's for attribute -->
      <input
        type="text"
        id="documentTitle"
        v-model="title"
        placeholder="Document Title"
      />
    </div>
    <div class="form-group">
      <!-- Since Quill Editor doesn't have an id, you might omit the for attribute or handle it differently -->
      <label>Content</label>
      <!-- Quill editor for document content -->
      <quill-editor v-model="content" :options="editorOptions"></quill-editor>
    </div>
    <button @click="submitDocument">Create Document</button>
  </div>
</template>

<script>
import { QuillEditor } from "@vueup/vue-quill"; // Import this based on how you installed Quill for Vue
import axios from "axios";

export default {
  components: {
    QuillEditor,
  },
  // EditDocument.vue
  data() {
    return {
      document: null, // For storing the document to be edited
    };
  },
  async mounted() {
    await this.fetchDocument();
  },
  methods: {
    async fetchDocument() {
      const documentId = this.$route.params.documentId;
      try {
        const response = await axios.get(`/api/documents/${documentId}`);
        this.document = response.data;
      } catch (error) {
        console.error("Failed to load document:", error);
        // Handle error, e.g., show notification or redirect
      }
    },
    async saveDocument() {
      const documentId = this.$route.params.documentId;
      try {
        await axios.put(`/api/documents/${documentId}`, this.document);
        // Handle success, e.g., show notification or redirect back to dashboard
      } catch (error) {
        console.error("Failed to save document:", error);
        // Handle error, e.g., show notification
      }
    },
  },
};
</script>

<style scoped>
.create-document {
  max-width: 800px;
  margin: auto;
  padding: 20px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
}

.form-group input,
.form-group .quill-editor {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button {
  background-color: #007bff;
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}
</style>
