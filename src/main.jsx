import React from 'react'
import {
  RouterProvider,
} from "react-router-dom";
import ReactDOM from 'react-dom/client'
import router from './routes/Routes';
import './index.css'
import { CarDataProvider } from './context/CarContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <CarDataProvider><RouterProvider router={router} /></CarDataProvider>
  </React.StrictMode>,
)
