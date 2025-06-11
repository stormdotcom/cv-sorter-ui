import { createContext, ReactNode, useContext, useState, useEffect } from "react";

import { apiRequest } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { loginApi, registerApi } from "@/http/apiCalls";
import { STORAGE_KEYS } from "@/constants";

// Define the API response types
type LoginResponse = {
  message: string;
  user: any;
};

type RegisterResponse = {
  message: string;
  user: any;
};

type LoginData = {
  username: string;
  password: string;
};

type RegisterData = {
  username: string;
  email: string;
  password: string;
};

type AuthContextType = {
  user: any | null;
  isLoading: boolean;
  error: Error | null;
  login: (credentials: LoginData) => Promise<void>;
  logout: () => Promise<void>;
  register: (credentials: RegisterData) => Promise<void>;
  refreshAuth: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const [user, setUser] = useState<any | null>({
    id: 1,
    username: "test",
    email: "test@test.com",
    role: "admin",
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchUser = async () => {
    try {
      setIsLoading(true);
      const response = await apiRequest("GET", "/api/user");
      setUser(response.user || null);
      setError(null);
    } catch (err) {
      setError(err as Error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // check if user is logged in
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    if (token) {
      // fetchUser();
    }
    // Set up an interval to refresh auth state every 2 minutes
    const interval = setInterval(fetchUser, 1000 * 60 * 2);
    return () => clearInterval(interval);
  }, []);

  const login = async (credentials: LoginData) => {
    try {
      setIsLoading(true);
      const response =  await loginApi(credentials);
      setUser(response.user);
      toast({
        title: "Login successful",
        description: `Welcome back, ${response.user?.username || 'User'}!`,
      });
    } catch (err) {
      const error = err as Error;
      toast({
        title: "Login failed",
        description: error.message || "Invalid username or password",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (credentials: RegisterData) => {
    try {
      setIsLoading(true);
      const response = await registerApi(credentials);
      setUser(response.user);
      toast({
        title: "Registration successful",
        description: `Welcome, ${response.user?.username || 'User'}!`,
      });
    } catch (err) {
      const error = err as Error;
      toast({
        title: "Registration failed",
        description: error.message || "Could not create account",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      // clear local storage with storage keys

      localStorage.clear();
      await apiRequest("POST", "/api/logout");
      setUser(null);
      toast({
        title: "Logged out",
        description: "You have been successfully logged out",
      });
    } catch (err) {
      const error = err as Error;
      toast({
        title: "Logout failed",
        description: error.message || "Could not log out",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        error,
        login,
        logout,
        register,
        refreshAuth: fetchUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
