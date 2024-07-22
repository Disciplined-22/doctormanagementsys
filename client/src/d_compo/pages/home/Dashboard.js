import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LoginContext } from '../../components/context/Context';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Container from '@mui/material/Container';
import { validuser } from '../../../services/Apis';
import './Dashboard.css';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import { purple, red } from '@mui/material/colors';


const StyledCard = styled(Card)(({ theme }) => ({
    maxWidth: 400,
    margin: '40px auto 0',
    borderRadius: 16,
    boxShadow: theme.shadows[8],
    background: 'linear-gradient(135deg, #ffffff, #f0f0f0)',
    padding: theme.spacing(4),
}));

const StyledButton = styled(Button)(({ theme }) => ({
    width: '100%',
    borderRadius: 8,
    textTransform: 'none',
    fontWeight: 'bold',
    padding: theme.spacing(1.5),
    marginBottom: theme.spacing(2),
}));

const Dashboard = () => {

    const [data, setData] = useState(false);
    const { logindata, setLoginData } = useContext(LoginContext);
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

    useEffect(() => {
        setTimeout(() => {
            DashboardValid();
            setData(true);
        }, 2000);
    }, []);

    return (
        <Container maxWidth="sm" sx={{ padding: 2 }}>
            {data ? (
                <StyledCard>
                    <CardContent sx={{ textAlign: 'center' }}>
                        <Avatar
                            alt="User Avatar"
                            src="./man.png"
                            sx={{ width: 100, height: 100, margin: '0 auto 20px', border: '4px solid #1976d2' }}
                        >
                            {logindata?.ValidUserOne?.fname ? logindata.ValidUserOne.fname[0] : ""}
                        </Avatar>
                        <Typography variant="h5" component="div" gutterBottom sx={{ fontWeight: 'bold' }}>
                            User Name
                        </Typography>
                        <Typography variant="h6" component="div" sx={{ mb: 2 }}>
                            {logindata ? logindata.ValidUserOne.fname : ""}
                        </Typography>
                        <Typography variant="subtitle1" color="textSecondary">
                            User Email:  {logindata ? logindata.ValidUserOne.email : ""}
                        </Typography>
                    </CardContent>
                </StyledCard>
            ) : (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                    <CircularProgress />
                    <Typography variant="h6" sx={{ ml: 2 }}>
                        Loading...
                    </Typography>
                </Box>
            )}
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 3 }}>
                <Link
                    to={{
                        pathname: "/doc/connect/",
                        state: { logindata }
                    }}
                    style={{ textDecoration: 'none', width: '100%' }}
                >
                    <StyledButton variant="contained" color="primary">
                        Connect
                    </StyledButton>
                </Link>
                <Link
                    to={{
                        pathname: "/doc/patientlist",
                        
                    }}
                    style={{ textDecoration: 'none', width: '100%' }}
                >
                    <StyledButton variant="contained" color="primary">
                        My Patients
                    </StyledButton>
                </Link>

                <Link
                    to={{
                        pathname: "/doc/uploadpdf",
                        state: { logindata }
                    }}
                    style={{ textDecoration: 'none', width: '100%' }}
                >
                    <StyledButton variant="contained" color="secondary">
                       Upload PDF
                    </StyledButton>
                </Link>

                <Link
                    to={{
                        pathname: "/doc/downloadpdf",
                        state: { logindata }
                    }}
                    style={{ textDecoration: 'none', width: '100%' }}
                >
                    <StyledButton variant="contained" color="secondary">
                      My Documents
                    </StyledButton>
                </Link>
            </Box>
            
        </Container>
    );
}

export default Dashboard;
