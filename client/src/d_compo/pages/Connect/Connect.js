import React, { useContext, useEffect, useState } from 'react';
import { connectpatient, usergetfunc, validuser } from "../../../services/Apis";
import { LoginContext } from '../../components/context/Context';
import { ToastContainer, toast } from "react-toastify";
import { Container, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import 'react-toastify/dist/ReactToastify.css';
import "../../css/connect.css";
import { useNavigate } from 'react-router-dom';
import CardContent from '@mui/material/CardContent';
import CircularProgress from '@mui/material/CircularProgress';
import Card from '@mui/material/Card';

const StyledCard = styled(Card)(({ theme }) => ({
    maxWidth: 400,
    margin: '40px auto 0',
    borderRadius: 16,
    boxShadow: theme.shadows[8],
    background: 'linear-gradient(135deg, #ffffff, #f0f0f0)',
    padding: theme.spacing(4),
  }));
  
  
// Styled components for better UI
const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
    marginTop: theme.spacing(4),
    borderRadius: theme.shape.borderRadius,
    boxShadow: theme.shadows[5],
}));

const StyledTable = styled(Table)(({ theme }) => ({
    minWidth: 650,
}));

const StyledTableHead = styled(TableHead)(({ theme }) => ({
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    fontWeight: theme.typography.fontWeightMedium,
}));

const Connect = () => {
    const [data, setData] = useState(false);
    const [logindata, setLoginData  ] = useState();

    const history = useNavigate();

    const DashboardValid = async () => {
        let token = localStorage.getItem("usersdatatoken");
    
        const config = {
            "Content-Type": "application/json",
            "Authorization": token
        }
    
        const response = await validuser(data, config);
    
        if (response.status === 401 || !response) {
            history("*");
        } else {
            setLoginData(response.data);
           
        }
    }

    const [userdata, setUserData] = useState([]);

    const userGet = async () => {
        try {
            const response = await usergetfunc();
            if (response.status === 200) {
                setUserData(response.data);
            } else {
                console.log("Error fetching user data");
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    };

    const connectpat = async (patientId) => {
        const data = {
            doctorId: logindata.ValidUserOne._id,
            patientId: patientId,
            action: "connect"
        };

        const response = await connectpatient(data);

        if (response.status === 200) {
            toast.success("New patient added!");
        } else if (response.status === 400 || !response) {
            toast.error("Server problem!");
        } else {
            toast.error("Patient is already connected to the doctor");
        }
    };

    useEffect(() => {
        setTimeout(() => {
            DashboardValid();
            userGet();
            setData(true);
        }, 2000);
    }, []);
    



    return (
        <Container maxWidth="lg" sx={{ paddingY: 4 }}>
          {data ? (
  <>
                <StyledCard>
                    <CardContent sx={{ textAlign: 'center' }}>
                      
                        <Typography variant="h5" component="div" gutterBottom sx={{ fontWeight: 'bold' }}>
                            Doctor Name
                        </Typography>
                        <Typography variant="h6" component="div" sx={{ mb: 2 }}>
                            {logindata ? logindata.ValidUserOne.fname : ""}
                        </Typography>
                       
                    </CardContent>
                </StyledCard>

                <h1   className='type1_typ'>
     Patient List
      </h1>
            <StyledTableContainer component={Paper}>
                <StyledTable>
                    <StyledTableHead>
                        <TableRow>
                            <StyledTableCell>S No.</StyledTableCell>
                            <StyledTableCell>First Name</StyledTableCell>
                            <StyledTableCell>Age</StyledTableCell>
                            <StyledTableCell>Initialize Connect</StyledTableCell>
                        </TableRow>
                    </StyledTableHead>
                    <TableBody>
                        {userdata.map((patient, index) => (
                            <TableRow key={patient._id}>
                                <TableCell>{index + 1}</TableCell>
                                <TableCell>{patient.fname}</TableCell>
                                <TableCell>{patient.age}</TableCell>
                                <TableCell>
                                    <Button
                                        onClick={() => connectpat(patient._id)}
                                        variant="contained"
                                        color="primary"
                                    >
                                        Connect
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </StyledTable>
            </StyledTableContainer>
            <ToastContainer position="top-center" />

</>
            ) : (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                    <CircularProgress />
                    <Typography variant="h6" sx={{ ml: 2 }}>
                        Loading...
                    </Typography>
                </Box>
            )}


        </Container>
    );
};

export default Connect;
