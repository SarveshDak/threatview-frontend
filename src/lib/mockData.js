// ------------------------------------------------------------
// ThreatView Mock Data (ONLY for charts/cards fallback)
// ------------------------------------------------------------

// These values are kept ONLY for UI fallback or demo mode.
// They are NOT used anywhere in IoC Search anymore.

export const mockThreatData = {
  activeThreats: 1250,

  topCountries: [
    { country: "Russia", count: 320 },
    { country: "China", count: 280 },
    { country: "North Korea", count: 150 },
    { country: "Iran", count: 110 },
    { country: "USA", count: 90 },
  ],

  trendingMalware: [
    { name: "Emotet", count: 240 },
    { name: "TrickBot", count: 180 },
    { name: "Ryuk", count: 140 },
    { name: "Maze", count: 120 },
    { name: "Dridex", count: 95 },
  ],

  phishingUrls: 430,

  malwareTrend: [
    { date: "2024-01-07", count: 120 },
    { date: "2024-01-08", count: 135 },
    { date: "2024-01-09", count: 150 },
    { date: "2024-01-10", count: 170 },
    { date: "2024-01-11", count: 165 },
    { date: "2024-01-12", count: 155 },
    { date: "2024-01-13", count: 180 },
  ],

  attacksByCountry: [
    { country: "Russia", latitude: 61.524, longitude: 105.3188, value: 320 },
    { country: "China", latitude: 35.8617, longitude: 104.1954, value: 280 },
    { country: "North Korea", latitude: 40.3399, longitude: 127.5101, value: 150 },
    { country: "Iran", latitude: 32.4279, longitude: 53.688, value: 110 },
    { country: "USA", latitude: 37.0902, longitude: -95.7129, value: 90 },
  ],

  phishingActivity: [
    { date: "2024-01-07", count: 80 },
    { date: "2024-01-08", count: 95 },
    { date: "2024-01-09", count: 100 },
    { date: "2024-01-10", count: 120 },
    { date: "2024-01-11", count: 130 },
    { date: "2024-01-12", count: 110 },
    { date: "2024-01-13", count: 140 },
  ],
};

// ------------------------------------------------------------
// ❌ REMOVED — mockIoCs (NOT USED ANYMORE)
// IoC search now uses REAL data from backend
// ------------------------------------------------------------

// ------------------------------------------------------------
// Mock Alerts (still safe to use)
// ------------------------------------------------------------

export const mockAlerts = [
  {
    id: "1",
    name: "Healthcare Ransomware Monitor",
    industry: "Healthcare",
    keywords: ["ransomware", "healthcare", "hospital"],
    targets: ["*.hospital.com", "10.0.0.0/8"],
    alertType: "Email",
    frequency: "Immediate",
    createdAt: "2024-01-10T14:30:00Z",
    enabled: true,
  },
  {
    id: "2",
    name: "Financial Phishing Watch",
    industry: "Finance",
    keywords: ["phishing", "banking", "credential"],
    targets: ["*.bank.com"],
    alertType: "Slack",
    frequency: "Daily",
    createdAt: "2024-01-08T09:15:00Z",
    enabled: true,
  },
  {
    id: "3",
    name: "APT Group Activity",
    industry: "Technology",
    keywords: ["apt", "advanced-persistent-threat"],
    targets: ["*.techcorp.com"],
    alertType: "Email",
    frequency: "Weekly",
    createdAt: "2024-01-05T16:45:00Z",
    enabled: false,
  },
];
