<template>
  <div class="Header">
    <Top />
  </div>
  <div class="dash-container">
    <div class="file-section">
      <button @click="createNewDocument">Create New Document</button>
      <!-- Add a button for deleting selected documents -->
      <button @click="deleteSelectedDocuments">
        Delete Selected Documents
      </button>
      <div class="document-list">
        <div
          v-for="document in documents"
          :key="document._id"
          class="document-item"
          @click="openDocument(document._id)"
        >
          <input
            type="checkbox"
            v-model="selectedDocuments"
            :value="document._id"
          />
          {{ document.title }}
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
  data() {
    return {
      selectedDocuments: [], // Add this line to keep track of selected documents
    };
  },
  computed: {
    ...mapState(["documents"]), // Maps state.documents to this.documents
  },
  methods: {
    ...mapActions(["fetchDocuments", "deleteDocumentById"]), // Keep as is if deleteDocumentById can handle array inputs
    createNewDocument() {
      this.$router.push({ name: "CreateDocument" });
    },
    openDocument(documentId) {
      this.$router.push({ name: "EditDocument", params: { id: documentId } });
    },
    deleteSelectedDocuments() {
      if (
        confirm(
          `Are you sure you want to delete ${this.selectedDocuments.length} documents?`
        )
      ) {
        // Call deleteDocumentById for each selected document if it doesn't support array inputs
        Promise.all(
          this.selectedDocuments.map((id) => this.deleteDocumentById(id))
        )
          .then(() => {
            alert("Selected documents deleted successfully.");
            this.fetchDocuments(); // Re-fetch documents to update the list
          })
          .catch((error) => {
            console.error("Error deleting documents:", error);
            alert("Failed to delete some documents.");
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
  cursor: pointer;
  padding: 10px;
  margin: 5px 0;
  border-radius: 4px;
}

.document-item:hover {
  background-color: #f0f0f0; /* Light grey background on hover */
}
</style>
