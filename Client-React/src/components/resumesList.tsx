// // "use client"

// // import type React from "react"
// // import { useState, useCallback } from "react"
// // import {
// //   Box,
// //   Typography,
// //   Paper,
// //   List,
// //   ListItem,
// //   ListItemText,
// //   Divider,
// //   Button,
// //   Dialog,
// //   DialogTitle,
// //   DialogContent,
// //   DialogActions,
// //   Grid,
// //   Chip,
// //   IconButton,
// //   CircularProgress,
// //   Pagination,
// //   useMediaQuery,
// //   useTheme,
// //   Tooltip,
// //   Alert,
// //   Menu,
// //   MenuItem,
// //   ListItemIcon,
// //   Snackbar,
// //   Fade,
// //   Zoom,
// // } from "@mui/material"
// // import {
// //   Download as DownloadIcon,
// //   Visibility as VisibilityIcon,
// //   Close as CloseIcon,
// //   Person as PersonIcon,
// //   School as SchoolIcon,
// //   Work as WorkIcon,
// //   FamilyRestroom as FamilyRestroomIcon,
// //   MoreVert as MoreVertIcon,
// //   Edit as EditIcon,
// //   Delete as DeleteIcon,
// //   Share as ShareIcon,
// //   AccessTime as AccessTimeIcon,
// //   OpenInNew as OpenInNewIcon,
// //   LocationOn as LocationOnIcon,
// //   Height as HeightIcon,
// //   Cake as CakeIcon,
// // } from "@mui/icons-material"
// // import { useDispatch, useSelector } from "react-redux"
// // import type { FileData } from "../types/file"
// // import type { AppDispatch, RootState } from "../store"
// // import { downloadFile, deleteFile, viewOriginalFile, clearError } from "../slices/fileSlice"
// // import EditResumeDialog from "./editResume"
// // import ShareDialog from "./share"
// // import Confirm from "./confirm"
// // interface ResumeListProps {
// //   resumes: FileData[]
// //   isLoading: boolean
// //   error?: string
// //   onDownload: (fileName: string) => void
// // }

// // const ResumeList: React.FC<ResumeListProps> = ({ resumes, isLoading, error }) => {
// //   const dispatch = useDispatch<AppDispatch>()
// //   const { loading } = useSelector((state: RootState) => state.files)
// //   const { user } = useSelector((state: RootState) => state.user)

// //   const [selectedResume, setSelectedResume] = useState<FileData | null>(null)
// //   const [detailsOpen, setDetailsOpen] = useState(false)
// //   const [editOpen, setEditOpen] = useState(false)
// //   const [shareOpen, setShareOpen] = useState(false)
// //   const [deleteOpen, setDeleteOpen] = useState(false)
// //   const [page, setPage] = useState(1)
// //   const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
// //   const [snackbar, setSnackbar] = useState<{
// //     open: boolean
// //     message: string
// //     severity: "success" | "error" | "info"
// //   }>({
// //     open: false,
// //     message: "",
// //     severity: "success",
// //   })

// //   const theme = useTheme()
// //   const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
// //   const itemsPerPage = 10

// //   const showSnackbar = useCallback((message: string, severity: "success" | "error" | "info" = "success") => {
// //     setSnackbar({ open: true, message, severity })
// //   }, [])

// //   const handleDetailsOpen = useCallback((resume: FileData) => {
// //     setSelectedResume(resume)
// //     setDetailsOpen(true)
// //   }, [])

// //   const handleDetailsClose = useCallback(() => {
// //     setDetailsOpen(false)
// //     setSelectedResume(null)
// //   }, [])

// //   // const handleDownload = useCallback(
// //   //   async (resume: FileData) => {
// //   //     if (!resume.fileName) return

// //   //     // try {
// //   //     //   await dispatch(downloadFile({ fileName: resume.fileName })).unwrap()
// //   //     //   showSnackbar("הקובץ הורד בהצלחה")



// //   //     // } catch (error) {
// //   //     //   showSnackbar("שגיאה בהורדת הקובץ", "error")
// //   //     // }

      
// //   //   },
// //   //   [dispatch, showSnackbar],
// //   // )
// //   const handleDownload = useCallback(
// //     async (resume: FileData) => {
// //       if (!resume.fileName) return;
  
// //       try {
// //             const response = await axios.get(`https://localhost:7012/api/download/download-url/maleForm.xlsx`);
// //             const downloadUrl = response.data;

// //             const fileResponse = await axios.get(downloadUrl, {
// //                 responseType: 'blob'
// //             });

// //             const url = window.URL.createObjectURL(new Blob([fileResponse.data]));
// //             const link = document.createElement('a');
// //             link.href = url;
// //             link.setAttribute('download', 'maleForm.xlsx');
// //             document.body.appendChild(link);
// //             link.click();
// //             link.remove();
  
// //         // הודעת הצלחה
// //         showSnackbar("הקובץ הורד בהצלחה");
  
// //       } catch (error) {
// //         console.error("Error downloading file:", error);
// //         showSnackbar("שגיאה בהורדת הקובץ", "error");
// //       }
// //     },
// //     [dispatch, showSnackbar]
// //   );
  


// //   const handleViewOriginal = useCallback(
// //     async (resume: FileData) => {
// //       if (!resume.fileName) return

// //       try {
// //         await dispatch(viewOriginalFile(resume.fileName)).unwrap()
// //       } catch (error) {
// //         showSnackbar("שגיאה בפתיחת הקובץ", "error")
// //       }
// //     },
// //     [dispatch, showSnackbar],
// //   )

// //   const handleMenuOpen = useCallback((event: React.MouseEvent<HTMLElement>, resume: FileData) => {
// //     setAnchorEl(event.currentTarget)
// //     setSelectedResume(resume)
// //   }, [])

// //   const handleMenuClose = useCallback(() => {
// //     setAnchorEl(null)
// //   }, [])

// //   const handleEdit = useCallback(() => {
// //     setEditOpen(true)
// //     handleMenuClose()
// //   }, [handleMenuClose])

// //   const handleShare = useCallback(() => {
// //     setShareOpen(true)
// //     handleMenuClose()
// //   }, [handleMenuClose])

// //   const handleDeleteConfirm = useCallback(() => {
// //     setDeleteOpen(true)
// //     handleMenuClose()
// //   }, [handleMenuClose])

// //   const handleDelete = useCallback(async () => {
// //     if (!selectedResume) return

// //     try {
// //       await dispatch(deleteFile(selectedResume.id)).unwrap()
// //       showSnackbar("הרזומה נמחקה בהצלחה")
// //       setDeleteOpen(false)
// //       setSelectedResume(null)
// //     } catch (error) {
// //       showSnackbar("שגיאה במחיקת הרזומה", "error")
// //     }
// //   }, [dispatch, selectedResume, showSnackbar])

// //   const handlePageChange = useCallback((event: React.ChangeEvent<unknown>, value: number) => {
// //     setPage(value)
// //   }, [])

// //   const handleSnackbarClose = useCallback(() => {
// //     setSnackbar((prev) => ({ ...prev, open: false }))
// //     dispatch(clearError())
// //   }, [dispatch])

// //   const startIndex = (page - 1) * itemsPerPage
// //   const endIndex = startIndex + itemsPerPage
// //   const displayedResumes = resumes.slice(startIndex, endIndex)
// //   const totalPages = Math.ceil(resumes.length / itemsPerPage)

// //   const formatDate = useCallback((dateString: string) => {
// //     return new Date(dateString).toLocaleDateString("he-IL", {
// //       year: "numeric",
// //       month: "long",
// //       day: "numeric",
// //       hour: "2-digit",
// //       minute: "2-digit",
// //     })
// //   }, [])

// //   const isOwner = useCallback(
// //     (resume: FileData) => {
// //       return resume.userId === user.id
// //     },
// //     [user.id],
// //   )

