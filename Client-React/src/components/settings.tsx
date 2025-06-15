// "use client"

// import type React from "react"
// import { useState } from "react"
// import { useSelector, useDispatch } from "react-redux"
// import {
//   Container,
//   Paper,
//   Typography,
//   Box,
//   TextField,
//   Button,
//   Grid,
//   Avatar,
//   Divider,
//   Alert,
//   Card,
//   CardContent,
//   Switch,
//   FormControlLabel,
//   IconButton,
//   Tooltip,
//   Select,
//   MenuItem,
//   FormControl,
//   InputLabel,
//   Slider,
//   Chip,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   DialogContentText,
//   Snackbar,
// } from "@mui/material"
// import {
//   ArrowBack as ArrowBackIcon,
//   Save as SaveIcon,
//   Person as PersonIcon,
//   Security as SecurityIcon,
//   Notifications as NotificationsIcon,
//   Palette as PaletteIcon,
//   Language as LanguageIcon,
//   VolumeUp as VolumeUpIcon,
//   Brightness6 as Brightness6Icon,
//   Lock as LockIcon,
//   Delete as DeleteIcon,
//   RestartAlt as RestartAltIcon,
//   Email as EmailIcon,
//   Phone as PhoneIcon,
//   PrivacyTip as PrivacyTipIcon,
//   Warning as WarningIcon,
//   Info as InfoIcon,
//   Backup as BackupIcon,
// } from "@mui/icons-material"
// import type { RootState, AppDispatch } from "../store"
// import { updateUserProfile } from "../slices/userSlice"
// import { getTranslation } from "../components/transletions"
// import { useNavigate } from "react-router-dom"
// import { resetSettings, updateAppearance, updateNotifications, updatePrivacy, updateSecurity, updateSounds } from "../slices/settingsSlice"

// const SettingsPage: React.FC = () => {
//   const navigate = useNavigate()
//   const dispatch = useDispatch<AppDispatch>()
//   const { user, loading } = useSelector((state: RootState) => state.user)
//   const settings = useSelector((state: RootState) => state.settings)

//   const [activeSection, setActiveSection] = useState<
//     "profile" | "notifications" | "appearance" | "privacy" | "security" | "sounds"
//   >("profile")
//   const [success, setSuccess] = useState("")
//   const [error, setError] = useState("")
//   const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
//   const [resetDialogOpen, setResetDialogOpen] = useState(false)

//   const [formData, setFormData] = useState({
//     username: user?.username || "",
//     email: user?.email || "",
//     phone: user?.phone || "",
//     address: user?.address || "",
//     currentPassword: "",
//     newPassword: "",
//     confirmPassword: "",
//   })

//   const t = (key: string) => getTranslation(settings.appearance.language, key as any)

//   const handleInputChange = (field: string, value: string) => {
//     setFormData((prev) => ({ ...prev, [field]: value }))
//   }

//   const handleNotificationChange = (setting: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
//     dispatch(updateNotifications({ [setting]: event.target.checked }))
//     setSuccess(t("success") + "!")
//   }

//   const handleAppearanceChange = (setting: string) => (event: any) => {
//     const value = event.target ? event.target.value : event
//     dispatch(updateAppearance({ [setting]: value }))
//     setSuccess(t("success") + "!")
//   }

//   const handlePrivacyChange = (setting: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
//     dispatch(updatePrivacy({ [setting]: event.target.checked }))
//     setSuccess(t("success") + "!")
//   }

//   const handleSecurityChange = (setting: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
//     dispatch(updateSecurity({ [setting]: event.target.checked }))
//     setSuccess(t("success") + "!")
//   }

//   const handleSoundsChange = (setting: string) => (event: any) => {
//     const value = event.target ? event.target.value : event
//     dispatch(updateSounds({ [setting]: value }))
//     setSuccess(t("success") + "!")
//   }

//   const handleSliderChange = (category: string, setting: string) => (event: Event, value: number | number[]) => {
//     const finalValue = Array.isArray(value) ? value[0] : value

//     if (category === "appearance") {
//       dispatch(updateAppearance({ [setting]: finalValue }))
//     } else if (category === "security") {
//       dispatch(updateSecurity({ [setting]: finalValue }))
//     } else if (category === "sounds") {
//       dispatch(updateSounds({ [setting]: finalValue }))
//     }

