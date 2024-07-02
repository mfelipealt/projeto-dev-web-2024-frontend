import { Route, Routes } from "react-router-dom";
import { HomePage } from "@/pages/HomePage";
import { UserSignInPage } from "@/pages/UserSignInPage";
import { UserSignupPage } from "@/pages/UserSignUpPage";
import { AuthenticatedRoutes } from "@/routes/AuthenticatedRoutes";
import { CategoryListPage } from "@/pages/CategoryListPage";
import { ProductListPage } from "@/pages/ProductListPage";
import { NavBar } from "@/components/NavBar";
import { CategoryProductsPage } from "@/pages/CategoryProductPages";
import { ProductDetails } from "@/pages/ProductDetails";

export function BaseRoutes() {
  return (
    <>
      <NavBar />
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<UserSignInPage />} />
        <Route path="/cadastrar" element={<UserSignupPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<ProductListPage />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/category/:categoryId" element={<CategoryProductsPage />} />
        <Route path="/categories" element={<CategoryListPage />} />

        {/* Protected Routes */}
        <Route element={<AuthenticatedRoutes />}>
        </Route>
      </Routes>
    </>
  );
}