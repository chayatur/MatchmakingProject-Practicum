import type React from "react"
import { useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import {
  Box,
  Paper,
  Typography,
  Avatar,
  Button,
  TextField,
  Grid,
  Divider,
  Alert,
  Snackbar,
  CircularProgress,
  InputAdornment,
} from "@mui/material"
import { Person, Email, Phone, LocationOn, Edit, Save, Lock } from "@mui/icons-material"
import type { RootState, AppDispatch } from '../store'
import { updateUserProfile } from "../slices/userSlice"

const UserProfile: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { user, loading } = useSelector((state: RootState) => state.user)

  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    username: user.username || "",
    email: user.email || "",
    phone: user.phone || "",
    address: user.address || "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })

    // Clear error when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      })
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.username) {
      newErrors.username = "נדרש להזין שם משתמש"
    }

    if (!formData.email) {
      newErrors.email = "נדרש להזין כתובת אימייל"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "כתובת אימייל לא תקינה"
    }

    if (formData.phone && !/^[0-9]{9,10}$/.test(formData.phone)) {
      newErrors.phone = "מספר טלפון לא תקין"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validateForm()) return

    try {
      await dispatch(
        updateUserProfile({
          id: user.id,
          username: formData.username,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
        }),
      ).unwrap()

      setSuccessMessage("הפרופיל עודכן בהצלחה")
      setIsEditing(false)
    } catch (error) {
      console.error("Failed to update profile:", error)
    }
  }

  const handleCloseSnackbar = () => {
    setSuccessMessage(null)
  }

  // Get initials for avatar
  const getInitials = () => {
    if (user.username) {
      return user.username.charAt(0).toUpperCase()
    }
    if (user.email) {
      return user.email.charAt(0).toUpperCase()
    }
    return "U"
  }

  return (
    <Paper
      elevation={3}
      sx={{
        p: 4,
        maxWidth: 800,
        width: "100%",
        mx: "auto",
        borderRadius: 2,
        backgroundColor: "#fff",
        border: "1px solid #e5d6d6",
      }}
    >
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mb: 4 }}>
        <Avatar
          sx={{
            width: 100,
            height: 100,
            bgcolor: "#8B0000",
            fontSize: 40,
            mb: 2,
          }}
        >
          {getInitials()}
        </Avatar>
        <Typography variant="h5" sx={{ color: "#8B0000", fontWeight: "bold" }}>
          {user.username || "משתמש"}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {user.email}
        </Typography>
      </Box>

      <Divider sx={{ mb: 4 }} />

      <Box dir="rtl">
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
          <Typography variant="h6" sx={{ color: "#8B0000" }}>
            פרטים אישיים
          </Typography>
          {!isEditing ? (
            <Button
              variant="outlined"
              startIcon={<Edit />}
              onClick={() => setIsEditing(true)}
              sx={{
                borderColor: "#8B0000",
                color: "#8B0000",
                "&:hover": {
                  borderColor: "#5c0000",
                  backgroundColor: "rgba(139, 0, 0, 0.04)",
                },
              }}
            >
              ערוך פרופיל
            </Button>
          ) : (
            <Button
              variant="contained"
              startIcon={<Save />}
              onClick={handleSubmit}
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
              {loading ? <CircularProgress size={24} color="inherit" /> : "שמור שינויים"}
            </Button>
          )}
        </Box>

        {isEditing ? (
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="שם משתמש"
                name="username"
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
                label="כתובת אימייל"
                name="email"
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
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="טלפון"
                name="phone"
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
                label="כתובת"
                name="address"
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
          </Grid>
        ) : (
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Person sx={{ color: "#8B0000", mr: 1 }} />
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    שם משתמש
                  </Typography>
                  <Typography variant="body1">{user.username || "לא הוגדר"}</Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Email sx={{ color: "#8B0000", mr: 1 }} />
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    כתובת אימייל
                  </Typography>
                  <Typography variant="body1">{user.email}</Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Phone sx={{ color: "#8B0000", mr: 1 }} />
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    טלפון
                  </Typography>
                  <Typography variant="body1">{user.phone || "לא הוגדר"}</Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <LocationOn sx={{ color: "#8B0000", mr: 1 }} />
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    כתובת
                  </Typography>
                  <Typography variant="body1">{user.address || "לא הוגדר"}</Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        )}

        <Divider sx={{ my: 4 }} />

        <Box>
          <Typography variant="h6" sx={{ color: "#8B0000", mb: 2 }}>
            אבטחה
          </Typography>
          <Button
            variant="outlined"
            startIcon={<Lock />}
            href="/auth/change-password"
            sx={{
              borderColor: "#8B0000",
              color: "#8B0000",
              "&:hover": {
                borderColor: "#5c0000",
                backgroundColor: "rgba(139, 0, 0, 0.04)",
              },
            }}
          >
            שינוי סיסמה
          </Button>
        </Box>
      </Box>

      <Snackbar
        open={!!successMessage}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: "100%" }}>
          {successMessage}
        </Alert>
      </Snackbar>
    </Paper>
  )
}

export default UserProfile
