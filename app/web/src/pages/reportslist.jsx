import { useState, useMemo } from 'react';
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Download, Search, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import Createconnection from "@/components/createconnection/createconnection";

const Reportslist = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const reports = useMemo(() => [
    { id: 1, title: "Info corp.pvt.ltd Report", type: "MongoDB", time: "2 hours ago", description: "Finding what is the best usecase for the validation helping the team to achieve better results." },
    { id: 2, title: "Q4 Financial Audit", type: "PostgreSQL", time: "5 hours ago", description: "Comprehensive analysis of Q4 database transactions and performance metrics." },
    { id: 3, title: "User Migration Sync", type: "MySQL", time: "1 day ago", description: "Report on the successful migration of user records from legacy system." },
    { id: 4, title: "Security Vulnerability Scan", type: "MongoDB", time: "2 days ago", description: "Detailed scan results for potential security risks in the production cluster." },
    { id: 5, title: "API Usage Statistics", type: "PostgreSQL", time: "3 days ago", description: "Weekly breakdown of API endpoint performance and usage patterns." },
  ], []);

  const filteredReports = useMemo(() => {
    return reports.filter(report =>
      report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.type.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [reports, searchQuery]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search reports..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-10 bg-background border-border/50 focus:border-primary/50 transition-colors"
          />
        </div>
        <Createconnection />
      </div>

      {filteredReports.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredReports.map((report) => (
            <Card key={report.id} className="overflow-hidden border-border/50 transition-all hover:shadow-md group">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-[10px] uppercase tracking-wider font-bold text-primary bg-primary/5 border-primary/20">
                    {report.type}
                  </Badge>
                  <span className="text-[10px] text-muted-foreground font-medium">{report.time}</span>
                </div>
                <CardTitle className="text-lg mt-3 leading-tight group-hover:text-primary transition-colors">
                  {report.title}
                </CardTitle>
                <CardDescription className="line-clamp-2 mt-2 text-xs leading-relaxed">
                  {report.description}
                </CardDescription>
              </CardHeader>
              <CardFooter className="flex justify-between items-center pt-2 pb-6 px-6">
                <div className="flex -space-x-2">
                  <div className="h-6 w-6 rounded-full border-2 border-background bg-muted flex items-center justify-center text-[8px] font-bold">JD</div>
                  <div className="h-6 w-6 rounded-full border-2 border-background bg-muted flex items-center justify-center text-[8px] font-bold">AS</div>
                </div>
                <Button size="sm" variant="secondary" className="h-8 text-xs font-bold uppercase tracking-wider border-border/50 hover:bg-background transition-colors">
                  <Download className="mr-2 h-3.5 w-3.5" />
                  Download
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed border-border/50 rounded-xl bg-muted/5">
          <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
            <FileText className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold">No reports yet</h3>
          <p className="text-sm text-muted-foreground max-w-xs mx-auto mt-1">
            Connect a database to start generating AI-powered analysis reports.
          </p>
          <div className="flex items-center space-x-3 mt-6">
            <Createconnection />
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSearchQuery('')}
            >
              Clear search
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reportslist;
