import React, { useEffect, useState } from 'react';
import Layout from '@/components/layout/layout';
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


const Profile = () => {
  const defaultUserData = {
    name: '',
    email: '',
    generationsUsed: 0,
    totalGenerations: 0,
  };

  const [userData, setUserData] = useState(defaultUserData);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const handleChange = (event) => {
    const inputValue = event.target.value;
    setText(inputValue);

    // Enable the button if there is text, disable otherwise
    setIsButtonDisabled(inputValue.trim() === "");
  };
  useEffect(() => {
    // const sessionData = sessionStorage.getItem('licenses');

    // if (sessionData) {
    //   // Load data from sessionStorage if available
    //   const userData=JSON.parse(sessionData)[0]

    //   console.log("session data "+JSON.stringify(JSON.parse(sessionData)[0].name))
    // } else {
    // Fetch from API or use default data
    const fetchUserData = async () => {
      const response = await fetch('http://localhost:5000/profile', {
        method: 'GET',
        headers: {
          'cookies': 'efkl32rtj32oikflikwle'
        },
        // credentials: 'include',
      });
      const data = await response.json();
      console.log("profile data " + JSON.stringify(data))
      setUserData(data);
      setUserData({
        name: data.profile.name,
        email: data.profile.email,
        generationsUsed: data.profile.licenses[0].generationsUsed,
        totalGenerations: data.profile.licenses[0].totalGenerations
      });
      sessionStorage.setItem('userData', JSON.stringify(data)); // Store in sessionStorage
    };

    fetchUserData();
    // }
  }, []);

  const handleInputChange = (field, value) => {
    const updatedData = { ...userData, [field]: value };
    setUserData(updatedData);
    sessionStorage.setItem('userData', JSON.stringify(updatedData)); // Update sessionStorage
  };

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
                onChange={(e) => {
                  handleChange(e)
                  handleInputChange('name', e.target.value)
                }}
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
                  {userData.totalGenerations - userData.generationsUsed}
                </div>
                <div className="text-xs font-medium text-muted-foreground uppercase tracking-widest">
                  Generations Left
                </div>
              </div>

              <div className="space-y-2">
                <Progress
                  value={(userData.generationsUsed / userData.totalGenerations) * 100}
                  className="h-1.5 bg-muted border-none"
                />
                <div className="text-[10px] font-medium text-muted-foreground flex justify-between uppercase tracking-widest">
                  <span>{userData.generationsUsed} used</span>
                  <span>{userData.totalGenerations} total</span>
                </div>
              </div>

              <Button variant="outline" size="sm" className="w-full h-8 text-xs font-bold uppercase tracking-wider border-border/50 hover:bg-background transition-colors">
                Upgrade Plan
              </Button>
            </CardContent>
          </Card>

          <Button
            className="w-full h-11 font-bold uppercase tracking-wider shadow-md hover:shadow-lg transition-all"
            onClick={() => sessionStorage.setItem('userData', JSON.stringify(userData))}
            disabled={isButtonDisabled}
          >
            Save Changes
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
