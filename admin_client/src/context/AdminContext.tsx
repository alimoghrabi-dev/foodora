import React, { createContext, useEffect, useState } from "react";
import axios from "axios";
import { useQuery, useQueryClient } from "@tanstack/react-query";

type AdminContextType = {
  admin: IAdmin | null;
  login: (data: { email: string; password: string }) => Promise<IAdmin>;
  logout: () => void;
  token: string | null;
  isPending: boolean;
};

const AdminContext = createContext<AdminContextType | null>(null);

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [admin, setAdmin] = useState<IAdmin | null>(null);
  const [token, setToken] = useState<string | null>(() => {
    const tokenInfoStorage = localStorage.getItem("adminInfo");
    return tokenInfoStorage ? JSON.parse(tokenInfoStorage) : null;
  });

  const queryClient = useQueryClient();

  const {
    data: authStatusData,
    refetch: refetchAuthStatus,
    isPending,
  } = useQuery({
    queryKey: ["admin-status"],
    queryFn: async () => {
      if (!token) return null;

      try {
        const response = await axios.get("/restaurant/auth-status", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = response.data;

        return data;
      } catch (error) {
        console.log(error);
      }
    },
    enabled: !!token,
    retry: false,
  });

  useEffect(() => {
    refetchAuthStatus();

    if (authStatusData) {
      setAdmin(authStatusData);
    }
  }, [authStatusData, refetchAuthStatus, token]);

  const login = async (data: {
    email: string;
    password: string;
  }): Promise<IAdmin> => {
    try {
      const { email, password } = data;

      const response = await axios.post("/restaurant/login", {
        email,
        password,
      });

      const responseData = response.data;

      if (response.status === 404 || response.status === 401) {
        throw new Error(responseData.message);
      }

      if (responseData) {
        localStorage.setItem("adminInfo", JSON.stringify(responseData.token));
        setToken(responseData.token);
      }

      queryClient.invalidateQueries({
        queryKey: ["admin-status"],
      });

      await refetchAuthStatus();

      return responseData;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message || "Something went wrong");
      } else {
        throw new Error("Something went wrong");
      }
    }
  };

  const logout = async () => {
    localStorage.removeItem("adminInfo");
    setToken(null);
    setAdmin(null);

    queryClient.invalidateQueries();
  };

  const value = {
    admin,
    login,
    logout,
    token,
    isPending,
  };

  return (
    <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
  );
};

export { AdminContext };
