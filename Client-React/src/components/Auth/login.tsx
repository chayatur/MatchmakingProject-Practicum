// // import React from 'react';
// // import { useForm } from 'react-hook-form';
// // import { yupResolver } from '@hookform/resolvers/yup';
// // import * as Yup from 'yup';
// // import { TextField, Button, CircularProgress, Typography } from '@mui/material';
// // import { useDispatch, useSelector } from 'react-redux';
// // import { loginUser } from '../../slices/userSlice';
// // import { useNavigate } from 'react-router-dom';
// // import { AppDispatch, RootState } from '../../store';

// // // הגדרת סכמת האימות
// // const validationSchema = Yup.object().shape({
// //     email: Yup.string().email('מייל לא תקין').required('מייל הוא שדה חובה'),
// //     password: Yup.string().required('סיסמה היא שדה חובה'),
// // });

// // const LoginForm = () => {
// //     const dispatch = useDispatch<AppDispatch>();
// //     const navigate = useNavigate();
// //     const { loading, msg } = useSelector((state: RootState) => state.user);

// //     const { register, handleSubmit, formState: { errors } } = useForm({
// //         resolver: yupResolver(validationSchema),
// //     });

// //     const handleLogin = async (formData: { email: string; password: string; }) => {
// //         const resultAction = await dispatch(loginUser(formData));
// //         if (loginUser.fulfilled.match(resultAction)) {
// //             // אם הכניסה הצליחה, נווט לדף הבא
// //             navigate("/FileUploader");
// //         } else {
// //             // טיפול בשגיאה במקרה שהכניסה נכשלה
// //             const errorMsg = resultAction.error.message || 'שגיאה בכניסה, נסה שוב.';
// //             // כאן אפשר גם לעדכן את הודעת השגיאה ב-state של Redux אם יש צורך
// //         }
// //     };

// //     return (
// //         <form onSubmit={handleSubmit(handleLogin)}>
// //             <TextField
// //                 label="מייל"
// //                 {...register('email')}
// //                 error={!!errors.email}
// //                 helperText={errors.email?.message}
// //                 fullWidth
// //                 margin="normal"
// //             />
// //             <TextField
// //                 label="סיסמה"
// //                 type="password"
// //                 {...register('password')}
// //                 error={!!errors.password}
// //                 helperText={errors.password?.message}
// //                 fullWidth
// //                 margin="normal"
// //             />
// //             <Button type="submit" variant="contained" color="primary" disabled={loading}>
// //                 {loading ? <CircularProgress size={24} color="inherit" /> : 'שלח'}
// //             </Button>
// //             {msg && <Typography color="error">{msg}</Typography>} {/* הודעת שגיאה */}
// //         </form>
// //     );
// // };

// // export default LoginForm;

// import React, { useState } from "react"
// import { useDispatch, useSelector } from "react-redux"
// import { useNavigate } from "react-router-dom"
// import {
//   Box,
//   TextField,
//   Button,
//   Typography,
//   Paper,
//   InputAdornment,
//   IconButton,
//   Alert,
//   CircularProgress,
// } from "@mui/material"
// import { Visibility, VisibilityOff, Email, Lock } from "@mui/icons-material"
// import { loginUser } from "../../slices/userSlice"
// import { AppDispatch, RootState } from "../../store"
// import AppLogo from "../logo"

// const LoginForm: React.FC = () => {
//   const [email, setEmail] = useState("")
//   const [password, setPassword] = useState("")
//   const [showPassword, setShowPassword] = useState(false)
//   const [errors, setErrors] = useState<{ email?: string; password?: string }>({})

//   const dispatch = useDispatch<AppDispatch>()
//   const navigate = useNavigate()
//   const { loading, msg: errorMessage, isLoggedIn } = useSelector((state: RootState) => state.user)

//   // Redirect if already logged in
//   React.useEffect(() => {
//     if (isLoggedIn) {
//       navigate("/resumes")
//     }
//   }, [isLoggedIn, navigate])

//   const validateForm = (): boolean => {
//     const newErrors: { email?: string; password?: string } = {}

