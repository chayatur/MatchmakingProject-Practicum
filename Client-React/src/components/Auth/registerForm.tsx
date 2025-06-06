"use client"

import React, { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom" // שיניתי כאן
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  InputAdornment,
  IconButton,
  Divider,
  Alert,
  CircularProgress,
  Link as MuiLink,
  Stepper,
  Step,
  StepLabel,
  Grid,
  Checkbox,
  FormControlLabel,
} from "@mui/material"
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  Person,
  Phone,
  LocationOn,
  ArrowBack,
  ArrowForward,
} from "@mui/icons-material"
import { registerUser } from "../../slices/userSlice" 
import type { AppDispatch, RootState } from "../../store"
import AppLogo from "../logo"

const RegisterForm: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    username: "",
    phone: "",
    address: "",
    agreeToTerms: false,
  })
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const { loading, msg: errorMessage, isLoggedIn } = useSelector((state: RootState) => state.user)

  // Redirect if already logged in
  React.useEffect(() => {
    if (isLoggedIn) {
      navigate("/resumes") // שיניתי כאן
    }
  }, [isLoggedIn, navigate])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    })

    // Clear error when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      })
    }
  }

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {}

    if (step === 0) {
      // Validate email
      if (!formData.email) {
        newErrors.email = "נדרש להזין כתובת אימייל"
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = "כתובת אימייל לא תקינה"
      }

      // Validate password
      if (!formData.password) {
        newErrors.password = "נדרש להזין סיסמה"
      } else if (formData.password.length < 6) {
        newErrors.password = "הסיסמה חייבת להכיל לפחות 6 תווים"
      }

      // Validate password confirmation
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "הסיסמאות אינן תואמות"
      }
    } else if (step === 1) {
      // Validate username
      if (!formData.username) {
        newErrors.username = "נדרש להזין שם משתמש"
      }

      // Validate phone (optional but if provided, must be valid)
      if (formData.phone && !/^[0-9]{9,10}$/.test(formData.phone)) {
        newErrors.phone = "מספר טלפון לא תקין"
      }

      // Terms agreement
      if (!formData.agreeToTerms) {
        newErrors.agreeToTerms = "יש לאשר את תנאי השימוש"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep((prevStep) => prevStep + 1)
    }
  }

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateStep(activeStep)) {
        return;
    }

    try {
        const userData = {
            id: 0, 
            email: formData.email,
            passwordHash: formData.password, 
            username: formData.username,
            phone: formData.phone,
            address: formData.address,
        };

        await dispatch(registerUser(userData)).unwrap(); 
    } catch (error) {
        console.error("Registration failed:", error);
    }
};


  const steps = ["פרטי התחברות", "פרטים אישיים"]

  return (
    <Paper
      elevation={3}
      sx={{
        p: 4,
        maxWidth: 600,
        width: "100%",
        mx: "auto",
        borderRadius: 2,
        backgroundColor: "#fff",
        border: "1px solid #e5d6d6",
      }}
    >
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mb: 3 }}>
        <AppLogo size="large" />
        <Typography variant="h5" sx={{ mt: 2, color: "#8B0000", fontWeight: "bold" }}>
          הרשמה למערכת
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1, textAlign: "center" }}>
          צרו חשבון חדש במערכת ניהול השידוכים
        </Typography>
      </Box>

      {errorMessage && (
        <Alert severity="error" sx={{ mb: 3, direction: "rtl" }}>
          {errorMessage}
        </Alert>
      )}

      <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }} dir="rtl">
        {activeStep === 0 ? (
          <>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="כתובת אימייל"
              name="email"
              autoComplete="email"
              autoFocus
              value={formData.email}
              onChange={handleChange}
              error={!!errors.email}
              helperText={errors.email}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email sx={{ color: "#8B0000" }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "&.Mui-focused fieldset": {
                    borderColor: "#8B0000",
                  },
                },
                "& .MuiInputLabel-root.Mui-focused": {
                  color: "#8B0000",
                },
              }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="סיסמה"
              type={showPassword ? "text" : "password"}
              id="password"
              autoComplete="new-password"
              value={formData.password}
              onChange={handleChange}
              error={!!errors.password}
              helperText={errors.password}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock sx={{ color: "#8B0000" }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "&.Mui-focused fieldset": {
                    borderColor: "#8B0000",
                  },
                },
                "& .MuiInputLabel-root.Mui-focused": {
                  color: "#8B0000",
                },
              }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="confirmPassword"
              label="אימות סיסמה"
              type={showPassword ? "text" : "password"}
              id="confirmPassword"
              autoComplete="new-password"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock sx={{ color: "#8B0000" }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "&.Mui-focused fieldset": {
                    borderColor: "#8B0000",
                  },
                },
                "& .MuiInputLabel-root.Mui-focused": {
                  color: "#8B0000",
                },
              }}
            />
          </>
        ) : (
          <>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="username"
                  label="שם משתמש"
                  name="username"
                  autoComplete="name"
                  value={formData.username}
                  onChange={handleChange}
                  error={!!errors.username}
                  helperText={errors.username}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person sx={{ color: "#8B0000" }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "&.Mui-focused fieldset": {
                        borderColor: "#8B0000",
                      },
                    },
                    "& .MuiInputLabel-root.Mui-focused": {
                      color: "#8B0000",
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="phone"
                  label="טלפון"
                  name="phone"
                  autoComplete="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  error={!!errors.phone}
                  helperText={errors.phone}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Phone sx={{ color: "#8B0000" }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "&.Mui-focused fieldset": {
                        borderColor: "#8B0000",
                      },
                    },
                    "& .MuiInputLabel-root.Mui-focused": {
                      color: "#8B0000",
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="address"
                  label="כתובת"
                  name="address"
                  autoComplete="address"
                  value={formData.address}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LocationOn sx={{ color: "#8B0000" }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "&.Mui-focused fieldset": {
                        borderColor: "#8B0000",
                      },
                    },
                    "& .MuiInputLabel-root.Mui-focused": {
                      color: "#8B0000",
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox
                      name="agreeToTerms"
                      checked={formData.agreeToTerms}
                      onChange={handleChange}
                      sx={{
                        color: "#8B0000",
                        "&.Mui-checked": {
                          color: "#8B0000",
                        },
                      }}
                    />
                  }
                  label="אני מסכים/ה לתנאי השימוש ומדיניות הפרטיות"
                  sx={{ color: errors.agreeToTerms ? "error.main" : "inherit" }}
                />
                {errors.agreeToTerms && (
                  <Typography variant="caption" color="error" sx={{ display: "block", mt: 0.5 }}>
                    {errors.agreeToTerms}
                  </Typography>
                )}
              </Grid>
            </Grid>
          </>
        )}

        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
          {activeStep > 0 ? (
            <Button
              onClick={handleBack}
              startIcon={<ArrowForward />}
              sx={{
                color: "#8B0000",
                "&:hover": {
                  backgroundColor: "rgba(139, 0, 0, 0.04)",
                },
              }}
            >
              חזרה
            </Button>
          ) : (
            <Box />
          )}

          {activeStep === steps.length - 1 ? (
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              sx={{
                backgroundColor: "#8B0000",
                color: "white",
                "&:hover": {
                  backgroundColor: "#5c0000",
                },
                "&.Mui-disabled": {
                  backgroundColor: "#d7a3a3",
                },
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : "הרשמה"}
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              endIcon={<ArrowBack />}
              variant="contained"
              sx={{
                backgroundColor: "#8B0000",
                color: "white",
                "&:hover": {
                  backgroundColor: "#5c0000",
                },
              }}
            >
              המשך
            </Button>
          )}
        </Box>

        <Divider sx={{ my: 3 }}>
          <Typography variant="body2" color="text.secondary">
            או
          </Typography>
        </Divider>

        <Box sx={{ textAlign: "center" }}>
          <Typography variant="body2">
            כבר יש לך חשבון?{" "}
            <MuiLink
              href="/auth/login"
              sx={{
                color: "#8B0000",
                textDecoration: "none",
                fontWeight: "bold",
                "&:hover": {
                  textDecoration: "underline",
                },
              }}
            >
              התחברות
            </MuiLink>
          </Typography>
        </Box>
      </Box>
    </Paper>
  )
}