// //   if (isLoading) {
// //     return (
// //       <Zoom in={isLoading}>
// //         <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", my: 4 }}>
// //           <CircularProgress sx={{ color: "#8B0000", mb: 2 }} />
// //           <Typography variant="body1" sx={{ color: "#8B0000" }}>
// //             טוען רזומות...
// //           </Typography>
// //         </Box>
// //       </Zoom>
// //     )
// //   }

// //   if (error) {
// //     return (
// //       <Fade in={!!error}>
// //         <Alert severity="error" sx={{ my: 2, borderRadius: 2 }}>
// //           {error}
// //         </Alert>
// //       </Fade>
// //     )
// //   }

// //   if (resumes.length === 0) {
// //     return (
// //       <Fade in={resumes.length === 0}>
// //         <Paper className="card-elegant" sx={{ p: 4, textAlign: "center", my: 2 }}>
// //           <Typography variant="h6" color="#8B0000" gutterBottom>
// //             לא נמצאו רזומות
// //           </Typography>
// //           <Typography variant="body2" color="text.secondary">
// //             נסה לשנות את פרמטרי החיפוש או להעלות רזומות חדשות
// //           </Typography>
// //         </Paper>
// //       </Fade>
// //     )
// //   }

// //   return (
// //     <Box className="fade-in">
// //       <Paper className="card-elegant" sx={{ overflow: "hidden" }}>
// //         <Box className="header-gradient" sx={{ p: 3, color: "white" }}>
// //           <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
// //             <Typography variant="h6" sx={{ fontWeight: 600 }}>
// //               רזומות במערכת ({resumes.length})
// //             </Typography>
// //             <Chip
// //               label={`עמוד ${page} מתוך ${totalPages || 1}`}
// //               size="small"
// //               sx={{
// //                 backgroundColor: "rgba(255, 255, 255, 0.2)",
// //                 color: "white",
// //                 fontWeight: 500,
// //               }}
// //             />
// //           </Box>
// //         </Box>

// //         <List sx={{ width: "100%", bgcolor: "background.paper", p: 0 }}>
// //           {displayedResumes.map((resume, index) => (
// //             <Fade in={true} timeout={300 + index * 100} key={resume.id}>
// //               <Box>
// //                 {index > 0 && <Divider />}
// //                 <ListItem
// //                   sx={{
// //                     py: 3,
// //                     px: 3,
// //                     transition: "all 0.3s ease",
// //                     "&:hover": {
// //                       backgroundColor: "rgba(139, 0, 0, 0.04)",
// //                       transform: "translateX(-4px)",
// //                     },
// //                   }}
// //                 >
// //                   <ListItemText
// //                     primary={
// //                       <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
// //                         <Typography
// //                           variant="h6"
// //                           sx={{
// //                             fontWeight: "bold",
// //                             color: "#8B0000",
// //                             direction: "rtl",
// //                           }}
// //                         >
// //                           {resume.firstName} {resume.lastName}
// //                         </Typography>
// //                         {isOwner(resume) && (
// //                           <Chip
// //                             label="שלי"
// //                             size="small"
// //                             sx={{
// //                               backgroundColor: "#D4AF37",
// //                               color: "white",
// //                               fontWeight: 600,
// //                               fontSize: "0.75rem",
// //                             }}
// //                           />
// //                         )}
// //                       </Box>
// //                     }
// //                     secondary={
// //                       <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1, direction: "rtl" }}>
// //                         {resume.age && (
// //                           <Chip
// //                             icon={<CakeIcon />}
// //                             label={`גיל: ${resume.age}`}
// //                             size="small"
// //                             sx={{
// //                               backgroundColor: "rgba(139, 0, 0, 0.08)",
// //                               color: "#5c0000",
// //                               "& .MuiChip-icon": { color: "#8B0000" },
// //                             }}
// //                           />
// //                         )}
// //                         {resume.height && (
// //                           <Chip
// //                             icon={<HeightIcon />}
// //                             label={`גובה: ${resume.height} ס"מ`}
// //                             size="small"
// //                             sx={{
// //                               backgroundColor: "rgba(139, 0, 0, 0.08)",
// //                               color: "#5c0000",
// //                               "& .MuiChip-icon": { color: "#8B0000" },
// //                             }}
// //                           />
// //                         )}
// //                         {resume.address && (
// //                           <Chip
// //                             icon={<LocationOnIcon />}
// //                             label={resume.address}
// //                             size="small"
// //                             sx={{
// //                               backgroundColor: "rgba(139, 0, 0, 0.08)",
// //                               color: "#5c0000",
// //                               "& .MuiChip-icon": { color: "#8B0000" },
// //                             }}
// //                           />
// //                         )}
// //                         <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
// //                           <AccessTimeIcon sx={{ fontSize: 16, color: "text.secondary" }} />
// //                           <Typography variant="caption" color="text.secondary">
// //                             הועלה: {formatDate(resume.createdAt)}
// //                           </Typography>
// //                         </Box>
// //                       </Box>
// //                     }
// //                   />

// //                   <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
// //                     <Tooltip title="צפה בפרטים">
// //                       <IconButton onClick={() => handleDetailsOpen(resume)} sx={{ color: "#8B0000" }}>
// //                         <VisibilityIcon />
// //                       </IconButton>
// //                     </Tooltip>

// //                     <Tooltip title="הורד רזומה">
// //                       <IconButton onClick={() => handleDownload(resume)} sx={{ color: "#8B0000" }} disabled={loading}>
// //                         <DownloadIcon />
// //                       </IconButton>
// //                     </Tooltip>

// //                     <Tooltip title="צפה ברזומה המקורי">
// //                       <IconButton
// //                         onClick={() => handleViewOriginal(resume)}
// //                         sx={{ color: "#8B0000" }}
// //                         disabled={loading}
// //                       >
// //                         <OpenInNewIcon />
// //                       </IconButton>
// //                     </Tooltip>

// //                     {isOwner(resume) && (
// //                       <Tooltip title="אפשרויות נוספות">
// //                         <IconButton onClick={(e) => handleMenuOpen(e, resume)} sx={{ color: "#8B0000" }}>
// //                           <MoreVertIcon />
// //                         </IconButton>
// //                       </Tooltip>
// //                     )}
// //                   </Box>
// //                 </ListItem>
// //               </Box>
// //             </Fade>
// //           ))}
// //         </List>

// //         {totalPages > 1 && (
// //           <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
// //             <Pagination
// //               count={totalPages}
// //               page={page}
// //               onChange={handlePageChange}
// //               color="standard"
// //               size={isMobile ? "small" : "medium"}
// //               sx={{
// //                 "& .MuiPaginationItem-root.Mui-selected": {
// //                   backgroundColor: "#8B0000",
// //                   color: "white",
// //                 },
// //                 "& .MuiPaginationItem-root:hover": {
// //                   backgroundColor: "rgba(139, 0, 0, 0.1)",
// //                 },
// //               }}
// //             />
// //           </Box>
// //         )}
// //       </Paper>

// //       {/* Actions Menu */}
// //       <Menu
// //         anchorEl={anchorEl}
// //         open={Boolean(anchorEl)}
// //         onClose={handleMenuClose}
// //         PaperProps={{
// //           sx: {
// //             borderRadius: 2,
// //             boxShadow: "0 8px 32px rgba(139, 0, 0, 0.15)",
// //             border: "1px solid rgba(139, 0, 0, 0.1)",
// //           },
// //         }}
// //       >
// //         <MenuItem onClick={handleEdit}>
// //           <ListItemIcon>
// //             <EditIcon sx={{ color: "#8B0000" }} />
// //           </ListItemIcon>
// //           עריכה
// //         </MenuItem>
// //         <MenuItem onClick={handleShare}>
// //           <ListItemIcon>
// //             <ShareIcon sx={{ color: "#8B0000" }} />
// //           </ListItemIcon>
// //           שיתוף
// //         </MenuItem>
// //         <Divider />
// //         <MenuItem onClick={handleDeleteConfirm} sx={{ color: "#F44336" }}>
// //           <ListItemIcon>
// //             <DeleteIcon sx={{ color: "#F44336" }} />
// //           </ListItemIcon>
// //           מחיקה
// //         </MenuItem>
// //       </Menu>

