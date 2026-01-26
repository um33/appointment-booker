// test if the backend and frontend are connected properly and show message on frontend that says it is connected

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const client = {
  getHealth: async () => {
    const response = await fetch(`${API_URL}/health`);
    if (!response.ok) {
      throw new Error('Failed to fetch health status');
    }
    return response.json();
  },
};