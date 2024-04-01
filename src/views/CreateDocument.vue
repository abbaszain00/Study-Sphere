<template>
  <nav class="top"><Top /></nav>

  <div class="create-document">
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
        :options="editorOptions"
      ></quill-editor>
    </div>
    <button @click="submitDocument">Create Document</button>
  </div>
</template>

<script>
import { QuillEditor } from "@vueup/vue-quill";
import axios from "axios";
import Top from "@/components/Top.vue";

export default {
  components: {
    QuillEditor,
    Top,
  },
  data() {
    return {
      title: "",
      modelname: "", // Add this line if modelname should be part of the component's data
      editorOptions: {
        modules: {
          toolbar: [
            [{ header: [1, 2, false] }],
            ["bold", "italic", "underline"],
            [{ list: "ordered" }, { list: "bullet" }],
            ["link", "image"],
            ["clean"], // remove formatting button
            ["code-block"],
          ],
          history: {
            delay: 2000,
            maxStack: 500,
            userOnly: true,
          },
        },
        readOnly: false,
        theme: "snow",
      },
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
  beforeRouteLeave(to, from, next) {
    // Automatically save the document before leaving the page
    this.submitDocument();

    // Call next() to proceed with the route navigation
    next();
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
