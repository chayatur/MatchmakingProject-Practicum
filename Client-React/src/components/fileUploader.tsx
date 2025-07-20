import type React from "react"
import { useState, useCallback } from "react"
import axios from "axios"
import {
  Box,
  Button,
  LinearProgress,
  Typography,
  Paper,
  Snackbar,
  Alert,
  Card,
  Tooltip,
  IconButton,
  Container
} from "@mui/material"
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useNavigate } from "react-router-dom"

const FileUploader = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null)
  const [progress, setProgress] = useState(0)
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: "success" | "error" }>({
    open: false,
    message: "",
    severity: "success",
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0])
    }
  }

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);
    if (droppedFiles.length > 0) {
      setFile(droppedFiles[0]);
    }
  }, []);

  const saveindb = async () => {
    try {
        if (!file) {
            throw new Error("No file selected");
        }

        const userId = sessionStorage.getItem("userId");
        if (!userId) {
            throw new Error("Missing userId in session storage");
        }

        const formData = new FormData();
        formData.append("ResumeFile", file);
        formData.append("UserId", userId);

        const response = await axios.post("https://matchmakingproject-practicum.onrender.com/api/AIResponse", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });

        console.log("Response from DB save:", response.data);
    } catch (error: any) {
        if (error.response) {
            console.error("Error saving file data:", error.response.data);
        } else {
            console.error("Error saving file data:", error.message);
        }
    }
  }

  const handleUpload = async () => {
    if (!file) return;

    try {
        const encodedFileName = encodeURIComponent(file.name);
        const response = await axios.get(`https://matchmakingproject-practicum.onrender.com/api/upload/presigned-url?fileName=${encodedFileName}`);

        const presignedUrl = response.data.url;
        console.log(presignedUrl);

        await axios.put(presignedUrl, file, {
            headers: {
                "Content-Type": file.type,
            },
            onUploadProgress: (progressEvent) => {
                const percent = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1));
                setProgress(percent);
            },
        });

        alert("File uploaded successfully!");
        await saveindb();
    } catch (error) {
        console.error("Upload error:", error);
        setSnackbar({ open: true, message: "שגיאה בהעלאה", severity: "error" });
    }
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Tooltip title="חזור">
            <IconButton sx={{ color: "#8B0000" }} onClick={() => navigate(-1)}>
          <  ArrowForwardIcon/>
            </IconButton>
          </Tooltip>
          <Typography variant="h5" sx={{ fontWeight: "bold", color: "#8B0000", ml: 1 }}>
            העלאת רזומה
          </Typography>
        </Box>

        <Card
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          sx={{
            p: 3,
            border: "2px dashed #8B0000",
            textAlign: "center",
            borderRadius: 3,
            backgroundColor: "#fff8f8",
            position: "relative",
          }}
        >
          <CloudUploadIcon sx={{ fontSize: 60, color: "#8B0000", mb: 1 }} />
          <Typography variant="h6" gutterBottom>
            גרור קובץ לכאן או לחץ לבחירה
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            קבצים נתמכים: DOCX | PDF גודל מקסימלי: 10MB
          </Typography>

          <label htmlFor="resume-upload">
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
              hidden
              id="resume-upload"
            />
            <Button variant="outlined" component="span" sx={{ borderColor: "#8B0000", color: "#8B0000" }}>
              בחר קובץ
            </Button>
          </label>
        </Card>

        {file && (
          <Typography sx={{ mt: 2, fontWeight: "bold", color: "#333" }}>
            קובץ שנבחר: {file.name}
          </Typography>
        )}

        <Button
          onClick={handleUpload}
          variant="contained"
          fullWidth
          disabled={!file}
          sx={{
            mt: 3,
            backgroundColor: "#8B0000",
            color: "white",
            borderRadius: 2,
            textTransform: "none",
            fontWeight: "bold",
            "&:hover": {
              backgroundColor: "#5c0000",
            },
            "&.Mui-disabled": {
              backgroundColor: "#ffcccc",
              color: "#990000",
            },
          }}
        >
          העלה קובץ
        </Button>

        {progress > 0 && (
          <Box sx={{ mt: 2 }}>
            <LinearProgress variant="determinate" value={progress} sx={{ height: 10, borderRadius: 5 }} />
            <Typography variant="caption">{`${Math.round(progress)}%`}</Typography>
          </Box>
        )}

        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Paper>
    </Container>
  )
}

export default FileUploader;
