import { Card } from "@/components/ui/card";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
} from "react-simple-maps";
import { useState, useRef, useMemo, useEffect } from "react";
import { motion } from "framer-motion";


const geoUrl =
  "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

export function ThreatMap({ displayData }) {
  const [hovered, setHovered] = useState(null);
  const [countryHover, setCountryHover] = useState(null);

  const mapRef = useRef(null);
  const pulseRef = useRef(0);       // 🔥 Use ref instead of state
  const [renderTick, setRenderTick] = useState(0); // triggers occasional renders

  // ------------------------------------------------------
  // ⚡ Ultra-fast pulse WITHOUT re-rendering every frame
  // ------------------------------------------------------
  useEffect(() => {
    let frame;

    const animate = () => {
      pulseRef.current += 0.06;

      // Re-render only 12 times/sec instead of 60
      // Smooth animation without choking React
      if (pulseRef.current % 5 < 0.1) {
        setRenderTick((t) => t + 1);
      }

      frame = requestAnimationFrame(animate);
    };

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, []);

  // ------------------------------------------------------
  // ⭐ Preprocess & merge attack points
  // ------------------------------------------------------
  const attacks = displayData?.attacksByCountry || [];

  const attackPoints = useMemo(() => {
    const filtered = attacks.filter(
      (a) =>
        a.latitude &&
        a.longitude &&
        !isNaN(+a.latitude) &&
        !isNaN(+a.longitude)
    );

    const combined = {};
    filtered.forEach((a) => {
      const key = `${a.latitude}-${a.longitude}`;
      combined[key] = combined[key]
        ? { ...a, value: combined[key].value + a.value }
        : { ...a };
    });

    return Object.values(combined);
  }, [attacks]);

  return (
    <Card className="p-6 border-border bg-card">
      <h3 className="text-lg font-semibold text-foreground mb-4">
        Global Attack Sources
      </h3>

      <div ref={mapRef} className="relative">
        <ComposableMap
          projection="geoMercator"
          projectionConfig={{ scale: 145 }}
          style={{ width: "100%", height: "480px" }}
        >
          {/* WORLD MAP */}
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  style={{
                    default: { fill: "hsl(var(--muted))" },
                    hover: { fill: "hsl(var(--muted-foreground))" },
                    pressed: { fill: "white" },
                  }}
                  onMouseMove={(e) => {
                    const bounds = mapRef.current?.getBoundingClientRect();
                    if (!bounds) return;
                    setCountryHover({
                      name: geo.properties.name,
                      x: e.clientX - bounds.left,
                      y: e.clientY - bounds.top,
                    });
                  }}
                  onMouseLeave={() => setCountryHover(null)}
                />
              ))
            }
          </Geographies>

          {/* ATTACK MARKERS */}
          {attackPoints.map((attack, i) => {
            const strong = Math.sqrt(attack.value || 1);
            const baseSize = Math.min(14, Math.max(4, strong));

            // 🔥 Smooth pulse from ref — NOT re-rendering 60 fps
            const animatedSize =
              baseSize + Math.sin(pulseRef.current) * 1.3;

            return (
              <Marker
  key={i}
  coordinates={[+attack.longitude, +attack.latitude]}
  onMouseMove={(e) => {
    const bounds = mapRef.current?.getBoundingClientRect();
    if (!bounds) return;
    setHovered({
      x: e.clientX - bounds.left,
      y: e.clientY - bounds.top,
      country: attack.country,
      value: attack.value,
    });
  }}
  onMouseLeave={() => setHovered(null)}
>
  <g style={{ transformOrigin: "center" }}>
    <motion.circle
      r={animatedSize * 2.8}
      fill="hsl(var(--critical))"
      fillOpacity={0.22}
      animate={{ scale: [1, 1.25, 1], opacity: [0.6, 1, 0.6] }}
      transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
    />

    <motion.circle
      r={animatedSize}
      fill="hsl(var(--critical))"
      fillOpacity={0.95}
      animate={{ scale: [1, 1.15, 1], opacity: [1, 0.5, 1] }}
      transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
    />

    <motion.circle
      r={animatedSize + 1.5}
      stroke="hsl(var(--critical))"
      strokeWidth={1}
      fill="none"
      animate={{ scale: [1, 1.3, 1], opacity: [0.8, 0.35, 0.8] }}
      transition={{ duration: 1.9, repeat: Infinity, ease: "easeInOut" }}
    />
  </g>
</Marker>

            );
          })}
        </ComposableMap>

        {/* HOVER TOOLTIP */}
        {hovered && (
          <div
            className="absolute bg-card border border-border rounded-lg px-3 py-2 text-sm shadow-md"
            style={{ left: hovered.x + 10, top: hovered.y + 10 }}
          >
            <p className="font-semibold text-foreground">{hovered.country}</p>
            <p className="text-muted-foreground">{hovered.value} attacks</p>
          </div>
        )}

        {/* COUNTRY TOOLTIP */}
        {countryHover && (
          <div
            className="absolute bg-card border border-border rounded-lg px-2 py-1 text-xs shadow-md"
            style={{ left: countryHover.x + 10, top: countryHover.y + 10 }}
          >
            <p className="text-foreground">{countryHover.name}</p>
          </div>
        )}
      </div>
    </Card>
  );
}