//     setSuccess(t("success") + "!")
//   }

//   const handleSaveProfile = async () => {
//     try {
//       if (!user?.id) {
//         setError("משתמש לא מזוהה")
//         return
//       }

//       const updatedUser = {
//         id: user.id,
//         username: formData.username.trim(),
//         email: formData.email.trim(),
//         phone: formData.phone.trim() || null,
//         address: formData.address.trim() || null,
//       }

//       await dispatch(updateUserProfile(updatedUser)).unwrap()
//       setSuccess("הפרופיל עודכן בהצלחה!")
//       setError("")
//     } catch (err: any) {
//       setError(err.message || "שגיאה בעדכון הפרופיל")
//       setSuccess("")
//     }
//   }

//   const handleResetSettings = () => {
//     dispatch(resetSettings())
//     setResetDialogOpen(false)
//     setSuccess("ההגדרות אופסו לברירת המחדל!")
//   }

//   const handleChangePassword = async () => {
//     if (formData.newPassword !== formData.confirmPassword) {
//       setError("הסיסמאות אינן תואמות")
//       return
//     }

//     try {
//       setSuccess("הסיסמה שונתה בהצלחה!")
//       setError("")
//       setFormData((prev) => ({ ...prev, currentPassword: "", newPassword: "", confirmPassword: "" }))
//     } catch (err) {
//       setError("שגיאה בשינוי הסיסמה")
//       setSuccess("")
//     }
//   }

//   const SettingsSection = ({
//     title,
//     icon,
//     children,
//   }: {
//     title: string
//     icon: React.ReactNode
//     children: React.ReactNode
//   }) => (
//     <Card
//       elevation={2}
//       sx={{
//         mb: 3,
//         borderRadius: 2,
//         border: "1px solid #e5d6d6",
//         "&:hover": {
//           boxShadow: "0 4px 12px rgba(139, 0, 0, 0.1)",
//         },
//       }}
//     >
//       <CardContent sx={{ p: 3 }}>
//         <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
//           <Avatar sx={{ bgcolor: "#8B0000", mr: 2, width: 40, height: 40 }}>{icon}</Avatar>
//           <Typography variant="h6" sx={{ color: "#8B0000", fontWeight: "bold" }}>
//             {title}
//           </Typography>
//         </Box>
//         {children}
//       </CardContent>
//     </Card>
//   )

//   const handleSelectChange = (category: string, setting: string) => (event: any) => {
//     const value = event.target ? event.target.value : event
//     if (category === "privacy") {
//       dispatch(updatePrivacy({ [setting]: value }))
//     } else if (category === "security") {
//       dispatch(updateSecurity({ [setting]: value }))
//     } else if (category === "sounds") {
//       dispatch(updateSounds({ [setting]: value }))
//     }
//     setSuccess(t("success") + "!")
//   }

//   const handleSwitchChange = (category: string, setting: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
//     if (category === "privacy") {
//       dispatch(updatePrivacy({ [setting]: event.target.checked }))
//     } else if (category === "security") {
//       dispatch(updateSecurity({ [setting]: event.target.checked }))
//     } else if (category === "sounds") {
//       dispatch(updateSounds({ [setting]: event.target.checked }))
//     }
//     setSuccess(t("success") + "!")
//   }

//   if (!user) {
//     return (
//       <Container maxWidth="lg" sx={{ py: 4 }}>
//         <Paper elevation={3} sx={{ p: 3, textAlign: "center" }}>
//           <Typography variant="h6" color="error">
//             יש להתחבר למערכת כדי לגשת להגדרות
//           </Typography>
//         </Paper>
//       </Container>
//     )
//   }

