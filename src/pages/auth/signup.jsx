import React from "react";
import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { useFormik } from "formik";
import { NavLink, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { usePostApiMutation } from "../../redux/apiSlice";
import useAlerts from "../../hooks/useAlerts";

const SignUp = () => {
  const { success, error } = useAlerts();
  const navigate = useNavigate();
  const [signup, { isLoading: isUpdating }] = usePostApiMutation();

  const validationSchema = Yup.object({
    firstname: Yup.string().required("First Name is required"),
    lastName: Yup.string().required("Last Name is required"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string().required("Password is required"),
    confirm_password: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Confirm Password is required"),
  });

  const formik = useFormik({
    initialValues: {
      firstname: "",
      lastName: "",
      email: "",
      password: "",
      confirm_password: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      const payload = {
        fname: values.firstname,
        lname: values.lastName,
        email: values.email,
        password: values.password,
      };

      try {
        const response = await signup({
          endpoint: "auth/signup",
          body: payload,
        });

        if (response.data?.success) {
          success(response.data.message);
          navigate("/signin");
        } else {
          error(response.error?.data?.message || "Sign up failed");
        }
      } catch (error) {
        error("Failed to sign up. Please try again.");
      }
    },
  });

  return (
    <Box
      height="100vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
    >
      <Card sx={{ width: 500 }}>
        <CardContent>
          <Typography variant="h5" align="center" gutterBottom>
            Sign Up
          </Typography>
          <form onSubmit={formik.handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="firstname"
                  name="firstname"
                  label="First Name"
                  variant="outlined"
                  {...formik.getFieldProps("firstname")}
                  error={formik.touched.firstname && formik.errors.firstname}
                  helperText={
                    formik.touched.firstname && formik.errors.firstname
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="lastName"
                  name="lastName"
                  label="Last Name"
                  variant="outlined"
                  {...formik.getFieldProps("lastName")}
                  error={formik.touched.lastName && formik.errors.lastName}
                  helperText={formik.touched.lastName && formik.errors.lastName}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="email"
                  name="email"
                  label="Email"
                  type="email"
                  variant="outlined"
                  {...formik.getFieldProps("email")}
                  error={formik.touched.email && formik.errors.email}
                  helperText={formik.touched.email && formik.errors.email}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="password"
                  name="password"
                  label="Password"
                  type="password"
                  variant="outlined"
                  {...formik.getFieldProps("password")}
                  error={formik.touched.password && formik.errors.password}
                  helperText={formik.touched.password && formik.errors.password}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="confirm_password"
                  name="confirm_password"
                  label="Confirm Password"
                  type="password"
                  variant="outlined"
                  {...formik.getFieldProps("confirm_password")}
                  error={
                    formik.touched.confirm_password &&
                    formik.errors.confirm_password
                  }
                  helperText={
                    formik.touched.confirm_password &&
                    formik.errors.confirm_password
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  disabled={formik.isSubmitting || isUpdating}
                >
                  {isUpdating ? "Signing Up..." : "Sign Up"}
                </Button>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body2" align="center">
                  Already have an account?{" "}
                  <NavLink to="/signin" style={{ textDecoration: "none" }}>
                    Sign In
                  </NavLink>
                </Typography>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default SignUp;
