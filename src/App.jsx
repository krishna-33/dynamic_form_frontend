import React from "react";
import "./App.scss";
import { RouterProvider } from "react-router-dom";
import router from "./routes";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { useSelector } from "react-redux";

function App() {
  return (
    <div className="App">
      <RouterProvider router={router} />
      <ToastContainer position="top-right" theme="colored" />
    </div>
  );
}

export default App;
