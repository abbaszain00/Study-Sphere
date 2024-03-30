<template>
  <div class="create-document">
    <h2>Create New Document</h2>
    <div class="form-group">
      <label for="documentTitle">Title</label>
      <input
        type="text"
        id="documentTitle"
        v-model="title"
        placeholder="Document Title"
      />
    </div>
    <div class="form-group">
      <label>Content</label>
      <quill-editor
        v-model:content="modelname"
        contentType="html"
        theme="snow"
      ></quill-editor>
    </div>
    <button @click="submitDocument">Create Document</button>
  </div>
</template>

<script>
import { QuillEditor } from "@vueup/vue-quill";
import axios from "axios";

export default {
  components: {
    QuillEditor,
  },
  data() {
    return {
      title: "",
      modelname: "", // Add this line if modelname should be part of the component's data
      editorOptions: {}, // Configure your Quill editor options here
    };
  },
  methods: {
    submitDocument() {
      const documentData = {
        title: this.title,
        content: this.modelname,
      };

      console.log(documentData); // Debug to check the content

      axios
        .post("/api/documents", documentData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then((response) => {
          // If document creation is successful, navigate to the dashboard
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
