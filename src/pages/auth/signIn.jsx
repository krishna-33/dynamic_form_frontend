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
import { signin } from "../../redux/authSlice";
import { useDispatch, useSelector } from "react-redux";

export default function SignIn() {
  const authToken = useSelector((state) => state.auth);
  const { success, error } = useAlerts();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [signIn, { isLoading: isSigningIn }] = usePostApiMutation({
    authToken,
  });

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email address")
      .required("Eamil is required"),
    password: Yup.string().required("Password is required"),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        const response = await signIn({
          endpoint: "auth/signin",
          body: values,
        });

        if (response.data?.success) {
          dispatch(signin(response.data.data));
          success(response.data?.message);
          navigate("/forms");
        } else {
          error(response.error?.data?.message || "Sign in failed");
        }
      } catch (error) {
        error("Failed to sign in. Please try again.");
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
            Sign In
          </Typography>
          <form onSubmit={formik.handleSubmit}>
            <Grid container spacing={2}>
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
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  disabled={formik.isSubmitting || isSigningIn}
                >
                  {isSigningIn ? "Signing In..." : "Sign In"}
                </Button>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body2" align="center">
                  Don't have an account?{" "}
                  <NavLink to="/signup" style={{ textDecoration: "none" }}>
                    Sign Up
                  </NavLink>
                </Typography>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
}
