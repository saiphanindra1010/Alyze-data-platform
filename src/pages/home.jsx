
import Layout from '@/components/layout/layout';
import { Outlet } from 'react-router-dom';
import { useState } from 'react';
import Reportslist from './reportslist';

  import Connections from './connections';
const Home = () => {


  return (
    <>
      <Layout >
      <Reportslist/>
      <input ></input>
      </Layout>
       {/* This Outlet is necessary to render nested routes under /home */}
    </>
  );
};

export default Home;
