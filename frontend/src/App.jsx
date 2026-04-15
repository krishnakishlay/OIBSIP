import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import ToastList from "./components/Toast";
import Home from "./pages/Home";
import MenuPage from "./pages/Menu";
import BuilderPage from "./pages/Builder";
import CheckoutPage from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";
import AdminOrders from "./pages/AdminOrders";
import AdminLogin from "./pages/AdminLogin";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/"          element={<Home />}         />
        <Route path="/menu"      element={<MenuPage />}     />
        <Route path="/build"     element={<BuilderPage />}  />
        <Route path="/checkout"  element={<CheckoutPage />} />
        <Route path="/order/:id" element={<OrderSuccess />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/orders" element={<AdminOrders />} />
        <Route path="*"          element={<NotFound />}     />
      </Routes>
      <ToastList />
    </>
  );
}