export default RegisterForm
// "use client"

// import React, { useState, useEffect } from "react"
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
//   Link as MuiLink,
// } from "@mui/material"
// import {
//   Visibility,
//   VisibilityOff,
//   Email,
//   Lock,
//   Person,
//   Phone,
//   Home,
// } from "@mui/icons-material"
// import { registerUser } from "../../slices/userSlice"
// import type { AppDispatch, RootState } from "../../store"
// import AppLogo from "../logo"

// interface RegisterFormData {
//   username: string
//   email: string
//   passwordHash: string
//   address: string
//   phone: string
// }

// const RegisterForm: React.FC = () => {
//   const [formData, setFormData] = useState<RegisterFormData>({
//     username: "",
//     email: "",
//     passwordHash: "",
//     address: "",
//     phone: "",
//   })
//   const [showPassword, setShowPassword] = useState(false)
//   const [errors, setErrors] = useState<Partial<RegisterFormData>>({})

//   const dispatch = useDispatch<AppDispatch>()
//   const navigate = useNavigate()
//   const { loading, msg: errorMessage, isLoggedIn } = useSelector(
//     (state: RootState) => state.user
//   )

//   // Redirect if already logged in
//   useEffect(() => {
//     if (isLoggedIn) {
//       navigate("/resumes")
//     }
//   }, [isLoggedIn, navigate])

