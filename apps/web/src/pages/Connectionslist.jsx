import { useRef, useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Trash, DotsThreeVertical, PencilSimple } from "phosphor-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useVirtualizer } from '@tanstack/react-virtual';

const Connectionslist = ({ searchQuery = '' }) => {
  const parentRef = useRef(null);

  // Mock data - expanded for virtualization demo
  const allConnections = useMemo(() => {
    const base = [
      { name: "Conte.pvt Database", application: "MongoDB" },
      { name: "Analytics Server", application: "PostgreSQL" },
      { name: "User Auth Service", application: "MongoDB" },
      { name: "Logging Database", application: "Elasticsearch" },
      { name: "Cache Server", application: "Redis" },
      { name: "Message Queue", application: "RabbitMQ" },
      { name: "Backup Database", application: "MySQL" },
    ];

    // Generate 1000 items for meaningful virtualization
    return Array.from({ length: 1000 }, (_, i) => ({
      ...base[i % base.length],
      name: `${base[i % base.length].name} ${Math.floor(i / base.length) + 1}`,
    }));
  }, []);

  const filteredConnections = useMemo(() => {
    return allConnections.filter(conn =>
      conn.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conn.application.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [allConnections, searchQuery]);

  const rowVirtualizer = useVirtualizer({
    count: filteredConnections.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 60, // Estimated row height
    overscan: 5,
  });

  return (
    <div className="space-y-4">
      <Card className="border-border/50 shadow-sm overflow-hidden">
        <div
          ref={parentRef}
          className="h-[600px] overflow-auto scrollbar-thin scrollbar-thumb-border"
        >
          <Table className="relative">
            <TableHeader className="sticky top-0 z-20 bg-background border-b border-border shadow-sm">
              <TableRow className="hover:bg-transparent border-b border-border/50">
                <TableHead className="font-bold text-xs uppercase tracking-wider py-4 bg-transparent">Connection Name</TableHead>
                <TableHead className="font-bold text-xs uppercase tracking-wider py-4 bg-transparent">Application</TableHead>
                <TableHead className="w-[100px] font-bold text-xs uppercase tracking-wider py-4 text-right pr-6 bg-transparent">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rowVirtualizer.getVirtualItems().length > 0 ? (
                <>
                  <tr style={{ height: `${rowVirtualizer.getVirtualItems()[0].start}px` }} />
                  {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                    const connection = filteredConnections[virtualRow.index];
                    return (
                      <TableRow
                        key={virtualRow.key}
                        data-index={virtualRow.index}
                        ref={rowVirtualizer.measureElement}
                        className="group border-b border-border/40 last:border-0 hover:bg-muted/20 transition-colors"
                      >
                        <TableCell className="font-medium py-4">{connection.name}</TableCell>
                        <TableCell className="py-4">
                          <Badge variant="secondary" className="font-medium text-[10px] bg-secondary/50 border-none">
                            {connection.application}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right pr-6 py-4">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                <span className="sr-only">Open menu</span>
                                <DotsThreeVertical size={16} className="shrink-0" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-32">
                              <DropdownMenuItem className="text-xs">
                                <PencilSimple size={14} className="mr-2 shrink-0" /> Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive text-xs focus:text-destructive">
                                <Trash size={14} className="mr-2 shrink-0" /> Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  <tr style={{ height: `${rowVirtualizer.getTotalSize() - rowVirtualizer.getVirtualItems()[rowVirtualizer.getVirtualItems().length - 1].end}px` }} />
                </>
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="h-32 text-center text-muted-foreground">
                    No connections found matching your search.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      <div className="flex items-center justify-between px-2">
        <p className="text-xs text-muted-foreground font-medium">
          Showing <span className="text-foreground">{filteredConnections.length}</span> connections
        </p>
      </div>
    </div>
  );
};

export default Connectionslist;