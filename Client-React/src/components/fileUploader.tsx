
import type React from "react";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { Box, Button, LinearProgress, Typography } from "@mui/material";
import { RootState } from "../store";

const FileUploader = () => {
const [file, setFile] = useState<File | null>(null);
const [progress, setProgress] = useState(0);
const userId = useSelector((state: RootState) => state.user.userId);

useEffect(() => {
console.log("Current User ID:", userId); // בדוק את ה-User ID
}, [userId]);

const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
if (e.target.files && e.target.files.length > 0) {
setFile(e.target.files[0]);
} else {
setFile(null); // אם אין קובץ, ננקה את ה-state
}
};

const saveindb = async (file: File) => {
try {
if (!file) {
throw new Error("No file selected");
}

  if (!userId) {
    throw new Error("Missing userId in Redux state");
  }

  const formData = new FormData();
  formData.append("ResumeFile", file);
  formData.append("UserId", userId.toString());

  const extension = file.name.split('.').pop();
  if (extension) {
    formData.append("extension", extension); // הוספת הסיומת רק אם היא קיימת
  } else {
    console.warn("File has no extension");
  }

  const response = await axios.post("http://localhost:5138/api/AIResponse", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  console.log("Response from DB save:", response.data);
} catch (error) {
  if (axios.isAxiosError(error)) {
    console.error("Error saving file data:", error.response?.data || error.message);
  } else {
    console.error("Unexpected error:", error);
  }
}
};

const handleUpload = async () => {
if (!file) return;

if (!userId) {
  console.error("User ID is not available. Please log in first.");
  return;
}

const validExtensions = ["pdf", "docx"];
const fileExtension = file.name.split('.').pop()?.toLowerCase(); // הוספת ? כדי למנוע שגיאה
if (!fileExtension || !validExtensions.includes(fileExtension)) {
  console.error("Unsupported file type.");
  return;
}

try {
  const response = await axios.get("http://localhost:5138/api/upload/presigned-url", {
    params: { fileName: file.name },
  });

  const presignedUrl = response.data.url;

  await axios.put(presignedUrl, file, {
    headers: {
      "Content-Type": file.type,
    },
    onUploadProgress: (progressEvent) => {
      const percent = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1));
      setProgress(percent);
    },
  });

  alert("הקובץ הועלה בהצלחה!");
  await saveindb(file);
} catch (error) {
  console.error("שגיאה בהעלאה:", error);
}
};

return (
<Box
sx={{
padding: 3,
borderRadius: 2,
backgroundColor: "white",
boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
width: "100%",
maxWidth: 400,
margin: "20px 0",
}}
>
<Box sx={{ mb: 2 }}>
<Button
variant="outlined"
component="label"
fullWidth
sx={{
borderColor: "#FF0000",
color: "#FF0000",
borderRadius: 2,
padding: "10px 0",
"&:hover": {
borderColor: "#cc0000",
backgroundColor: "rgba(255, 0, 0, 0.04)",
},
}}
>
Select File
<input type="file" onChange={handleFileChange} hidden />
</Button>
{file && <Box sx={{ mt: 1, fontSize: "0.875rem", color: "text.secondary" }}>Selected: {file.name}</Box>}
</Box>

  <Button
    onClick={handleUpload}
    variant="contained"
    fullWidth
    disabled={!file}
    sx={{
      backgroundColor: "#FF0000",
      color: "white",
      borderRadius: 2,
      padding: "10px 0",
      textTransform: "none",
      fontWeight: "bold",
      "&:hover": {
        backgroundColor: "#cc0000",
      },
      "&.Mui-disabled": {
        backgroundColor: "#ffcccc",
        color: "#990000",
      },
    }}
  >
    Upload File
  </Button>

  {progress > 0 && (
    <Box sx={{ mt: 2 }}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
        <Box sx={{ width: "100%", mr: 1 }}>
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              height: 10,
              borderRadius: 5,
              backgroundColor: "#ffcccc",
              "& .MuiLinearProgress-bar": {
                backgroundColor: "#FF0000",
              },
            }}
          />
        </Box>
        <Box sx={{ minWidth: 35 }}>
          <Typography variant="body2" color="text.secondary">{`${Math.round(progress)}%`}</Typography>
        </Box>
      </Box>
      <Typography variant="caption" color="text.secondary">
        Uploading: {file?.name}
      </Typography>
    </Box>
  )}
</Box>
);
};

export default FileUploader;