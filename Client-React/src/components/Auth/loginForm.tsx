"use client"

import React, { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom" 
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
} from "@mui/material"
import { Visibility, VisibilityOff, Email, Lock } from "@mui/icons-material"
import { loginUser } from "../../slices/userSlice"
import type { AppDispatch, RootState } from "../../store"
import AppLogo from "../logo"

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})

  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate() // שיניתי כאן
  const { loading, msg: errorMessage, isLoggedIn } = useSelector((state: RootState) => state.user)

  // Redirect if already logged in
  React.useEffect(() => {
    if (isLoggedIn) {
      navigate("/resumes") // שיניתי כאן
    }
  }, [isLoggedIn, navigate])

  const validateForm = (): boolean => {
    const newErrors: { email?: string; password?: string } = {}

    // Email validation
    if (!email) {
      newErrors.email = "נדרש להזין כתובת אימייל"
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "כתובת אימייל לא תקינה"
    }

    // Password validation
    if (!password) {
      newErrors.password = "נדרש להזין סיסמה"
    } else if (password.length < 4) {
      newErrors.password = "הסיסמה חייבת להכיל לפחות 4 תווים"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    try {
      await dispatch(loginUser({ email, password })).unwrap()
      // Successful login will redirect via the useEffect above
    } catch (error) {
      console.error("Login failed:", error)
      // Error is handled by the Redux slice and displayed via errorMessage
    }
  }

  return (
    <Paper
      elevation={3}
      sx={{
        p: 4,
        maxWidth: 450,
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
          כניסה למערכת
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1, textAlign: "center" }}>
          ברוכים הבאים למערכת ניהול השידוכים
        </Typography>
      </Box>

      {errorMessage && (
        <Alert severity="error" sx={{ mb: 3, direction: "rtl" }}>
          {errorMessage}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }} dir="rtl">
        <TextField
          margin="normal"
          required
          fullWidth
          id="email"
          label="כתובת אימייל"
          name="email"
          autoComplete="email"
          autoFocus
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
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
        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 1 }}>
          <MuiLink
            href="/auth/forgot-password"
            variant="body2"
            sx={{
              color: "#8B0000",
              textDecoration: "none",
              "&:hover": {
                textDecoration: "underline",
              },
            }}
          >
            שכחת סיסמה?
          </MuiLink>
        </Box>
        <Button
          type="submit"
          fullWidth
          variant="contained"
          disabled={loading}
          sx={{
            mt: 3,
            mb: 2,
            py: 1.5,
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
          {loading ? <CircularProgress size={24} color="inherit" /> : "כניסה"}
        </Button>

        <Divider sx={{ my: 2 }}>
          <Typography variant="body2" color="text.secondary">
            או
          </Typography>
        </Divider>

        <Box sx={{ textAlign: "center" }}>
          <Typography variant="body2">
            אין לך חשבון עדיין?{" "}
            <MuiLink
              href="/auth/register"
              sx={{
                color: "#8B0000",
                textDecoration: "none",
                fontWeight: "bold",
                "&:hover": {
                  textDecoration: "underline",
                },
              }}
            >
              הרשמה
            </MuiLink>
          </Typography>
        </Box>
      </Box>
    </Paper>
  )
}

export default LoginForm
