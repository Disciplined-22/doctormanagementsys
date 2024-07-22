import React, { useState, useContext, useEffect } from 'react';
import { Card, CardContent, CardActions, Button, Typography, Box, CircularProgress } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { uploadpdf, validuser } from "../../../services/Apis";
import { LoginContext } from '../../components/context/Context';
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from 'react-router-dom';

function UploadPDF() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const history = useNavigate();

  const [logindata, setLoginData  ] = useState();


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


  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      toast.error("File is required!");
      return;
    }

    setLoading(true);

    const data = new FormData();
    data.append("pdf", file);
    data.append("doctorId", logindata.ValidUserOne._id);

    try {
      const response = await uploadpdf(data, { "Content-Type": "multipart/form-data" });

      if (response.status === 201) {
        toast.success("File uploaded successfully!");
        setFile(null);
      } else {
        toast.error("File upload failed. Please try again.");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setTimeout(() => {
        DashboardValid();
       
        setLoading(false);
    }, 2000);
}, []);


  return (
    <Card sx={{ maxWidth: 500, margin: '0 auto', mt: 5, p: 2, boxShadow: 3, borderRadius: 2 }}>
      <CardContent>
        <Typography variant="h5" component="div" gutterBottom align="center" sx={{ fontFamily: 'Roboto, Arial, sans-serif' }}>
          Upload Your File
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 2 }}>
          <Typography variant="body1" align="center" sx={{ mb: 2 }}>
            Select a file to upload. Only PDF files are allowed.
          </Typography>
          <Button
            variant="contained"
            component="label"
            startIcon={<CloudUploadIcon />}
            sx={{ mb: 2, px: 3, py: 1.5, fontSize: '1rem' }}
          >
            Upload File
            <input
              type="file"
              accept="application/pdf"
              hidden
              onChange={handleFileChange}
            />
          </Button>
          <Typography variant="body2" align="center" sx={{ mb: 2 }}>
            {file ? `Selected file: ${file.name}` : 'No file selected'}
          </Typography>
        </Box>
      </CardContent>
      <CardActions sx={{ justifyContent: 'center', mb: 2 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          sx={{ px: 3, py: 1.5, fontSize: '1rem' }}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Submit'}
        </Button>
      </CardActions>
      <ToastContainer position="top-center" autoClose={5000} />
    </Card>
  );
}

export default UploadPDF;
