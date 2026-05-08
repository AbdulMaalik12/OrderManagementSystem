import api from './api';

const aiService = {
  /**
   * Generate a comprehensive AI business summary.
   */
  generateSummary: () => api.post('/ai/summary'),

  /**
   * Ask a specific question about orders.
   * @param {string} question
   */
  askQuestion: (question) => api.post('/ai/ask', { question }),
};

export default aiService;
