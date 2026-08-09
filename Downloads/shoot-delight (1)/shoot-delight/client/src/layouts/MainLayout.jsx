import { Outlet } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";

export default function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Toaster position="top-center" toastOptions={{ style: { background: "#111", color: "#faf9f6" } }} />
      <Navbar />
      <main className="flex-1 pt-20">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
