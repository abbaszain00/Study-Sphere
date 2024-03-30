<template>
  <div class="edit-document">
    <h2>Edit Document</h2>
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
    <button @click="saveDocument">Save Changes</button>
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
      content: "",
      modelname: "",
      editorOptions: {}, // Configure your Quill editor options here
    };
  },
  methods: {
    async fetchDocument() {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get(
          `/api/documents/${this.$route.params.id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        this.title = response.data.title;
        console.log("This is it: ", response.data.content);
        this.modelname = response.data.content; // Assign content here
      } catch (error) {
        console.error("Failed to fetch document:", error);
      }
    },

    // async fetchDocument() {
    //   const token = localStorage.getItem("token");
    //   try {
    //     const response = await axios.get(
    //       `/api/documents/${this.$route.params.id}`,
    //       {
    //         headers: { Authorization: `Bearer ${token}` },
    //       }
    //     );
    //     this.title = response.data.title;
    //     this.modelname = response.data.content; // Assign content here
    //     this.originalModelname = response.data.content; // Store original content
    //   } catch (error) {
    //     console.error("Failed to fetch document:", error);
    //   }
    // },

    async saveDocument() {
      const token = localStorage.getItem("token");
      const documentData = {
        title: this.title,
        content: this.modelname,
        originalContent: this.originalContent, // Include original content
      };

      try {
        await axios.put(
          `/api/documents/${this.$route.params.id}`,
          documentData,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        this.$router.push({ name: "dash" });
      } catch (error) {
        console.error("Failed to save document:", error);
      }
    },
  },
  mounted() {
    this.fetchDocument();
  },
};
</script>

<style scoped>
.edit-document {
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
