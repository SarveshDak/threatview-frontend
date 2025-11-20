import { useEffect, useRef, useState } from "react";

export function useCountAnimation(value, duration = 600) {
  // Ensure value is always a valid number
  const safeValue =
    typeof value === "number" && !isNaN(value) ? value : 0;

  const [displayValue, setDisplayValue] = useState(safeValue);
  const previousValue = useRef(safeValue);
  const rafRef = useRef(null);

  useEffect(() => {
    // If no change → no animation
    if (previousValue.current === safeValue) return;

    const startValue = previousValue.current;
    const endValue = safeValue;

    const startTime = performance.now();

    const animate = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Smooth easing (easeOutCubic)
      const eased = 1 - Math.pow(1 - progress, 3);

      const current = startValue + (endValue - startValue) * eased;

      setDisplayValue(Math.round(current));

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      }
    };

    // Begin animation
    rafRef.current = requestAnimationFrame(animate);

    // Store value for next cycle
    previousValue.current = safeValue;

    // Cleanup on unmount
    return () => cancelAnimationFrame(rafRef.current);
  }, [safeValue, duration]);

  return displayValue;
}
