<template>
  <div class="Header">
    <Top />
  </div>
  <div class="dash-container">
    <div class="file-section">
      <button @click="createNewDocument">Create New Document</button>
      <button @click="toggleEditMode">Edit</button>
      <button v-if="isEditing" @click="deleteSelectedDocuments">
        Delete Selected Documents
      </button>

      <!-- Table structure for documents -->
      <table class="documents-table">
        <thead>
          <tr>
            <th v-if="isEditing">Select</th>
            <!-- Column for checkboxes -->
            <th>Name</th>
            <th>Last Updated</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="document in documents"
            :key="document._id"
            @click="openDocument(document._id, $event)"
          >
            <!-- Conditional checkbox column -->
            <td v-if="isEditing">
              <input
                type="checkbox"
                v-model="selectedDocuments"
                :value="document._id"
              />
            </td>
            <td>{{ document.title }}</td>
            <td>{{ formatDate(document.updatedAt) }}</td>

            <!-- Assuming you have a 'lastUpdated' field -->
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import Top from "@/components/Top.vue";
import { mapActions, mapState } from "vuex";
import { isTokenValid } from "@/utils/util"; // Adjust the path as necessary
export default {
  components: {
    Top,
  },
  data() {
    return {
      selectedDocuments: [],
      isEditing: false,
    };
  },
  computed: {
    ...mapState(["documents"]),
  },
  methods: {
    ...mapActions(["fetchDocuments", "deleteDocumentById"]),

    redirectToSignIn() {
      // Directly set the window location to the sign-in page's URL.
      window.location.href = "/signin";
    },

    async checkAndRedirect() {
      // Assuming isTokenValid() is a synchronous function that checks the validity of the token
      // You might need to make it asynchronous if it involves fetching from an API
      const isValid = isTokenValid();
      if (!isValid) {
        this.redirectToSignIn();
        return false; // Token is not valid, prevent further actions
      }
      return true; // Token is valid, proceed with the action
    },

    async createNewDocument() {
      const canProceed = await this.checkAndRedirect();
      if (!canProceed) return;
      // Proceed with document creation if the token is valid
      this.$router.push({ name: "CreateDocument" });
    },

    async openDocument(documentId) {
      const canProceed = await this.checkAndRedirect();
      if (!canProceed) return;
      // Proceed with opening the document if the token is valid
      this.$router.push({ name: "EditDocument", params: { id: documentId } });
    },

    deleteSelectedDocuments() {
      if (
        confirm(
          `Are you sure you want to delete ${this.selectedDocuments.length} documents?`
        )
      ) {
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
    async toggleEditMode() {
      const canProceed = await this.checkAndRedirect();
      if (!canProceed) return;

      this.isEditing = !this.isEditing;
    },

    formatDate(value) {
      if (!value) return "";
      // You can adjust the formatting as per your requirements
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
.documents-table {
  width: 100%;
  border-collapse: collapse;
}

.documents-table th,
.documents-table td {
  /* border: 1px solid #ddd; */
  padding: 8px;
  text-align: left;
}

.documents-table th {
  background-color: #f2f2f2;
}

.documents-table tr:hover {
  background-color: #f0f0f0;
  cursor: pointer;
}

/* Style adjustments for when in editing mode */
.documents-table tr[isEditing] {
  cursor: default; /* Prevents the cursor pointer style */
}
</style>
