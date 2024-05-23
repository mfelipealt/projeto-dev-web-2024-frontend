import { Route, Routes } from "react-router-dom";
import { HomePage } from "@/pages/HomePage";
import { UserSignInPage } from "@/pages/UserSignInPage";
import { UserSignupPage } from "@/pages/UserSignUpPage";
import { AuthenticatedRoutes } from "@/routes/AuthenticatedRoutes";
import { CategoryListPage } from "@/pages/CategoryListPage";
import { CategoryFormPage } from "@/pages/CategoryFormPage";

export function BaseRoutes() {
  return (
    <>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<UserSignInPage />} />
        <Route path="/cadastrar" element={<UserSignupPage />} />

        {/* Protected Routes */}
        <Route element={<AuthenticatedRoutes />}>
            <Route path="/home" element={<HomePage />} />
            <Route path="/" element={<HomePage />} />
            <Route path="/categories" element={<CategoryListPage />} />
            <Route path="/categories/new" element={<CategoryFormPage />} />
        </Route>
      </Routes>
    </>
  );
}