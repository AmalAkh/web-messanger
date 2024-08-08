import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx';
import Login from './Login.jsx';
import axios from 'axios';
import "./scss/styles.scss";
import host from './api/http/host.js';
axios.defaults.baseURL = host;

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App></App>,
  },
  {
    path: "/login",
    element: <Login></Login>,
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
 
    <RouterProvider router={router} />
);