//   return (
//     <Container maxWidth="lg" sx={{ py: 4 }}>
//       <Box className="settings-container">
//         {/* Header */}
//         <Paper
//           elevation={3}
//           sx={{
//             background: "linear-gradient(135deg, #8B0000 0%, #DC143C 100%)",
//             color: "white",
//             p: 3,
//             borderRadius: 2,
//             mb: 3,
//           }}
//         >
//           <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
//             <Tooltip title="חזור לאיזור האישי">
//               <IconButton onClick={() => navigate("/profile")} sx={{ color: "white" }}>
//                 <ArrowBackIcon />
//               </IconButton>
//             </Tooltip>
//             <Typography variant="h4" sx={{ fontWeight: 700 }}>
//               {t("settingsTitle")}
//             </Typography>
//           </Box>
//         </Paper>

//         {/* Alerts */}
//         {success && (
//           <Alert severity="success" sx={{ mt: 2 }} onClose={() => setSuccess("")}>
//             {success}
//           </Alert>
//         )}
//         {error && (
//           <Alert severity="error" sx={{ mt: 2 }} onClose={() => setError("")}>
//             {error}
//           </Alert>
//         )}

//         <Grid container spacing={3} sx={{ mt: 2 }}>
//           {/* Sidebar */}
//           <Grid item xs={12} md={3}>
//             <Paper elevation={2} sx={{ p: 2 }}>
//               <Box sx={{ textAlign: "center", mb: 3 }}>
//                 <Avatar
//                   sx={{
//                     width: 80,
//                     height: 80,
//                     bgcolor: "#8B0000",
//                     fontSize: "2rem",
//                     mx: "auto",
//                     mb: 2,
//                   }}
//                 >
//                   {user.username ? user.username.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
//                 </Avatar>
//                 <Typography variant="h6">{user.username || user.email}</Typography>
//               </Box>

//               <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
//                 {[
//                   { key: "profile", label: t("personalDetails"), icon: <PersonIcon /> },
//                   { key: "notifications", label: t("notifications"), icon: <NotificationsIcon /> },
//                   { key: "appearance", label: t("appearance"), icon: <PaletteIcon /> },
//                   { key: "privacy", label: t("privacy"), icon: <PrivacyTipIcon /> },
//                   { key: "security", label: t("security"), icon: <SecurityIcon /> },
//                   { key: "sounds", label: t("sounds"), icon: <VolumeUpIcon /> },
//                 ].map((section) => (
//                   <Button
//                     key={section.key}
//                     variant={activeSection === section.key ? "contained" : "outlined"}
//                     startIcon={section.icon}
//                     onClick={() => setActiveSection(section.key as any)}
//                     fullWidth
//                     sx={{
//                       justifyContent: "flex-start",
//                       bgcolor: activeSection === section.key ? "#8B0000" : "transparent",
//                       borderColor: "#8B0000",
//                       color: activeSection === section.key ? "white" : "#8B0000",
//                     }}
//                   >
//                     {section.label}
//                   </Button>
//                 ))}
//               </Box>
//             </Paper>
//           </Grid>

//           {/* Main Content */}
//           <Grid item xs={12} md={9}>
//             <Paper elevation={2} sx={{ p: 3 }}>
//               {activeSection === "appearance" && (
//                 <SettingsSection title={t("appearance")} icon={<PaletteIcon />}>
//                   <Grid container spacing={3}>
//                     <Grid item xs={12} sm={4}>
//                       <FormControl fullWidth>
//                         <InputLabel sx={{ "&.Mui-focused": { color: "#8B0000" } }}>{t("theme")}</InputLabel>
//                         <Select
//                           value={settings.appearance.theme}
//                           onChange={handleAppearanceChange("theme")}
//                           sx={{
//                             "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#8B0000" },
//                           }}
//                         >
//                           <MenuItem value="light">
//                             <Box sx={{ display: "flex", alignItems: "center" }}>
//                               <Brightness6Icon sx={{ mr: 1 }} />
//                               {t("lightTheme")}
//                             </Box>
//                           </MenuItem>
//                           <MenuItem value="dark">{t("darkTheme")}</MenuItem>
//                           <MenuItem value="auto">{t("autoTheme")}</MenuItem>
//                         </Select>
//                       </FormControl>
//                     </Grid>
//                     <Grid item xs={12} sm={4}>
//                       <FormControl fullWidth>
//                         <InputLabel sx={{ "&.Mui-focused": { color: "#8B0000" } }}>{t("language")}</InputLabel>
//                         <Select
//                           value={settings.appearance.language}
//                           onChange={handleAppearanceChange("language")}
//                           sx={{
//                             "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#8B0000" },
//                           }}
//                         >
//                           <MenuItem value="he">
//                             <Box sx={{ display: "flex", alignItems: "center" }}>
//                               <LanguageIcon sx={{ mr: 1 }} />
//                               {t("hebrew")}
//                             </Box>
//                           </MenuItem>
//                           <MenuItem value="en">{t("english")}</MenuItem>
//                           <MenuItem value="ar">{t("arabic")}</MenuItem>
//                         </Select>
//                       </FormControl>
//                     </Grid>
//                     <Grid item xs={12} sm={4}>
//                       <Typography gutterBottom>
//                         {t("fontSize")}: {settings.appearance.fontSize}px
//                       </Typography>
//                       <Slider
//                         value={settings.appearance.fontSize}
//                         onChange={handleSliderChange("appearance", "fontSize")}
//                         min={12}
//                         max={20}
//                         step={1}
//                         sx={{
//                           color: "#8B0000",
//                           "& .MuiSlider-thumb": { backgroundColor: "#8B0000" },
//                           "& .MuiSlider-track": { backgroundColor: "#8B0000" },
//                         }}
//                       />
//                     </Grid>
//                   </Grid>
//                 </SettingsSection>
//               )}

