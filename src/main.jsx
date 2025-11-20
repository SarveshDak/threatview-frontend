import React, { useEffect } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

import { useAuthStore } from "./store/authStore";

function AppInitializer() {
  const init = useAuthStore((s) => s.init);

  useEffect(() => {
    init(); // 👈 Auto-login ONCE (correct place)
  }, []);

  return <App />;
}

createRoot(document.getElementById("root")).render(<AppInitializer />);
