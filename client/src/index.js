import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from "react-router-dom"
import Context from './d_compo/components/context/Context';
// import ContextProvider from "./components/context/ContextProvider"


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  
  
    
      <Context>
      <BrowserRouter>
        <App />
      </BrowserRouter>
      </Context>

);

