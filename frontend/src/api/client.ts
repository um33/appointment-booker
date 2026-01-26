const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export const client = {
  getHealth: async () => {
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjbWpvazdocGIwMDAwOHpkdGptbW0yZHp6Iiwicm9sZSI6IlBST1ZJREVSIiwiaWF0IjoxNzY5NDQ1NTM1LCJleHAiOjE3Njk0NDU5NTV9.qA7-_gPAa7SunmViCcgJOnBxSa9G91eVwfLppT5slHs" // ✅ get latest token here

    const res = await fetch(`${API_URL}/api/homePage`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Failed: ${res.status} - ${err}`);
    }

    return res.json();
  },
};

export default client;
