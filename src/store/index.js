import { createStore } from 'vuex';
import axios from 'axios';

export default createStore({
  state: {
    documents: [], // Defines the initial state for documents
    chatMessages: [], // Defines the initial state for chat messages
  },
  mutations: {
    // Mutation to set the documents fetched from the backend
    setDocuments(state, documents) {
      state.documents = documents;
    },
    // Mutation to add a new document to the state
    addDocument(state, newDocument) {
      state.documents.push(newDocument);
    },
    // Mutation to remove a document by its ID
    removeDocument(state, documentId) {
      state.documents = state.documents.filter(doc => doc._id !== documentId);
    },
    // Mutation to add a new chat message
    addChatMessage(state, message) {
      state.chatMessages.push(message);
    },
    // Mutation to clear chat messages
    clearChatMessages(state) {
      state.chatMessages = [];
    },
  },
  actions: {
    // Action to delete a document by its ID
    deleteDocumentById({ commit }, documentId) {
      const token = localStorage.getItem('token');
      axios.delete(`/api/documents/${documentId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        commit('removeDocument', documentId);
      })
      .catch(error => console.error("Error deleting document:", error));
    },

    // Action to fetch documents from the backend and commit to state
    fetchDocuments({ commit }) {
      const token = localStorage.getItem('token');
      axios.get('/api/documents', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(response => {
        commit('setDocuments', response.data);
      })
      .catch(error => console.error("Error fetching documents:", error));
    },
    
    // Action to post a new document to the backend and add to state upon success
    createDocument({ commit }, documentData) {
      const token = localStorage.getItem('token');
      axios.post('/api/documents', documentData, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
      .then(response => {
        commit('addDocument', response.data.document); // Adjust based on actual response structure
      })
      .catch(error => console.error("Error creating document:", error));
    },

    // Action to add a new chat message
    addChatMessage({ commit }, message) {
      commit('addChatMessage', message);
    },

    // Action to clear chat messages
    clearChatMessages({ commit }) {
      commit('clearChatMessages');
    },
  }
});
