<template>
  <div class="Header">
    <Top />
  </div>
  <div class="dash-container">
    <DocumentNameModal
      v-if="isCreatingDocument"
      @save="handleSave"
      @close="handleClose"
    />
    <div class="file-section">
      <div class="actions">
        <button @click="createNewDocument">Create</button>
        <button @click="toggleEditMode">Edit</button>
        <button v-if="isEditing" @click="deleteSelectedDocuments">
          Delete Selected
        </button>
        <div class="search-container">
          <input
            type="text"
            v-model="searchQuery"
            placeholder="Search documents..."
            class="search-input"
          />
        </div>
      </div>
      <!-- Table structure for documents -->
      <table class="documents-table">
        <thead>
          <tr>
            <th v-if="isEditing">Select</th>
            <th>Name</th>
            <th>Created At</th>
            <th>Last Updated</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="document in filteredDocuments"
            :key="document._id"
            @click="isEditing ? null : openDocument(document._id)"
          >
            <td v-if="isEditing">
              <input
                type="checkbox"
                v-model="selectedDocuments"
                :value="document._id"
                @click.stop
              />
            </td>
            <td>{{ document.title }}</td>
            <td>{{ formatDate(document.createdAt) }}</td>
            <td>{{ formatDate(document.updatedAt) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import DocumentNameModal from "@/components/DocumentNameModal.vue";
import Top from "@/components/Top.vue";
import { mapActions, mapState } from "vuex";
import { isTokenValid } from "@/utils/util";

export default {
  components: {
    Top,
    DocumentNameModal,
  },
  data() {
    return {
      isCreatingDocument: false,
      selectedDocuments: [],
      isEditing: false,
      searchQuery: "",
    };
  },
  computed: {
    ...mapState(["documents"]),
    filteredDocuments() {
      return this.searchQuery
        ? this.documents.filter((doc) =>
            doc.title.toLowerCase().includes(this.searchQuery.toLowerCase())
          )
        : this.documents;
    },
  },
  methods: {
    ...mapActions(["fetchDocuments", "deleteDocumentById", "createDocument"]),
    redirectToSignIn() {
      window.location.href = "/signin";
    },
    async checkAndRedirect() {
      if (!isTokenValid()) {
        this.redirectToSignIn();
        return false;
      }
      return true;
    },
    async createNewDocument() {
      if (!(await this.checkAndRedirect())) return;
      this.isCreatingDocument = true;
    },
    handleClose() {
      this.isCreatingDocument = false;
    },
    async handleSave(documentName) {
      if (!(await this.checkAndRedirect())) return;
      const documentData = { title: documentName, content: "" };
      this.createDocument(documentData)
        .then(() => {
          this.isCreatingDocument = false;
          this.fetchDocuments();
        })
        .catch((error) => {
          console.error("Failed to create document:", error);
          alert("There was a problem creating your document.");
        });
    },
    async openDocument(documentId) {
      if (!(await this.checkAndRedirect())) return;
      this.$router.push({ name: "EditDocument", params: { id: documentId } });
    },
    async deleteSelectedDocuments() {
      if (!(await this.checkAndRedirect())) return;
      if (
        !confirm(
          `Are you sure you want to delete ${this.selectedDocuments.length} documents?`
        )
      )
        return;
      Promise.all(
        this.selectedDocuments.map((id) => this.deleteDocumentById(id))
      )
        .then(() => {
          alert("Selected documents deleted successfully.");
          this.fetchDocuments();
        })
        .catch((error) => {
          console.error("Error deleting documents:", error);
          alert("Failed to delete some documents.");
        });
    },
    async toggleEditMode() {
      if (!(await this.checkAndRedirect())) return;
      this.isEditing = !this.isEditing;
    },
    formatDate(value) {
      return new Date(value).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    },
  },
  mounted() {
    this.fetchDocuments();
  },
};
</script>

<style>
body {
  overflow: hidden;
  font-family: "Inter";
}
.dash-container {
  background-color: white;
  height: 100vh;
  font-family: "Inter";
}

.file-section {
  background-color: rgb(226, 226, 226);
  margin: auto;
  height: 100vh;
  width: 1200px;
  font-family: "Inter";
}
.file-section .actions button {
  font-family: "Inter";
  margin: 10px;
  cursor: pointer;
  background-color: white;
  color: black;
  text-decoration: none;
  border-radius: 5px;
  transition: 0.3s;
  font-weight: bold;
  width: 100px !important; /* Adjust as needed */
  height: 40px !important; /* Adjust as needed */
  margin-top: 20px;
}

.file-section .actions button:hover {
  background-color: grey;
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
  background-color: #f0f0f0;
}

.documents-table {
  width: 100%;
  border-collapse: collapse;
}

.documents-table th,
.documents-table td {
  padding: 10px;
  text-align: left;
}

.documents-table th {
  background-color: rgb(0 0 0 / 32%);
}

.documents-table tr:hover {
  background-color: #f0f0f0;
  cursor: pointer;
}

.search-container .search-input {
  padding: 10px; /* Adjust padding as necessary */
  margin: 20px 0;
  width: 500px; /* Use 100% to fill the container, or set a fixed width */
  border: 1px solid #000000;
  border-radius: 4px;
  background-color: #ffffff;
  font-family: "Inter";
  font-size: 16px; /* Ensuring font size is explicitly set */
  height: var(--input-height); /* Use CSS variable */
  box-sizing: border-box; /* Ensures padding doesn't affect the final size */
}

.actions {
  display: flex;
}

.search-container {
  margin-left: auto;
  padding-right: 20px;
}
</style>
