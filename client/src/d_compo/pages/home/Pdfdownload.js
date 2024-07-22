import React, { useContext, useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Button, CircularProgress, Grid } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { LoginContext } from '../../components/context/Context';
import { validuser } from '../../../services/Apis';

function Pdfdownload() {
    const [loading, setLoading] = useState(true);
    const [logindata, setLoginData  ] = useState();
   
    const history = useNavigate();
  

    const DashboardValid = async () => {
        let token = localStorage.getItem("usersdatatoken");
    
        const config = {
            "Content-Type": "application/json",
            "Authorization": token
        }
    
        const response = await validuser("", config);
    
        if (response.status === 401 || !response) {
            history("*");
        } else {
            setLoginData(response.data);
           
        }
    }
    

 useEffect(() => {
    setTimeout(() => {
        DashboardValid();
       
        setLoading(false);
    }, 2000);
}, []);



    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </div>
        );
    }

    if (!logindata) {
        return (
            <Typography variant="h6" color="error" align="center">
                No login data available
            </Typography>
        );
    }

    return (
        <div style={{ padding: '2rem' }}>
            <Typography variant="h4" gutterBottom align="center" color="primary">
                Welcome, {logindata.ValidUserOne.fname}!
            </Typography>
            
            <Typography variant="h5" gutterBottom align="center" color="secondary">
                Your PDF Files
            </Typography>
      
            <TableContainer component={Paper} style={{ marginTop: '1rem' }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell align="center">PDF Name</TableCell>
                            <TableCell align="center">Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {logindata.ValidUserOne.pdfs.length > 0 ? (
                            logindata.ValidUserOne.pdfs.map((pdf, index) => (
                                <TableRow key={index}>
                                    <TableCell align="center">{`PDF ${index + 1}`}</TableCell>
                                    <TableCell align="center">
                                        <Button variant="contained" color="primary" href={pdf} download>
                                            Download
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell align="center" colSpan={2}>
                                    No PDFs uploaded
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
}

export default Pdfdownload;