//   const validateForm = (): boolean => {
//     const newErrors: Partial<RegisterFormData> = {}

//     // Username validation
//     if (!formData.username.trim()) {
//       newErrors.username = "נדרש להזין שם משתמש"
//     } else if (formData.username.length < 2) {
//       newErrors.username = "שם המשתמש חייב להכיל לפחות 2 תווים"
//     }

//     // Email validation
//     if (!formData.email) {
//       newErrors.email = "נדרש להזין כתובת אימייל"
//     } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
//       newErrors.email = "כתובת אימייל לא תקינה"
//     }

//     // Password validation
//     if (!formData.passwordHash) {
//       newErrors.passwordHash = "נדרש להזין סיסמה"
//     } else if (formData.passwordHash.length < 4) {
//       newErrors.passwordHash = "הסיסמה חייבת להכיל לפחות 4 תווים"
//     }

//     // Phone validation (optional but if provided should be valid)
//     if (formData.phone && !/^[\d\-\+\(\)\s]+$/.test(formData.phone)) {
//       newErrors.phone = "מספר טלפון לא תקין"
//     }

//     setErrors(newErrors)
//     return Object.keys(newErrors).length === 0
//   }

//   const handleInputChange = (field: keyof RegisterFormData) => (
//     e: React.ChangeEvent<HTMLInputElement>
//   ) => {
//     setFormData(prev => ({
//       ...prev,
//       [field]: e.target.value,
//     }))
//     // Clear error for this field when user starts typing
//     if (errors[field]) {
//       setErrors(prev => ({
//         ...prev,
//         [field]: undefined,
//       }))
//     }
//   }

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()

//     if (!validateForm()) {
//       return
//     }

//     try {
//       // Create user object matching the server expectations
//       const userData = {
//         id: 0, // Server will assign ID
//         username: formData.username,
//         email: formData.email,
//         passwordHash: formData.passwordHash,
//         address: formData.address || undefined,
//         phone: formData.phone || undefined,
//       }

//       await dispatch(registerUser(userData)).unwrap()
//       // Successful registration will redirect via the useEffect above
//     } catch (error) {
//       console.error("Registration failed:", error)
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
//           הרשמה למערכת
//         </Typography>
//         <Typography variant="body2" color="text.secondary" sx={{ mt: 1, textAlign: "center" }}>
//           הצטרפו למערכת ניהול השידוכים המתקדמת
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
//           id="username"
//           label="שם משתמש"
//           name="username"
//           autoComplete="username"
//           autoFocus
//           value={formData.username}
//           onChange={handleInputChange("username")}
//           error={!!errors.username}
//           helperText={errors.username}
//           InputProps={{
//             startAdornment: (
//               <InputAdornment position="start">
//                 <Person sx={{ color: "#8B0000" }} />
//               </InputAdornment>
//             ),
//           }}
//           sx={{
//             "& .MuiOutlinedInput-root": {
//               "&.Mui-focused fieldset": {
//                 borderColor: "#8B0000",
//               },
//             },
//             "& .MuiInputLabel-root.Mui-focused": {
//               color: "#8B0000",
//             },
//           }}
//         />
        
