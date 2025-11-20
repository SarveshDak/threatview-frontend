import { create } from "zustand";

// ✅ Base URL for Railway backend
const BASE_URL =
  "https://threatview-backend-production.up.railway.app/api/threats";

// 🔧 Safer helper: force no-cache, handle 304 cleanly
const safeFetchJson = async (url) => {
  // cache: "no-store" stops the browser from doing 304 conditional requests
  const res = await fetch(url, { cache: "no-store" });
  const text = await res.text();
  let data = {};

  try {
    data = text ? JSON.parse(text) : {};
  } catch (e) {
    throw new Error(text || "Unexpected response from server");
  }

  // Treat 2xx as success; anything else as error
  if (res.status < 200 || res.status >= 300) {
    throw new Error(data.message || `Request failed: ${res.status}`);
  }

  return data;
};

export const useThreatStore = create((set, get) => ({
  // -------------------------------------------------------
  // STATE
  // -------------------------------------------------------
  displayData: null,
  iocs: [],
  loading: false,

  // Alerts State (FIX)
  alerts: [],

  // -------------------------------------------------------
  // 🌫️ Smooth UI Drift Animation
  // -------------------------------------------------------
  startLiveDrift: () => {
    let drift = 0;

    const animate = () => {
      drift += 0.015;

      document.documentElement.style.setProperty(
        "--drift-x",
        `${Math.sin(drift) * 4}px`
      );

      document.documentElement.style.setProperty(
        "--drift-y",
        `${Math.cos(drift * 0.7) * 4}px`
      );

      document.documentElement.style.setProperty(
        "--pulse",
        `${(Math.sin(drift * 2) + 1) / 2}`
      );

      requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  },

  // -------------------------------------------------------
  // 🚀 ALERTS CRUD (NEW)
  // -------------------------------------------------------
  setAlerts: (alerts) => set({ alerts }),

  addAlert: (alert) =>
    set((state) => ({
      alerts: [...state.alerts, alert],
    })),

  toggleAlert: (id) =>
    set((state) => ({
      alerts: state.alerts.map((a) =>
        a.id === id ? { ...a, enabled: !a.enabled } : a
      ),
    })),

  deleteAlert: (id) =>
    set((state) => ({
      alerts: state.alerts.filter((a) => a.id !== id),
    })),

  // -------------------------------------------------------
  // 🚀 FETCH ALL THREAT DATA FROM BACKEND
  // -------------------------------------------------------
  fetchAllThreats: async () => {
    set({ loading: true });

    try {
      const [
        allThreats,
        malwareTrend,
        phishingTrend,
        topCountries,
        mapData,
        families,
      ] = await Promise.all([
        safeFetchJson(`${BASE_URL}`),
        safeFetchJson(`${BASE_URL}/malware-trends`),
        safeFetchJson(`${BASE_URL}/phishing-trends`),
        safeFetchJson(`${BASE_URL}/top-countries`),
        safeFetchJson(`${BASE_URL}/map-data`),
        safeFetchJson(`${BASE_URL}/malware-families`),
      ]);

      set({
        loading: false,
        iocs: allThreats,
      });

      get().processDashboardData({
        allThreats,
        malwareTrend,
        phishingTrend,
        topCountries,
        mapData,
        families,
      });
    } catch (err) {
      console.error("FETCH ERROR:", err);
      set({ iocs: [], displayData: null, loading: false });
    }
  },

  // -------------------------------------------------------
  // 🧠 PROCESS DASHBOARD DATA
  // -------------------------------------------------------
  processDashboardData: ({
    allThreats,
    malwareTrend,
    phishingTrend,
    topCountries,
    mapData,
    families,
  }) => {
    const activeThreats = allThreats.filter((t) =>
      ["High", "Critical"].includes(t.severity)
    ).length;

    const severityCounts = allThreats.reduce((acc, t) => {
      const s = t.severity || "Unknown";
      acc[s] = (acc[s] || 0) + 1;
      return acc;
    }, {});

    const phishingUrls = allThreats.filter(
      (t) => (t.type || "").toLowerCase() === "url"
    ).length;

    set({
      displayData: {
        totalThreats: allThreats.length,
        activeThreats,
        severityCounts,
        topCountries: topCountries.length
          ? topCountries
          : [{ country: "—", count: 0 }],
        attacksByCountry: mapData,
        trendingMalware: families.map((f) => f._id),
        malwareTrend,
        phishingActivity: phishingTrend,
        phishingUrls,
      },
    });
  },
}));
