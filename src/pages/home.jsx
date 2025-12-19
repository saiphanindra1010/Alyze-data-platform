
import Layout from '@/components/layout/layout';
import { Outlet } from 'react-router-dom';
import { useState } from 'react';
import Reportslist from './reportslist';

import Connections from './connections';
const Home = () => {


  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Generated Reports</h1>
        <p className="text-muted-foreground mt-1">
          View and download your recently generated database analysis reports.
        </p>
      </div>
      <Reportslist />
    </div>
  );
};

export default Home;
