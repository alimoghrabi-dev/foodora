import React from "react";
import { Route, Routes } from "react-router-dom";
import RootLayout from "./components/layout/RootLayout";
import LoginForm from "./components/auth/LoginForm";
import {
  AddMenuItem,
  CompleteInfo,
  CreateCategory,
  EditMenuItem,
  EditRestaurant,
  Home,
  Menu,
  OrderPage,
  Orders,
  VerifyEmailPage,
} from "./pages/pages";
import { useAuth } from "./context/useAuth";
import OpeningHours from "./pages/OpeningHours";

const App: React.FC = () => {
  const { admin } = useAuth();

  const isAdminInfoIncomplete =
    !admin?.deliveryTime ||
    !admin?.cuisine ||
    !admin?.coverImage ||
    !admin?.address ||
    !admin?.latitude ||
    !admin?.longitude ||
    !admin?.isEmailVerified ||
    !admin?.description ||
    !admin?.phoneNumber ||
    !admin?.openingHours;

  return (
    <Routes>
      <Route element={<RootLayout />}>
        <Route index element={<Home />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/menu/add" element={<AddMenuItem />} />
        <Route path="/menu/create-category" element={<CreateCategory />} />
        <Route path="/menu/item/edit/:id" element={<EditMenuItem />} />
        <Route path="/edit-restaurant" element={<EditRestaurant />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/orders/:id" element={<OrderPage />} />
        <Route path="/opening-hours" element={<OpeningHours />} />

        {isAdminInfoIncomplete && (
          <Route path="/info" element={<CompleteInfo />} />
        )}
      </Route>

      <Route path="/login" element={<LoginForm />} />
      <Route path="/verify-email/:token" element={<VerifyEmailPage />} />
    </Routes>
  );
};

export default App;
