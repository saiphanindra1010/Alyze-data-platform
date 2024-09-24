import React from 'react'

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
    SelectLabel,
    SelectValue,
  } from "@/components/ui/select"
  import { useState } from 'react';
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Ban,Check   } from "lucide-react"

const MongoDBform = () => (
  <div className={`grid gap-4`}>
  <div className="grid grid-cols-4 items-center gap-4">
    <Label htmlFor="username" className="text-right">
      Base uri
    </Label>
    <Input
      id="Baseuri"
      defaultValue=""
      className="col-span-3"
    />
  </div>

  </div>
);
const PostgresForm = () => (
  <div className={`grid gap-4`}>
  <div className="grid grid-cols-4 items-center gap-4">
    <Label htmlFor="username" className="text-right">
      Username
    </Label>
    <Input
      id="username"
      defaultValue=""
      className="col-span-3"
    />
  </div>
  <div className="grid grid-cols-4 items-center gap-4">
    <Label htmlFor="username" className="text-right">
      Password
    </Label>
    <Input
      id="username"
      defaultValue=""
      className="col-span-3"
    />
  </div>

  </div>
);
const MySQLForm = () => (
  <div className={`grid gap-4`}>
  <div className="grid grid-cols-4 items-center gap-4">
    <Label htmlFor="username" className="text-right">
      Username
    </Label>
    <Input
      id="username"
      defaultValue=""
      className="col-span-3"
    />
  </div>
  <div className="grid grid-cols-4 items-center gap-4">
    <Label htmlFor="username" className="text-right">
      Password
    </Label>
    <Input
      id="username"
      defaultValue=""
      className="col-span-3"
    />
  </div>

  </div>
);
const Createconnection = () => {
  const [Appname, setNewForm] = useState('')
  
  const handleAppchange=(event)=>{
    setNewForm(event)
    // console.log("application name "+event)
  }
  
  let isconnected=null
  return (
    <div >  <Dialog>
    <DialogTrigger asChild>
      <Button variant="outline">Connection <Plus/></Button>
    </DialogTrigger>

    <DialogContent className="sm:max-w-[425px] ">
      <DialogHeader>
        <DialogTitle>Create Connection</DialogTitle>
        <DialogDescription>
          Make changes to your profile here. Click save when you're done.
        </DialogDescription>
       { isconnected==true && (        <Alert className='text-green-800 bg-emerald-100 border-green-800'>
      <Check className="h-4 w-4" />
      <AlertTitle className='142.1 76.2% 36.3%'>Connection is successfullt established</AlertTitle> </Alert>)}
      
      
      { isconnected==false &&(   <Alert className='text-red-800 bg-red-100 border-red-800'>
      <Ban className="h-4 w-4" />
      <AlertTitle className='142.1 76.2% 36.3%'>Failed to Connect</AlertTitle>
      <AlertDescription>
       Check your creds
      </AlertDescription>
    </Alert>)}


      </DialogHeader>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="name" className="text-right">
            Name
          </Label>
          <Input
            id="name"
            defaultValue=""
            className="col-span-3"
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="name" className="text-right">
            Application
          </Label>
          <Select  onValueChange={handleAppchange}>  
      <SelectTrigger className="col-span-3">
        <SelectValue placeholder="Select Application" />
      </SelectTrigger>
      <SelectContent >
        <SelectGroup>

          <SelectItem value="Mongo DB">Mongo DB</SelectItem>
          <SelectItem value="Postgres Sql">Postgres Sql</SelectItem>
          <SelectItem value="My Sql">My Sql</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
        </div>
         {Appname==="Mongo DB" &&(<MongoDBform/>)}
         {Appname === "Postgres Sql" && <PostgresForm />}
         {Appname === "My Sql" && <MySQLForm />}
 
        </div>
      <DialogFooter className='flex-row justify-between'>
      <Button  variant="outline" type="submit">Test connection</Button>
      <Button type="submit">Save and Close</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog></div>
  )
}

export default Createconnection