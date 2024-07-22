import React, { useState, useEffect } from 'react';
import { TextField, Button, Card, CardContent, Typography, CircularProgress, Container, Box } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { registerdoc } from "../../../services/Apis";
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

const Signup_d = () => {
    const [inputdata, setInputData] = useState({
        fname: "",
        specialization: "",
        email: "",
        password: "",
    });

    const [passwordStrength, setPasswordStrength] = useState('');
    const [strengthClass, setStrengthClass] = useState('');

    const [showspin, setShowSpin] = useState(true);
    const navigate = useNavigate();

    // Set input value
    const setInputValue = (e) => {
        const { name, value } = e.target;
        setInputData({ ...inputdata, [name]: value });
        if (name === 'password') {
            checkPasswordStrength(value);
        }
    }

    const checkPasswordStrength = (password) => {
        const length = password.length;
        let hasUppercase = false;
        let hasSpecialChar = false;

        // Check for uppercase letters and special characters manually
        for (let char of password) {
            if (char >= 'A' && char <= 'Z') {
                hasUppercase = true;
            }
            if (['!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '-', '_', '=', '+', '{', '}', '[', ']', '|', ':', ';', '"', '\'', '<', '>', ',', '.', '/', '?'].includes(char)) {
                hasSpecialChar = true;
            }
        }

        if (length < 3) {
            setPasswordStrength('Weak: Password should be at least 3 characters long.');
            setStrengthClass('weak');
        } else if (length >= 3 && (!hasSpecialChar || !hasUppercase)) {
            if (!hasSpecialChar) {
                setPasswordStrength('Moderate: Include a special character to make it much better.');
                setStrengthClass('moderate');
            } else if (!hasUppercase) {
                setPasswordStrength('Moderate: Include at least one capital letter to make it much better.');
                setStrengthClass('moderate');
            }
        } else if (length >= 3 && hasSpecialChar && hasUppercase) {
            setPasswordStrength('Strong: Password meets the criteria.');
            setStrengthClass('strong');
        }
    };

    // Submit user data
    const submitUserData = async (e) => {
        e.preventDefault();

        const { fname, specialization, email, password } = inputdata;

        if (fname === "") {
            toast.error("First name is Required!");
        } else if (specialization === "") {
            toast.error("Specialization is Required!");
        } else if (email === "") {
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

            const response = await registerdoc(data, config);

            if (response.status === 201) {
                toast.success("User registered successfully");
                setInputData({
                    fname: "",
                    specialization: "",
                    email: "",
                    password: "",
                });

                navigate("/doc/signin");
            } else {
                toast.error("User already exists with the same email!");
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
                    DOCTOR SIGN UP 
                    </Typography>
                    <Card sx={{ borderRadius: 2, boxShadow: 3, p: 3 }}>
                        <CardContent>
                            <form onSubmit={submitUserData}>
                                <Box sx={{ mb: 2 }}>
                                    <TextField
                                        fullWidth
                                        label="First Name"
                                        name="fname"
                                        value={inputdata.fname}
                                        onChange={setInputValue}
                                        variant="outlined"
                                        required
                                        sx={{ mb: 2 }}
                                    />
                                </Box>
                                <Box sx={{ mb: 2 }}>
                                    <TextField
                                        fullWidth
                                        label="Specialization"
                                        name="specialization"
                                        value={inputdata.specialization}
                                        onChange={setInputValue}
                                        variant="outlined"
                                        required
                                        sx={{ mb: 2 }}
                                    />
                                </Box>
                                <Box sx={{ mb: 2 }}>
                                    <TextField
                                        fullWidth
                                        label="Email Address"
                                        name="email"
                                        type="email"
                                        value={inputdata.email}
                                        onChange={setInputValue}
                                        variant="outlined"
                                        required
                                        sx={{ mb: 2 }}
                                    />
                                </Box>
                                <Box sx={{ mb: 2 }}>
                                    <TextField
                                        fullWidth
                                        label="Password"
                                        name="password"
                                        type="password"
                                        value={inputdata.password}
                                        onChange={setInputValue}
                                        variant="outlined"
                                        required
                                        sx={{ mb: 2 }}
                                    />
                                    <Typography variant="body2" color={strengthClass === 'strong' ? 'success.main' : strengthClass === 'moderate' ? 'warning.main' : 'error.main'}>
                                        Password Strength: {passwordStrength}
                                    </Typography>
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

export default Signup_d;
