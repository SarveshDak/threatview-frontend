import { create } from "zustand";
import { persist } from "zustand/middleware";

// ✅ 1) CLEAN, CORRECT BASE URL (no double '//')
const BASE_URL = "https://threatview-backend-production.up.railway.app/api/auth";

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      loading: false,

      // Prevent auto-loading UI bug
      resetLoading: () => set({ loading: false }),

      // ------------------------------------------------------
      // INIT (Auto-login on refresh)
      // ------------------------------------------------------
      init: async () => {
        get().resetLoading();

        const token = get().token;
        if (!token) return;

        try {
          const res = await fetch(`${BASE_URL}/me`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          if (!res.ok) {
            get().logout();
            return;
          }

          const data = await res.json();
          set({ user: data.user });
        } catch (err) {
          console.error("Auto-login failed:", err);
          get().logout();
        }
      },

      // ------------------------------------------------------
      // REGISTER
      // ------------------------------------------------------
      register: async (formData) => {
        set({ loading: true });

        try {
          const res = await fetch(`${BASE_URL}/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
          });

          // ✅ Read as text first to avoid "Unexpected token <"
          const raw = await res.text();
          let data = {};

          try {
            data = raw ? JSON.parse(raw) : {};
          } catch (e) {
            // Backend returned HTML or non-JSON
            throw { message: raw || "Unexpected response from server" };
          }

          if (!res.ok) {
            throw data;
          }

          set({
            user: data.user,
            token: data.token,
            loading: false,
          });

          return data;
        } catch (err) {
          console.error("Register error:", err);
          set({ loading: false });
          throw err;
        }
      },

      // ------------------------------------------------------
      // LOGIN
      // ------------------------------------------------------
      login: async ({ email, password }) => {
        set({ loading: true });

        try {
          const res = await fetch(`${BASE_URL}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
          });

          const raw = await res.text();
          let data = {};

          try {
            data = raw ? JSON.parse(raw) : {};
          } catch (e) {
            throw { message: raw || "Unexpected response from server" };
          }

          if (!res.ok) {
            throw data;
          }

          set({
            user: data.user,
            token: data.token,
            loading: false,
          });

          return data;
        } catch (err) {
          console.error("Login error:", err);
          set({ loading: false });
          throw err;
        }
      },

      // ------------------------------------------------------
      // LOGOUT
      // ------------------------------------------------------
      logout: () => {
        set({ user: null, token: null, loading: false });
      },
    }),
    {
      name: "auth-storage",
    }
  )
);
