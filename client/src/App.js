import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import React, { useContext} from 'react'
import { Routes, Route } from "react-router-dom"
import Signup_d from './d_compo/pages/auth_pages/Signup.js';
import Signin_d from './d_compo/pages/auth_pages/Signin_d.js';
import Connect from './d_compo/pages/Connect/Connect.js';
import Dashboard from './d_compo/pages/home/Dashboard.js';
import Uploadpdf from './d_compo/pages/home/Uploadpdf.js';
import Current_patient from './d_compo/pages/Connect/Current_patient.js';
import { ToastContainer} from "react-toastify"
import Pdfdownload from './d_compo/pages/home/Pdfdownload.js';
function App() {


  return (
    <>
      {/* <Header /> */}
      <Routes>
       
        {/* register components */}
        <Route path='/' element={<Signup_d />} />
        <Route path='/doc/signin' element={<Signin_d />} />

        {/* Dashboard compo */}

        <Route path='/doc/dashboard' element={<Dashboard />} />
        <Route path='/doc/uploadpdf' element={<Uploadpdf />} />
        <Route path='/doc/downloadpdf' element={<Pdfdownload />} />


        {/* connect components */}
        <Route path='/doc/connect' element={<Connect />} />

        <Route path='/doc/patientlist' element={<Current_patient/>} />


      </Routes>
      <ToastContainer position="top-center" />
    </>
  );
}

export default App;
