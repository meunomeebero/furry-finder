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
  validateToken(token: string): Promise<any>;
  logout(): void;
}

export const CustomSessionContext = createContext({} as CustomSessionContextProps);

export function CustomSessionProvider({ children }) {
  const { data, refetch } = useQuery('me', async () => {
    const token = sessionStorage.getItem('token');
    if (token) {
      const data = await api.getMe(token);
      if (data) {
        AxiosAPI.token = token;
        const { data: userData } = await axios.get('/api/v1/users/me?id=' + data.id)
        return { user: userData };
      } else {
        sessionStorage.removeItem('token');
      }
    }
  });

  const validateToken = useCallback(async (token: string) => {
    sessionStorage.setItem('token', token);
    const res = await refetch();
    return res.data.user
  }, [refetch]);

  const logout = useCallback(() => {
    sessionStorage.removeItem('token');
    refetch();
  }, [refetch]);

  return (
    <CustomSessionContext.Provider value={{ data, validateToken, logout }}>
      {children}
    </CustomSessionContext.Provider>
  );
}
