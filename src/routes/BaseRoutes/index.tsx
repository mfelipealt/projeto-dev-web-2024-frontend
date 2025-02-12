import { Route, Routes } from "react-router-dom";
import { UserSignInPage } from "@/pages/UserSignInPage";
import { UserSignupPage } from "@/pages/UserSignUpPage";
import { AuthenticatedRoutes } from "@/routes/AuthenticatedRoutes";
import { CategoryListPage } from "@/pages/CategoryListPage";
import { ProductListPage } from "@/pages/ProductListPage";
import { NavBar } from "@/components/NavBar";
import { CategoryProductsPage } from "@/pages/CategoryProductPages";
import { ProductDetails } from "@/pages/ProductDetailsPage";
import { CheckoutPage } from "@/pages/CheckoutPage";
import { UserPage } from "@/pages/UserPage.tsx";

export function BaseRoutes() {
  return (
    <>
      <NavBar />
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<UserSignInPage />} />
        <Route path="/cadastrar" element={<UserSignupPage />} />
        <Route path="/" element={<ProductListPage />} />
        <Route path="/products" element={<ProductListPage />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/category/:categoryId" element={<CategoryProductsPage />} />
        <Route path="/categories" element={<CategoryListPage />} />

        {/* Protected Routes */}
        <Route element={<AuthenticatedRoutes />}>
          <Route path="/checkout" element={<CheckoutPage/>} />
          <Route path="/user" element={<UserPage/>} />
        </Route>
      </Routes>
    </>
  );
}