//               {activeSection === "notifications" && (
//                 <SettingsSection title={t("notifications")} icon={<NotificationsIcon />}>
//                   <Grid container spacing={2}>
//                     <Grid item xs={12} sm={6}>
//                       <FormControlLabel
//                         control={
//                           <Switch
//                             checked={settings.notifications.email}
//                             onChange={handleNotificationChange("email")}
//                             sx={{
//                               "& .MuiSwitch-switchBase.Mui-checked": { color: "#8B0000" },
//                               "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": { backgroundColor: "#8B0000" },
//                             }}
//                           />
//                         }
//                         label={
//                           <Box sx={{ display: "flex", alignItems: "center" }}>
//                             <EmailIcon sx={{ mr: 1, color: "#8B0000" }} />
//                             {t("emailNotifications")}
//                           </Box>
//                         }
//                       />
//                     </Grid>
//                     <Grid item xs={12} sm={6}>
//                       <FormControlLabel
//                         control={
//                           <Switch
//                             checked={settings.notifications.push}
//                             onChange={handleNotificationChange("push")}
//                             sx={{
//                               "& .MuiSwitch-switchBase.Mui-checked": { color: "#8B0000" },
//                               "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": { backgroundColor: "#8B0000" },
//                             }}
//                           />
//                         }
//                         label={t("pushNotifications")}
//                       />
//                     </Grid>
//                     <Grid item xs={12} sm={6}>
//                       <FormControlLabel
//                         control={
//                           <Switch
//                             checked={settings.notifications.sms}
//                             onChange={handleNotificationChange("sms")}
//                             sx={{
//                               "& .MuiSwitch-switchBase.Mui-checked": { color: "#8B0000" },
//                               "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": { backgroundColor: "#8B0000" },
//                             }}
//                           />
//                         }
//                         label={
//                           <Box sx={{ display: "flex", alignItems: "center" }}>
//                             <PhoneIcon sx={{ mr: 1, color: "#8B0000" }} />
//                             {t("smsNotifications")}
//                           </Box>
//                         }
//                       />
//                     </Grid>
//                     <Grid item xs={12} sm={6}>
//                       <FormControlLabel
//                         control={
//                           <Switch
//                             checked={settings.notifications.marketing}
//                             onChange={handleNotificationChange("marketing")}
//                             sx={{
//                               "& .MuiSwitch-switchBase.Mui-checked": { color: "#8B0000" },
//                               "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": { backgroundColor: "#8B0000" },
//                             }}
//                           />
//                         }
//                         label={t("marketingEmails")}
//                       />
//                     </Grid>
//                   </Grid>
//                 </SettingsSection>
//               )}

//               {activeSection === "profile" && (
//                 <div>
//                   <Typography variant="h5" gutterBottom sx={{ color: "#8B0000", fontWeight: "bold" }}>
//                     פרטים אישיים
//                   </Typography>
//                   <Divider sx={{ mb: 3 }} />