//         <TextField
//           margin="normal"
//           required
//           fullWidth
//           id="email"
//           label="כתובת אימייל"
//           name="email"
//           autoComplete="email"
//           value={formData.email}
//           onChange={handleInputChange("email")}
//           error={!!errors.email}
//           helperText={errors.email}
//           InputProps={{
//             startAdornment: (
//               <InputAdornment position="start">
//                 <Email sx={{ color: "#8B0000" }} />
//               </InputAdornment>
//             ),
//           }}
//           sx={{
//             "& .MuiOutlinedInput-root": {
//               "&.Mui-focused fieldset": {
//                 borderColor: "#8B0000",
//               },
//             },
//             "& .MuiInputLabel-root.Mui-focused": {
//               color: "#8B0000",
//             },
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
//           autoComplete="new-password"
//           value={formData.passwordHash}
//           onChange={handleInputChange("passwordHash")}
//           error={!!errors.passwordHash}
//           helperText={errors.passwordHash}
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
//           sx={{
//             "& .MuiOutlinedInput-root": {
//               "&.Mui-focused fieldset": {
//                 borderColor: "#8B0000",
//               },
//             },
//             "& .MuiInputLabel-root.Mui-focused": {
//               color: "#8B0000",
//             },
//           }}
//         />

//         <TextField
//           margin="normal"
//           fullWidth
//           id="phone"
//           label="מספר טלפון (אופציונלי)"
//           name="phone"
//           autoComplete="tel"
//           value={formData.phone}
//           onChange={handleInputChange("phone")}
//           error={!!errors.phone}
//           helperText={errors.phone}
//           InputProps={{
//             startAdornment: (
//               <InputAdornment position="start">
//                 <Phone sx={{ color: "#8B0000" }} />
//               </InputAdornment>
//             ),
//           }}
//           sx={{
//             "& .MuiOutlinedInput-root": {
//               "&.Mui-focused fieldset": {
//                 borderColor: "#8B0000",
//               },
//             },
//             "& .MuiInputLabel-root.Mui-focused": {
//               color: "#8B0000",
//             },
//           }}
//         />

//         <TextField
//           margin="normal"
//           fullWidth
//           id="address"
//           label="כתובת (אופציונלי)"
//           name="address"
//           autoComplete="address-line1"
//           value={formData.address}
//           onChange={handleInputChange("address")}
//           error={!!errors.address}
//           helperText={errors.address}
//           InputProps={{
//             startAdornment: (
//               <InputAdornment position="start">
//                 <Home sx={{ color: "#8B0000" }} />
//               </InputAdornment>
//             ),
//           }}
//           sx={{
//             "& .MuiOutlinedInput-root": {
//               "&.Mui-focused fieldset": {
//                 borderColor: "#8B0000",
//               },
//             },
//             "& .MuiInputLabel-root.Mui-focused": {
//               color: "#8B0000",
//             },
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
//             py: 1.5,
//             backgroundColor: "#8B0000",
//             color: "white",
//             "&:hover": {
//               backgroundColor: "#5c0000",
//             },
//             "&.Mui-disabled": {
//               backgroundColor: "#d7a3a3",
//             },
//           }}
//         >
//           {loading ? <CircularProgress size={24} color="inherit" /> : "הרשמה"}
//         </Button>

//         <Box sx={{ textAlign: "center" }}>
//           <Typography variant="body2">
//             כבר יש לך חשבון?{" "}
//             <MuiLink
//               href="/auth/login"
//               sx={{
//                 color: "#8B0000",
//                 textDecoration: "none",
//                 fontWeight: "bold",
//                 "&:hover": {
//                   textDecoration: "underline",
//                 },
//               }}
//             >
//               כניסה למערכת
//             </MuiLink>
//           </Typography>
//         </Box>
//       </Box>
//     </Paper>
//   )
// }

// export default RegisterForm