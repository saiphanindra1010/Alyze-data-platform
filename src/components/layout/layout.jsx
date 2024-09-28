import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  PlugZap,
  BadgeHelp,
  UserPen,
  BrainCircuit,
  Info,
  Menu,
  ArrowBigLeft,
  X,
} from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import Topnav from '../topnav/topnav';
import Connections from '@/pages/connections';
import Dbchat from '@/pages/dbchat';

const Navbar = ({ children }) => {
  const [isNavOpen, setIsNavOpen] = useState(false);

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
  };

  const renderContent = () => {
    const location = useLocation();
    switch (location.pathname) {
      case '/connections':
        return <Connections />;
      default:
        return <Dbchat />;
    }
  };

  return (
    <>
      <Topnav />
      <button
          className="md:hidden p-4"
          onClick={toggleNav}
        >
          {isNavOpen ? <X  size={24} /> : <ArrowBigLeft size={24} />}
        </button>
      <div className="flex h-screen ">
       
        <nav
          className={`border-r-2 bg-white border-solid w-1/6 pt-6 h-[calc(100vh-5rem)] fixed md:relative z-10 transform ${
            isNavOpen ? 'translate-x-0 w-5/6' : '-translate-x-full'
          } md:translate-x-0 transition-transform duration-300 ease-in-out`}
        >
          <div className="flex flex-col justify-between h-full">
          <div className="flex flex-col items-center">
              <ul className="space-y-4">
                <li>
                  <Link to="/connections" className="flex items-center hover:text-blue-600">
                    <LayoutDashboard className="mr-2" /> Generated Reports
                  </Link>
                </li>
                <li>
                  <Link to="/connections" className="flex items-center hover:text-blue-600">
                    <BrainCircuit className="mr-2" /> Analyze Report
                  </Link>
                </li>
                <li>
                  <Link to="/connections" className="flex items-center hover:text-blue-600">
                    <PlugZap className="mr-2" /> Connections
                  </Link>
                </li>
                <li>
                  <Link to="/talktodb" className="flex items-center hover:text-blue-600">
                    <PlugZap className="mr-2" /> Talk to Database
                  </Link>
                </li>
                <li>
                  <Link to="/connections" className="flex items-center hover:text-blue-600">
                    <PlugZap className="mr-2" /> Talk to Files
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Add to library</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </Link>
                </li>
              </ul>
            </div>
            <div className="flex flex-col items-center">
              <ul className="space-y-4">
                <li>
                  <Link to="/connections" className="flex items-center hover:text-blue-600">
                    <BadgeHelp className="mr-2" /> Help
                  </Link>
                </li>
                <li>
                  <Link to="/connections" className="flex items-center hover:text-blue-600">
                    <UserPen className="mr-2" /> Profile
                  </Link>
                </li>
                <li>
                  {/* <Button className="flex justify-center">
                    <LogOut /> Sign out
                  </Button> */}
                </li>
              </ul>
            </div>
          </div>
        </nav>
        <div className="flex-1 overflow-y-auto p-4 ml-0 md:ml-1/6">
          {children}
        </div>
      </div>
    </>
  );
};

Navbar.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Navbar;
