import React, { useState, useEffect } from 'react';
import { TextField, Button, Card, CardContent, Typography, CircularProgress, Container, Box } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { signindoc } from "../../../services/Apis";
import 'react-toastify/dist/ReactToastify.css';
import "../../css/Signup.css";

// Spinner component for loading state
const Spiner = () => (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ ml: 2 }}>
            Loading...
        </Typography>
    </Box>
);

const Signin_d = () => {
    const [inputdata, setInputData] = useState({
        email: "",
        password: "",
    });

    const history = useNavigate();
    const [showspin, setShowSpin] = useState(true);

    // Set input value
    const setInputValue = (e) => {
        const { name, value } = e.target;
        setInputData({ ...inputdata, [name]: value });
    }

    // Submit user data
    const submitUserData = async (e) => {
        e.preventDefault();

        const { email, password } = inputdata;

        if (email === "") {
            toast.error("Email is Required!");
        } else if (!email.includes("@")) {
            toast.error("Enter Valid Email!");
        } else if (password === "") {
            toast.error("Password is Required!");
        } else {
            const data = inputdata;

            const config = {
                "Content-Type": "application/json"
            }

            const response = await signindoc(data, config);

            if (response.status === 200) {
                toast.success("User Signed in");
                localStorage.setItem("usersdatatoken", response.data.result.token);

                setInputData({
                    email: "",
                    password: "",
                });

                history("/doc/dashboard");
            } else {
                toast.error("Unable to sign in");
            }
        }
    }

    useEffect(() => {
        setTimeout(() => {
            setShowSpin(false);
        }, 1200);
    }, []);

    return (
        <>
            {showspin ? <Spiner /> :
                <Container maxWidth="sm" sx={{ mt: 4 }}>
                    <Typography variant="h4" component="h2" align="center" sx={{ mb: 4 }}>
                      DOCTOR SIGN IN
                    </Typography>
                    <Card sx={{ borderRadius: 2, boxShadow: 3, p: 3 }}>
                        <CardContent>
                            <form onSubmit={submitUserData}>
                                <Box sx={{ mb: 2 }}>
                                    <TextField
                                        fullWidth
                                        label="Email"
                                        name="email"
                                        value={inputdata.email}
                                        onChange={setInputValue}
                                        variant="outlined"
                                        required
                                        sx={{ mb: 2 }}
                                    />
                                </Box>
                                <Box sx={{ mb: 3 }}>
                                    <TextField
                                        fullWidth
                                        label="Password"
                                        name="password"
                                        type="password"
                                        value={inputdata.password}
                                        onChange={setInputValue}
                                        variant="outlined"
                                        required
                                    />
                                </Box>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    type="submit"
                                    fullWidth
                                    sx={{ borderRadius: 2, padding: '10px', fontWeight: 'bold' }}
                                >
                                    Submit
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                    <ToastContainer position="top-center" autoClose={5000} />
                </Container>
            }
        </>
    );
}

export default Signin_d;
