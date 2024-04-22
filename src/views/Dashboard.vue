<template>
  <div class="Header">
    <!--Top navbar component-->
    <Top />
  </div>
  <div class="dash-container">
    <!--Modal component for creating documents-->
    <DocumentNameModal
      v-if="isCreatingDocument"
      @save="handleSave"
      @close="handleClose"
    />
    <!--Main section of dashoard containing documents and actions-->
    <div class="file-section">
      <div class="actions">
        <!--Button for creating documents-->
        <button @click="createNewDocument">Create</button>
        <!--Button for editing documents-->
        <button @click="toggleEditMode">Edit</button>
        <!--Button for deleting documents-->
        <button v-if="isEditing" @click="deleteSelectedDocuments">
          Delete Selected
        </button>
        <div class="search-container">
          <!--Search bar-->
          <input
            type="text"
            v-model="searchQuery"
            placeholder="Search documents..."
            class="search-input"
          />
        </div>
        <!--Sorting documents-->
        <div class="dropdown">
          <button class="dropbtn">Sort By</button>
          <div class="dropdown-content">
            <a href="#" @click.prevent="sortDocuments('alphabetical')"
              >Alphabetical Order</a
            >
            <a href="#" @click.prevent="sortDocuments('lastModified')"
              >Last Modified</a
            >
          </div>
        </div>
      </div>
      <!-- Table structure for documents -->
      <table class="documents-table">
        <thead>
          <tr>
            <!--Conditional select column for deleting documents-->
            <th v-if="isEditing">Select</th>
            <th>Name</th>
            <th>Created At</th>
            <th>Last Updated</th>
          </tr>
        </thead>
        <tbody>
          <!-- Dynamic list of documents, filterable by searchQuery -->
          <tr
            v-for="document in filteredDocuments"
            :key="document._id"
            @click="isEditing ? null : openDocument(document._id)"
          >
            <!-- Checkbox for selecting documents in edit mode -->
            <td v-if="isEditing">
              <input
                type="checkbox"
                v-model="selectedDocuments"
                :value="document._id"
                @click.stop
              />
            </td>
            <!-- Document details -->
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
import DocumentNameModal from "@/components/DocumentNameModal.vue"; //import document modal component
import Top from "@/components/Top.vue"; //import top navbar componenet
import { mapActions, mapState } from "vuex"; // Vuex helpers for mapping store state and actions to local component method
import { isTokenValid } from "@/utils/util"; // Utility function to check token validity

export default {
  components: {
    //Component declarations
    Top,
    DocumentNameModal,
  },
  data() {
    return {
      isCreatingDocument: false, //Flag to show/hide document creation modal componenet
      selectedDocuments: [], //Array to track selected documents for delete function
      isEditing: false, //Flag to toggle edit mode
      searchQuery: "", //Search query to filter documents
    };
  },
  computed: {
    ...mapState(["documents"]), // Maps the 'documents' state from Vuex store to a local computed property
    // Computed property to return filtered documents based on search query
    filteredDocuments() {
      return this.searchQuery
        ? this.documents.filter((doc) =>
            doc.title.toLowerCase().includes(this.searchQuery.toLowerCase())
          )
        : this.documents;
    },
  },
  methods: {
    // Method to sort documents based on selected criteria
    sortDocuments(method) {
      if (method === "alphabetical") {
        this.documents.sort((a, b) => a.title.localeCompare(b.title));
      } else if (method === "lastModified") {
        this.documents.sort(
          (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
        );
      }
      this.documents = [...this.documents]; // Triggering reactivity after sorting
    },
    ...mapActions(["fetchDocuments", "deleteDocumentById", "createDocument"]), // Mapping Vuex actions to component methods
    redirectToSignIn() {
      window.location.href = "/signin"; // Method to redirect user to Sign In view
    },
    // Method to check token validity and redirect if invalid
    async checkAndRedirect() {
      if (!isTokenValid()) {
        this.redirectToSignIn();
        return false;
      }
      return true;
    },
    // Method to create a new document after ensuring user is authenticated
    async createNewDocument() {
      if (!(await this.checkAndRedirect())) return;
      this.isCreatingDocument = true;
    },
    // Method to handle closing the document creation modal
    handleClose() {
      this.isCreatingDocument = false;
    },
    // Method to handle saving a new or edited document
    async handleSave(documentName) {
      if (!(await this.checkAndRedirect())) return;
      const documentData = { title: documentName, content: "" };
      this.createDocument(documentData)
        .then(() => {
          this.isCreatingDocument = false;
          this.fetchDocuments(); // Fetch documents to update the list
        })
        .catch((error) => {
          console.error("Failed to create document:", error);
          alert("There was a problem creating your document.");
        });
    },
    // Method to open an existing document for editing
    async openDocument(documentId) {
      if (!(await this.checkAndRedirect())) return;
      this.$router.push({ name: "EditDocument", params: { id: documentId } });
    },
    // Method to delete selected documents
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
    // Method to toggle the edit mode for document manipulation
    async toggleEditMode() {
      if (!(await this.checkAndRedirect())) return;
      this.isEditing = !this.isEditing;
    },
    // Method to format the date string
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
    this.fetchDocuments(); // Fetch documents on component mount
  },
};
</script>

<style>
body {
  overflow: hidden;
  font-family: "Inter";
}
.dash-container {
  background: linear-gradient(white, #d3d0d0, #a1a1a1);
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
  width: 100px !important;
  height: 40px !important;
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
  padding: 10px;
  margin: 20px 0;
  width: 500px;
  border: 1px solid #000000;
  border-radius: 4px;
  background-color: #ffffff;
  font-family: "Inter";
  font-size: 16px;
  height: var(--input-height);
  box-sizing: border-box;
}

.actions {
  display: flex;
}

.search-container {
  margin-left: auto;
  padding-right: 20px;
}

.dropbtn {
  font-family: "Inter";
  margin: 10px;
  cursor: pointer;
  background-color: white;
  color: black;
  text-decoration: none;
  border-radius: 5px;
  transition: 0.3s;
  font-weight: bold;
  width: 100px !important;
  height: 40px !important;
  margin-top: 20px;
}

.dropdown {
  position: relative;
  display: inline-block;
}

.dropdown-content {
  display: none;
  position: absolute;
  background-color: #f9f9f9;
  min-width: 160px;
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
  z-index: 1;
}

.dropdown-content a {
  color: black;
  padding: 12px 16px;
  text-decoration: none;
  display: block;
}

.dropdown:hover .dropdown-content {
  display: block;
}

.dropdown-content a:hover {
  background-color: grey;
}
</style>
