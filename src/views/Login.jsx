import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,Snackbar, SnackbarContent 
} from "@material-ui/core";
import axios from "axios";
import { Rating } from "@mui/material";

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
  },
  paper: {
    padding: theme.spacing(3),
    maxWidth: 400,
    width: "100%",
    textAlign: "center",
  },
  form: {
    "& .MuiTextField-root": {
      marginBottom: theme.spacing(2),
    },
  },
}));

const Login = ({ setToken }) => {
  const classes = useStyles();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // API call to create an account
    try {
      const getAuthTokenResponse = await axios.post(
        "https://demo2.z-bit.ee/users/get-token",
        {
          username: formData.email,
          password: formData.password,
        }
      );
      console.log("Authentication token:", getAuthTokenResponse.data);
      setSnackbarMessage("Login successful");
      setSnackbarSeverity("success");

      setTimeout(() => {
        setToken(getAuthTokenResponse.data.access_token);
      }, 1750);
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error:", error);
      setSnackbarMessage("Login failed");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  return (
    <Container className={classes.container}>
      <Paper className={classes.paper} elevation={3}>
        <Typography variant="h5" gutterBottom>
          Login
        </Typography>
        <form className={classes.form} onSubmit={handleSubmit}>
          <TextField
            label="Email"
            type="email"
            name="email"
            fullWidth
            required
            onChange={handleChange}
          />
          <TextField
            label="Password"
            type="password"
            name="password"
            fullWidth
            required
            onChange={handleChange}
          />

          <Button type="submit" variant="contained" color="primary" fullWidth>
            Sign In
          </Button>
        </form>
      </Paper>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={1500}
        onClose={handleCloseSnackbar}
      >
        <SnackbarContent
          onClose={handleCloseSnackbar}
          message={snackbarMessage}
          style={{
            backgroundColor:
              snackbarSeverity === "error" ? "#d32f2f" : "#43a047",
          }}
        />
      </Snackbar>
    </Container>
  );
};

export default Login;