//                   <Grid container spacing={3}>
//                     <Grid item xs={12} md={6}>
//                       <TextField
//                         fullWidth
//                         label="שם משתמש"
//                         value={formData.username}
//                         onChange={(e) => handleInputChange("username", e.target.value)}
//                         variant="outlined"
//                         dir="rtl"
//                       />
//                     </Grid>
//                     <Grid item xs={12} md={6}>
//                       <TextField
//                         fullWidth
//                         label="אימייל"
//                         value={formData.email}
//                         onChange={(e) => handleInputChange("email", e.target.value)}
//                         variant="outlined"
//                         type="email"
//                         dir="rtl"
//                       />
//                     </Grid>
//                     <Grid item xs={12} md={6}>
//                       <TextField
//                         fullWidth
//                         label="טלפון"
//                         value={formData.phone}
//                         onChange={(e) => handleInputChange("phone", e.target.value)}
//                         variant="outlined"
//                         dir="rtl"
//                       />
//                     </Grid>
//                     <Grid item xs={12} md={6}>
//                       <TextField
//                         fullWidth
//                         label="כתובת"
//                         value={formData.address}
//                         onChange={(e) => handleInputChange("address", e.target.value)}
//                         variant="outlined"
//                         dir="rtl"
//                       />
//                     </Grid>
//                   </Grid>

//                   <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
//                     <Button
//                       variant="contained"
//                       startIcon={<SaveIcon />}
//                       onClick={handleSaveProfile}
//                       disabled={loading}
//                       sx={{ bgcolor: "#8B0000", "&:hover": { bgcolor: "#5c0000" } }}
//                     >
//                       {loading ? "שומר..." : "שמור פרטים"}
//                     </Button>
//                   </Box>
//                 </div>
//               )}

//               {activeSection === "privacy" && (
//                 <SettingsSection title="הגדרות פרטיות" icon={<PrivacyTipIcon />}>
//                   <Grid container spacing={2}>
//                     <Grid item xs={12} sm={6}>
//                       <FormControl fullWidth>
//                         <InputLabel sx={{ "&.Mui-focused": { color: "#8B0000" } }}>נראות פרופיל</InputLabel>
//                         <Select
//                           value={settings.privacy.profileVisibility}
//                           onChange={handleSelectChange("privacy", "profileVisibility")}
//                           sx={{
//                             "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#8B0000" },
//                           }}
//                         >
//                           <MenuItem value="public">
//                             <Chip label="ציבורי" size="small" color="success" sx={{ mr: 1 }} />
//                             כולם יכולים לראות
//                           </MenuItem>
//                           <MenuItem value="friends">
//                             <Chip label="חברים" size="small" color="primary" sx={{ mr: 1 }} />
//                             רק חברים
//                           </MenuItem>
//                           <MenuItem value="private">
//                             <Chip label="פרטי" size="small" color="error" sx={{ mr: 1 }} />
//                             רק אני
//                           </MenuItem>
//                         </Select>
//                       </FormControl>
//                     </Grid>
//                     <Grid item xs={12} sm={6}>
//                       <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
//                         <FormControlLabel
//                           control={
//                             <Switch
//                               checked={settings.privacy.showEmail}
//                               onChange={handleSwitchChange("privacy", "showEmail")}
//                               sx={{
//                                 "& .MuiSwitch-switchBase.Mui-checked": { color: "#8B0000" },
//                                 "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
//                                   backgroundColor: "#8B0000",
//                                 },
//                               }}
//                             />
//                           }
//                           label="הצג אימייל בפרופיל"
//                         />
//                         <FormControlLabel
//                           control={
//                             <Switch
//                               checked={settings.privacy.showPhone}
//                               onChange={handleSwitchChange("privacy", "showPhone")}
//                               sx={{
//                                 "& .MuiSwitch-switchBase.Mui-checked": { color: "#8B0000" },
//                                 "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
//                                   backgroundColor: "#8B0000",
//                                 },
//                               }}
//                             />
//                           }
//                           label="הצג טלפון בפרופיל"
//                         />
//                         <FormControlLabel
//                           control={
//                             <Switch
//                               checked={settings.privacy.showLocation}
//                               onChange={handleSwitchChange("privacy", "showLocation")}
//                               sx={{
//                                 "& .MuiSwitch-switchBase.Mui-checked": { color: "#8B0000" },
//                                 "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
//                                   backgroundColor: "#8B0000",
//                                 },
//                               }}
//                             />
//                           }
//                           label="הצג מיקום בפרופיל"
//                         />
//                       </Box>
//                     </Grid>
//                   </Grid>
//                 </SettingsSection>
//               )}

