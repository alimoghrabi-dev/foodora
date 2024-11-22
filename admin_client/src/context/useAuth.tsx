import { useContext } from "react";
import { AdminContext } from "./AdminContext";

export const useAuth = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error("useAuth must be used within an AdminContextProvider");
  }

  return context;
};
