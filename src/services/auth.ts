const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface SignupPayload {
  name: string;
  email: string;
  password: string;
}

interface LoginPayload {
  email_or_name: string;
  password: string;
}

interface AuthResponse {
  message: string;
  access_token: string;
  token_type: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}


export async function signup(
  data: SignupPayload
): Promise<AuthResponse> {

  const response = await fetch(
    `${API_URL}/api/auth/signup`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );


  if (!response.ok) {
    const error = await response.json();
    throw new Error(
      error.detail || "Signup failed"
    );
  }


  return await response.json();
}



export async function signin(
  data: LoginPayload
): Promise<AuthResponse> {

  const response = await fetch(
    `${API_URL}/api/auth/signin`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );


  if (!response.ok) {
    const error = await response.json();
    throw new Error(
      error.detail || "Login failed"
    );
  }


  return await response.json();
}

export function hasAccessToken(): boolean {
  return !!localStorage.getItem("access_token");
}
export async function validateSession(): Promise<boolean> {
  const token = localStorage.getItem("access_token");

  if (!token) {
    return false;
  }

  const response = await fetch(`${API_URL}/api/dashboard`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (response.status === 401 || response.status === 404) {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    return false;
  }

  return response.ok;
}