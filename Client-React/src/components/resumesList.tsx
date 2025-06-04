"use client"

import React, { useState } from "react"
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
} from "@mui/icons-material"
import { useDispatch, useSelector } from "react-redux"
import type { FileData } from "../types/file"
import type { AppDispatch, RootState } from "../store"
import { downloadFile, deleteFile } from "../slices/fileSlice"
import EditResumeDialog from "./editResume"
import ShareDialog from "./share"

interface ResumeListProps {
  resumes: FileData[]
  isLoading: boolean
  error?: string
  onDownload: (fileName: string) => void
}

const ResumeList: React.FC<ResumeListProps> = ({ resumes, isLoading, error, onDownload }) => {
  const dispatch = useDispatch<AppDispatch>()
  const { user } = useSelector((state: RootState) => state.user)

  const [selectedResume, setSelectedResume] = useState<FileData | null>(null)
  const [open, setOpen] = useState(false)
  const [page, setPage] = useState(1)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [selectedResumeForMenu, setSelectedResumeForMenu] = useState<FileData | null>(null)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [shareDialogOpen, setShareDialogOpen] = useState(false)
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: "success" | "error" }>({
    open: false,
    message: "",
    severity: "success",
  })

  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
  const itemsPerPage = 10

  const handleOpen = (resume: FileData) => {
    setSelectedResume(resume)
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
    setSelectedResume(null)
  }

  const handleDownload = async (resume: FileData) => {
    if (resume.fileName) {
      try {
        await dispatch(downloadFile({ fileName: resume.fileName })).unwrap()
        setSnackbar({ open: true, message: "הקובץ הורד בהצלחה", severity: "success" })
      } catch (error) {
        setSnackbar({ open: true, message: "שגיאה בהורדת הקובץ", severity: "error" })
      }
    }
  }

  const handleViewOriginal = async (resume: FileData) => {
    if (resume.fileName) {
      try {
        // Get the download URL and open it in a new tab
        const response = await fetch(
          `http://localhost:5138/api/Download_ShowFiles/download-url?fileName=${encodeURIComponent(resume.fileName)}`,
        )
        const data = await response.json()

        if (data.url) {
          window.open(data.url, "_blank")
        } else {
          setSnackbar({ open: true, message: "לא ניתן לפתוח את הקובץ", severity: "error" })
        }
      } catch (error) {
        setSnackbar({ open: true, message: "שגיאה בפתיחת הקובץ", severity: "error" })
      }
    }
  }

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, resume: FileData) => {
    setAnchorEl(event.currentTarget)
    setSelectedResumeForMenu(resume)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
    setSelectedResumeForMenu(null)
  }

  const handleEdit = () => {
    setEditDialogOpen(true)
    handleMenuClose()
  }

  const handleDelete = async () => {
    if (selectedResumeForMenu && window.confirm("האם אתה בטוח שברצונך למחוק את הרזומה?")) {
      try {
        await dispatch(deleteFile(selectedResumeForMenu.id)).unwrap()
        setSnackbar({ open: true, message: "הרזומה נמחקה בהצלחה", severity: "success" })
      } catch (error) {
        setSnackbar({ open: true, message: "שגיאה במחיקת הרזומה", severity: "error" })
      }
    }
    handleMenuClose()
  }

  const handleShare = () => {
    setShareDialogOpen(true)
    handleMenuClose()
  }

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value)
  }

  const startIndex = (page - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const displayedResumes = resumes.slice(startIndex, endIndex)
  const totalPages = Math.ceil(resumes.length / itemsPerPage)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("he-IL", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", my: 4 }}>
        <CircularProgress sx={{ color: "#8B0000", mb: 2 }} />
        <Typography variant="body1" sx={{ color: "#8B0000" }}>
          טוען רזומות...
        </Typography>
      </Box>
    )
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ my: 2, borderRadius: 2 }}>
        {error}
      </Alert>
    )
  }

  if (resumes.length === 0) {
    return (
      <Paper className="card-elegant" sx={{ p: 4, textAlign: "center", my: 2 }}>
        <Typography variant="h6" color="#8B0000" gutterBottom>
          לא נמצאו רזומות
        </Typography>
        <Typography variant="body2" color="text.secondary">
          נסה לשנות את פרמטרי החיפוש או להעלות רזומות חדשות
        </Typography>
      </Paper>
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
            <React.Fragment key={resume.id}>
              {index > 0 && <Divider />}
              <ListItem
                className="slide-up"
                sx={{
                  py: 3,
                  px: 3,
                  transition: "all 0.3s ease",
                  "&:hover": {
                    backgroundColor: "rgba(139, 0, 0, 0.04)",
                    transform: "translateX(-4px)",
                  },
                  animation: `slideUp 0.6s ease-out ${index * 0.1}s both`,
                }}
              >
                <ListItemText
                  primary={
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
                      {resume.isOwner && (
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
                  }
                  secondary={
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <AccessTimeIcon sx={{ fontSize: 16, color: "text.secondary" }} />
                      <Typography variant="caption" color="text.secondary">
                        הועלה: {formatDate(resume.createdAt)}
                      </Typography>
                    </Box>
                  }
                />

                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Tooltip title="צפה בפרטים">
                    <IconButton onClick={() => handleOpen(resume)} sx={{ color: "#8B0000" }}>
                      <VisibilityIcon />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="הורד רזומה">
                    <IconButton onClick={() => handleDownload(resume)} sx={{ color: "#8B0000" }}>
                      <DownloadIcon />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="צפה ברזומה המקורי">
                    <IconButton onClick={() => handleViewOriginal(resume)} sx={{ color: "#8B0000" }}>
                      <OpenInNewIcon />
                    </IconButton>
                  </Tooltip>

                  {resume.isOwner && (
                    <Tooltip title="אפשרויות נוספות">
                      <IconButton onClick={(e) => handleMenuClick(e, resume)} sx={{ color: "#8B0000" }}>
                        <MoreVertIcon />
                      </IconButton>
                    </Tooltip>
                  )}
                </Box>
              </ListItem>
            </React.Fragment>
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

      {/* Menu for owner actions */}
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
        <MenuItem onClick={handleDelete} sx={{ color: "#F44336" }}>
          <ListItemIcon>
            <DeleteIcon sx={{ color: "#F44336" }} />
          </ListItemIcon>
          מחיקה
        </MenuItem>
      </Menu>

      {/* Resume Details Dialog */}
      <Dialog
        open={open}
        onClose={handleClose}
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
                <IconButton onClick={handleClose} sx={{ color: "white" }}>
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
                        <strong>גיל:</strong> {selectedResume.age}
                      </Typography>
                      <Typography variant="body1" gutterBottom>
                        <strong>גובה:</strong> {selectedResume.height} ס"מ
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
              <Button onClick={handleClose} className="btn-secondary">
                סגור
              </Button>
              <Box sx={{ display: "flex", gap: 2 }}>
                <Button
                  onClick={() => handleViewOriginal(selectedResume)}
                  className="btn-primary"
                  startIcon={<OpenInNewIcon />}
                >
                  צפה ברזומה המקורי
                </Button>
                <Button
                  onClick={() => handleDownload(selectedResume)}
                  className="btn-primary"
                  startIcon={<DownloadIcon />}
                >
                  הורד רזומה
                </Button>
              </Box>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Edit Dialog */}
      {selectedResumeForMenu && (
        <EditResumeDialog
          open={editDialogOpen}
          onClose={() => setEditDialogOpen(false)}
          resume={selectedResumeForMenu}
        />
      )}

      {/* Share Dialog */}
      {selectedResumeForMenu && (
        <ShareDialog open={shareDialogOpen} onClose={() => setShareDialogOpen(false)} resume={selectedResumeForMenu} />
      )}

      {/* Snackbar for notifications */}
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
    </Box>
  )
}

export default ResumeList
