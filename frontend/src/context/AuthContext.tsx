import React, { createContext, useEffect, useState } from "react";
import axios from "axios";
import { useQuery, useQueryClient } from "@tanstack/react-query";

type AuthContextType = {
  user: IUser | null;
  login: (data: { email: string; password: string }) => Promise<IUser>;
  logout: () => void;
  token: string | null;
  appliesLength: number | null;
  userOrdersLength: number | null;
  isPending: boolean;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [appliesLength, setappliesLength] = useState<number | null>(null);
  const [userOrdersLength, setUserOrdersLength] = useState<number | null>(null);
  const [token, setToken] = useState<string | null>(() => {
    const tokenInfoStorage = localStorage.getItem("tokenInfo");
    return tokenInfoStorage ? JSON.parse(tokenInfoStorage) : null;
  });

  const queryClient = useQueryClient();

  const logout = async () => {
    localStorage.removeItem("tokenInfo");
    setToken(null);
    setUser(null);

    if (user?.googleId) {
      window.open("http://localhost:5000/logout", "_self");
    }

    queryClient.invalidateQueries({ queryKey: ["auth-status"] });
  };

  const {
    data: authStatusData,
    refetch: refetchAuthStatus,
    isPending,
  } = useQuery({
    queryKey: ["auth-status"],
    queryFn: async () => {
      if (!token) return null;

      try {
        const response = await axios.get("/auth/auth-status", {
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
  });

  useEffect(() => {
    refetchAuthStatus();

    if (authStatusData) {
      setUser(authStatusData?.user);
      setappliesLength(authStatusData?.appliesLength);
      setUserOrdersLength(authStatusData?.userOrdersLength);
    }
  }, [authStatusData, refetchAuthStatus, token]);

  const login = async (data: {
    email: string;
    password: string;
  }): Promise<IUser> => {
    try {
      const { email, password } = data;

      const response = await axios.post("/auth/login", {
        email,
        password,
      });

      const responseData = response.data;

      if (response.status === 404 || response.status === 401) {
        throw new Error(responseData.message);
      }

      if (responseData) {
        localStorage.setItem("tokenInfo", JSON.stringify(responseData.token));
        setToken(responseData.token);
      }

      queryClient.invalidateQueries({
        queryKey: ["auth-status"],
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

  const value = {
    user,
    login,
    logout,
    token,
    appliesLength,
    userOrdersLength,
    isPending,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export { AuthContext };
