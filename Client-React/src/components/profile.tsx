import type React from "react";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
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
} from "@mui/material";
import { Person, Email, Phone, LocationOn, Edit, Save, Cancel } from "@mui/icons-material";
import type { RootState, AppDispatch } from '../store';
import { updateUserProfile } from "../slices/userSlice";
import BackToSettingsButton from "./backToSettings";
const UserProfile = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user, loading } = useSelector((state: RootState) => state.user);

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
    address: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (user && user.id) {
      setFormData({
        username: user.username || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
      });
    }
  }, [user, isEditing]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.username.trim()) {
      newErrors.username = "נדרש להזין שם משתמש";
    }

    if (!formData.email.trim()) {
      newErrors.email = "נדרש להזין כתובת אימייל";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "כתובת אימייל לא תקינה";
    }

    if (formData.phone && !/^[0-9]{9,10}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = "מספר טלפון לא תקין (9-10 ספרות)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCloseSnackbar = () => {
    setSuccessMessage(null);
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      const updatedUser = {
        id: user.id,
        username: formData.username.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim() || null,
        address: formData.address.trim() || null,
      };

      console.log("Sending update request with data:", updatedUser);

      await dispatch(updateUserProfile(updatedUser)).unwrap();

      setSuccessMessage("הפרופיל עודכן בהצלחה!");
      setIsEditing(false);
    } catch (error: any) {
      console.error("Failed to update profile:", error);
      setErrors({ general: "שגיאה בעדכון הפרופיל. אנא נסה שוב." });
    }
  };

  const handleCancel = () => {
    setFormData({
      username: user.username || "",
      email: user.email || "",
      phone: user.phone || "",
      address: user.address || "",
    });
    setErrors({});
    setIsEditing(false);
  };

  const getInitials = () => {
    if (user.username) {
      return user.username.charAt(0).toUpperCase();
    }
    if (user.email) {
      return user.email.charAt(0).toUpperCase();
    }
    return "U";
  };

  if (!user || !user.id) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress sx={{ color: "#8B0000" }} />
      </Box>
    );
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
      <BackToSettingsButton />
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
            <Box sx={{ display: "flex", gap: 1 }}>
              <Button
                variant="outlined"
                startIcon={<Cancel />}
                onClick={handleCancel}
                sx={{
                  borderColor: "#757575",
                  color: "#757575",
                  "&:hover": {
                    borderColor: "#424242",
                    backgroundColor: "rgba(117, 117, 117, 0.04)",
                  },
                }}
              >
                ביטול
              </Button>
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
            </Box>
          )}
        </Box>

        {errors.general && (
          <Alert severity="error" sx={{ mb: 3, direction: "rtl" }}>
            {errors.general}
          </Alert>
        )}

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
                required
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
                type="email"
                value={formData.email}
                onChange={handleChange}
                error={!!errors.email}
                helperText={errors.email}
                required
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
                placeholder="לדוגמה: 0501234567"
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
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {user.username || "לא הוגדר"}
                  </Typography>
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
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {user.email}
                  </Typography>
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
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {user.phone || "לא הוגדר"}
                  </Typography>
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
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {user.address || "לא הוגדר"}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        )}

        <Divider sx={{ my: 4 }} />
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
  );
};

export default UserProfile;
