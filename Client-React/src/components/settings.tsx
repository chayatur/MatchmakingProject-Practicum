
import type React from "react"
import { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import {
  Container,
  Typography,
  Box,
  Paper,
  Switch,
  FormControlLabel,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  Alert,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  IconButton,
  Tooltip,
  Avatar,
  LinearProgress,
} from "@mui/material"
import {
  Settings as SettingsIcon,
  Notifications as NotificationsIcon,
  Security as SecurityIcon,
  Palette as PaletteIcon,
  Language as LanguageIcon,
  Storage as StorageIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  ArrowBack as ArrowBackIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  VpnKey as VpnKeyIcon,
  Email as EmailIcon,
  Sms as SmsIcon,
  DarkMode as DarkModeIcon,
  Download as DownloadIcon,
} from "@mui/icons-material"
import type { RootState } from "../store"
import "../styles/setting.css"

interface UserSettings {
  notifications: {
    email: boolean
    sms: boolean
    push: boolean
    newMatches: boolean
    messages: boolean
    systemUpdates: boolean
  }
  privacy: {
    profileVisibility: "public" | "private" | "friends"
    showOnlineStatus: boolean
    allowDirectMessages: boolean
    dataCollection: boolean
  }
  appearance: {
    theme: "light" | "dark" | "auto"
    language: "he" | "en" | "ar"
    fontSize: "small" | "medium" | "large"
  }
  account: {
    twoFactorAuth: boolean
    loginAlerts: boolean
    sessionTimeout: number
  }
}

const SettingsPage: React.FC = () => {
  // const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const { user, isLoggedIn } = useSelector((state: RootState) => state.user)

  const [activeTab, setActiveTab] = useState("general")
  const [settings, setSettings] = useState<UserSettings>({
    notifications: {
      email: true,
      sms: false,
      push: true,
      newMatches: true,
      messages: true,
      systemUpdates: false,
    },
    privacy: {
      profileVisibility: "public",
      showOnlineStatus: true,
      allowDirectMessages: true,
      dataCollection: false,
    },
    appearance: {
      theme: "light",
      language: "he",
      fontSize: "medium",
    },
    account: {
      twoFactorAuth: false,
      loginAlerts: true,
      sessionTimeout: 30,
    },
  })

  const [loading, setLoading] = useState(false)
  const [snackbar, setSnackbar] = useState<{
    open: boolean
    message: string
    severity: "success" | "error" | "info"
  }>({
    open: false,
    message: "",
    severity: "success",
  })
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [exportDialogOpen, setExportDialogOpen] = useState(false)
  const [deleteConfirmText, setDeleteConfirmText] = useState("")

  // Load user settings on component mount
  useEffect(() => {
    if (isLoggedIn && user.id) {
      loadUserSettings()
    }
  }, [isLoggedIn, user.id])

  const loadUserSettings = async () => {
    try {
      const savedSettings = localStorage.getItem(`settings_${user.id}`)
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings))
      }
    } catch (error) {
      console.error("Failed to load settings:", error)
    }
  }

  const handleSettingChange = (category: keyof UserSettings, key: string, value: any) => {
    setSettings((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value,
      },
    }))
  }

  const handleSaveSettings = async () => {
    setLoading(true)
    try {
      localStorage.setItem(`settings_${user.id}`, JSON.stringify(settings))
      setSnackbar({
        open: true,
        message: "ההגדרות נשמרו בהצלחה!",
        severity: "success",
      })
    } catch (error) {
      setSnackbar({
        open: true,
        message: "שגיאה בשמירת ההגדרות",
        severity: "error",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleExportData = async () => {
    try {
      const userData = {
        profile: user,
        settings: settings,
        exportDate: new Date().toISOString(),
      }

      const blob = new Blob([JSON.stringify(userData, null, 2)], {
        type: "application/json",
      })

      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `my-data-${new Date().toISOString().split("T")[0]}.json`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      setExportDialogOpen(false)
      setSnackbar({
        open: true,
        message: "הנתונים יוצאו בהצלחה!",
        severity: "success",
      })
    } catch (error) {
      setSnackbar({
        open: true,
        message: "שגיאה בייצוא הנתונים",
        severity: "error",
      })
    }
  }

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== "מחק את החשבון שלי") {
      setSnackbar({
        open: true,
        message: "יש להקליד את הטקסט בדיוק כפי שמופיע",
        severity: "error",
      })
      return
    }

    try {
      setSnackbar({
        open: true,
        message: "החשבון נמחק בהצלחה",
        severity: "info",
      })
      setDeleteDialogOpen(false)
      setTimeout(() => {
        navigate("/")
      }, 2000)
    } catch (error) {
      setSnackbar({
        open: true,
        message: "שגיאה במחיקת החשבון",
        severity: "error",
      })
    }
  }

  const getInitials = () => {
    if (user.username) {
      return user.username.charAt(0).toUpperCase()
    }
    if (user.email) {
      return user.email.charAt(0).toUpperCase()
    }
    return "U"
  }

  if (!isLoggedIn) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Paper elevation={3} sx={{ p: 4, textAlign: "center" }}>
          <Typography variant="h5" color="#8B0000" gutterBottom>
            יש להתחבר למערכת כדי לגשת להגדרות
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate("/login")}
            sx={{
              mt: 2,
              backgroundColor: "#8B0000",
              "&:hover": { backgroundColor: "#5c0000" },
            }}
          >
            התחבר למערכת
          </Button>
        </Paper>
      </Container>
    )
  }

  const tabs = [
    { id: "general", label: "כללי", icon: <SettingsIcon /> },
    { id: "notifications", label: "התראות", icon: <NotificationsIcon /> },
    { id: "privacy", label: "פרטיות", icon: <SecurityIcon /> },
    { id: "appearance", label: "תצוגה", icon: <PaletteIcon /> },
    { id: "account", label: "חשבון", icon: <VpnKeyIcon /> },
  ]

  return (
    <div className="settings-container">
      {/* Header */}
      <div className="settings-header">
        <Container maxWidth="lg">
          <Box sx={{ display: "flex", alignItems: "center", gap: 3, mb: 2 }}>
            <Tooltip title="חזור">
              <IconButton onClick={() => navigate(-1)} sx={{ color: "white" }}>
                <ArrowBackIcon />
              </IconButton>
            </Tooltip>
            <Avatar
              sx={{
                width: 72,
                height: 72,
                bgcolor: "rgba(255, 255, 255, 0.2)",
                fontSize: "1.8rem",
                fontWeight: "bold",
                border: "3px solid rgba(255, 255, 255, 0.3)",
                boxShadow: "0 4px 16px rgba(0, 0, 0, 0.2)",
              }}
            >
              {getInitials()}
            </Avatar>
            <Box>
              <Typography className="welcome-text">
                שלום {user.username || "משתמש"}, ברוך הבא לאזור ההגדרות! 👋
              </Typography>
              <Typography className="settings-title">הגדרות מתקדמות</Typography>
              <Typography className="settings-subtitle">
                התאם את המערכת בדיוק לפי הצרכים והעדפות שלך במערכת השידוכים המתקדמת
              </Typography>
            </Box>
          </Box>
        </Container>
      </div>

      {/* Content */}
      <div className="settings-content">
        <Container maxWidth="lg">
          {/* Tabs */}
          <div className="settings-tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`tab-button ${activeTab === tab.id ? "active" : ""}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.icon}
                <span style={{ marginRight: 8 }}>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* General Settings */}
          {activeTab === "general" && (
            <div className="slide-in">
              <div className="settings-section">
                <div className="section-header">
                  <div className="section-icon">
                    <SettingsIcon />
                  </div>
                  <div>
                    <h2 className="section-title">הגדרות כלליות</h2>
                    <p className="section-description">הגדרות בסיסיות לחשבון שלך</p>
                  </div>
                </div>

                <div className="settings-grid">
                  <div className="setting-item">
                    <div className="setting-label">
                      <InfoIcon sx={{ color: "#8B0000" }} />
                      פרטי פרופיל
                    </div>
                    <div className="setting-description">עדכן את הפרטים האישיים שלך</div>
                    <Button
                      variant="outlined"
                      onClick={() => navigate("/profile")}
                      sx={{
                        borderColor: "#8B0000",
                        color: "#8B0000",
                        "&:hover": {
                          borderColor: "#5c0000",
                          backgroundColor: "rgba(139, 0, 0, 0.04)",
                        },
                      }}
                    >
                      עדכן פרופיל
                    </Button>
                  </div>

                  <div className="setting-item">
                    <div className="setting-label">
                      <StorageIcon sx={{ color: "#8B0000" }} />
                      ניהול נתונים
                    </div>
                    <div className="setting-description">ייצא או מחק את הנתונים שלך</div>
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <Button
                        variant="outlined"
                        startIcon={<DownloadIcon />}
                        onClick={() => setExportDialogOpen(true)}
                        sx={{
                          borderColor: "#8B0000",
                          color: "#8B0000",
                          "&:hover": {
                            borderColor: "#5c0000",
                            backgroundColor: "rgba(139, 0, 0, 0.04)",
                          },
                        }}
                      >
                        ייצא נתונים
                      </Button>
                    </Box>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Notifications Settings */}
          {activeTab === "notifications" && (
            <div className="slide-in">
              <div className="settings-section">
                <div className="section-header">
                  <div className="section-icon">
                    <NotificationsIcon />
                  </div>
                  <div>
                    <h2 className="section-title">הגדרות התראות</h2>
                    <p className="section-description">בחר איך ומתי תרצה לקבל התראות</p>
                  </div>
                </div>

                <div className="settings-grid">
                  <div className="setting-item">
                    <div className="setting-label">
                      <EmailIcon sx={{ color: "#8B0000" }} />
                      התראות אימייל
                    </div>
                    <div className="setting-description">קבל התראות באימייל על פעילות חשובה</div>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={settings.notifications.email}
                          onChange={(e) => handleSettingChange("notifications", "email", e.target.checked)}
                          sx={{
                            "& .MuiSwitch-switchBase.Mui-checked": {
                              color: "#8B0000",
                            },
                            "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                              backgroundColor: "#8B0000",
                            },
                          }}
                        />
                      }
                      label=""
                    />
                  </div>

                  <div className="setting-item">
                    <div className="setting-label">
                      <SmsIcon sx={{ color: "#8B0000" }} />
                      התראות SMS
                    </div>
                    <div className="setting-description">קבל התראות בהודעות טקסט</div>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={settings.notifications.sms}
                          onChange={(e) => handleSettingChange("notifications", "sms", e.target.checked)}
                          sx={{
                            "& .MuiSwitch-switchBase.Mui-checked": {
                              color: "#8B0000",
                            },
                            "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                              backgroundColor: "#8B0000",
                            },
                          }}
                        />
                      }
                      label=""
                    />
                  </div>

                  <div className="setting-item">
                    <div className="setting-label">
                      <NotificationsIcon sx={{ color: "#8B0000" }} />
                      התראות דחיפה
                    </div>
                    <div className="setting-description">קבל התראות ישירות בדפדפן</div>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={settings.notifications.push}
                          onChange={(e) => handleSettingChange("notifications", "push", e.target.checked)}
                          sx={{
                            "& .MuiSwitch-switchBase.Mui-checked": {
                              color: "#8B0000",
                            },
                            "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                              backgroundColor: "#8B0000",
                            },
                          }}
                        />
                      }
                      label=""
                    />
                  </div>

                  <div className="setting-item">
                    <div className="setting-label">התראות על התאמות חדשות</div>
                    <div className="setting-description">קבל התראה כאשר נמצאות התאמות חדשות</div>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={settings.notifications.newMatches}
                          onChange={(e) => handleSettingChange("notifications", "newMatches", e.target.checked)}
                          sx={{
                            "& .MuiSwitch-switchBase.Mui-checked": {
                              color: "#8B0000",
                            },
                            "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                              backgroundColor: "#8B0000",
                            },
                          }}
                        />
                      }
                      label=""
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Privacy Settings */}
          {activeTab === "privacy" && (
            <div className="slide-in">
              <div className="settings-section">
                <div className="section-header">
                  <div className="section-icon">
                    <SecurityIcon />
                  </div>
                  <div>
                    <h2 className="section-title">הגדרות פרטיות</h2>
                    <p className="section-description">שלוט על הפרטיות והנראות שלך במערכת</p>
                  </div>
                </div>

                <div className="settings-grid">
                  <div className="setting-item">
                    <div className="setting-label">נראות פרופיל</div>
                    <div className="setting-description">בחר מי יכול לראות את הפרופיל שלך</div>
                    <FormControl fullWidth>
                      <Select
                        value={settings.privacy.profileVisibility}
                        onChange={(e) => handleSettingChange("privacy", "profileVisibility", e.target.value)}
                        sx={{
                          "& .MuiOutlinedInput-notchedOutline": {
                            borderColor: "rgba(139, 0, 0, 0.2)",
                          },
                          "&:hover .MuiOutlinedInput-notchedOutline": {
                            borderColor: "rgba(139, 0, 0, 0.4)",
                          },
                          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                            borderColor: "#8B0000",
                          },
                        }}
                      >
                        <MenuItem value="public">ציבורי - כולם יכולים לראות</MenuItem>
                        <MenuItem value="private">פרטי - רק אני יכול לראות</MenuItem>
                        <MenuItem value="friends">חברים - רק חברים יכולים לראות</MenuItem>
                      </Select>
                    </FormControl>
                  </div>

                  <div className="setting-item">
                    <div className="setting-label">הצג סטטוס מקוון</div>
                    <div className="setting-description">אפשר למשתמשים אחרים לראות שאתה מקוון</div>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={settings.privacy.showOnlineStatus}
                          onChange={(e) => handleSettingChange("privacy", "showOnlineStatus", e.target.checked)}
                          sx={{
                            "& .MuiSwitch-switchBase.Mui-checked": {
                              color: "#8B0000",
                            },
                            "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                              backgroundColor: "#8B0000",
                            },
                          }}
                        />
                      }
                      label=""
                    />
                  </div>

                  <div className="setting-item">
                    <div className="setting-label">אפשר הודעות ישירות</div>
                    <div className="setting-description">אפשר למשתמשים אחרים לשלוח לך הודעות ישירות</div>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={settings.privacy.allowDirectMessages}
                          onChange={(e) => handleSettingChange("privacy", "allowDirectMessages", e.target.checked)}
                          sx={{
                            "& .MuiSwitch-switchBase.Mui-checked": {
                              color: "#8B0000",
                            },
                            "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                              backgroundColor: "#8B0000",
                            },
                          }}
                        />
                      }
                      label=""
                    />
                  </div>

                  <div className="setting-item">
                    <div className="setting-label">איסוף נתונים לשיפור השירות</div>
                    <div className="setting-description">אפשר איסוף נתונים אנונימיים לשיפור המערכת</div>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={settings.privacy.dataCollection}
                          onChange={(e) => handleSettingChange("privacy", "dataCollection", e.target.checked)}
                          sx={{
                            "& .MuiSwitch-switchBase.Mui-checked": {
                              color: "#8B0000",
                            },
                            "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                              backgroundColor: "#8B0000",
                            },
                          }}
                        />
                      }
                      label=""
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Appearance Settings */}
          {activeTab === "appearance" && (
            <div className="slide-in">
              <div className="settings-section">
                <div className="section-header">
                  <div className="section-icon">
                    <PaletteIcon />
                  </div>
                  <div>
                    <h2 className="section-title">הגדרות תצוגה</h2>
                    <p className="section-description">התאם את המראה והתחושה של המערכת</p>
                  </div>
                </div>

                <div className="settings-grid">
                  <div className="setting-item">
                    <div className="setting-label">
                      <DarkModeIcon sx={{ color: "#8B0000" }} />
                      ערכת נושא
                    </div>
                    <div className="setting-description">בחר בין מצב בהיר, כהה או אוטומטי</div>
                    <FormControl fullWidth>
                      <Select
                        value={settings.appearance.theme}
                        onChange={(e) => handleSettingChange("appearance", "theme", e.target.value)}
                        sx={{
                          "& .MuiOutlinedInput-notchedOutline": {
                            borderColor: "rgba(139, 0, 0, 0.2)",
                          },
                          "&:hover .MuiOutlinedInput-notchedOutline": {
                            borderColor: "rgba(139, 0, 0, 0.4)",
                          },
                          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                            borderColor: "#8B0000",
                          },
                        }}
                      >
                        <MenuItem value="light">בהיר</MenuItem>
                        <MenuItem value="dark">כהה</MenuItem>
                        <MenuItem value="auto">אוטומטי</MenuItem>
                      </Select>
                    </FormControl>
                  </div>

                  <div className="setting-item">
                    <div className="setting-label">
                      <LanguageIcon sx={{ color: "#8B0000" }} />
                      שפה
                    </div>
                    <div className="setting-description">בחר את שפת הממשק</div>
                    <FormControl fullWidth>
                      <Select
                        value={settings.appearance.language}
                        onChange={(e) => handleSettingChange("appearance", "language", e.target.value)}
                        sx={{
                          "& .MuiOutlinedInput-notchedOutline": {
                            borderColor: "rgba(139, 0, 0, 0.2)",
                          },
                          "&:hover .MuiOutlinedInput-notchedOutline": {
                            borderColor: "rgba(139, 0, 0, 0.4)",
                          },
                          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                            borderColor: "#8B0000",
                          },
                        }}
                      >
                        <MenuItem value="he">עברית</MenuItem>
                        <MenuItem value="en">English</MenuItem>
                        <MenuItem value="ar">العربية</MenuItem>
                      </Select>
                    </FormControl>
                  </div>

                  <div className="setting-item">
                    <div className="setting-label">גודל גופן</div>
                    <div className="setting-description">בחר את גודל הטקסט המועדף עליך</div>
                    <FormControl fullWidth>
                      <Select
                        value={settings.appearance.fontSize}
                        onChange={(e) => handleSettingChange("appearance", "fontSize", e.target.value)}
                        sx={{
                          "& .MuiOutlinedInput-notchedOutline": {
                            borderColor: "rgba(139, 0, 0, 0.2)",
                          },
                          "&:hover .MuiOutlinedInput-notchedOutline": {
                            borderColor: "rgba(139, 0, 0, 0.4)",
                          },
                          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                            borderColor: "#8B0000",
                          },
                        }}
                      >
                        <MenuItem value="small">קטן</MenuItem>
                        <MenuItem value="medium">בינוני</MenuItem>
                        <MenuItem value="large">גדול</MenuItem>
                      </Select>
                    </FormControl>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Account Settings */}
          {activeTab === "account" && (
            <div className="slide-in">
              <div className="settings-section">
                <div className="section-header">
                  <div className="section-icon">
                    <VpnKeyIcon />
                  </div>
                  <div>
                    <h2 className="section-title">הגדרות חשבון</h2>
                    <p className="section-description">נהל את האבטחה והגישה לחשבון שלך</p>
                  </div>
                </div>

                <div className="settings-grid">
                  <div className="setting-item">
                    <div className="setting-label">
                      <SecurityIcon sx={{ color: "#8B0000" }} />
                      אימות דו-שלבי
                      <Chip
                        label="מומלץ"
                        size="small"
                        sx={{
                          backgroundColor: "#10b981",
                          color: "white",
                          fontWeight: 600,
                          marginRight: 1,
                        }}
                      />
                    </div>
                    <div className="setting-description">הוסף שכבת אבטחה נוספת לחשבון שלך</div>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={settings.account.twoFactorAuth}
                          onChange={(e) => handleSettingChange("account", "twoFactorAuth", e.target.checked)}
                          sx={{
                            "& .MuiSwitch-switchBase.Mui-checked": {
                              color: "#8B0000",
                            },
                            "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                              backgroundColor: "#8B0000",
                            },
                          }}
                        />
                      }
                      label=""
                    />
                  </div>

                  <div className="setting-item">
                    <div className="setting-label">התראות כניסה</div>
                    <div className="setting-description">קבל התראה על כניסות חדשות לחשבון</div>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={settings.account.loginAlerts}
                          onChange={(e) => handleSettingChange("account", "loginAlerts", e.target.checked)}
                          sx={{
                            "& .MuiSwitch-switchBase.Mui-checked": {
                              color: "#8B0000",
                            },
                            "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                              backgroundColor: "#8B0000",
                            },
                          }}
                        />
                      }
                      label=""
                    />
                  </div>

                  <div className="setting-item">
                    <div className="setting-label">זמן תפוגת הפעלה (דקות)</div>
                    <div className="setting-description">כמה זמן להישאר מחובר ללא פעילות</div>
                    <TextField
                      type="number"
                      value={settings.account.sessionTimeout}
                      onChange={(e) =>
                        handleSettingChange("account", "sessionTimeout", Number.parseInt(e.target.value))
                      }
                      inputProps={{ min: 5, max: 120 }}
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
                  </div>
                </div>
              </div>

              {/* Danger Zone */}
              <div className="danger-zone">
                <div className="section-header">
                  <div className="section-icon">
                    <WarningIcon />
                  </div>
                  <div>
                    <h2 className="section-title">אזור מסוכן</h2>
                    <p className="section-description">פעולות בלתי הפיכות - היזהר מאוד!</p>
                  </div>
                </div>

                <div className="settings-grid">
                  <div className="setting-item">
                    <div className="setting-label">
                      <DeleteIcon sx={{ color: "#8b0000" }} />
                      מחיקת חשבון לצמיתות
                    </div>
                    <div className="setting-description">
                      מחק את החשבון שלך לצמיתות כולל כל הרזומות והנתונים. פעולה זו בלתי הפיכה!
                    </div>
                    <Button
                      variant="contained"
                      startIcon={<DeleteIcon />}
                      onClick={() => setDeleteDialogOpen(true)}
                      className="danger-button"
                    >
                      מחק חשבון לצמיתות
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Save Button */}
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <Button
              variant="contained"
              size="large"
              startIcon={loading ? <LinearProgress /> : <SaveIcon />}
              onClick={handleSaveSettings}
              disabled={loading}
              sx={{
                backgroundColor: "#8B0000",
                color: "white",
                px: 4,
                py: 1.5,
                fontSize: "1.1rem",
                fontWeight: 600,
                borderRadius: 3,
                "&:hover": {
                  backgroundColor: "#5c0000",
                },
                "&:disabled": {
                  backgroundColor: "#cccccc",
                },
              }}
            >
              {loading ? "שומר..." : "שמור הגדרות"}
            </Button>
          </Box>
        </Container>
      </div>

      {/* Export Data Dialog */}
      <Dialog
        open={exportDialogOpen}
        onClose={() => setExportDialogOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: 3,
          },
        }}
      >
        <DialogTitle sx={{ color: "#8B0000", fontWeight: 600 }}>ייצוא נתונים</DialogTitle>
        <DialogContent>
          <Typography>
            האם אתה בטוח שברצונך לייצא את כל הנתונים שלך? הקובץ יכלול את פרטי הפרופיל, ההגדרות וכל המידע הקשור לחשבון
            שלך.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button
            onClick={() => setExportDialogOpen(false)}
            variant="outlined"
            sx={{ borderColor: "#ccc", color: "#666" }}
          >
            ביטול
          </Button>
          <Button
            onClick={handleExportData}
            variant="contained"
            startIcon={<DownloadIcon />}
            sx={{
              backgroundColor: "#8B0000",
              "&:hover": { backgroundColor: "#5c0000" },
            }}
          >
            ייצא נתונים
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Account Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: 3,
          },
        }}
      >
        <DialogTitle sx={{ color: "#ef4444", fontWeight: 600 }}>מחיקת חשבון</DialogTitle>
        <DialogContent>
          <Alert severity="error" sx={{ mb: 2 }}>
            <Typography variant="body1" sx={{ fontWeight: 600 }}>
              אזהרה: פעולה זו בלתי הפיכה!
            </Typography>
          </Alert>
          <Typography>
            האם אתה בטוח שברצונך למחוק את החשבון שלך לצמיתות? כל הנתונים, הרזומות והשיתופים שלך יימחקו ולא ניתן יהיה
            לשחזר אותם.
          </Typography>
          <Typography sx={{ mt: 2, fontWeight: 600, color: "#ef4444" }}>הקלד "מחק את החשבון שלי" כדי לאשר:</Typography>
          <TextField
            fullWidth
            placeholder="מחק את החשבון שלי"
            value={deleteConfirmText}
            onChange={(e) => setDeleteConfirmText(e.target.value)}
            sx={{
              mt: 1,
              "& .MuiOutlinedInput-root": {
                "&.Mui-focused fieldset": {
                  borderColor: "#8B0000",
                },
              },
            }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button
            onClick={() => setDeleteDialogOpen(false)}
            variant="outlined"
            sx={{ borderColor: "#ccc", color: "#666" }}
          >
            ביטול
          </Button>
          <Button
            onClick={handleDeleteAccount}
            variant="contained"
            startIcon={<DeleteIcon />}
            disabled={deleteConfirmText !== "מחק את החשבון שלי"}
            sx={{
              backgroundColor: "#ef4444",
              "&:hover": { backgroundColor: "#dc2626" },
            }}
          >
            מחק חשבון
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%", borderRadius: 2 }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  )
}

export default SettingsPage
