const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const api = {
  // Authentication headers should be included in real implementation (e.g. Firebase token)
  getHeaders: async () => {
    // const token = await auth.currentUser?.getIdToken();
    return {
      'Content-Type': 'application/json',
      // 'Authorization': `Bearer ${token}`
    };
  },

  uploadDocument: async (file) => {
    const formData = new FormData();
    formData.append('document', file);
    // const token = await auth.currentUser?.getIdToken();
    
    // return fetch(`${BASE_URL}/upload`, { 
    //   method: 'POST', 
    //   body: formData,
    //   headers: { 'Authorization': `Bearer ${token}` }
    // }).then(r => r.json());

    console.log('Simulating document upload...', file.name);
    return new Promise(resolve => setTimeout(() => resolve({ success: true }), 1000));
  },

  getDocuments: async () => {
    // const headers = await api.getHeaders();
    // return fetch(`${BASE_URL}/documents`, { headers }).then(r => r.json());

    return [
      { id: 1, name: 'Project_Requirements.pdf', type: 'pdf', date: 'Just now' },
      { id: 2, name: 'Architecture_v2.md', type: 'md', date: '2 hours ago' }
    ];
  },

  deleteDocument: async (id) => {
    // const headers = await api.getHeaders();
    // return fetch(`${BASE_URL}/documents/${id}`, { method: 'DELETE', headers }).then(r => r.json());

    console.log('Simulating document deletion for ID:', id);
    return new Promise(resolve => setTimeout(() => resolve({ success: true }), 500));
  },

  chat: async (query, documentIds) => {
    // const headers = await api.getHeaders();
    // return fetch(`${BASE_URL}/chat`, { 
    //   method: 'POST', 
    //   headers, 
    //   body: JSON.stringify({ query, documents: documentIds }) 
    // }).then(r => r.json());

    console.log('Simulating chat query...', query);
    return new Promise(resolve => setTimeout(() => resolve({ 
      text: 'This is a simulated response from the RAG pipeline.' 
    }), 1000));
  }
};
