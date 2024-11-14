import { Outlet } from "react-router-dom";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import {
  LayoutDashboard,
  PlugZap,
  BadgeHelp,
  UserPen,
  BrainCircuit,
  FileDigit,
  DatabaseZap,
  ArrowBigLeft,
  X,
} from "lucide-react";
import { useState } from "react";
import Styles from "./layout.module.css";
import Topnav from "../topnav/topnav";

const Layout = () => {
  const [isNavOpen, setIsNavOpen] = useState(false);

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
  };

  return (
    <>
      <Topnav />
      <button className="md:hidden p-4" onClick={toggleNav}>
        {isNavOpen ? <X size={24} /> : <ArrowBigLeft size={24} />}
      </button>
      <div className="flex overflow-hidden h-3/5 ">
        <nav
          className={`w-52 pt-6 h-[calc(100vh-5rem)] fixed md:relative z-10 transform ${
            isNavOpen ? "translate-x-0 w-5/6" : "-translate-x-full"
          } md:translate-x-0 transition-transform duration-300 ease-in-out`}
        >
          <div className="flex flex-col justify-between h-full">
            <div className="flex flex-col items-center">
              <ul className="space-y-3">
                <li className="p-3 border-none rounded-lg hover:bg-primary">
                  <Link to="/home" className="flex items-center">
                    <LayoutDashboard className="mr-2" /> Generated Reports
                  </Link>
                </li>
                <li
                  className={`${Styles.hover} p-3 border-none rounded-lg hover:bg-primary`}
                >
                  <Link to="/analyze" className="flex items-center">
                    <BrainCircuit className="mr-2" /> Analyze Report
                  </Link>
                </li>
                <li className="p-3 border-none rounded-lg hover:bg-primary">
                  <Link
                    to="/connections"
                    className="flex items-center hover:bg-primary"
                  >
                    <PlugZap className="mr-2" /> Connections
                  </Link>
                </li>
                <li className="p-3 border-none rounded-lg hover:bg-primary">
                  <Link to="/talktodb" className="flex items-center">
                    <DatabaseZap className="mr-2" /> Talk to Database
                  </Link>
                </li>
                <li className="p-3 border-none rounded-lg hover:bg-primary">
                  <Link to="/filechat" className="flex items-center">
                    <FileDigit className="mr-2" /> Talk to Files
                  </Link>
                </li>
              </ul>
            </div>
            <div className="flex flex-col items-center">
              <ul className="space-y-4">
                <li className="p-3 border-none rounded-lg">
                  <Link
                    to="/connectionss"
                    className="flex items-center hover:text-blue-600"
                  >
                    <BadgeHelp className="mr-2" /> Help
                  </Link>
                </li>
                <li className="p-1 border-none rounded-lg">
                  <Link
                    to="/profile"
                    className="flex items-center hover:text-blue-600"
                  >
                    <UserPen className="mr-2" /> Profile
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>
        <div className="flex-1 overflow-y-auto p-4 ml-0 md:ml-1/6 h-[calc(100vh-5rem)]">
          <Outlet />
        </div>
      </div>
    </>
  );
};

// Layout.propTypes = {
//   children: PropTypes.node.isRequired,
// };

export default Layout;
