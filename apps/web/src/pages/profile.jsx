import React, { useEffect, useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { SecureAPI } from "../lib/authService";
import { useToast } from "@/hooks/use-toast";

const Profile = () => {
  const { toast } = useToast();
  const defaultUserData = {
    name: '',
    email: '',
    generationsUsed: 0,
    totalGenerations: 0,
    licenses: [{ licensesType: 'trial', totalGenerations: 5, generationsUsed: 0 }]
  };

  const [userData, setUserData] = useState(defaultUserData);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  // Fetch profile data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await SecureAPI.get('/profile');
        const data = response.data;

        if (data.success && data.profile) {
          const profile = data.profile;
          // Handle case where licenses might be empty
          const license = profile.licenses && profile.licenses.length > 0
            ? profile.licenses[0]
            : { totalGenerations: 5, generationsUsed: 0 };

          setUserData({
            name: profile.name || '',
            email: profile.email || '',
            generationsUsed: license.generationsUsed || 0,
            totalGenerations: license.totalGenerations || 0,
            ...profile
          });
        }
      } catch (error) {
        console.error("Failed to fetch profile:", error);
        toast({
          variant: "destructive",
          title: "Error fetching profile",
          description: "Could not load your profile data. Please try again.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [toast]);

  const handleNameChange = (e) => {
    const value = e.target.value;
    setUserData(prev => ({ ...prev, name: value }));
    setIsButtonDisabled(value.trim() === "");
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await SecureAPI.put('/profile', {
        name: userData.name
      });

      toast({
        title: "Profile updated",
        description: "Your changes have been saved successfully.",
      });

      setIsButtonDisabled(true);
    } catch (error) {
      console.error("Failed to update profile:", error);
      toast({
        variant: "destructive",
        title: "Update failed",
        description: "Could not save your changes. Please try again.",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Calculate safe values for progress bar
  const total = parseInt(userData.totalGenerations) || 5;
  const used = parseInt(userData.generationsUsed) || 0;
  const remaining = Math.max(0, total - used);
  const percentage = Math.min(100, Math.max(0, (used / total) * 100));

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] p-4">
      <Card className="w-full max-w-lg border-border/50 shadow-sm">
        <CardHeader className="space-y-1 pb-8">
          <CardTitle className="text-2xl font-bold tracking-tight">Profile Settings</CardTitle>
          <p className="text-sm text-muted-foreground">
            Manage your account details and track your license usage.
          </p>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="grid gap-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Full Name</Label>
              <Input
                id="name"
                value={userData.name}
                type="text"
                className="h-10 bg-background border-border/50 focus:border-primary/50 transition-colors"
                placeholder="Enter your name"
                onChange={handleNameChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Email Address</Label>
              <Input
                id="email"
                value={userData.email}
                type="email"
                className="h-10 bg-muted/50 text-muted-foreground border-border/30 cursor-not-allowed"
                placeholder="Enter your email"
                disabled
              />
            </div>
          </div>

          <Card className="border-border/40 bg-muted/20 shadow-none">
            <CardHeader className="pb-4">
              <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">License Usage</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-baseline justify-between">
                <div className="text-3xl font-bold tracking-tighter">
                  {remaining}
                </div>
                <div className="text-xs font-medium text-muted-foreground uppercase tracking-widest">
                  Generations Left
                </div>
              </div>

              <div className="space-y-2">
                <Progress
                  value={percentage}
                  className="h-1.5 bg-muted border-none"
                />
                <div className="text-[10px] font-medium text-muted-foreground flex justify-between uppercase tracking-widest">
                  <span>{used} used</span>
                  <span>{total} total</span>
                </div>
              </div>

              <Button variant="outline" size="sm" className="w-full h-8 text-xs font-bold uppercase tracking-wider border-border/50 hover:bg-background transition-colors">
                Upgrade Plan
              </Button>
            </CardContent>
          </Card>

          <Button
            className="w-full h-11 font-bold uppercase tracking-wider shadow-md hover:shadow-lg transition-all"
            onClick={handleSave}
            disabled={isButtonDisabled || saving}
          >
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
