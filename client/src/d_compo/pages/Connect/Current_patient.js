import React, { useContext, useEffect, useState } from 'react';
import { LoginContext } from '../../components/context/Context';
import { Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box } from '@mui/material';
import "./current_patient.css"
import { styled } from '@mui/material/styles';
import CardContent from '@mui/material/CardContent';
import CircularProgress from '@mui/material/CircularProgress';
import Card from '@mui/material/Card';
import { validuser } from '../../../services/Apis';
import { useNavigate } from 'react-router-dom';

const StyledCard = styled(Card)(({ theme }) => ({
  maxWidth: 400,
  margin: '40px auto 0',
  borderRadius: 16,
  boxShadow: theme.shadows[8],
  background: 'linear-gradient(135deg, #ffffff, #f0f0f0)',
  padding: theme.spacing(4),
}));


const customFontStyle = {
  fontFamily: ' sans-serif', // or 'Lora', or 'Open Sans'
};

function Current_patient() {
  const [data, setData] = useState(false);
  const [logindata, setLoginData  ] = useState();
  const [patientdata, setPatientData] = useState([]);
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
        patientGet(response.data); 
    }
}

  const patientGet = async (userData) => {
    try {
      const doctorId = userData.ValidUserOne._id;
      const url = new URL('http://localhost:6010/doc/mypatient');
      url.searchParams.append('doctorId', doctorId);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          "Content-Type": "application/json"
        }
      });

      const result = await response.json();

      if (response.status === 200) {
        setPatientData(result.patients); // Adjust based on your response structure
      } else {
        console.log("Error fetching mypatient data");
      }
    } catch (error) {
      console.error("Error fetching patient data:", error);
    }
  };

  useEffect(() => {
    setTimeout(() => {
        DashboardValid();
       
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

                <h1 className='type1_typ' style={{ marginTop: '40px' }}>
        My Patient List
      </h1>
      <TableContainer component={Paper} sx={{ boxShadow: 3, borderRadius: 2, marginTop: 1 }}>
        <Table>
          <TableHead>
            <TableRow>
            <TableCell align="center">S No.</TableCell>
              <TableCell align="center">Name</TableCell>
              <TableCell align="center">Age</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {patientdata.map((patient,index) => (
              <TableRow key={patient._id}>
                <TableCell align="center">{index + 1}</TableCell>
                <TableCell align="center">{patient.fname}</TableCell>
                <TableCell align="center">{patient.age}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

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
}

export default Current_patient;
