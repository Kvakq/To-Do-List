import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { AppBar, Tabs, Tab } from "@material-ui/core";
import Login from "./Login";
import Register from "./Register";

const useStyles = makeStyles((theme) => ({
  title: {
    textAlign: "center",
    margin: theme.spacing(2),
  },
}));

const Auth = ({ setToken }) => {
  const classes = useStyles();
  const [tabIndex, setTabIndex] = useState(0);
  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };
  return (
    <>
      <AppBar position="static">
        <Tabs value={tabIndex} onChange={handleTabChange} centered>
          <Tab label="Login" />
          <Tab label="Register" />
        </Tabs>
      </AppBar>
      <h1 className={classes.title}>Todo List</h1>
      {tabIndex === 0 && <Login setToken={setToken} />}
      {tabIndex === 1 && <Register setToken={setToken} />}
    </>
  );
};

export default Auth;