// //       {/* Resume Details Dialog */}
// //       <Dialog
// //         open={detailsOpen}
// //         onClose={handleDetailsClose}
// //         fullWidth
// //         maxWidth="md"
// //         PaperProps={{
// //           sx: {
// //             borderRadius: 3,
// //             overflow: "hidden",
// //           },
// //         }}
// //       >
// //         {selectedResume && (
// //           <>
// //             <DialogTitle className="header-gradient" sx={{ color: "white", p: 3 }}>
// //               <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
// //                 <Typography variant="h6" sx={{ fontWeight: 600 }}>
// //                   פרטי רזומה: {selectedResume.firstName} {selectedResume.lastName}
// //                 </Typography>
// //                 <IconButton onClick={handleDetailsClose} sx={{ color: "white" }}>
// //                   <CloseIcon />
// //                 </IconButton>
// //               </Box>
// //             </DialogTitle>

// //             <DialogContent sx={{ p: 4 }}>
// //               <Grid container spacing={3} dir="rtl">
// //                 <Grid item xs={12} md={6}>
// //                   <Paper className="card-elegant" sx={{ p: 3, height: "100%" }}>
// //                     <Typography
// //                       variant="h6"
// //                       gutterBottom
// //                       sx={{ color: "#8B0000", display: "flex", alignItems: "center", gap: 1, mb: 3 }}
// //                     >
// //                       <PersonIcon /> פרטים אישיים
// //                     </Typography>
// //                     <Box sx={{ space: 2 }}>
// //                       <Typography variant="body1" gutterBottom>
// //                         <strong>שם מלא:</strong> {selectedResume.firstName} {selectedResume.lastName}
// //                       </Typography>
// //                       <Typography variant="body1" gutterBottom>
// //                         <strong>גיל:</strong> {selectedResume.age || "לא צוין"}
// //                       </Typography>
// //                       <Typography variant="body1" gutterBottom>
// //                         <strong>גובה:</strong> {selectedResume.height ? `${selectedResume.height} ס"מ` : "לא צוין"}
// //                       </Typography>
// //                       <Typography variant="body1" gutterBottom>
// //                         <strong>כתובת:</strong> {selectedResume.address || "לא צוין"}
// //                       </Typography>
// //                     </Box>
// //                   </Paper>
// //                 </Grid>

// //                 <Grid item xs={12} md={6}>
// //                   <Paper className="card-elegant" sx={{ p: 3, height: "100%" }}>
// //                     <Typography
// //                       variant="h6"
// //                       gutterBottom
// //                       sx={{ color: "#8B0000", display: "flex", alignItems: "center", gap: 1, mb: 3 }}
// //                     >
// //                       <FamilyRestroomIcon /> פרטי משפחה
// //                     </Typography>
// //                     <Box sx={{ space: 2 }}>
// //                       <Typography variant="body1" gutterBottom>
// //                         <strong>שם האב:</strong> {selectedResume.fatherName || "לא צוין"}
// //                       </Typography>
// //                       <Typography variant="body1" gutterBottom>
// //                         <strong>שם האם:</strong> {selectedResume.motherName || "לא צוין"}
// //                       </Typography>
// //                     </Box>
// //                   </Paper>
// //                 </Grid>

// //                 <Grid item xs={12} md={6}>
// //                   <Paper className="card-elegant" sx={{ p: 3, height: "100%" }}>
// //                     <Typography
// //                       variant="h6"
// //                       gutterBottom
// //                       sx={{ color: "#8B0000", display: "flex", alignItems: "center", gap: 1, mb: 3 }}
// //                     >
// //                       <SchoolIcon /> השכלה
// //                     </Typography>
// //                     <Box sx={{ space: 2 }}>
// //                       <Typography variant="body1" gutterBottom>
// //                         <strong>מקום לימודים:</strong> {selectedResume.placeOfStudy || "לא צוין"}
// //                       </Typography>
// //                     </Box>
// //                   </Paper>
// //                 </Grid>

// //                 <Grid item xs={12} md={6}>
// //                   <Paper className="card-elegant" sx={{ p: 3, height: "100%" }}>
// //                     <Typography
// //                       variant="h6"
// //                       gutterBottom
// //                       sx={{ color: "#8B0000", display: "flex", alignItems: "center", gap: 1, mb: 3 }}
// //                     >
// //                       <WorkIcon /> תעסוקה
// //                     </Typography>
// //                     <Box sx={{ space: 2 }}>
// //                       <Typography variant="body1" gutterBottom>
// //                         <strong>עיסוק:</strong> {selectedResume.occupation || "לא צוין"}
// //                       </Typography>
// //                     </Box>
// //                   </Paper>
// //                 </Grid>

// //                 <Grid item xs={12}>
// //                   <Paper className="card-elegant" sx={{ p: 3, backgroundColor: "rgba(139, 0, 0, 0.04)" }}>
// //                     <Typography variant="body2" color="text.secondary" gutterBottom>
// //                       <strong>מזהה קובץ:</strong> {selectedResume.id}
// //                     </Typography>
// //                     <Typography variant="body2" color="text.secondary" gutterBottom>
// //                       <strong>שם קובץ:</strong> {selectedResume.fileName}
// //                     </Typography>
// //                     <Typography variant="body2" color="text.secondary" gutterBottom>
// //                       <strong>תאריך העלאה:</strong> {formatDate(selectedResume.createdAt)}
// //                     </Typography>
// //                     {selectedResume.updatedAt && (
// //                       <Typography variant="body2" color="text.secondary">
// //                         <strong>תאריך עדכון:</strong> {formatDate(selectedResume.updatedAt)}
// //                       </Typography>
// //                     )}
// //                   </Paper>
// //                 </Grid>
// //               </Grid>
// //             </DialogContent>

// //             <DialogActions sx={{ p: 3, justifyContent: "space-between" }}>
// //               <Button onClick={handleDetailsClose} className="btn-secondary">
// //                 סגור
// //               </Button>
// //               <Box sx={{ display: "flex", gap: 2 }}>
// //                 <Button
// //                   onClick={() => handleViewOriginal(selectedResume)}
// //                   className="btn-primary"
// //                   startIcon={<OpenInNewIcon />}
// //                   disabled={loading}
// //                 >
// //                   צפה ברזומה המקורי
// //                 </Button>
// //                 <Button
// //                   onClick={() => handleDownload(selectedResume)}
// //                   className="btn-primary"
// //                   startIcon={<DownloadIcon />}
// //                   disabled={loading}
// //                 >
// //                   הורד רזומה
// //                 </Button>
// //               </Box>
// //             </DialogActions>
// //           </>
// //         )}
// //       </Dialog>

// //       {/* Edit Dialog */}
// //       {selectedResume && (
// //         <EditResumeDialog
// //           open={editOpen}
// //           onClose={() => setEditOpen(false)}
// //           resume={selectedResume}
// //           onSuccess={() => showSnackbar("הרזומה עודכנה בהצלחה")}
// //         />
// //       )}

// //       {/* Share Dialog */}
// //       {selectedResume && (
// //         <ShareDialog
// //           open={shareOpen}
// //           onClose={() => setShareOpen(false)}
// //           resume={selectedResume}
// //           onSuccess={() => showSnackbar("הרזומה שותפה בהצלחה")}
// //         />
// //       )}

// //       {/* Delete Confirmation Dialog */}
// //       <Confirm
// //         open={deleteOpen}
// //         onClose={() => setDeleteOpen(false)}
// //         onConfirm={handleDelete}
// //         title="מחיקת רזומה"
// //         message={`האם אתה בטוח שברצונך למחוק את הרזומה של ${selectedResume?.firstName} ${selectedResume?.lastName}?`}
// //         confirmText="מחק"
// //         cancelText="ביטול"
// //         loading={loading}
// //       />

// //       {/* Snackbar for notifications */}
// //       <Snackbar
// //         open={snackbar.open}
// //         autoHideDuration={6000}
// //         onClose={handleSnackbarClose}
// //         anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
// //       >
// //         <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: "100%", borderRadius: 2 }}>
// //           {snackbar.message}
// //         </Alert>
// //       </Snackbar>
// //     </Box>
// //   )
// // }

