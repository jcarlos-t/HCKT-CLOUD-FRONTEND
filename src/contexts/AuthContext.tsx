import { createContext, type ReactNode, useContext, useEffect } from "react";
import { useStorageState } from "../hooks/useStorageState";

import type { LoginRequest }   from "../interfaces/auth/LoginRequest";
import type { RegisterRequest } from "../interfaces/auth/RegisterRequest";

import { login as loginService }    from "../services/auth/login";
import { register as registerService } from "../services/auth/register";
import Api from "../services/api";

interface AuthContextType {
  login:    (req: LoginRequest)    => Promise<void>;
  register: (req: RegisterRequest) => Promise<void>;
  logout:   () => void;
  session: string | null;

  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {

  const [[isLoading, session], setSession] = useStorageState("token");

  useEffect(() => {
    // Sincronizar el token en ambas instancias de API
    Promise.all([
      Api.getInstance("usuarios"),
      Api.getInstance("reportes"),
    ]).then(([apiUsuarios, apiReportes]) => {
      const token = session ?? "";
      apiUsuarios.authorization = token;
      apiReportes.authorization = token;
    });
  }, [session]);

  const login = async (req: LoginRequest) => {
    const { data } = await loginService(req);  
    setSession(data.token);
  };

  const register = async (req: RegisterRequest) => {
    const { data } = await registerService(req);   
    setSession(data.token);
  };

  const logout = () => setSession(null);

  return (
    <AuthContext.Provider
      value={{ login, register, logout, session, isLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return ctx;
}