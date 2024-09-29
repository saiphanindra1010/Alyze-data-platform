import React from 'react'
import Layout from '@/components/layout/layout'
import { Label } from '@radix-ui/react-dropdown-menu'
import { Input } from '@/components/ui/input'
const profile = () => {
  return (
    
    <Layout>
    <div>

        <Label>Name</Label>
        <Input type="text"></Input> 
    </div>
    </Layout>
  )
}

export default profile