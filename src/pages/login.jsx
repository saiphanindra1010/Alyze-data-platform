import React from "react";
import styles from "./login.module.css";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import Logo from "../components/logo/logo";

const Login = () => {
  return (
    <div className={`${styles.main} flex`}>
      <div className={`${styles.login} flex flex-col justify-center items-center`}>
        <Logo/>
        <div className={styles.buttonContainer}>
          <Button aria-label="Google Sign In">Google Sign In</Button>
          <div>(or)</div>
          <Input aria-label="Email Input" placeholder="Email*" />
          <Button aria-label="Submit">Submit</Button>
        </div>
      </div>
      <div className={styles.iframediv}>
        <iframe
          className={styles.iframe}
          src="https://learn.microsoft.com/en-us/power-pages/getting-started/add-iframe"
          title="Microsoft Learn"
        ></iframe>
      </div>
    </div>
  );
};

export default Login;
