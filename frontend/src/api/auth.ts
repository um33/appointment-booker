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

export type SignUpResponse = {
  user:{
    name: string;
    email: string;
    passwordHash: string;
    role: string;
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

export const signUpClient = {
  signUp: async (name: string, email: string, password: string, role:string): Promise<SignUpResponse> => {
    const res = await fetch(`${API_URL}/auth/profile`, {
      method: 'POST',
      headers : {
        'Content-Type': 'application/json',
      }, 
      body: JSON.stringify({name, email, passwordHash:password, role})
    })
    if (!res.ok) {
      const err = await res.text();
      throw new Error(`SignUp failed: ${res.status} - ${err}`);
    }
    const user: SignUpResponse = await res.json();
    localStorage.setItem("token", user.token);
    localStorage.setItem("user", JSON.stringify(user.user));
    return user;
  }
}

const authClient = {
  loginClient,
  signUpClient,
};

export default authClient;