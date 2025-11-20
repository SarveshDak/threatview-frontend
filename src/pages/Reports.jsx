import { useEffect, useState } from "react";
import { FileText, Download, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

const API = import.meta.env.VITE_API_URL;   // ✅ USE ENV BASE URL

export default function Reports() {
  const [pastReports, setPastReports] = useState([]);

  useEffect(() => {
    fetchPastReports();
  }, []);

  const fetchPastReports = async () => {
    try {
      const res = await fetch(`${API}/api/reports`);
      const data = await res.json();

      if (data.success) {
        setPastReports(data.reports);
      }
    } catch (error) {
      console.error("Fetch Reports Error:", error);
    }
  };

  const handleGenerateReport = async () => {
    try {
      const res = await fetch(`${API}/api/reports/generate`);
      const data = await res.json();

      if (data.success) {
        toast.success("Report generated!", {
          description: "A new intelligence report has been created.",
        });

        fetchPastReports();
      } else {
        toast.error("Failed to generate report");
      }
    } catch (err) {
      toast.error("Server error while generating report");
    }
  };

  const handleDownload = (id) => {
    window.open(`${API}/api/reports/export/${id}`, "_blank");
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Do you really want to delete this report?"
    );
    if (!confirmDelete) return;

    try {
      const res = await fetch(`${API}/api/reports/delete/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (data.success) {
        toast.success("Report deleted successfully");
        setPastReports(pastReports.filter((r) => r._id !== id));
      } else {
        toast.error("Failed to delete report");
      }
    } catch (error) {
      toast.error("Server error while deleting report");
    }
  };

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Reports</h1>
        <p className="text-muted-foreground">
          Generate and download threat intelligence reports
        </p>
      </div>

      <Card className="p-8 border-border bg-card cyber-border glow-effect">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold text-foreground">
              Generate New Report
            </h2>
            <p className="text-muted-foreground">
              Create a comprehensive weekly threat intelligence report
            </p>
          </div>

          <Button
            onClick={handleGenerateReport}
            size="lg"
            className="bg-primary hover:bg-primary-glow glow-effect"
          >
            <FileText className="w-5 h-5 mr-2" />
            Generate Report
          </Button>
        </div>
      </Card>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground">Past Reports</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pastReports.map((report) => (
            <Card
              key={report._id}
              className="p-6 border-border bg-card hover:glow-effect transition-all duration-300"
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <FileText className="w-6 h-6 text-primary" />
                  </div>
                  <Badge variant="outline">PDF</Badge>
                </div>

                <div>
                  <h3 className="font-semibold text-foreground mb-2">
                    Threat Intelligence Report
                  </h3>

                  <div className="space-y-1 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {new Date(report.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Download className="w-4 h-4" />
                      <span>Export as PDF</span>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={() => handleDownload(report._id)}
                  variant="outline"
                  className="w-full border-primary/30 hover:bg-primary/10"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>

                <Button
                  onClick={() => handleDelete(report._id)}
                  variant="destructive"
                  className="w-full mt-2 bg-red-600 hover:bg-red-700"
                >
                  Delete Report
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
