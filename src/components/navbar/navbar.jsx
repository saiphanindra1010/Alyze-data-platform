import { Link } from "react-router-dom";
import styles from "./navbar.module.css";
import Logo from "../../assets/logo.svg";
import { Button } from "@/components/ui/button"
// import { GoogleLogin } from "@react-oauth/google";

// import "remixicon/fonts/remixicon.css";
// import { RiMoonClearFill,RiSunLine }  from "@remixicon/react";
const navbar = () => {

  return (
    <>
      <nav>
        <div className={styles.nav_container}>
          <div className={styles.nav_brand}>
            <Link to="/">
              <img src={Logo} className="nav_logo" />
            </Link>
          </div>

          <div>
            <ul className={styles.nav_itemwrapper}>
              <li className={styles.nav_item}>
                <Link className={styles.nav_link} to="/">
                  Home
                </Link>
              </li>
              <li className={styles.nav_item}>
                <Link className={styles.nav_link} to="/pricing">
                  Pricing
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <Button >Free Trial</Button>
          </div>
        </div>
      </nav>
    </>
  );
};

export default navbar;
