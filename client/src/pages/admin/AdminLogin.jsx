import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext.jsx";

export default function AdminLogin() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onSubmit = async ({ email, password }) => {
    setLoading(true);
    try {
      await login(email, password);
      navigate("/admin/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-ink px-6">
      <div className="glass rounded-2xl p-10 w-full max-w-md">
        <img src="/brand/logo-square.png" alt="Shoot Delight" className="brand-logo h-20 mx-auto mb-2" />
        <p className="text-center text-cream/60 text-sm mb-8">Admin Login</p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-2 text-cream">Email</label>
            <input
              type="email"
              {...register("email", { required: "Email is required" })}
              className="w-full bg-white/5 border border-cream/20 rounded-lg px-4 py-3 text-cream focus:outline-none focus:border-brand"
            />
            {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-cream">Password</label>
            <input
              type="password"
              {...register("password", { required: "Password is required" })}
              className="w-full bg-white/5 border border-cream/20 rounded-lg px-4 py-3 text-cream focus:outline-none focus:border-brand"
            />
            {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full justify-center disabled:opacity-60">
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