// // export default ResumeList
// "use client"

// import type React from "react"
// import { useState, useCallback } from "react"
// import {
//   Box,
//   Typography,
//   Paper,
//   List,
//   ListItem,
//   ListItemText,
//   Divider,
//   Button,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Grid,
//   Chip,
//   IconButton,
//   CircularProgress,
//   Pagination,
//   useMediaQuery,
//   useTheme,
//   Tooltip,
//   Alert,
//   Menu,
//   MenuItem,
//   ListItemIcon,
//   Snackbar,
//   Fade,
//   Zoom,
// } from "@mui/material"
// import {
//   Download as DownloadIcon,
//   Visibility as VisibilityIcon,
//   Close as CloseIcon,
//   Person as PersonIcon,
//   School as SchoolIcon,
//   Work as WorkIcon,
//   FamilyRestroom as FamilyRestroomIcon,
//   MoreVert as MoreVertIcon,
//   Edit as EditIcon,
//   Delete as DeleteIcon,
//   Share as ShareIcon,
//   AccessTime as AccessTimeIcon,
//   OpenInNew as OpenInNewIcon,
//   LocationOn as LocationOnIcon,
//   Height as HeightIcon,
//   Cake as CakeIcon,
// } from "@mui/icons-material"
// import { useDispatch, useSelector } from "react-redux"
// import type { FileData } from "../types/file"
// import type { AppDispatch, RootState } from "../store"
// import { downloadFile, deleteFile, viewOriginalFile, clearError } from "../slices/fileSlice"
// import EditResumeDialog from "./editResume"
// import ShareDialog from "./share"
// import Confirm from "./confirm"
// import axios from "axios" // הוספת ייבוא של axios

// interface ResumeListProps {
//   resumes: FileData[]
//   isLoading: boolean
//   error?: string
//   onDownload: (fileName: string) => void
// }

// const ResumeList: React.FC<ResumeListProps> = ({ resumes, isLoading, error }) => {
//   const dispatch = useDispatch<AppDispatch>()
//   const { loading } = useSelector((state: RootState) => state.files)
//   const { user } = useSelector((state: RootState) => state.user)

//   const [selectedResume, setSelectedResume] = useState<FileData | null>(null)
//   const [detailsOpen, setDetailsOpen] = useState(false)
//   const [editOpen, setEditOpen] = useState(false)
//   const [shareOpen, setShareOpen] = useState(false)
//   const [deleteOpen, setDeleteOpen] = useState(false)
//   const [page, setPage] = useState(1)
//   const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
//   const [snackbar, setSnackbar] = useState<{
//     open: boolean
//     message: string
//     severity: "success" | "error" | "info"
//   }>({
//     open: false,
//     message: "",
//     severity: "success",
//   })

//   const theme = useTheme()
//   const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
//   const itemsPerPage = 10

//   const showSnackbar = useCallback((message: string, severity: "success" | "error" | "info" = "success") => {
//     setSnackbar({ open: true, message, severity })
//   }, [])

//   const handleDetailsOpen = useCallback((resume: FileData) => {
//     setSelectedResume(resume)
//     setDetailsOpen(true)
//   }, [])

//   const handleDetailsClose = useCallback(() => {
//     setDetailsOpen(false)
//     setSelectedResume(null)
//   }, [])

//   const handleDownload = useCallback(
//     async (resume: FileData) => {
//       if (!resume.fileName) return;

//       try {

//         const downloadUrl = await dispatch(downloadFile({ fileName: resume.fileName })).unwrap()
//         console.log(downloadUrl)
//         const response = await fetch(downloadUrl.url)
//         const blob = await response.blob()
//         const link = document.createElement("a")
//         link.href = window.URL.createObjectURL(blob)
//         link.download = resume.fileName
//         document.body.appendChild(link)
//         link.click()
//         document.body.removeChild(link)
//         window.URL.revokeObjectURL(link.href)

        
//         showSnackbar("הקובץ הורד בהצלחה");
//       } catch (error) {
//         console.error("Error downloading file:", error);
//         showSnackbar("שגיאה בהורדת הקובץ", "error");
//       }
//     },
//     [dispatch, showSnackbar]
//   );

//   const handleViewOriginal = useCallback(
//     async (resume: FileData) => {
//       if (!resume.fileName) return

//       try {
//         await dispatch(viewOriginalFile(resume.fileName)).unwrap()
//       } catch (error) {
//         showSnackbar("שגיאה בפתיחת הקובץ", "error")
//       }
//     },
//     [dispatch, showSnackbar],
//   )

//   const handleMenuOpen = useCallback((event: React.MouseEvent<HTMLElement>, resume: FileData) => {
//     setAnchorEl(event.currentTarget)
//     setSelectedResume(resume)
//   }, [])

//   const handleMenuClose = useCallback(() => {
//     setAnchorEl(null)
//   }, [])

//   const handleEdit = useCallback(() => {
//     setEditOpen(true)
//     handleMenuClose()
//   }, [handleMenuClose])

//   const handleShare = useCallback(() => {
//     setShareOpen(true)
//     handleMenuClose()
//   }, [handleMenuClose])

//   const handleDeleteConfirm = useCallback(() => {
//     setDeleteOpen(true)
//     handleMenuClose()
//   }, [handleMenuClose])

//   const handleDelete = useCallback(async () => {
//     if (!selectedResume) return

//     try {
//       await dispatch(deleteFile(selectedResume.id)).unwrap()
//       showSnackbar("הרזומה נמחקה בהצלחה")
//       setDeleteOpen(false)
//       setSelectedResume(null)
//     } catch (error) {
//       showSnackbar("שגיאה במחיקת הרזומה", "error")
//     }
//   }, [dispatch, selectedResume, showSnackbar])

//   const handlePageChange = useCallback((event: React.ChangeEvent<unknown>, value: number) => {
//     setPage(value)
//   }, [])

//   const handleSnackbarClose = useCallback(() => {
//     setSnackbar((prev) => ({ ...prev, open: false }))
//     dispatch(clearError())
//   }, [dispatch])

//   const startIndex = (page - 1) * itemsPerPage
//   const endIndex = startIndex + itemsPerPage
//   const displayedResumes = resumes.slice(startIndex, endIndex)
//   const totalPages = Math.ceil(resumes.length / itemsPerPage)

//   const formatDate = useCallback((dateString: string) => {
//     return new Date(dateString).toLocaleDateString("he-IL", {
//       year: "numeric",
//       month: "long",
//       day: "numeric",
//       hour: "2-digit",
//       minute: "2-digit",
//     })
//   }, [])

//   const isOwner = useCallback(
//     (resume: FileData) => {
//       return resume.userId === user.id
//     },
//     [user.id],
//   )

//   if (isLoading) {
//     return (
//       <Zoom in={isLoading}>
//         <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", my: 4 }}>
//           <CircularProgress sx={{ color: "#8B0000", mb: 2 }} />
//           <Typography variant="body1" sx={{ color: "#8B0000" }}>
//             טוען רזומות...
//           </Typography>
//         </Box>
//       </Zoom>
//     )
//   }

//   if (error) {
//     return (
//       <Fade in={!!error}>
//         <Alert severity="error" sx={{ my: 2, borderRadius: 2 }}>
//           {error}
//         </Alert>
//       </Fade>
//     )
//   }

//   if (resumes.length === 0) {
//     return (
//       <Fade in={resumes.length === 0}>
//         <Paper className="card-elegant" sx={{ p: 4, textAlign: "center", my: 2 }}>
//           <Typography variant="h6" color="#8B0000" gutterBottom>
//             לא נמצאו רזומות
//           </Typography>
//           <Typography variant="body2" color="text.secondary">
//             נסה לשנות את פרמטרי החיפוש או להעלות רזומות חדשות
//           </Typography>
//         </Paper>
//       </Fade>
//     )
//   }

