import React from 'react';
import Layout from '@/components/layout/layout';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

const Profile = () => {
  return (
    <Layout>
      <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="name" className="text-sm font-medium">Name</Label>
              <Input id="name" type="text" className="mt-1" placeholder="Enter your name" />
            </div>
            <div>
              <Label htmlFor="email" className="text-sm font-medium">Email</Label>
              <Input id="email" value="user@mail.com" type="email" className="mt-1 bg-gray-100 text-gray-500 cursor-not-allowed" placeholder="Enter your email" disabled />
            </div>
            <Card className="bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">License Usage</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold mb-2">
                  22 generations left
                </div>
                <Progress value={30} className="h-2 bg-slate-200" />
                <div className="text-sm text-muted-foreground mt-2 flex justify-between items-center">
                  <span>23/45 generations used</span>
                  <Button variant="outline" size="sm">Upgrade</Button>
                </div>
              </CardContent>
            </Card>
            <Button className="w-full">Save Profile</Button>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Profile;