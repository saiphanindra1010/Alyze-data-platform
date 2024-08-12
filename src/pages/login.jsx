import React from "react";
import styles from "./login.module.css";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const login = () => {
  return (
    <>
    <div className="flex">
      <div className={styles.login}>
        <form className="">
        <Button >google signin</Button>
        <div>or</div>
    <Input type="email" placeholder="Email" />
        <Button >Free Trial</Button>
        </form>
      </div>
      <div className={styles.iframediv}>
      <iframe  className={styles.iframe} src="https://learn.microsoft.com/en-us/power-pages/getting-started/add-iframe"></iframe>
      </div>
      </div>
    </>
  );
};

export default login;
