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
          @click="openDocument(document._id)"
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
import { mapActions, mapState } from "vuex";

export default {
  components: {
    Top,
  },
  computed: {
    ...mapState(["documents"]), // Maps state.documents to this.documents
  },
  methods: {
    ...mapActions(["fetchDocuments"]), // Maps store action fetchDocuments to this method
    createNewDocument() {
      this.$router.push({ name: "CreateDocument" });
    },
    openDocument(documentId) {
      this.$router.push({ name: "EditDocument", params: { id: documentId } });
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
