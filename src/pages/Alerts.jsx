import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useThreatStore } from "@/store/threatStore";
import { mockAlerts } from "@/lib/mockData";

export default function Alerts() {
  const { alerts, setAlerts, addAlert, toggleAlert, deleteAlert } = useThreatStore();

  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    industry: "",
    keywords: "",
    targets: "",
    alertType: "Email",
    frequency: "Immediate",
  });

  useEffect(() => {
    if (alerts.length === 0) {
      setAlerts(mockAlerts);
    }
  }, [alerts.length, setAlerts]);

  const handleSubmit = (e) => {
    e.preventDefault();

    addAlert({
      id: Date.now().toString(),
      name: formData.name,
      industry: formData.industry,
      keywords: formData.keywords.split(",").map((k) => k.trim()),
      targets: formData.targets.split(",").map((t) => t.trim()),
      alertType: formData.alertType,
      frequency: formData.frequency,
      createdAt: new Date().toISOString(),
      enabled: true,
    });

    setFormData({
      name: "",
      industry: "",
      keywords: "",
      targets: "",
      alertType: "Email",
      frequency: "Immediate",
    });

    setOpen(false);
  };

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Custom Alerts</h1>
          <p className="text-muted-foreground">
            Create and manage custom threat intelligence alerts
          </p>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary-glow glow-effect">
              <Plus className="w-4 h-4 mr-2" />
              New Alert
            </Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-[525px] bg-card border-border">
            <DialogHeader>
              <DialogTitle>Create New Alert</DialogTitle>
              <DialogDescription>
                Set up a custom alert to monitor specific threats
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Alert Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <Label htmlFor="industry">Industry</Label>
                <Input
                  id="industry"
                  value={formData.industry}
                  onChange={(e) =>
                    setFormData({ ...formData, industry: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <Label htmlFor="keywords">Keywords (comma-separated)</Label>
                <Input
                  id="keywords"
                  value={formData.keywords}
                  onChange={(e) =>
                    setFormData({ ...formData, keywords: e.target.value })
                  }
                  placeholder="ransomware, malware, apt"
                  required
                />
              </div>

              <div>
                <Label htmlFor="targets">Targets (comma-separated)</Label>
                <Input
                  id="targets"
                  value={formData.targets}
                  onChange={(e) =>
                    setFormData({ ...formData, targets: e.target.value })
                  }
                  placeholder="*.example.com, 10.0.0.0/8"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="alertType">Alert Type</Label>
                  <Select
                    value={formData.alertType}
                    onValueChange={(value) =>
                      setFormData({ ...formData, alertType: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Email">Email</SelectItem>
                      <SelectItem value="Slack">Slack</SelectItem>
                      <SelectItem value="Webhook">Webhook</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="frequency">Frequency</Label>
                  <Select
                    value={formData.frequency}
                    onValueChange={(value) =>
                      setFormData({ ...formData, frequency: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Immediate">Immediate</SelectItem>
                      <SelectItem value="Hourly">Hourly</SelectItem>
                      <SelectItem value="Daily">Daily</SelectItem>
                      <SelectItem value="Weekly">Weekly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <DialogFooter>
                <Button type="submit" className="bg-primary hover:bg-primary-glow">
                  Create Alert
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        {alerts.map((alert) => (
          <Card
            key={alert.id}
            className="p-6 border-border bg-card hover:glow-effect transition-all duration-300"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-semibold text-foreground">
                    {alert.name}
                  </h3>
                  <Badge variant={alert.enabled ? "default" : "secondary"}>
                    {alert.enabled ? "Active" : "Inactive"}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Industry: </span>
                    <span>{alert.industry}</span>
                  </div>

                  <div>
                    <span className="text-muted-foreground">Frequency: </span>
                    <span>{alert.frequency}</span>
                  </div>

                  <div>
                    <span className="text-muted-foreground">Alert Type: </span>
                    <span>{alert.alertType}</span>
                  </div>

                  <div>
                    <span className="text-muted-foreground">Created: </span>
                    <span>{new Date(alert.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {alert.keywords.map((keyword, i) => (
                    <Badge key={i} variant="outline" className="text-xs">
                      {keyword}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2 ml-4">
                <Switch
                  checked={alert.enabled}
                  onCheckedChange={() => toggleAlert(alert.id)}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deleteAlert(alert.id)}
                  className="hover:bg-critical/20 hover:text-critical"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
