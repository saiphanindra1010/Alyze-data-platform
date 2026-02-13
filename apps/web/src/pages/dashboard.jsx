import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Database,
  FileText,
  Lightning,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
} from "phosphor-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const Dashboard = () => {
  const stats = [
    { title: "Total Connections", value: "12", icon: Database, trend: "+2", trendType: "up", description: "Active database sources" },
    { title: "Reports Generated", value: "148", icon: FileText, trend: "+12%", trendType: "up", description: "Total analysis reports" },
    { title: "AI Generations", value: "842", icon: Lightning, trend: "-5%", trendType: "down", description: "Tokens used this month" },
    { title: "Avg. Sync Time", value: "1.2s", icon: Activity, trend: "-0.4s", trendType: "up", description: "Database response time" },
  ];

  const recentActivity = [
    { id: 1, action: "New connection added", target: "Production MongoDB", time: "2 mins ago", type: "connection" },
    { id: 2, action: "Report generated", target: "Financial Audit Q4", time: "1 hour ago", type: "report" },
    { id: 3, action: "Database sync failed", target: "Legacy MySQL", time: "3 hours ago", type: "error" },
    { id: 4, action: "AI analysis completed", target: "User Behavior Study", time: "5 hours ago", type: "ai" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
        <p className="text-muted-foreground mt-1">
          Welcome back! Here's what's happening with your database analysis.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <Card key={i} className="border-border/50 shadow-sm hover:shadow-md transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center mt-1">
                <span className={`text-[10px] font-bold flex items-center ${stat.trendType === 'up' ? 'text-emerald-500' : 'text-rose-500'
                  }`}>
                  {stat.trendType === 'up' ? <ArrowUpRight size={12} className="mr-0.5 shrink-0" /> : <ArrowDownRight size={12} className="mr-0.5 shrink-0" />}
                  {stat.trend}
                </span>
                <span className="text-[10px] text-muted-foreground ml-1.5 font-medium">
                  {stat.description}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4 border-border/50 shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl font-bold tracking-tight">System Health</CardTitle>
            <CardDescription>Real-time performance of your connected databases.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] flex items-center justify-center border-2 border-dashed border-border/50 rounded-xl bg-muted/5">
              <div className="flex flex-col items-center text-muted-foreground">
                <Activity size={32} className="mb-2 opacity-20 shrink-0" />
                <span className="text-xs font-medium uppercase tracking-widest">Performance Chart Placeholder</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3 border-border/50 shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl font-bold tracking-tight">Recent Activity</CardTitle>
            <CardDescription>Latest events across your workspace.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-4">
                  <div className={`mt-1 h-2 w-2 rounded-full ${activity.type === 'error' ? 'bg-rose-500' :
                      activity.type === 'connection' ? 'bg-blue-500' :
                        activity.type === 'report' ? 'bg-emerald-500' : 'bg-primary'
                    }`} />
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-semibold leading-none">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">{activity.target}</p>
                  </div>
                  <div className="flex items-center text-[10px] font-medium text-muted-foreground">
                    <Clock size={12} className="mr-1 shrink-0" />
                    {activity.time}
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-6 h-9 text-xs font-bold uppercase tracking-wider border-border/50">
              View All Activity
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;