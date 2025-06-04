
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
  console.log(file.type);

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


// import type React from "react"
// import { useState } from "react"
// import { useSelector } from "react-redux"
// import axios from "axios"
// import {
//   Box,
//   Button,
//   LinearProgress,
//   Typography,
//   Paper,
//   Container,
//   Card,
//   CardContent,
//   Alert,
//   Snackbar,
// } from "@mui/material"
// import {
//   CloudUpload as CloudUploadIcon,
//   FileCopy as FileCopyIcon,
//   CheckCircle as CheckCircleIcon,
// } from "@mui/icons-material"
// import type { RootState } from "../store"

// const FileUploader: React.FC = () => {
//   const [file, setFile] = useState<File | null>(null)
//   const [progress, setProgress] = useState(0)
//   const [uploading, setUploading] = useState(false)
//   const [uploadComplete, setUploadComplete] = useState(false)
//   const [error, setError] = useState<string | null>(null)
//   const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: "success" | "error" }>({
//     open: false,
//     message: "",
//     severity: "success",
//   })
//   const userId = useSelector((state: RootState) => state.user.userId)

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files.length > 0) {
//       const selectedFile = e.target.files[0]
//       const fileExtension = selectedFile.name.split(".").pop()?.toLowerCase()

//       if (fileExtension && ["pdf", "docx"].includes(fileExtension)) {
//         setFile(selectedFile)
//         setError(null)
//         setUploadComplete(false)
//       } else {
//         setFile(null)
//         setError("סוג קובץ לא נתמך. אנא בחר קובץ PDF או DOCX.")
//       }
//     }
//   }

//   const clearFile = () => {
//     setFile(null)
//     setProgress(0)
//     setUploadComplete(false)
//     setError(null)
//   }

//   const saveInDb = async (file: File) => {
//     try {
//       if (!file) {
//         throw new Error("לא נבחר קובץ")
//       }

//       if (!userId) {
//         throw new Error("חסר מזהה משתמש. אנא התחבר מחדש.")
//       }

//       const formData = new FormData()
//       formData.append("ResumeFile", file)
//       formData.append("UserId", userId.toString())

//       const extension = file.name.split(".").pop()
//       if (extension) {
//         formData.append("extension", extension)
//       }

//       const response = await axios.post("http://localhost:5138/api/AIResponse", formData, {
//         headers: {
//           "Content-Type": "multipart/form-data",
//         },
//       })

//       return response.data
//     } catch (error) {
//       if (axios.isAxiosError(error)) {
//         throw new Error(error.response?.data?.message || error.message)
//       } else {
//         throw error
//       }
//     }
//   }

//   const handleUpload = async () => {
//     if (!file) return

//     if (!userId) {
//       setError("מזהה משתמש אינו זמין. אנא התחבר מחדש.")
//       return
//     }

//     setUploading(true)
//     setProgress(0)
//     setError(null)

//     try {
//       // 1. קבלת URL חתום להעלאה
//       const response = await axios.get("http://localhost:5138/api/upload/presigned-url", {
//         params: { fileName: file.name },
//       })

//       const presignedUrl = response.data.url

//       // 2. העלאת הקובץ לשרת
//       await axios.put(presignedUrl, file, {
//         headers: {
//           "Content-Type": file.type,
//         },
//         onUploadProgress: (progressEvent) => {
//           const percent = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1))
//           setProgress(percent)
//         },
//       })

//       // 3. שמירת המידע במסד הנתונים
//       await saveInDb(file)

//       setUploadComplete(true)
//       setSnackbar({
//         open: true,
//         message: "הקובץ הועלה בהצלחה!",
//         severity: "success",
//       })
//     } catch (error: any) {
//       console.error("שגיאה בהעלאה:", error)
//       setError(error.message || "אירעה שגיאה בהעלאת הקובץ")
//       setSnackbar({
//         open: true,
//         message: error.message || "אירעה שגיאה בהעלאת הקובץ",
//         severity: "error",
//       })
//     } finally {
//       setUploading(false)
//     }
//   }

//   return (
//     <Container maxWidth="md" sx={{ py: 6 }}>
//       <Paper
//         elevation={0}
//         sx={{
//           borderRadius: 4,
//           overflow: "hidden",
//           border: "1px solid #e5d6d6",
//           boxShadow: "0 10px 40px rgba(139, 0, 0, 0.1)",
//         }}
//       >
//         {/* Header */}
//         <Box
//           sx={{
//             background: "linear-gradient(135deg, #8B0000 0%, #5c0000 100%)",
//             color: "white",
//             p: 4,
//             textAlign: "center",
//           }}
//         >
//           <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
//             העלאת רזומה
//           </Typography>
//           <Typography variant="body1" sx={{ opacity: 0.9 }}>
//             העלה קובץ רזומה בפורמט PDF או DOCX
//           </Typography>
//         </Box>

//         <Box sx={{ p: 4 }}>
//           {/* Upload Area */}
//           <Card
//             sx={{
//               borderRadius: 3,
//               border: "2px dashed",
//               borderColor: file ? "#8B0000" : "#e0e0e0",
//               backgroundColor: file ? "rgba(139, 0, 0, 0.03)" : "#f9f9f9",
//               transition: "all 0.3s ease",
//               mb: 3,
//               position: "relative",
//               overflow: "hidden",
//             }}
//           >
//             <CardContent
//               sx={{
//                 display: "flex",
//                 flexDirection: "column",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 py: 6,
//                 textAlign: "center",
//               }}
//             >
//               {!file ? (
//                 <>
//                   <CloudUploadIcon
//                     sx={{
//                       fontSize: 80,
//                       color: "#8B0000",
//                       mb: 2,
//                       opacity: 0.7,
//                     }}
//                   />
//                   <Typography variant="h6" sx={{ mb: 1, color: "#333" }}>
//                     גרור קובץ לכאן או
//                   </Typography>
//                   <Button
//                     variant="contained"
//                     component="label"
//                     sx={{
//                       mt: 2,
//                       backgroundColor: "#8B0000",
//                       color: "white",
//                       px: 4,
//                       py: 1.5,
//                       borderRadius: 2,
//                       "&:hover": {
//                         backgroundColor: "#5c0000",
//                       },
//                     }}
//                   >
//                     בחר קובץ
//                     <input type="file" accept=".pdf,.docx" onChange={handleFileChange} hidden />
//                   </Button>
//                   <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
//                     קבצים נתמכים: PDF, DOCX
//                   </Typography>
//                 </>
//               ) : (
//                 <>
//                   <Box sx={{ position: "relative", mb: 2 }}>
//                     <FileCopyIcon
//                       sx={{
//                         fontSize: 60,
//                         color: "#8B0000",
//                       }}
//                     />
//                     {uploadComplete && (
//                       <CheckCircleIcon
//                         sx={{
//                           position: "absolute",
//                           bottom: -5,
//                           right: -5,
//                           color: "#4CAF50",
//                           fontSize: 24,
//                           backgroundColor: "white",
//                           borderRadius: "50%",
//                         }}
//                       />
//                     )}
//                   </Box>
//                   <Typography variant="h6" sx={{ mb: 1, color: "#333" }}>
//                     {file.name}
//                   </Typography>
//                   <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
//                     {(file.size / 1024 / 1024).toFixed(2)} MB
//                   </Typography>

//                   <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
//                     {!uploading && !uploadComplete && (
//                       <>
//                         <Button
//                           variant="contained"
//                           onClick={handleUpload}
//                           sx={{
//                             backgroundColor: "#8B0000",
//                             color: "white",
//                             "&:hover": {
//                               backgroundColor: "#5c0000",
//                             },
//                           }}
//                         >
//                           העלה קובץ
//                         </Button>
//                         <Button
//                           variant="outlined"
//                           onClick={clearFile}
//                           sx={{
//                             borderColor: "#8B0000",
//                             color: "#8B0000",
//                             "&:hover": {
//                               borderColor: "#5c0000",
//                               backgroundColor: "rgba(139, 0, 0, 0.04)",
//                             },
//                           }}
//                         >
//                           בחר קובץ אחר
//                         </Button>
//                       </>
//                     )}

//                     {uploadComplete && (
//                       <Button
//                         variant="outlined"
//                         onClick={clearFile}
//                         sx={{
//                           borderColor: "#4CAF50",
//                           color: "#4CAF50",
//                           "&:hover": {
//                             borderColor: "#388E3C",
//                             backgroundColor: "rgba(76, 175, 80, 0.04)",
//                           },
//                         }}
//                       >
//                         העלה קובץ נוסף
//                       </Button>
//                     )}
//                   </Box>

//                   {uploading && (
//                     <Box sx={{ width: "100%", mt: 3 }}>
//                       <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
//                         <Box sx={{ width: "100%", mr: 1 }}>
//                           <LinearProgress
//                             variant="determinate"
//                             value={progress}
//                             sx={{
//                               height: 10,
//                               borderRadius: 5,
//                               backgroundColor: "rgba(139, 0, 0, 0.1)",
//                               "& .MuiLinearProgress-bar": {
//                                 backgroundColor: "#8B0000",
//                               },
//                             }}
//                           />
//                         </Box>
//                         <Box sx={{ minWidth: 35 }}>
//                           <Typography variant="body2" color="text.secondary">{`${Math.round(progress)}%`}</Typography>
//                         </Box>
//                       </Box>
//                       <Typography variant="caption" color="text.secondary">
//                         מעלה: {file.name}
//                       </Typography>
//                     </Box>
//                   )}
//                 </>
//               )}
//             </CardContent>
//           </Card>

//           {error && (
//             <Alert
//               severity="error"
//               sx={{
//                 mb: 3,
//                 borderRadius: 2,
//                 "& .MuiAlert-icon": {
//                   color: "#8B0000",
//                 },
//               }}
//             >
//               {error}
//             </Alert>
//           )}

//           {/* Instructions */}
//           <Box sx={{ mt: 4, p: 3, backgroundColor: "#f9f5f5", borderRadius: 2 }}>
//             <Typography variant="h6" sx={{ color: "#8B0000", mb: 2, fontWeight: 600 }}>
//               הנחיות להעלאת רזומה:
//             </Typography>
//             <Typography variant="body2" component="div" sx={{ color: "#555" }}>
//               <ul style={{ paddingInlineStart: "20px" }}>
//                 <li>הקובץ חייב להיות בפורמט PDF או DOCX</li>
//                 <li>גודל הקובץ המקסימלי הוא 10MB</li>
//                 <li>וודא שהרזומה מכילה את כל הפרטים האישיים הנדרשים</li>
//                 <li>המערכת תעבד את הקובץ ותחלץ את המידע הרלוונטי באופן אוטומטי</li>
//                 <li>לאחר העלאה מוצלחת, הרזומה תופיע ברשימת הרזומות שלך</li>
//               </ul>
//             </Typography>
//           </Box>
//         </Box>
//       </Paper>

//       <Snackbar
//         open={snackbar.open}
//         autoHideDuration={6000}
//         onClose={() => setSnackbar({ ...snackbar, open: false })}
//         anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
//       >
//         <Alert
//           onClose={() => setSnackbar({ ...snackbar, open: false })}
//           severity={snackbar.severity}
//           sx={{ width: "100%", borderRadius: 2 }}
//         >
//           {snackbar.message}
//         </Alert>
//       </Snackbar>
//     </Container>
//   )
// }

// export default FileUploader