//     // Email validation
//     if (!email) {
//       newErrors.email = "נדרש להזין כתובת אימייל"
//     } else if (!/\S+@\S+\.\S+/.test(email)) {
//       newErrors.email = "כתובת אימייל לא תקינה"
//     }

//     // Password validation
//     if (!password) {
//       newErrors.password = "נדרש להזין סיסמה"
//     } else if (password.length < 4) {
//       newErrors.password = "הסיסמה חייבת להכיל לפחות 4 תווים"
//     }

//     setErrors(newErrors)
//     return Object.keys(newErrors).length === 0
//   }

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()

//     if (!validateForm()) {
//       return
//     }

//     try {
//       await dispatch(loginUser({ email, password })).unwrap()
//       // Successful login will redirect via the useEffect above
//     } catch (error) {
//       console.error("Login failed:", error)
//       // Error is handled by the Redux slice and displayed via errorMessage
//     }
//   }

//   return (
//     <Paper
//       elevation={3}
//       sx={{
//         p: 4,
//         maxWidth: 450,
//         width: "100%",
//         mx: "auto",
//         borderRadius: 2,
//         backgroundColor: "#fff",
//         border: "1px solid #e5d6d6",
//       }}
//     >
//       <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mb: 3 }}>
//         <AppLogo size="large" />
//         <Typography variant="h5" sx={{ mt: 2, color: "#8B0000", fontWeight: "bold" }}>
//           כניסה למערכת
//         </Typography>
//       </Box>

//       {errorMessage && (
//         <Alert severity="error" sx={{ mb: 3, direction: "rtl" }}>
//           {errorMessage}
//         </Alert>
//       )}

//       <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }} dir="rtl">
//         <TextField
//           margin="normal"
//           required
//           fullWidth
//           id="email"
//           label="כתובת אימייל"
//           name="email"
//           autoComplete="email"
//           autoFocus
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           error={!!errors.email}
//           helperText={errors.email}
//           InputProps={{
//             startAdornment: (
//               <InputAdornment position="start">
//                 <Email sx={{ color: "#8B0000" }} />
//               </InputAdornment>
//             ),
//           }}
//         />
//         <TextField
//           margin="normal"
//           required
//           fullWidth
//           name="password"
//           label="סיסמה"
//           type={showPassword ? "text" : "password"}
//           id="password"
//           autoComplete="current-password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           error={!!errors.password}
//           helperText={errors.password}
//           InputProps={{
//             startAdornment: (
//               <InputAdornment position="start">
//                 <Lock sx={{ color: "#8B0000" }} />
//               </InputAdornment>
//             ),
//             endAdornment: (
//               <InputAdornment position="end">
//                 <IconButton
//                   aria-label="toggle password visibility"
//                   onClick={() => setShowPassword(!showPassword)}
//                   edge="end"
//                 >
//                   {showPassword ? <VisibilityOff /> : <Visibility />}
//                 </IconButton>
//               </InputAdornment>
//             ),
//           }}
//         />
//         <Button
//           type="submit"
//           fullWidth
//           variant="contained"
//           disabled={loading}
//           sx={{
//             mt: 3,
//             mb: 2,
//             backgroundColor: "#8B0000",
//             color: "white",
//           }}
//         >
//           {loading ? <CircularProgress size={24} color="inherit" /> : "כניסה"}
//         </Button>
//       </Box>
//     </Paper>
//   )
// }

// export default LoginForm
"use client"

import React, { useEffect } from "react"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom" // שיניתי כאן
import { Container, Box } from "@mui/material"
import LoginForm from "./loginForm"
import type { RootState } from "../../store"

const LoginPage: React.FC = () => {
  const navigate = useNavigate() // שיניתי כאן
  const { isLoggedIn } = useSelector((state: RootState) => state.user)

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/resumes") // שיניתי כאן
    }
  }, [isLoggedIn, navigate])

  return (
    <Container maxWidth="sm">
      <Box sx={{ py: 8 }}>
        <LoginForm />
      </Box>
    </Container>
  )
}

export default LoginPage
