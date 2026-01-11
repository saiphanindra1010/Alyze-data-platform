import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Database,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Activity
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import Createconnection from "@/components/createconnection/createconnection";

const Analyzereport = () => {
  const [selectedDb, setSelectedDb] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const databases = [
    { id: '1', name: 'Production MongoDB', type: 'MongoDB', status: 'online' },
    { id: '2', name: 'Analytics PostgreSQL', type: 'PostgreSQL', status: 'online' },
    { id: '3', name: 'Legacy MySQL', type: 'MySQL', status: 'offline' },
  ];

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    setTimeout(() => setIsAnalyzing(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Generate AI Report</h1>
        <p className="text-muted-foreground max-w-lg mx-auto">
          Select a database and let our AI analyze your schema, data patterns, and performance bottlenecks.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <Card className="border-border/50 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center text-xl font-bold tracking-tight">
              1. Select Source
            </CardTitle>
            <CardDescription>Choose the database you want to analyze.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Database Connection</label>
              <Select onValueChange={setSelectedDb}>
                <SelectTrigger className="h-11 bg-background border-border/50">
                  <SelectValue placeholder={databases.length > 0 ? "Select a database..." : "No connections found"} />
                </SelectTrigger>
                <SelectContent className="max-h-[350px] overflow-hidden flex flex-col p-0">
                  {databases.length > 0 ? (
                    <>
                      <div className="overflow-y-auto py-1 flex-1">
                        {databases.map((db) => (
                          <SelectItem key={db.id} value={db.id} disabled={db.status === 'offline'}>
                            <div className="flex items-center justify-between w-full">
                              <span className="font-medium">{db.name}</span>
                              <Badge variant="outline" className="ml-2 text-[10px] uppercase tracking-widest opacity-70">
                                {db.type}
                              </Badge>
                            </div>
                          </SelectItem>
                        ))}
                      </div>
                      <div className="p-2 border-t border-border/50 bg-background sticky bottom-0 z-10">
                        <Createconnection />
                      </div>
                    </>
                  ) : (
                    <div className="p-6 text-center space-y-4">
                      <p className="text-sm text-muted-foreground">No database connections configured.</p>
                      <Createconnection />
                    </div>
                  )}
                </SelectContent>
              </Select>
            </div>

            {selectedDb && (
              <div className="p-4 rounded-lg bg-primary/5 border border-primary/10 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-primary">Connection Status</span>
                  <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 hover:bg-emerald-500/10">
                    <CheckCircle2 className="mr-1 h-3 w-3" /> Online
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Connection established. AI is ready to read schema and sample data.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-border/50 shadow-sm flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center text-xl font-bold tracking-tight">
              2. Analysis Options
            </CardTitle>
            <CardDescription>Customize your AI generation parameters.</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow space-y-4">
            <div className="space-y-3">
              {[
                "Schema Optimization Suggestions",
                "Query Performance Analysis",
                "Data Integrity Check",
                "Security Audit (Basic)"
              ].map((option, i) => (
                <div key={i} className="flex items-center space-x-3 p-3 rounded-md border border-border/40 hover:bg-muted/30 transition-colors cursor-pointer">
                  <div className="h-4 w-4 rounded border border-primary flex items-center justify-center bg-primary text-primary-foreground">
                    <CheckCircle2 className="h-3 w-3" />
                  </div>
                  <span className="text-sm font-medium">{option}</span>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="pt-0">
            <Button
              className="w-full h-12 font-bold uppercase tracking-widest shadow-md hover:shadow-lg transition-all"
              disabled={!selectedDb || isAnalyzing}
              onClick={handleAnalyze}
            >
              {isAnalyzing ? (
                <>
                  <Activity className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  Run Full Analysis
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>

      {!selectedDb && (
        <div className="flex items-center justify-center p-4 rounded-lg bg-amber-500/5 border border-amber-500/10 text-amber-600">
          <AlertCircle className="mr-2 h-4 w-4" />
          <span className="text-xs font-bold uppercase tracking-wider">Please select a database connection to proceed</span>
        </div>
      )}
    </div>
  );
};

export default Analyzereport;