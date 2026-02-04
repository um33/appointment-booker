const API_URL = import.meta.env.VITE_API_URL;

// fetch login details from the backend to create the login page

export type LoginResponse = {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    createdAt: string;
  };
  token: string;
}

export const loginClient = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, passwordHash:password }),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Login failed: ${res.status} - ${err}`);
    }

    const user: LoginResponse = await res.json();
    localStorage.setItem("token", user.token);
    localStorage.setItem("user", JSON.stringify(user.user));
    return user;
  },
};

export default loginClient;