//   return (
//     <Box className="fade-in">
//       <Paper className="card-elegant" sx={{ overflow: "hidden" }}>
//         <Box className="header-gradient" sx={{ p: 3, color: "white" }}>
//           <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
//             <Typography variant="h6" sx={{ fontWeight: 600 }}>
//               רזומות במערכת ({resumes.length})
//             </Typography>
//             <Chip
//               label={`עמוד ${page} מתוך ${totalPages || 1}`}
//               size="small"
//               sx={{
//                 backgroundColor: "rgba(255, 255, 255, 0.2)",
//                 color: "white",
//                 fontWeight: 500,
//               }}
//             />
//           </Box>
//         </Box>

//         <List sx={{ width: "100%", bgcolor: "background.paper", p: 0 }}>
//           {displayedResumes.map((resume, index) => (
//             <Fade in={true} timeout={300 + index * 100} key={resume.id}>
//               <Box>
//                 {index > 0 && <Divider />}
//                 <ListItem
//                   sx={{
//                     py: 3,
//                     px: 3,
//                     transition: "all 0.3s ease",
//                     "&:hover": {
//                       backgroundColor: "rgba(139, 0, 0, 0.04)",
//                       transform: "translateX(-4px)",
//                     },
//                   }}
//                 >
//                   <ListItemText
//                     primary={
//                       <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
//                         <Typography
//                           variant="h6"
//                           sx={{
//                             fontWeight: "bold",
//                             color: "#8B0000",
//                             direction: "rtl",
//                           }}
//                         >
//                           {resume.firstName} {resume.lastName}
//                         </Typography>
//                         {isOwner(resume) && (
//                           <Chip
//                             label="שלי"
//                             size="small"
//                             sx={{
//                               backgroundColor: "#D4AF37",
//                               color: "white",
//                               fontWeight: 600,
//                               fontSize: "0.75rem",
//                             }}
//                           />
//                         )}
//                       </Box>
//                     }
//                     secondary={
//                       <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1, direction: "rtl" }}>
//                         {resume.age && (
//                           <Chip
//                             icon={<CakeIcon />}
//                             label={`גיל: ${resume.age}`}
//                             size="small"
//                             sx={{
//                               backgroundColor: "rgba(139, 0, 0, 0.08)",
//                               color: "#5c0000",
//                               "& .MuiChip-icon": { color: "#8B0000" },
//                             }}
//                           />
//                         )}
//                         {resume.height && (
//                           <Chip
//                             icon={<HeightIcon />}
//                             label={`גובה: ${resume.height} ס"מ`}
//                             size="small"
//                             sx={{
//                               backgroundColor: "rgba(139, 0, 0, 0.08)",
//                               color: "#5c0000",
//                               "& .MuiChip-icon": { color: "#8B0000" },
//                             }}
//                           />
//                         )}
//                         {resume.address && (
//                           <Chip
//                             icon={<LocationOnIcon />}
//                             label={resume.address}
//                             size="small"
//                             sx={{
//                               backgroundColor: "rgba(139, 0, 0, 0.08)",
//                               color: "#5c0000",
//                               "& .MuiChip-icon": { color: "#8B0000" },
//                             }}
//                           />
//                         )}
//                         <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
//                           <AccessTimeIcon sx={{ fontSize: 16, color: "text.secondary" }} />
//                           <Typography variant="caption" color="text.secondary">
//                             הועלה: {formatDate(resume.createdAt)}
//                           </Typography>
//                         </Box>
//                       </Box>
//                     }
//                   />

//                   <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
//                     <Tooltip title="צפה בפרטים">
//                       <IconButton onClick={() => handleDetailsOpen(resume)} sx={{ color: "#8B0000" }}>
//                         <VisibilityIcon />
//                       </IconButton>
//                     </Tooltip>

//                     <Tooltip title="הורד רזומה">
//                       <IconButton onClick={() => handleDownload(resume)} sx={{ color: "#8B0000" }} disabled={loading}>
//                         <DownloadIcon />
//                       </IconButton>
//                     </Tooltip>

//                     <Tooltip title="צפה ברזומה המקורי">
//                       <IconButton
//                         onClick={() => handleViewOriginal(resume)}
//                         sx={{ color: "#8B0000" }}
//                         disabled={loading}
//                       >
//                         <OpenInNewIcon />
//                       </IconButton>
//                     </Tooltip>

//                     {isOwner(resume) && (
//                       <Tooltip title="אפשרויות נוספות">
//                         <IconButton onClick={(e) => handleMenuOpen(e, resume)} sx={{ color: "#8B0000" }}>
//                           <MoreVertIcon />
//                         </IconButton>
//                       </Tooltip>
//                     )}
//                   </Box>
//                 </ListItem>
//               </Box>
//             </Fade>
//           ))}
//         </List>

//         {totalPages > 1 && (
//           <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
//             <Pagination
//               count={totalPages}
//               page={page}
//               onChange={handlePageChange}
//               color="standard"
//               size={isMobile ? "small" : "medium"}
//               sx={{
//                 "& .MuiPaginationItem-root.Mui-selected": {
//                   backgroundColor: "#8B0000",
//                   color: "white",
//                 },
//                 "& .MuiPaginationItem-root:hover": {
//                   backgroundColor: "rgba(139, 0, 0, 0.1)",
//                 },
//               }}
//             />
//           </Box>
//         )}
//       </Paper>

//       {/* Actions Menu */}
//       <Menu
//         anchorEl={anchorEl}
//         open={Boolean(anchorEl)}
//         onClose={handleMenuClose}
//         PaperProps={{
//           sx: {
//             borderRadius: 2,
//             boxShadow: "0 8px 32px rgba(139, 0, 0, 0.15)",
//             border: "1px solid rgba(139, 0, 0, 0.1)",
//           },
//         }}
//       >
//         <MenuItem onClick={handleEdit}>
//           <ListItemIcon>
//             <EditIcon sx={{ color: "#8B0000" }} />
//           </ListItemIcon>
//           עריכה
//         </MenuItem>
//         <MenuItem onClick={handleShare}>
//           <ListItemIcon>
//             <ShareIcon sx={{ color: "#8B0000" }} />
//           </ListItemIcon>
//           שיתוף
//         </MenuItem>
//         <Divider />
//         <MenuItem onClick={handleDeleteConfirm} sx={{ color: "#F44336" }}>
//           <ListItemIcon>
//             <DeleteIcon sx={{ color: "#F44336" }} />
//           </ListItemIcon>
//           מחיקה
//         </MenuItem>
//       </Menu>

//       {/* Resume Details Dialog */}
//       <Dialog
//         open={detailsOpen}
//         onClose={handleDetailsClose}
//         fullWidth
//         maxWidth="md"
//         PaperProps={{
//           sx: {
//             borderRadius: 3,
//             overflow: "hidden",
//           },
//         }}
//       >
//         {selectedResume && (
//           <>
//             <DialogTitle className="header-gradient" sx={{ color: "white", p: 3 }}>
//               <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
//                 <Typography variant="h6" sx={{ fontWeight: 600 }}>
//                   פרטי רזומה: {selectedResume.firstName} {selectedResume.lastName}
//                 </Typography>
//                 <IconButton onClick={handleDetailsClose} sx={{ color: "white" }}>
//                   <CloseIcon />
//                 </IconButton>
//               </Box>
//             </DialogTitle>

//             <DialogContent sx={{ p: 4 }}>
//               <Grid container spacing={3} dir="rtl">
//                 <Grid item xs={12} md={6}>
//                   <Paper className="card-elegant" sx={{ p: 3, height: "100%" }}>
//                     <Typography
//                       variant="h6"
//                       gutterBottom
//                       sx={{ color: "#8B0000", display: "flex", alignItems: "center", gap: 1, mb: 3 }}
//                     >
//                       <PersonIcon /> פרטים אישיים
//                     </Typography>
//                     <Box sx={{ space: 2 }}>
//                       <Typography variant="body1" gutterBottom>
//                         <strong>שם מלא:</strong> {selectedResume.firstName} {selectedResume.lastName}
//                       </Typography>
//                       <Typography variant="body1" gutterBottom>
//                         <strong>גיל:</strong> {selectedResume.age || "לא צוין"}
//                       </Typography>
//                       <Typography variant="body1" gutterBottom>
//                         <strong>גובה:</strong> {selectedResume.height ? `${selectedResume.height} ס"מ` : "לא צוין"}
//                       </Typography>
//                       <Typography variant="body1" gutterBottom>
//                         <strong>כתובת:</strong> {selectedResume.address || "לא צוין"}
//                       </Typography>
//                     </Box>
//                   </Paper>
//                 </Grid>

