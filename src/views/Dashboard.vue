<template>
  <div class="Header">
    <Top />
  </div>
  <div class="dash-container">
    <div class="file-section">
      <!-- Button to create a new document -->
      <button @click="createNewDocument">Create New Document</button>

      <!-- List of documents -->
      <div class="document-list">
        <div
          v-for="document in documents"
          :key="document.id"
          @click="openDocument(document.id)"
          class="document-item"
        >
          {{ document.title }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Top from "@/components/Top.vue";
// Import Axios if you're making HTTP requests
import axios from "axios";

export default {
  components: {
    Top,
  },
  data() {
    return {
      documents: [], // Array to store documents
    };
  },
  methods: {
    fetchDocuments() {
      axios
        .get("/api/documents")
        .then((response) => {
          this.documents = response.data;
        })
        .catch((error) => console.error("Error fetching documents:", error));
    },
    createNewDocument() {
      this.$router.push({ name: "CreateDocument" }); // Assuming you have a route named 'CreateDocument'
    },
    openDocument(documentId) {
      this.$router.push({ name: "EditDocument", params: { id: documentId } }); // Assuming you have a route named 'EditDocument'
    },
  },
  mounted() {
    this.fetchDocuments(); // Fetch documents when component mounts
  },
};
</script>

<style>
body {
  overflow: hidden;
}
.dash-container {
  background-color: white;
  height: 100vh;
}

.file-section {
  background-color: rgb(226, 226, 226);
  margin: auto;
  height: 100vh;
  width: 1200px;
}

.document-list {
  margin-top: 20px;
}

.document-item {
  cursor: pointer;
  padding: 10px;
  border-bottom: 1px solid #ccc;
}

.document-item:hover {
  background-color: #f0f0f0;
}
</style>
