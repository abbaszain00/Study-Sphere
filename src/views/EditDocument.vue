<template>
  <nav class="top"><Top /></nav>

  <div class="edit-document">
    <div class="title">
      <label for="documentTitle"> </label>
      <input
        type="text"
        id="documentTitle"
        v-model="title"
        placeholder="Document Title"
      />
    </div>
    <div class="form-group">
      <!-- <label>Content</label> -->
      <quill-editor
        v-model:content="modelname"
        contentType="html"
        theme="snow"
      ></quill-editor>
    </div>
  </div>
</template>

<script>
import { QuillEditor } from "@vueup/vue-quill";
import axios from "axios";
import Top from "@/components/Top.vue";
import { isTokenExpiringSoon } from "@/utils/util.js";
import { isTokenValid } from "@/utils/util.js";

export default {
  components: {
    QuillEditor,
    Top,
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
    checkTokenExpiration() {
      if (!isTokenValid()) {
        // Assuming you have a method to check token validity
        clearInterval(this.expirationCheckInterval);
        return; // Exit if the token is no longer valid
      }

      if (isTokenExpiringSoon(5)) {
        alert(
          "Your session is about to expire in 5 minutes. Please save your changes and re-login."
        );
      }
    },

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
    this.tokenCheckInterval = setInterval(this.checkTokenExpiration, 60 * 1000);

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
    // Clear the interval to prevent memory leaks
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
  font-size: 1.5rem; /* Adjust the font size as needed */
  border: 1px solid #ccc; /* Light grey border for minimal appearance */
  background-color: rgba(
    255,
    255,
    255,
    0.8
  ); /* Slightly transparent background */
  width: 100%; /* Adjust the width as necessary */
  padding: 8px 12px; /* Padding for better text alignment */
  border-radius: 5px; /* Slightly rounded corners for a softer look */
  outline: none; /* Removes the outline to keep the design clean */
  box-shadow: none; /* Avoids any shadow for a flat design */
  transition: all 0.3s ease; /* Smooth transition for focus effect */
  text-align: center; /* Centers text horizontally */
  display: block; /* Ensures the input behaves as a block-level element */
  margin: 0 auto; /* Centers the input field within its container */
}

.title input[type="text"]:focus {
  border-color: #007bff; /* Highlight color when the input is focused */
  background-color: white; /* Fully opaque background on focus */
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25); /* Subtle glow effect */
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
  position: relative; /* Needed to effectively set z-index */
  z-index: 2; /* Ensure this is higher than the Quill toolbar's z-index */
}

.form-group .ql-editor {
  width: 8.5in;
  min-height: 11in;
  padding: 1in;
  margin: 1rem auto; /* Center in the page */
  box-shadow: 0 0 5px 0 black;
  background-color: white;
}

.form-group .ql-container.ql-snow {
  border: none;
  display: block; /* Adjusted to block for better control */
  max-width: 8.5in; /* Match the width of ql-editor */
  margin: auto; /* Centering it */
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
  margin: 1inch;
}
@media print {
  body {
    background-color: none;
    overflow-y: visible; /* Ensure overflow content is visible */
  }

  .top {
    display: none; /* Hide the top navigation bar */
  }

  .create-document,
  .form-group {
    width: 100%; /* Use full width for printing */
    overflow: visible; /* Ensure content is not clipped */
    page-break-inside: avoid; /* Avoid breaking inside elements */
  }

  .form-group .ql-editor {
    width: 100%; /* Adjusted for print, ensuring it fits the page */
    height: auto; /* Allow height to adjust based on content */
    padding: 1in; /* Maintain padding as per requirements */
    margin: 0 auto; /* Center horizontally */
    box-shadow: none;
    page-break-after: auto; /* Allow content to flow across pages */
  }

  .form-group .ql-toolbar.ql-snow {
    display: none; /* Hide the editor toolbar */
  }
}
</style>