//                 <Grid item xs={12} md={6}>
//                   <Paper className="card-elegant" sx={{ p: 3, height: "100%" }}>
//                     <Typography
//                       variant="h6"
//                       gutterBottom
//                       sx={{ color: "#8B0000", display: "flex", alignItems: "center", gap: 1, mb: 3 }}
//                     >
//                       <FamilyRestroomIcon /> פרטי משפחה
//                     </Typography>
//                     <Box sx={{ space: 2 }}>
//                       <Typography variant="body1" gutterBottom>
//                         <strong>שם האב:</strong> {selectedResume.fatherName || "לא צוין"}
//                       </Typography>
//                       <Typography variant="body1" gutterBottom>
//                         <strong>שם האם:</strong> {selectedResume.motherName || "לא צוין"}
//                       </Typography>
//                     </Box>
//                   </Paper>
//                 </Grid>

//                 <Grid item xs={12} md={6}>
//                   <Paper className="card-elegant" sx={{ p: 3, height: "100%" }}>
//                     <Typography
//                       variant="h6"
//                       gutterBottom
//                       sx={{ color: "#8B0000", display: "flex", alignItems: "center", gap: 1, mb: 3 }}
//                     >
//                       <SchoolIcon /> השכלה
//                     </Typography>
//                     <Box sx={{ space: 2 }}>
//                       <Typography variant="body1" gutterBottom>
//                         <strong>מקום לימודים:</strong> {selectedResume.placeOfStudy || "לא צוין"}
//                       </Typography>
//                     </Box>
//                   </Paper>
//                 </Grid>

//                 <Grid item xs={12} md={6}>
//                   <Paper className="card-elegant" sx={{ p: 3, height: "100%" }}>
//                     <Typography
//                       variant="h6"
//                       gutterBottom
//                       sx={{ color: "#8B0000", display: "flex", alignItems: "center", gap: 1, mb: 3 }}
//                     >
//                       <WorkIcon /> תעסוקה
//                     </Typography>
//                     <Box sx={{ space: 2 }}>
//                       <Typography variant="body1" gutterBottom>
//                         <strong>עיסוק:</strong> {selectedResume.occupation || "לא צוין"}
//                       </Typography>
//                     </Box>
//                   </Paper>
//                 </Grid>

//                 <Grid item xs={12}>
//                   <Paper className="card-elegant" sx={{ p: 3, backgroundColor: "rgba(139, 0, 0, 0.04)" }}>
//                     <Typography variant="body2" color="text.secondary" gutterBottom>
//                       <strong>מזהה קובץ:</strong> {selectedResume.id}
//                     </Typography>
//                     <Typography variant="body2" color="text.secondary" gutterBottom>
//                       <strong>שם קובץ:</strong> {selectedResume.fileName}
//                     </Typography>
//                     <Typography variant="body2" color="text.secondary" gutterBottom>
//                       <strong>תאריך העלאה:</strong> {formatDate(selectedResume.createdAt)}
//                     </Typography>
//                     {selectedResume.updatedAt && (
//                       <Typography variant="body2" color="text.secondary">
//                         <strong>תאריך עדכון:</strong> {formatDate(selectedResume.updatedAt)}
//                       </Typography>
//                     )}
//                   </Paper>
//                 </Grid>
//               </Grid>
//             </DialogContent>

//             <DialogActions sx={{ p: 3, justifyContent: "space-between" }}>
//               <Button onClick={handleDetailsClose} className="btn-secondary">
//                 סגור
//               </Button>
//               <Box sx={{ display: "flex", gap: 2 }}>
//                 <Button
//                   onClick={() => handleViewOriginal(selectedResume)}
//                   className="btn-primary"
//                   startIcon={<OpenInNewIcon />}
//                   disabled={loading}
//                 >
//                   צפה ברזומה המקורי
//                 </Button>
//                 <Button
//                   onClick={() => handleDownload(selectedResume)}
//                   className="btn-primary"
//                   startIcon={<DownloadIcon />}
//                   disabled={loading}
//                 >
//                   הורד רזומה
//                 </Button>
//               </Box>
//             </DialogActions>
//           </>
//         )}
//       </Dialog>

//       {/* Edit Dialog */}
//       {selectedResume && (
//         <EditResumeDialog
//           open={editOpen}
//           onClose={() => setEditOpen(false)}
//           resume={selectedResume}
//           onSuccess={() => showSnackbar("הרזומה עודכנה בהצלחה")}
//         />
//       )}

//       {/* Share Dialog */}
//       {selectedResume && (
//         <ShareDialog
//           open={shareOpen}
//           onClose={() => setShareOpen(false)}
//           resume={selectedResume}
//           onSuccess={() => showSnackbar("הרזומה שותפה בהצלחה")}
//         />
//       )}

//       {/* Delete Confirmation Dialog */}
//       <Confirm
//         open={deleteOpen}
//         onClose={() => setDeleteOpen(false)}
//         onConfirm={handleDelete}
//         title="מחיקת רזומה"
//         message={`האם אתה בטוח שברצונך למחוק את הרזומה של ${selectedResume?.firstName} ${selectedResume?.lastName}?`}
//         confirmText="מחק"
//         cancelText="ביטול"
//         loading={loading}
//       />

//       {/* Snackbar for notifications */}
//       <Snackbar
//         open={snackbar.open}
//         autoHideDuration={6000}
//         onClose={handleSnackbarClose}
//         anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
//       >
//         <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: "100%", borderRadius: 2 }}>
//           {snackbar.message}
//         </Alert>
//       </Snackbar>
//     </Box>
//   )
// }

// export default ResumeList
"use client"

import type React from "react"
import { useState, useCallback } from "react"
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Chip,
  IconButton,
  CircularProgress,
  Pagination,
  useMediaQuery,
  useTheme,
  Tooltip,
  Alert,
  Menu,
  MenuItem,
  ListItemIcon,
  Snackbar,
  Fade,
  Zoom,
} from "@mui/material"
import {
  Download as DownloadIcon,
  Visibility as VisibilityIcon,
  Close as CloseIcon,
  Person as PersonIcon,
  School as SchoolIcon,
  Work as WorkIcon,
  FamilyRestroom as FamilyRestroomIcon,
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Share as ShareIcon,
  AccessTime as AccessTimeIcon,
  OpenInNew as OpenInNewIcon,
  LocationOn as LocationOnIcon,
  Height as HeightIcon,
  Cake as CakeIcon,
} from "@mui/icons-material"
import { useDispatch, useSelector } from "react-redux"
import type { FileData } from "../types/file"
import type { AppDispatch, RootState } from "../store"
import { downloadFile, deleteFile, viewOriginalFile, clearError } from "../slices/fileSlice"
import EditResumeDialog from "./editResume"
import ShareDialog from "./share"
import Confirm from "./confirm"
import axios from "axios"

interface ResumeListProps {
  resumes: FileData[]
  isLoading: boolean
  error?: string
  onDownload: (fileName: string) => void
}

