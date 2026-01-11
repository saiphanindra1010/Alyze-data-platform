import { useState } from 'react';
import Createconnection from "@/components/createconnection/createconnection"
import Connectionslist from "@/pages/Connectionslist"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

const Connections = () => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Connections</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Manage your database sources and configuration.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-10 bg-background border-border/50 focus:border-primary/50 transition-colors"
            />
          </div>
          <Createconnection />
        </div>
      </div>

      <div className="pt-2">
        <Connectionslist searchQuery={searchQuery} />
      </div>
    </div>
  )
}

export default Connections