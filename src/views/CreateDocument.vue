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
  data() {
    return {
      title: "",
      content: "",
      editorOptions: {}, // Specify any options for Quill editor here
    };
  },
  methods: {
    submitDocument() {
      const documentData = {
        title: this.title,
        content: this.content,
      };

      axios
        .post("http://localhost:3000/api/documents", documentData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })

        .then((response) => {
          this.$store.dispatch("createDocument", response.data.document); // Assuming your backend returns the created document
          this.$router.push({ name: "dash" });
        })
        .catch((error) => {
          console.error("Failed to create document:", error);
          alert("There was a problem creating your document.");
        });
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
