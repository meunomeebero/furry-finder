import axios from "axios";
import { createContext, useCallback, useEffect, useState } from "react";
import { useQuery } from "react-query";
import { api, AxiosAPI } from "../../services/api";

export type User = {
  id: number;
  name: string;
  email: string;
  image: string;
  github: string;
  role: 'USER' | 'ADMIN';
  created_at: string;
  updated_at: string;
}

export interface CustomSessionContextProps {
  data: { user: User };
  isActive: boolean;
  validateToken(token: string): Promise<void>;
  logout(): void;
}

export const CustomSessionContext = createContext({} as CustomSessionContextProps);

export function CustomSessionProvider({ children }) {
  const [isActive, setIsActive] = useState(true);

  const { data, refetch } = useQuery('me', async () => {
    const token = sessionStorage.getItem('token');
    if (token) {
      const data = await api.getMe(token);
      if (data) {
        AxiosAPI.token = token;
        return { user: data };
      } else {
        sessionStorage.removeItem('token');
      }
    }
  });

  useEffect(() => {
    if (data?.user) {
      axios.get('/api/v1/users/status', { params: { userId: data.user.id } })
      .then(response => {
        setIsActive(response.data.isActive);
      });
    }
  }, [data]);

  const validateToken = useCallback(async (token: string) => {
    sessionStorage.setItem('token', token);
    refetch();
  }, [refetch]);

  const logout = useCallback(() => {
    sessionStorage.removeItem('token');
    refetch();
  }, [refetch]);

  return (
    <CustomSessionContext.Provider value={{ data, validateToken, logout, isActive }}>
      {children}
    </CustomSessionContext.Provider>
  );
}