//               {activeSection === "security" && (
//                 <div>
//                   <SettingsSection title="הגדרות אבטחה" icon={<SecurityIcon />}>
//                     <Grid container spacing={2}>
//                       <Grid item xs={12} sm={6}>
//                         <FormControlLabel
//                           control={
//                             <Switch
//                               checked={settings.security.twoFactor}
//                               onChange={handleSwitchChange("security", "twoFactor")}
//                               sx={{
//                                 "& .MuiSwitch-switchBase.Mui-checked": { color: "#8B0000" },
//                                 "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
//                                   backgroundColor: "#8B0000",
//                                 },
//                               }}
//                             />
//                           }
//                           label={
//                             <Box sx={{ display: "flex", alignItems: "center" }}>
//                               <LockIcon sx={{ mr: 1, color: "#8B0000" }} />
//                               אימות דו-שלבי
//                               {settings.security.twoFactor && (
//                                 <Chip label="מופעל" size="small" color="success" sx={{ mr: 1 }} />
//                               )}
//                             </Box>
//                           }
//                         />
//                       </Grid>
//                       <Grid item xs={12} sm={6}>
//                         <FormControlLabel
//                           control={
//                             <Switch
//                               checked={settings.security.loginAlerts}
//                               onChange={handleSwitchChange("security", "loginAlerts")}
//                               sx={{
//                                 "& .MuiSwitch-switchBase.Mui-checked": { color: "#8B0000" },
//                                 "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
//                                   backgroundColor: "#8B0000",
//                                 },
//                               }}
//                             />
//                           }
//                           label="התראות התחברות"
//                         />
//                       </Grid>
//                       <Grid item xs={12}>
//                         <Typography gutterBottom>זמן קצוב לסשן (דקות): {settings.security.sessionTimeout}</Typography>
//                         <Slider
//                           value={settings.security.sessionTimeout}
//                           onChange={handleSliderChange("security", "sessionTimeout")}
//                           min={15}
//                           max={120}
//                           step={15}
//                           marks={[
//                             { value: 15, label: "15 דק" },
//                             { value: 30, label: "30 דק" },
//                             { value: 60, label: "60 דק" },
//                             { value: 120, label: "120 דק" },
//                           ]}
//                           sx={{
//                             color: "#8B0000",
//                             "& .MuiSlider-thumb": { backgroundColor: "#8B0000" },
//                             "& .MuiSlider-track": { backgroundColor: "#8B0000" },
//                           }}
//                         />
//                       </Grid>
//                     </Grid>
//                   </SettingsSection>

//                   {/* Password Change Section */}
//                   <Typography variant="h6" gutterBottom sx={{ color: "#8B0000", fontWeight: "bold", mt: 3 }}>
//                     שינוי סיסמה
//                   </Typography>
//                   <Divider sx={{ mb: 3 }} />

//                   <Grid container spacing={3}>
//                     <Grid item xs={12}>
//                       <TextField
//                         fullWidth
//                         label="סיסמה נוכחית"
//                         type="password"
//                         value={formData.currentPassword}
//                         onChange={(e) => handleInputChange("currentPassword", e.target.value)}
//                         variant="outlined"
//                         dir="rtl"
//                       />
//                     </Grid>
//                     <Grid item xs={12} md={6}>
//                       <TextField
//                         fullWidth
//                         label="סיסמה חדשה"
//                         type="password"
//                         value={formData.newPassword}
//                         onChange={(e) => handleInputChange("newPassword", e.target.value)}
//                         variant="outlined"
//                         dir="rtl"
//                       />
//                     </Grid>
//                     <Grid item xs={12} md={6}>
//                       <TextField
//                         fullWidth
//                         label="אישור סיסמה חדשה"
//                         type="password"
//                         value={formData.confirmPassword}
//                         onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
//                         variant="outlined"
//                         dir="rtl"
//                       />
//                     </Grid>
//                   </Grid>

