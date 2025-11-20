import { useState } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export default function IocSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;

    setLoading(true);

    try {
      const res = await fetch(
        `http://127.0.0.1:5000/api/iocs/search?q=${encodeURIComponent(query)}`
      );

      const data = await res.json();
      setResults(data);
    } catch (err) {
      console.error("❌ Search failed:", err);
    }

    setLoading(false);
  };

  const getThreatLevelColor = (level) => {
    if (!level) return "bg-muted text-muted-foreground";

    switch (level.toLowerCase()) {
      case "critical":
        return "bg-critical text-critical-foreground";
      case "high":
        return "bg-warning text-warning-foreground";
      case "medium":
        return "bg-primary/20 text-primary";
      case "low":
        return "bg-success/20 text-success";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="p-8 space-y-8">

      <div>
        <h1 className="text-3xl font-bold mb-2">IoC Search</h1>
        <p className="text-muted-foreground">
          Search IPs, domains, hashes, or URLs from the live threat feed.
        </p>
      </div>

      <Card className="p-6 bg-card border-border">
        <div className="flex gap-4">
          <Input
            type="text"
            placeholder="Enter IP, domain, hash, URL..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="bg-background border-border"
          />

          <Button onClick={handleSearch} className="bg-primary hover:bg-primary-glow">
            <Search className="w-4 h-4 mr-2" />
            Search
          </Button>
        </div>
      </Card>

      {/* Loading */}
      {loading && (
        <Card className="p-8 text-center bg-card border-border">
          <p className="text-muted-foreground">Searching live data...</p>
        </Card>
      )}

      {/* Results */}
      {results.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">
            Search Results ({results.length})
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {results.map((ioc) => (
              <Card
                key={ioc._id}
                className="p-6 bg-card border-border hover:glow-effect transition-all"
              >
                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex justify-between items-start">
                    <div>
                      <Badge variant="outline" className="uppercase mb-1">
                        {ioc.type}
                      </Badge>
                      <p className="font-mono text-sm break-all">
                        {ioc.value}
                      </p>
                    </div>

                    <Badge
                      className={cn(
                        "capitalize",
                        getThreatLevelColor(ioc.severity)
                      )}
                    >
                      {ioc.severity || "unknown"}
                    </Badge>
                  </div>

                  {/* Details */}
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Source</span>
                      <span className="font-medium">{ioc.source}</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Confidence</span>
                      <span className="font-medium">
                        {ioc.confidence || "N/A"}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-muted-foreground">First Seen</span>
                      <span className="font-medium">
                        {ioc.dateDetected
                          ? new Date(ioc.dateDetected).toLocaleDateString()
                          : "N/A"}
                      </span>
                    </div>
                  </div>

                  {/* Tags */}
                  {ioc.tags?.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {ioc.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* No results */}
      {!loading && query && results.length === 0 && (
        <Card className="p-12 text-center bg-card border-border">
          <p className="text-muted-foreground">
            No results found for "{query}". Try another search.
          </p>
        </Card>
      )}
    </div>
  );
}
