import { useState, useEffect } from "react";
import { User, CreditCard, Shield } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

// --- Local Storage Keys ---
const PROFILE_KEY = "tv_profile";
const SUBSCRIPTION_KEY = "tv_subscription";

export default function Settings() {
  // -------------------------------
  // ⭐ Profile State
  // -------------------------------
  const [profile, setProfile] = useState({
    firstName: "Security",
    lastName: "Admin",
    email: "admin@threatview.com",
    company: "ThreatView Inc.",
  });

  // -------------------------------
  // ⭐ Subscription State
  // -------------------------------
  const [subscription, setSubscription] = useState({
    plan: "Professional",
    status: "Active",
    renewal: "Feb 13, 2025",
    paymentMethod: "•••• 4242",
    price: "$99/month",
  });

  // -------------------------------
  // ⭐ Load saved settings
  // -------------------------------
  useEffect(() => {
    const savedProfile = localStorage.getItem(PROFILE_KEY);
    const savedSub = localStorage.getItem(SUBSCRIPTION_KEY);

    if (savedProfile) setProfile(JSON.parse(savedProfile));
    if (savedSub) setSubscription(JSON.parse(savedSub));
  }, []);

  // -------------------------------
  // ⭐ Save Profile
  // -------------------------------
  const saveProfile = () => {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
    alert("Profile updated!");
  };

  // -------------------------------
  // ⭐ Upgrade Plan (Mock)
  // -------------------------------
  const upgradePlan = () => {
    const updated = {
      ...subscription,
      plan: "Enterprise",
      price: "$199/month",
    };

    setSubscription(updated);
    localStorage.setItem(SUBSCRIPTION_KEY, JSON.stringify(updated));

    alert("Plan upgraded to Enterprise!");
  };

  // -------------------------------
  // ⭐ Update Payment (Mock)
  // -------------------------------
  const updatePayment = () => {
    const updated = {
      ...subscription,
      paymentMethod: "•••• 8899",
    };

    setSubscription(updated);
    localStorage.setItem(SUBSCRIPTION_KEY, JSON.stringify(updated));

    alert("Payment method updated!");
  };

  // -------------------------------
  // ⭐ Update profile input fields
  // -------------------------------
  const handleChange = (field, value) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Settings</h1>
        <p className="text-muted-foreground">Manage your account and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* -------------------------------
            ⭐ PROFILE SECTION
        ------------------------------- */}
        <Card className="p-6 border-border bg-card lg:col-span-2 space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <User className="w-5 h-5 text-primary" />
            </div>
            <h2 className="text-xl font-semibold text-foreground">Profile Information</h2>
          </div>

          <Separator className="bg-border" />

          <div className="space-y-4">

            {/* Name */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>First Name</Label>
                <Input
                  value={profile.firstName}
                  onChange={(e) => handleChange("firstName", e.target.value)}
                />
              </div>

              <div>
                <Label>Last Name</Label>
                <Input
                  value={profile.lastName}
                  onChange={(e) => handleChange("lastName", e.target.value)}
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <Label>Email</Label>
              <Input
                value={profile.email}
                onChange={(e) => handleChange("email", e.target.value)}
              />
            </div>

            {/* Company */}
            <div>
              <Label>Company</Label>
              <Input
                value={profile.company}
                onChange={(e) => handleChange("company", e.target.value)}
              />
            </div>

            <Button onClick={saveProfile} className="bg-primary hover:bg-primary-glow">
              Save Changes
            </Button>
          </div>
        </Card>

        {/* -------------------------------
            ⭐ SUBSCRIPTION + BILLING SECTION
        ------------------------------- */}
        <div className="space-y-6">

          {/* Subscription */}
          <Card className="p-6 border-border bg-card space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-success/10">
                <Shield className="w-5 h-5 text-success" />
              </div>
              <h2 className="text-lg font-semibold text-foreground">Subscription</h2>
            </div>

            <Separator className="bg-border" />

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Current Plan</span>
                <Badge className="bg-primary">{subscription.plan}</Badge>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Status</span>
                <span className="text-sm text-success font-medium">{subscription.status}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Renewal</span>
                <span className="text-sm text-foreground">{subscription.renewal}</span>
              </div>
            </div>

            <Button variant="outline" onClick={upgradePlan} className="w-full border-primary/30">
              Upgrade Plan
            </Button>
          </Card>

          {/* Billing */}
          <Card className="p-6 border-border bg-card space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-warning/10">
                <CreditCard className="w-5 h-5 text-warning" />
              </div>
              <h2 className="text-lg font-semibold text-foreground">Billing</h2>
            </div>

            <Separator className="bg-border" />

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Payment Method</span>
                <span className="text-sm text-foreground">{subscription.paymentMethod}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Next Payment</span>
                <span className="text-sm text-foreground">{subscription.price}</span>
              </div>
            </div>

            <Button variant="outline" onClick={updatePayment} className="w-full border-border">
              Update Payment
            </Button>
          </Card>

        </div>
      </div>
    </div>
  );
}
