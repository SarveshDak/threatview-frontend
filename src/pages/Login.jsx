import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { Shield } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);
  const loading = useAuthStore((s) => s.loading);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await login(form);
      navigate("/");
    } catch (err) {
      const message = err?.message || err?.msg || err?.error || String(err);
      setError(message || "Login failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-muted">
      <div className="bg-card p-10 rounded-2xl border border-border shadow-xl w-full max-w-lg">

        {/* ⭐ BIG CENTERED LOGO BLOCK */}
        <div className="flex flex-col items-center justify-center mb-10">
          <div className="relative mb-3">
            <Shield className="w-16 h-16 text-primary" /> {/* BIG ICON */}
            <div className="absolute inset-0 glow-effect rounded-full" />
          </div>

          <h1 className="text-4xl font-extrabold text-foreground text-center">
            ThreatView
          </h1>

          <p className="text-sm text-muted-foreground mt-1 tracking-wide text-center">
            Intelligence Platform
          </p>
        </div>

        <h2 className="text-xl font-semibold mb-4 text-center">Sign In</h2>

        {error && (
          <p
            role="alert"
            className="text-red-500 text-sm mb-3 text-center break-words"
          >
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            className="w-full p-3 rounded-lg bg-muted border border-border"
            placeholder="Email"
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            autoComplete="email"
          />

          <input
            className="w-full p-3 rounded-lg bg-muted border border-border"
            placeholder="Password"
            type="password"
            required
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            autoComplete="current-password"
          />

          <button
            type="submit"
            className="w-full bg-primary text-primary-foreground py-3 rounded-lg text-base font-medium"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="text-center text-sm text-muted-foreground mt-5">
          Don’t have an account?{" "}
          <button
            className="text-primary underline-offset-2 hover:underline"
            onClick={() => navigate("/register")}
          >
            Register
          </button>
        </p>
      </div>
    </div>
  );
}