//                   <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
//                     <Button
//                       variant="contained"
//                       startIcon={<SecurityIcon />}
//                       onClick={handleChangePassword}
//                       sx={{ bgcolor: "#8B0000", "&:hover": { bgcolor: "#5c0000" } }}
//                     >
//                       שנה סיסמה
//                     </Button>
//                   </Box>
//                 </div>
//               )}

//               {activeSection === "sounds" && (
//                 <SettingsSection title="הגדרות צלילים" icon={<VolumeUpIcon />}>
//                   <Grid container spacing={2}>
//                     <Grid item xs={12} sm={6}>
//                       <FormControlLabel
//                         control={
//                           <Switch
//                             checked={settings.sounds.enabled}
//                             onChange={handleSwitchChange("sounds", "enabled")}
//                             sx={{
//                               "& .MuiSwitch-switchBase.Mui-checked": { color: "#8B0000" },
//                               "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": { backgroundColor: "#8B0000" },
//                             }}
//                           />
//                         }
//                         label="הפעל צלילים"
//                       />
//                     </Grid>
//                     <Grid item xs={12} sm={6}>
//                       <FormControl fullWidth disabled={!settings.sounds.enabled}>
//                         <InputLabel sx={{ "&.Mui-focused": { color: "#8B0000" } }}>צליל התראות</InputLabel>
//                         <Select
//                           value={settings.sounds.notificationSound}
//                           onChange={handleSelectChange("sounds", "notificationSound")}
//                           sx={{
//                             "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#8B0000" },
//                           }}
//                         >
//                           <MenuItem value="default">ברירת מחדל</MenuItem>
//                           <MenuItem value="bell">פעמון</MenuItem>
//                           <MenuItem value="chime">צלצול</MenuItem>
//                           <MenuItem value="beep">ביפ</MenuItem>
//                         </Select>
//                       </FormControl>
//                     </Grid>
//                     <Grid item xs={12}>
//                       <Typography gutterBottom>עוצמת קול: {settings.sounds.volume}%</Typography>
//                       <Slider
//                         value={settings.sounds.volume}
//                         onChange={handleSliderChange("sounds", "volume")}
//                         disabled={!settings.sounds.enabled}
//                         min={0}
//                         max={100}
//                         step={10}
//                         sx={{
//                           color: "#8B0000",
//                           "& .MuiSlider-thumb": { backgroundColor: "#8B0000" },
//                           "& .MuiSlider-track": { backgroundColor: "#8B0000" },
//                         }}
//                       />
//                     </Grid>
//                   </Grid>
//                 </SettingsSection>
//               )}
//             </Paper>
//           </Grid>
//         </Grid>

