<template>
  <!--Top bar component-->
  <nav class="top"><Top /></nav>
  <!-- Edit document section -->
  <div class="edit-document">
    <!-- Document title input field -->
    <div class="title">
      <label for="documentTitle"> </label>
      <input
        type="text"
        id="documentTitle"
        v-model="title"
        placeholder="Document Title"
      />
    </div>
    <!-- Quill editor integration for document content editing -->
    <div class="form-group">
      <quill-editor
        v-model:content="modelname"
        contentType="html"
        theme="snow"
      ></quill-editor>
    </div>
  </div>
</template>

<script>
import { QuillEditor } from "@vueup/vue-quill"; // Importing QuillEditor
import axios from "axios"; //Import axios for HTTP requests
import Top from "@/components/Top.vue"; //Importing Top component
import { isTokenExpiringSoon } from "@/utils/util.js"; //Import utility functions for token validation
import { isTokenValid } from "@/utils/util.js"; //Import utility functions for token validation

export default {
  components: {
    //Component declarations
    QuillEditor,
    Top,
  },
  data() {
    //Data properties
    return {
      title: "",
      content: "",
      modelname: "",
      editorOptions: {}, // Configure your Quill editor options here
    };
  },
  methods: {
    checkTokenExpiration() {
      if (!isTokenValid()) {
        // Check if tken is still valid
        clearInterval(this.expirationCheckInterval);
        return; // Exit if the token is no longer valid
      }
      // Check if the token is expiring within 5 minutes
      if (isTokenExpiringSoon(5)) {
        alert(
          "Your session is about to expire in 5 minutes. Please save your changes and re-login."
        );
      }
    },
    //Fetch documents from database
    async fetchDocument() {
      const token = localStorage.getItem("token"); // Retrieve the auth token from local storage
      try {
        const response = await axios.get(
          `/api/documents/${this.$route.params.id}`, //Fetch documents by ID
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        this.title = response.data.title; // Setting the document's title from the response
        console.log("This is it: ", response.data.content);
        this.modelname = response.data.content; // Assigning content to the Quill editor
      } catch (error) {
        console.error("Failed to fetch document:", error);
      }
    },
    //Save documents to database
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
        this.$router.push({ name: "dash" }); // Redirecting to the dashboard view after saving
      } catch (error) {
        console.error("Failed to save document:", error);
      }
    },
  },
  mounted() {
    this.fetchDocument(); // Fetch the document when the component is mounted
    this.tokenCheckInterval = setInterval(this.checkTokenExpiration, 60 * 1000); // Set up an interval to check token expiration every minute

    // Perform an initial check in case the token is already close to expiring
    this.checkTokenExpiration();
  },
  beforeRouteLeave(to, from, next) {
    // Automatically save the document before leaving the page
    this.saveDocument();

    // Call next() to proceed with the route navigation
    next();
  },
  beforeDestroy() {
    // Clean up by clearing the interval when the component is destroyed
    clearInterval(this.tokenCheckInterval);
  },
};
</script>

<style>
.title {
  justify-content: center;
  display: flex;
}
.title input[type="text"] {
  font-size: 1.5rem;
  border: 1px solid #ccc;
  background-color: rgba(255, 255, 255, 0.8);
  width: 100%;
  padding: 8px 12px;
  border-radius: 5px;
  outline: none;
  box-shadow: none;
  transition: all 0.3s ease;
  text-align: center;
  display: block;
  margin: 0 auto;
}

.title input[type="text"]:focus {
  border-color: #007bff;
  background-color: white;
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
}

*,
*::before,
*::after {
  box-sizing: border-box;
}
body {
  background-color: #f3f3f3;
  margin: 0;
  overflow-y: auto; /* Ensure the body is scrollable */
}
button:hover {
  background-color: #0056b3;
}
nav.top {
  position: relative;
  z-index: 2;
}

.form-group .ql-editor {
  width: 8.5in;
  min-height: 11in;
  padding: 1in;
  margin: 1rem auto;
  box-shadow: 0 0 5px 0 black;
  background-color: white;
}

.form-group .ql-container.ql-snow {
  border: none;
  display: block;
  max-width: 8.5in;
  margin: auto;
}

.form-group .ql-toolbar.ql-snow {
  display: flex;
  justify-content: center;
  position: sticky;
  top: 0;
  z-index: 1;
  background-color: #f3f3f3;
}
@page {
  margin: 0.5in;
}
@media print {
  body {
    background-color: transparent;
    overflow-y: visible;
  }
  .top,
  .nav {
    display: none;
  }
  .form-group .ql-toolbar.ql-snow {
    display: none;
  }
  .form-group .ql-editor {
    width: 100%;
    height: auto;
    padding: 0;
    box-shadow: none;
  }
}
</style>
