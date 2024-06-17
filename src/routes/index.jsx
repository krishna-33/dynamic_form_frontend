import React from "react";
import { createBrowserRouter } from "react-router-dom";
import ErrorPage from "../pages/error";
import FormList from "../pages/form/list";
import CreateForm from "../pages/form/create";
import DisplayForm from "../pages/form/display";
import SignIn from "../pages/auth/signIn";
import SignUp from "../pages/auth/signup";
import RequireAuth from "../hoc/requireAuth";


const AuthenticatedFormList = RequireAuth(FormList);
const AuthenticatedCreateForm = RequireAuth(CreateForm);
const AuthenticatedDisplayForm = RequireAuth(DisplayForm);



const router = createBrowserRouter([
  {
    path: "/",
    errorElement: <ErrorPage />,
    children: [
      {
        element: <SignIn />,
        index: true
      },
      {
        path: "signin",
        element: <SignIn />,
      },
      {
        path: "signup",
        element: <SignUp />,
      },
      {
        path: "forms",
        children: [
          {
            element: <AuthenticatedFormList />,
            index: true
          },
          {
            path: "new",
            element: <AuthenticatedCreateForm />,
          },
          {
            path: ":id",
            element: <AuthenticatedDisplayForm />,
          },
        ]
      }
     
    ]
  },
  {
    path: "*",
    element: <ErrorPage />,
  },
]);

export default router;
