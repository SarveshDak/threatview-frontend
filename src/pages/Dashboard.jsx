import { useState, useEffect } from "react";
import { Activity, Globe, Bug, Link as LinkIcon } from "lucide-react";
import { useThreatStore } from "@/store/threatStore";
import { ThreatCard } from "@/components/dashboard/ThreatCard";
import { ThreatMap } from "@/components/dashboard/ThreatMap";
import { ChartSection } from "@/components/dashboard/ChartSection";
import { IocsTable } from "@/components/dashboard/IocsTable";
import { Skeleton } from "@/components/ui/skeleton";

export default function Dashboard() {
  const {
    displayData,
    iocs,
    loading,
    fetchAllThreats,
  } = useThreatStore();

  // -------------------------------
  // LIVE FLUCTUATING STATS
  // -------------------------------
  const [liveStats, setLiveStats] = useState({
    activeThreats: 0,
    topCountries: 0,
    trendingMalware: 0,
    totalThreats: 0,
  });

  // Load backend threat data once
  useEffect(() => {
    fetchAllThreats();
  }, []);

  // Initialize live stats when backend data loads
  useEffect(() => {
    if (displayData) {
      setLiveStats({
        activeThreats: displayData.activeThreats,
        topCountries: displayData.topCountries.length,
        trendingMalware: displayData.trendingMalware.length,
        totalThreats: displayData.totalThreats,
      });
    }
  }, [displayData]);

  // Fluctuation function
  const fluctuate = (value, min, max) => {
    const change = Math.floor(Math.random() * (max - min) + min);
    const plusOrMinus = Math.random() > 0.5 ? 1 : -1;

    let newValue = value + change * plusOrMinus;
    if (newValue < 0) newValue = 0;
    return newValue;
  };

  // Auto-change values every 3 seconds (after data is loaded)
  useEffect(() => {
    if (!displayData) return;

    const interval = setInterval(() => {
      setLiveStats(prev => ({
        activeThreats: fluctuate(prev.activeThreats, 10, 40),
        topCountries: fluctuate(prev.topCountries, 1, 3),
        trendingMalware: fluctuate(prev.trendingMalware, 1, 4),
        totalThreats: fluctuate(prev.totalThreats, 20, 80),
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, [displayData]);

  return (
    <div className="p-8 space-y-8 relative">

      {/* GPU Drift Background */}
      <div className="drift-bg">
        <div className="drift-blob blob-red" />
        <div className="drift-blob blob-yellow" />
      </div>

      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Threat Intelligence Dashboard
        </h1>
        <p className="text-muted-foreground">
          Real-time overview of global cyber threats
        </p>
      </div>

      {/* CARDS */}
      {!displayData ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1,2,3,4].map(i => <Skeleton key={i} className="h-24" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

          <ThreatCard 
            title="Active Threats Today" 
            value={liveStats.activeThreats}
            icon={Activity}
            variant="critical"
          />

          <ThreatCard 
            title="Top Attacker Countries" 
            value={liveStats.topCountries}
            icon={Globe}
            variant="warning"
          />

          <ThreatCard 
            title="Trending Malware Families" 
            value={liveStats.trendingMalware}
            icon={Bug}
            variant="warning"
          />

          <ThreatCard 
            title="Total Threats Found" 
            value={liveStats.totalThreats}
            icon={LinkIcon}
            variant="critical"
          />

        </div>
      )}

      {/* MAP */}
      {displayData ? <ThreatMap displayData={displayData} /> : <Skeleton className="h-[480px]" />}

      {/* CHARTS */}
      {displayData ? <ChartSection displayData={displayData} /> : <Skeleton className="h-[350px]" />}

      {/* IOC TABLE */}
      <div>
        {loading && !iocs.length ? (
          <Skeleton className="h-40" />
        ) : (
          <IocsTable iocs={iocs} />
        )}
      </div>
    </div>
  );
}
