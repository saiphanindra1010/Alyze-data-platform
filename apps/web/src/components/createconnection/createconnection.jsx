import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectGroup,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useState } from 'react';
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from '@/components/ui/button';
import { Plus, Prohibit, Check } from 'phosphor-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

const MongoDBform = () => (
  <div className="grid gap-4">
    <div className="grid grid-cols-4 items-center gap-4">
      <Label htmlFor="Baseuri" className="text-right text-xs font-bold uppercase tracking-wider text-muted-foreground">
        Base URI
      </Label>
      <Input
        id="Baseuri"
        placeholder="mongodb://localhost:27017"
        className="col-span-3 h-9"
      />
    </div>
  </div>
);

const PostgresForm = () => (
  <div className="grid gap-4">
    <div className="grid grid-cols-4 items-center gap-4">
      <Label htmlFor="username" className="text-right text-xs font-bold uppercase tracking-wider text-muted-foreground">
        Username
      </Label>
      <Input id="username" className="col-span-3 h-9" />
    </div>
    <div className="grid grid-cols-4 items-center gap-4">
      <Label htmlFor="password" className="text-right text-xs font-bold uppercase tracking-wider text-muted-foreground">
        Password
      </Label>
      <Input id="password" type="password" className="col-span-3 h-9" />
    </div>
  </div>
);

const MySQLForm = () => (
  <div className="grid gap-4">
    <div className="grid grid-cols-4 items-center gap-4">
      <Label htmlFor="username" className="text-right text-xs font-bold uppercase tracking-wider text-muted-foreground">
        Username
      </Label>
      <Input id="username" className="col-span-3 h-9" />
    </div>
    <div className="grid grid-cols-4 items-center gap-4">
      <Label htmlFor="password" className="text-right text-xs font-bold uppercase tracking-wider text-muted-foreground">
        Password
      </Label>
      <Input id="password" type="password" className="col-span-3 h-9" />
    </div>
  </div>
);

const Createconnection = () => {
  const [appName, setAppName] = useState('')

  const handleAppChange = (value) => {
    setAppName(value)
  }

  let isConnected = null;

  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <Button className="h-10 font-bold uppercase tracking-wider text-xs shadow-md hover:shadow-lg transition-all">
            <Plus size={16} className="mr-2 shrink-0" />
            New Connection
          </Button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader className="space-y-3">
            <DialogTitle className="text-xl font-bold tracking-tight">Create Connection</DialogTitle>
            <DialogDescription className="text-sm">
              Configure your database connection details here.
            </DialogDescription>

            {isConnected === true && (
              <Alert className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 py-2">
                <Check size={16} className="shrink-0" />
                <AlertTitle className="text-xs font-bold uppercase tracking-wider">Success</AlertTitle>
                <AlertDescription className="text-xs">Connection established successfully.</AlertDescription>
              </Alert>
            )}

            {isConnected === false && (
              <Alert variant="destructive" className="py-2">
                <Prohibit size={16} className="shrink-0" />
                <AlertTitle className="text-xs font-bold uppercase tracking-wider">Error</AlertTitle>
                <AlertDescription className="text-xs">Failed to connect. Please check your credentials.</AlertDescription>
              </Alert>
            )}
          </DialogHeader>

          <div className="grid gap-6 py-6">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Name
              </Label>
              <Input
                id="name"
                placeholder="Production DB"
                className="col-span-3 h-9"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="application" className="text-right text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Type
              </Label>
              <Select onValueChange={handleAppChange}>
                <SelectTrigger className="col-span-3 h-9">
                  <SelectValue placeholder="Select Database Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="Mongo DB" className="text-sm">MongoDB</SelectItem>
                    <SelectItem value="Postgres Sql" className="text-sm">PostgreSQL</SelectItem>
                    <SelectItem value="My Sql" className="text-sm">MySQL</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            {appName === "Mongo DB" && <MongoDBform />}
            {appName === "Postgres Sql" && <PostgresForm />}
            {appName === "My Sql" && <MySQLForm />}
          </div>

          <DialogFooter className="flex-row justify-between sm:justify-between pt-2">
            <Button variant="ghost" type="button" className="text-xs font-bold uppercase tracking-widest">Test</Button>
            <Button type="button" className="text-xs font-bold uppercase tracking-widest px-6">Save Connection</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default Createconnection;