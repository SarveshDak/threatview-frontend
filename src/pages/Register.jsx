import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";

export default function Register() {
  const navigate = useNavigate();
  const register = useAuthStore((s) => s.register);
  const loading = useAuthStore((s) => s.loading);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    company: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await register(form);
      navigate("/");
    } catch (err) {
      setError(err?.message || "Registration failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-muted">
      <div className="bg-card p-8 rounded-xl border border-border shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-6 text-center">Create Account</h2>

        {error && (
          <p className="text-red-500 text-sm mb-3 text-center">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            className="w-full p-3 rounded-lg bg-muted border border-border"
            placeholder="First Name"
            required
            value={form.firstName}
            onChange={(e) => setForm({ ...form, firstName: e.target.value })}
          />

          <input
            className="w-full p-3 rounded-lg bg-muted border border-border"
            placeholder="Last Name"
            value={form.lastName}
            onChange={(e) => setForm({ ...form, lastName: e.target.value })}
          />

          <input
            className="w-full p-3 rounded-lg bg-muted border border-border"
            placeholder="Company"
            value={form.company}
            onChange={(e) => setForm({ ...form, company: e.target.value })}
          />

          <input
            className="w-full p-3 rounded-lg bg-muted border border-border"
            placeholder="Email"
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />

          <input
            className="w-full p-3 rounded-lg bg-muted border border-border"
            placeholder="Password"
            type="password"
            required
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />

          <button
            type="submit"
            className="w-full bg-primary text-primary-foreground py-3 rounded-lg"
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Register"}
          </button>
        </form>

        <p className="text-center text-sm text-muted-foreground mt-4">
          Already have an account?{" "}
          <span
            className="text-primary cursor-pointer"
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}