const ResumeList: React.FC<ResumeListProps> = ({ resumes, isLoading, error }) => {
  const dispatch = useDispatch<AppDispatch>()
  const { loading } = useSelector((state: RootState) => state.files)
  const { user } = useSelector((state: RootState) => state.user)

  const [selectedResume, setSelectedResume] = useState<FileData | null>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [shareOpen, setShareOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [page, setPage] = useState(1)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [snackbar, setSnackbar] = useState<{
    open: boolean
    message: string
    severity: "success" | "error" | "info"
  }>({
    open: false,
    message: "",
    severity: "success",
  })

  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
  const itemsPerPage = 10

  const showSnackbar = useCallback((message: string, severity: "success" | "error" | "info" = "success") => {
    setSnackbar({ open: true, message, severity })
  }, [])

  const handleDetailsOpen = useCallback((resume: FileData) => {
    setSelectedResume(resume)
    setDetailsOpen(true)
  }, [])

  const handleDetailsClose = useCallback(() => {
    setDetailsOpen(false)
    setSelectedResume(null)
  }, [])

  const handleDownload = useCallback(
    async (resume: FileData) => {
      if (!resume.fileName) return;

      try {
        const downloadUrl = await dispatch(downloadFile({ fileName: resume.fileName })).unwrap()
        console.log(downloadUrl)
        const response = await fetch(downloadUrl.url)
        const blob = await response.blob()
        const link = document.createElement("a")
        link.href = window.URL.createObjectURL(blob)
        link.download = resume.fileName
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(link.href)

        showSnackbar("הקובץ הורד בהצלחה");
      } catch (error) {
        console.error("Error downloading file:", error);
        showSnackbar("שגיאה בהורדת הקובץ", "error");
      }
    },
    [dispatch, showSnackbar]
  );

  const handleViewOriginal = useCallback(
    async (resume: FileData) => {
      if (!resume.fileName) return

      try {
        await dispatch(viewOriginalFile(resume.fileName)).unwrap()
      } catch (error) {
        showSnackbar("שגיאה בפתיחת הקובץ", "error")
      }
    },
    [dispatch, showSnackbar],
  )

  const handleMenuOpen = useCallback((event: React.MouseEvent<HTMLElement>, resume: FileData) => {
    setAnchorEl(event.currentTarget)
    setSelectedResume(resume)
  }, [])

  const handleMenuClose = useCallback(() => {
    setAnchorEl(null)
  }, [])

  const handleEdit = useCallback(() => {
    setEditOpen(true)
    handleMenuClose()
  }, [handleMenuClose])

  const handleShare = useCallback(() => {
    setShareOpen(true)
    handleMenuClose()
  }, [handleMenuClose])

  const handleDeleteConfirm = useCallback(() => {
    setDeleteOpen(true)
    handleMenuClose()
  }, [handleMenuClose])

  const handleDelete = useCallback(async () => {
    if (!selectedResume) return

    try {
      await dispatch(deleteFile(selectedResume.id)).unwrap()
      showSnackbar("הרזומה נמחקה בהצלחה")
      setDeleteOpen(false)
      setSelectedResume(null)
    } catch (error) {
      showSnackbar("שגיאה במחיקת הרזומה", "error")
    }
  }, [dispatch, selectedResume, showSnackbar])

  const handlePageChange = useCallback((event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value)
  }, [])

  const handleSnackbarClose = useCallback(() => {
    setSnackbar((prev) => ({ ...prev, open: false }))
    dispatch(clearError())
  }, [dispatch])

  const startIndex = (page - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const displayedResumes = resumes.slice(startIndex, endIndex)
  const totalPages = Math.ceil(resumes.length / itemsPerPage)

  const formatDate = useCallback((dateString: string) => {
    return new Date(dateString).toLocaleDateString("he-IL", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }, [])

  const isOwner = useCallback(
    (resume: FileData) => {
      return resume.userId === user.id
    },
    [user.id],
  )

  if (isLoading) {
    return (
      <Zoom in={isLoading}>
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", my: 4 }}>
          <CircularProgress sx={{ color: "#8B0000", mb: 2 }} />
          <Typography variant="body1" sx={{ color: "#8B0000" }}>
            טוען רזומות...
          </Typography>
        </Box>
      </Zoom>
    )
  }

  if (error) {
    return (
      <Fade in={!!error}>
        <Alert severity="error" sx={{ my: 2, borderRadius: 2 }}>
          {error}
        </Alert>
      </Fade>
    )
  }

  if (resumes.length === 0) {
    return (
      <Fade in={resumes.length === 0}>
        <Paper className="card-elegant" sx={{ p: 4, textAlign: "center", my: 2 }}>
          <Typography variant="h6" color="#8B0000" gutterBottom>
            לא נמצאו רזומות
          </Typography>
          <Typography variant="body2" color="text.secondary">
            נסה לשנות את פרמטרי החיפוש או להעלות רזומות חדשות
          </Typography>
        </Paper>
      </Fade>
    )
  }

  return (
    <Box className="fade-in">
      <Paper className="card-elegant" sx={{ overflow: "hidden" }}>
        <Box className="header-gradient" sx={{ p: 3, color: "white" }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              רזומות במערכת ({resumes.length})
            </Typography>
            <Chip
              label={`עמוד ${page} מתוך ${totalPages || 1}`}
              size="small"
              sx={{
                backgroundColor: "rgba(255, 255, 255, 0.2)",
                color: "white",
                fontWeight: 500,
              }}
            />
          </Box>
        </Box>

        <List sx={{ width: "100%", bgcolor: "background.paper", p: 0 }}>
          {displayedResumes.map((resume, index) => (
            <Fade in={true} timeout={300 + index * 100} key={resume.id}>
              <Box>
                {index > 0 && <Divider />}
                <ListItem
                  sx={{
                    py: 3,
                    px: 3,
                    transition: "all 0.3s ease",
                    "&:hover": {
                      backgroundColor: "rgba(139, 0, 0, 0.04)",
                      transform: "translateX(-4px)",
                    },
                  }}
                >
                  <Box sx={{ flex: 1 }}>
                    {/* Primary content */}
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: "bold",
                          color: "#8B0000",
                          direction: "rtl",
                        }}
                      >
                        {resume.firstName} {resume.lastName}
                      </Typography>
                      {isOwner(resume) && (
                        <Chip
                          label="שלי"
                          size="small"
                          sx={{
                            backgroundColor: "#D4AF37",
                            color: "white",
                            fontWeight: 600,
                            fontSize: "0.75rem",
                          }}
                        />
                      )}
                    </Box>
                    
                    {/* Secondary content - using Box instead of ListItemText secondary */}
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1, direction: "rtl" }}>
                      {resume.age && (
                        <Chip
                          icon={<CakeIcon />}
                          label={`גיל: ${resume.age}`}
                          size="small"
                          sx={{
                            backgroundColor: "rgba(139, 0, 0, 0.08)",
                            color: "#5c0000",
                            "& .MuiChip-icon": { color: "#8B0000" },
                          }}
                        />
                      )}
                      {resume.height && (
                        <Chip
                          icon={<HeightIcon />}
                          label={`גובה: ${resume.height} ס"מ`}
                          size="small"
                          sx={{
                            backgroundColor: "rgba(139, 0, 0, 0.08)",
                            color: "#5c0000",
                            "& .MuiChip-icon": { color: "#8B0000" },
                          }}
                        />
                      )}
                      {resume.address && (
                        <Chip
                          icon={<LocationOnIcon />}
                          label={resume.address}
                          size="small"
                          sx={{
                            backgroundColor: "rgba(139, 0, 0, 0.08)",
                            color: "#5c0000",
                            "& .MuiChip-icon": { color: "#8B0000" },
                          }}
                        />
                      )}
                      <Box component="span" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <AccessTimeIcon sx={{ fontSize: 16, color: "text.secondary" }} />
                        <Typography variant="caption" color="text.secondary" component="span">
                          הועלה: {formatDate(resume.createdAt)}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>

                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Tooltip title="צפה בפרטים">
                      <IconButton onClick={() => handleDetailsOpen(resume)} sx={{ color: "#8B0000" }}>
                        <VisibilityIcon />
                      </IconButton>
                    </Tooltip>

                    <Tooltip title="הורד רזומה">
                      <IconButton onClick={() => handleDownload(resume)} sx={{ color: "#8B0000" }} disabled={loading}>
                        <DownloadIcon />
                      </IconButton>
                    </Tooltip>

                    <Tooltip title="צפה ברזומה המקורי">
                      <IconButton
                        onClick={() => handleViewOriginal(resume)}
                        sx={{ color: "#8B0000" }}
                        disabled={loading}
                      >
                        <OpenInNewIcon />
                      </IconButton>
                    </Tooltip>

                    {isOwner(resume) && (
                      <Tooltip title="אפשרויות נוספות">
                        <IconButton onClick={(e) => handleMenuOpen(e, resume)} sx={{ color: "#8B0000" }}>
                          <MoreVertIcon />
                        </IconButton>
                      </Tooltip>
                    )}
                  </Box>
                </ListItem>
              </Box>
            </Fade>
          ))}
        </List>

        {totalPages > 1 && (
          <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={handlePageChange}
              color="standard"
              size={isMobile ? "small" : "medium"}
              sx={{
                "& .MuiPaginationItem-root.Mui-selected": {
                  backgroundColor: "#8B0000",
                  color: "white",
                },
                "& .MuiPaginationItem-root:hover": {
                  backgroundColor: "rgba(139, 0, 0, 0.1)",
                },
              }}
            />
          </Box>
        )}
      </Paper>

      {/* Actions Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: "0 8px 32px rgba(139, 0, 0, 0.15)",
            border: "1px solid rgba(139, 0, 0, 0.1)",
          },
        }}
      >
        <MenuItem onClick={handleEdit}>
          <ListItemIcon>
            <EditIcon sx={{ color: "#8B0000" }} />
          </ListItemIcon>
          עריכה
        </MenuItem>
        <MenuItem onClick={handleShare}>
          <ListItemIcon>
            <ShareIcon sx={{ color: "#8B0000" }} />
          </ListItemIcon>
          שיתוף
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleDeleteConfirm} sx={{ color: "#F44336" }}>
          <ListItemIcon>
            <DeleteIcon sx={{ color: "#F44336" }} />
          </ListItemIcon>
          מחיקה
        </MenuItem>
      </Menu>

      {/* Resume Details Dialog */}
      <Dialog
        open={detailsOpen}
        onClose={handleDetailsClose}
        fullWidth
        maxWidth="md"
        PaperProps={{
          sx: {
            borderRadius: 3,
            overflow: "hidden",
          },
        }}
      >
        {selectedResume && (
          <>
            <DialogTitle className="header-gradient" sx={{ color: "white", p: 3 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  פרטי רזומה: {selectedResume.firstName} {selectedResume.lastName}
                </Typography>
                <IconButton onClick={handleDetailsClose} sx={{ color: "white" }}>
                  <CloseIcon />
                </IconButton>
              </Box>
            </DialogTitle>

            <DialogContent sx={{ p: 4 }}>
              <Grid container spacing={3} dir="rtl">
                <Grid item xs={12} md={6}>
                  <Paper className="card-elegant" sx={{ p: 3, height: "100%" }}>
                    <Typography
                      variant="h6"
                      gutterBottom
                      sx={{ color: "#8B0000", display: "flex", alignItems: "center", gap: 1, mb: 3 }}
                    >
                      <PersonIcon /> פרטים אישיים
                    </Typography>
                    <Box sx={{ space: 2 }}>
                      <Typography variant="body1" gutterBottom>
                        <strong>שם מלא:</strong> {selectedResume.firstName} {selectedResume.lastName}
                      </Typography>
                      <Typography variant="body1" gutterBottom>
                        <strong>גיל:</strong> {selectedResume.age || "לא צוין"}
                      </Typography>
                      <Typography variant="body1" gutterBottom>
                        <strong>גובה:</strong> {selectedResume.height ? `${selectedResume.height} ס"מ` : "לא צוין"}
                      </Typography>
                      <Typography variant="body1" gutterBottom>
                        <strong>כתובת:</strong> {selectedResume.address || "לא צוין"}
                      </Typography>
                    </Box>
                  </Paper>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Paper className="card-elegant" sx={{ p: 3, height: "100%" }}>
                    <Typography
                      variant="h6"
                      gutterBottom
                      sx={{ color: "#8B0000", display: "flex", alignItems: "center", gap: 1, mb: 3 }}
                    >
                      <FamilyRestroomIcon /> פרטי משפחה
                    </Typography>
                    <Box sx={{ space: 2 }}>
                      <Typography variant="body1" gutterBottom>
                        <strong>שם האב:</strong> {selectedResume.fatherName || "לא צוין"}
                      </Typography>
                      <Typography variant="body1" gutterBottom>
                        <strong>שם האם:</strong> {selectedResume.motherName || "לא צוין"}
                      </Typography>
                    </Box>
                  </Paper>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Paper className="card-elegant" sx={{ p: 3, height: "100%" }}>
                    <Typography
                      variant="h6"
                      gutterBottom
                      sx={{ color: "#8B0000", display: "flex", alignItems: "center", gap: 1, mb: 3 }}
                    >
                      <SchoolIcon /> השכלה
                    </Typography>
                    <Box sx={{ space: 2 }}>
                      <Typography variant="body1" gutterBottom>
                        <strong>מקום לימודים:</strong> {selectedResume.placeOfStudy || "לא צוין"}
                      </Typography>
                    </Box>
                  </Paper>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Paper className="card-elegant" sx={{ p: 3, height: "100%" }}>
                    <Typography
                      variant="h6"
                      gutterBottom
                      sx={{ color: "#8B0000", display: "flex", alignItems: "center", gap: 1, mb: 3 }}
                    >
                      <WorkIcon /> תעסוקה
                    </Typography>
                    <Box sx={{ space: 2 }}>
                      <Typography variant="body1" gutterBottom>
                        <strong>עיסוק:</strong> {selectedResume.occupation || "לא צוין"}
                      </Typography>
                    </Box>
                  </Paper>
                </Grid>

                <Grid item xs={12}>
                  <Paper className="card-elegant" sx={{ p: 3, backgroundColor: "rgba(139, 0, 0, 0.04)" }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      <strong>מזהה קובץ:</strong> {selectedResume.id}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      <strong>שם קובץ:</strong> {selectedResume.fileName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      <strong>תאריך העלאה:</strong> {formatDate(selectedResume.createdAt)}
                    </Typography>
                    {selectedResume.updatedAt && (
                      <Typography variant="body2" color="text.secondary">
                        <strong>תאריך עדכון:</strong> {formatDate(selectedResume.updatedAt)}
                      </Typography>
                    )}
                  </Paper>
                </Grid>
              </Grid>
            </DialogContent>

            <DialogActions sx={{ p: 3, justifyContent: "space-between" }}>
              <Button onClick={handleDetailsClose} className="btn-secondary">
                סגור
              </Button>
              <Box sx={{ display: "flex", gap: 2 }}>
                <Button
                  onClick={() => handleViewOriginal(selectedResume)}
                  className="btn-primary"
                  startIcon={<OpenInNewIcon />}
                  disabled={loading}
                >
                  צפה ברזומה המקורי
                </Button>
                <Button
                  onClick={() => handleDownload(selectedResume)}
                  className="btn-primary"
                  startIcon={<DownloadIcon />}
                  disabled={loading}
                >
                  הורד רזומה
                </Button>
              </Box>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Edit Dialog */}
      {selectedResume && (
        <EditResumeDialog
          open={editOpen}
          onClose={() => setEditOpen(false)}
          resume={selectedResume}
          onSuccess={() => showSnackbar("הרזומה עודכנה בהצלחה")}
        />
      )}

      {/* Share Dialog */}
      {selectedResume && (
        <ShareDialog
          open={shareOpen}
          onClose={() => setShareOpen(false)}
          resume={selectedResume}
          onSuccess={() => showSnackbar("הרזומה שותפה בהצלחה")}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <Confirm
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
        title="מחיקת רזומה"
        message={`האם אתה בטוח שברצונך למחוק את הרזומה של ${selectedResume?.firstName} ${selectedResume?.lastName}?`}
        confirmText="מחק"
        cancelText="ביטול"
        loading={loading}
      />

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: "100%", borderRadius: 2 }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default ResumeList