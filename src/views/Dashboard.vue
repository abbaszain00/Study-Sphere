<template>
  <div class="Header">
    <Top />
  </div>
  <div class="dash-container">
    <div class="file-section">
      <button @click="createNewDocument">Create New Document</button>
      <div class="document-list">
        <div
          v-for="document in documents"
          :key="document._id"
          class="document-item"
        >
          {{ document.title }}
          <!-- Added delete button for each document -->
          <button @click.stop="deleteDocument(document._id)">Delete</button>
          <!-- Added button to open document, prevent deletion when opening -->
          <button @click.stop="openDocument(document._id)">Open</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Top from "@/components/Top.vue";
import { mapActions, mapState } from "vuex";

export default {
  components: {
    Top,
  },
  computed: {
    ...mapState(["documents"]), // Maps state.documents to this.documents
  },
  methods: {
    ...mapActions(["fetchDocuments", "deleteDocumentById"]), // Include deleteDocumentById in the mapped actions
    createNewDocument() {
      this.$router.push({ name: "CreateDocument" });
    },
    openDocument(documentId) {
      this.$router.push({ name: "EditDocument", params: { id: documentId } });
    },
    deleteDocument(documentId) {
      // Confirm before deletion
      if (confirm("Are you sure you want to delete this document?")) {
        this.deleteDocumentById(documentId)
          .then(() => {
            alert("Document deleted successfully.");
            this.fetchDocuments(); // Re-fetch documents to update the list
          })
          .catch((error) => {
            console.error("Error deleting document:", error);
            alert("Failed to delete the document.");
          });
      }
    },
  },
  mounted() {
    this.fetchDocuments(); // Fetch documents when the component mounts
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
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  padding: 10px;
  border-bottom: 1px solid #ccc;
}

.document-item:hover {
  background-color: #f0f0f0;
}
</style>