//         {/* System Actions */}
//         <Paper
//           elevation={2}
//           sx={{
//             p: 3,
//             mt: 3,
//             borderRadius: 2,
//             border: "1px solid #e5d6d6",
//             backgroundColor: "#fafafa",
//           }}
//         >
//           <Typography variant="h6" sx={{ color: "#8B0000", mb: 3, fontWeight: "bold" }}>
//             פעולות מערכת
//           </Typography>
//           <Grid container spacing={2}>
//             <Grid item xs={12} sm={6} md={3}>
//               <Button
//                 fullWidth
//                 variant="contained"
//                 startIcon={<SaveIcon />}
//                 sx={{
//                   backgroundColor: "#8B0000",
//                   color: "white",
//                   "&:hover": { backgroundColor: "#5c0000" },
//                   mb: 1,
//                 }}
//               >
//                 {t("save")}
//               </Button>
//             </Grid>
//             <Grid item xs={12} sm={6} md={3}>
//               <Button
//                 fullWidth
//                 variant="outlined"
//                 startIcon={<RestartAltIcon />}
//                 onClick={() => setResetDialogOpen(true)}
//                 sx={{
//                   borderColor: "#FF9800",
//                   color: "#FF9800",
//                   "&:hover": {
//                     borderColor: "#F57C00",
//                     backgroundColor: "rgba(255, 152, 0, 0.04)",
//                   },
//                   mb: 1,
//                 }}
//               >
//                 איפוס הגדרות
//               </Button>
//             </Grid>
//             <Grid item xs={12} sm={6} md={3}>
//               <Button
//                 fullWidth
//                 variant="outlined"
//                 startIcon={<BackupIcon />}
//                 sx={{
//                   borderColor: "#2196F3",
//                   color: "#2196F3",
//                   "&:hover": {
//                     borderColor: "#1976D2",
//                     backgroundColor: "rgba(33, 150, 243, 0.04)",
//                   },
//                   mb: 1,
//                 }}
//               >
//                 גיבוי נתונים
//               </Button>
//             </Grid>
//             <Grid item xs={12} sm={6} md={3}>
//               <Button
//                 fullWidth
//                 variant="outlined"
//                 startIcon={<DeleteIcon />}
//                 onClick={() => setDeleteDialogOpen(true)}
//                 sx={{
//                   borderColor: "#f44336",
//                   color: "#f44336",
//                   "&:hover": {
//                     borderColor: "#d32f2f",
//                     backgroundColor: "rgba(244, 67, 54, 0.04)",
//                   },
//                   mb: 1,
//                 }}
//               >
//                 מחק חשבון
//               </Button>
//             </Grid>
//           </Grid>
//         </Paper>

//         {/* Delete Account Dialog */}
//         <Dialog
//           open={deleteDialogOpen}
//           onClose={() => setDeleteDialogOpen(false)}
//           PaperProps={{ sx: { borderRadius: 2 } }}
//         >
//           <DialogTitle sx={{ color: "#f44336", display: "flex", alignItems: "center" }}>
//             <WarningIcon sx={{ mr: 1 }} />
//             מחיקת חשבון
//           </DialogTitle>
//           <DialogContent>
//             <DialogContentText dir="rtl">
//               האם אתה בטוח שברצונך למחוק את החשבון? פעולה זו אינה הפיכה ותמחק את כל הנתונים שלך לצמיתות.
//             </DialogContentText>
//           </DialogContent>
//           <DialogActions>
//             <Button onClick={() => setDeleteDialogOpen(false)} sx={{ color: "#757575" }}>
//               ביטול
//             </Button>
//             <Button
//               onClick={() => setDeleteDialogOpen(false)}
//               sx={{ color: "#f44336" }}
//               variant="contained"
//               color="error"
//             >
//               מחק חשבון
//             </Button>
//           </DialogActions>
//         </Dialog>

//         {/* Reset Settings Dialog */}
//         <Dialog
//           open={resetDialogOpen}
//           onClose={() => setResetDialogOpen(false)}
//           PaperProps={{ sx: { borderRadius: 2 } }}
//         >
//           <DialogTitle sx={{ color: "#FF9800", display: "flex", alignItems: "center" }}>
//             <InfoIcon sx={{ mr: 1 }} />
//             איפוס הגדרות
//           </DialogTitle>
//           <DialogContent>
//             <DialogContentText>האם אתה בטוח שברצונך לאפס את כל ההגדרות לברירת המחדל?</DialogContentText>
//           </DialogContent>
//           <DialogActions>
//             <Button onClick={() => setResetDialogOpen(false)} sx={{ color: "#757575" }}>
//               {t("cancel")}
//             </Button>
//             <Button onClick={handleResetSettings} sx={{ color: "#FF9800" }} variant="contained">
//               איפוס
//             </Button>
//           </DialogActions>
//         </Dialog>

//         {/* Success Snackbar */}
//         <Snackbar
//           open={!!success}
//           autoHideDuration={3000}
//           onClose={() => setSuccess("")}
//           anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
//         >
//           <Alert
//             onClose={() => setSuccess("")}
//             severity="success"
//             sx={{
//               width: "100%",
//               "& .MuiAlert-icon": { color: "#4caf50" },
//             }}
//           >
//             {success}
//           </Alert>
//         </Snackbar>
//       </Box>
//     </Container>
//   )
// }

// export default SettingsPage
