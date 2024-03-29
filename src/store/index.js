import { createStore } from 'vuex';
import axios from 'axios';

export default createStore({
  state: {
    documents: [] // Defines the initial state for documents
  },
  mutations: {
    // Mutation to set the documents fetched from the backend
    setDocuments(state, documents) {
      state.documents = documents;
    },
    // Mutation to add a new document to the state
    addDocument(state, newDocument) {
      state.documents.push(newDocument);
    }
  },
  actions: {
    addNewDocument({ commit }, newDocument) {
        commit('addDocument', newDocument);
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
      axios.post('/api/documents', documentData)
        .then(response => {
          commit('addDocument', response.data); // Assuming your API returns the newly created document
          // If your API returns the document under a specific property, adjust accordingly, e.g., response.data.document
        })
        .catch(error => console.error("Error creating document:", error));
    }
  }
});
