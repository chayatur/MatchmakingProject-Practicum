"use client"

import type React from "react"
import { useState, useEffect, useCallback } from "react"
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
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
  Delete as DeleteIcon,
  AccessTime as AccessTimeIcon,
  OpenInNew as OpenInNewIcon,
  Groups as GroupsIcon,
} from "@mui/icons-material"
import ShareIcon from "@mui/icons-material/Share"

import { useDispatch, useSelector } from "react-redux"
import type { FileData } from "../types/file"
import type { AppDispatch, RootState } from "../store"
import { clearError, deleteFile, downloadFile, viewOriginalFile, fetchFiles } from "../slices/fileSlice"
import ShareDialog from "./share"

interface ResumeListProps {
  resumes: FileData[]
  isLoading: boolean
  error?: string
}

const ResumeList: React.FC<ResumeListProps> = ({ resumes, isLoading, error }) => {
  const dispatch = useDispatch<AppDispatch>()
  const { loading } = useSelector((state: RootState) => state.files)
  const { userId } = useSelector((state: RootState) => state.user)

  const [selectedResume, setSelectedResume] = useState<FileData | null>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)
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
      if (!resume.fileName) return

      try {
        const downloadUrl = await dispatch(downloadFile({ fileName: resume.fileName })).unwrap()
        const response = await fetch(downloadUrl.url)
        const blob = await response.blob()
        const link = document.createElement("a")
        link.href = window.URL.createObjectURL(blob)
        link.download = resume.fileName
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(link.href)

        showSnackbar("הקובץ הורד בהצלחה")
      } catch (error) {
        console.error("Error downloading file:", error)
        showSnackbar("שגיאה בהורדת הקובץ", "error")
      }
    },
    [dispatch, showSnackbar],
  )

  const handleViewOriginal = useCallback(
    async (resume: FileData) => {
      if (!resume.fileName) return

      try {
        const response = await dispatch(viewOriginalFile({ fileName: resume.fileName })).unwrap()
        if (response.success && response.url) {
          window.open(response.url, "_blank")
          showSnackbar("הקובץ נפתח בהצלחה", "success")
        }
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

  const handleShareClick = useCallback(() => {
    if (selectedResume) {
      setShareOpen(true)
      handleMenuClose()
    }
  }, [selectedResume, handleMenuClose])

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
    console.log(event);
    
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
      return resume.userId === userId
    },
    [userId],
  )

  const isSharedWithMe = useCallback(
    (resume: FileData) => {
      return resume.isSharedWithMe || false
    },
    [],
  )

  useEffect(() => {
    if (userId) {
      dispatch(fetchFiles())
    }
  }, [dispatch, userId])

  useEffect(() => {
    resumes.forEach((resume) => {
      console.log(`  Resume ID ${resume.id}: isOwner=${resume.isOwner}, isSharedWithMe=${resume.isSharedWithMe}`)
    })
  }, [resumes])

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
        <Paper sx={{ p: 4, textAlign: "center", my: 2, borderRadius: 3 }}>
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
    <Box>
      <Paper sx={{ overflow: "hidden", borderRadius: 3, boxShadow: "0 8px 32px rgba(139, 0, 0, 0.1)" }}>
        <Box sx={{ p: 3, background: "linear-gradient(135deg, #8B0000 0%, #5c0000 100%)", color: "white" }}>
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
                    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 1 }}>
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
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <AccessTimeIcon sx={{ fontSize: 16, color: "text.secondary" }} />
                        <Typography variant="caption" color="text.secondary" component="span">
                          הועלה: {formatDate(resume.createdAt)}
                        </Typography>
                        {/* Chips for owner and shared status */}
                        {isOwner(resume) && (
                          <Chip
                          icon={<PersonIcon sx={{ color: "white !important", fontSize: "16px" }} />}
                            label="הרזומה שלי"
                            size="small"
                            sx={{
                              backgroundColor: "#8B0000",
                              color: "white",
                              fontWeight: 600,
                            }}
                          />
                        )}
                        {isSharedWithMe(resume) && (
                          <Chip
                            label="שותף איתי"
                            icon={<GroupsIcon sx={{ color: "white !important", fontSize: "16px" }} />}
                            size="small"
                            sx={{
                              backgroundColor: "#722F37",
                              color: "white",
                              fontWeight: 600,
                            }}
                          />
                        )}
                      </Box>
                    </Box>
                  </Box>

                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Tooltip title="צפה בפרטים">
                      <IconButton onClick={() => handleDetailsOpen(resume)} sx={{ color: "#8B0000" }}>
                        <VisibilityIcon />
                      </IconButton>
                    </Tooltip>
                    {(isOwner(resume) || isSharedWithMe(resume)) && (
                      <Tooltip title="הורד רזומה">
                        <IconButton onClick={() => handleDownload(resume)} sx={{ color: "#8B0000" }} disabled={loading}>
                          <DownloadIcon />
                        </IconButton>
                      </Tooltip>
                    )}
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
        <MenuItem onClick={handleShareClick}>
          <ListItemIcon>
            <Box sx={{ color: "#8B0000" }}>
              <ShareIcon />
            </Box>
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
            <DialogTitle
              sx={{
                background: "linear-gradient(135deg, #8B0000 0%, #722F37 100%)",
                color: "white",
                p: 3,
              }}
            >
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    פרטי רזומה: {selectedResume.firstName} {selectedResume.lastName}
                  </Typography>
                  {isSharedWithMe(selectedResume) && (
                    <Chip
                      icon={<GroupsIcon sx={{ color: "white !important", fontSize: "16px" }} />}
                      label="שותף איתי"
                      size="small"
                      sx={{
                        backgroundColor: "rgba(255, 255, 255, 0.2)",
                        color: "white",
                        fontWeight: 600,
                        fontSize: "0.7rem",
                      }}
                    />
                  )}
                </Box>
                <IconButton onClick={handleDetailsClose} sx={{ color: "white" }}>
                  <CloseIcon />
                </IconButton>
              </Box>
            </DialogTitle>

            <DialogContent sx={{ p: 4 }}>
              <Grid container spacing={3} dir="rtl">
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 3, height: "100%", borderRadius: 2 }}>
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
                  <Paper sx={{ p: 3, height: "100%", borderRadius: 2 }}>
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
                  <Paper sx={{ p: 3, height: "100%", borderRadius: 2 }}>
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
                  <Paper sx={{ p: 3, height: "100%", borderRadius: 2 }}>
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
                  <Paper sx={{ p: 3, backgroundColor: "rgba(139, 0, 0, 0.04)", borderRadius: 2 }}>
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
              <Button onClick={handleDetailsClose} variant="outlined" sx={{ borderColor: "#ccc", color: "#666" }}>
                סגור
              </Button>
              <Box sx={{ display: "flex", gap: 2 }}>
                <Button
                  onClick={() => handleViewOriginal(selectedResume)}
                  variant="contained"
                  startIcon={<OpenInNewIcon />}
                  disabled={loading}
                  sx={{
                    backgroundColor: "#8B0000",
                    "&:hover": { backgroundColor: "#5c0000" },
                  }}
                >
                  צפה ברזומה המקורי
                </Button>
                {(isOwner(selectedResume) || isSharedWithMe(selectedResume)) && (
                  <Tooltip title="הורד רזומה">
                    <IconButton
                      onClick={() => handleDownload(selectedResume)}
                      sx={{ color: "#8B0000" }}
                      disabled={loading}
                    >
                      <DownloadIcon />
                    </IconButton>
                  </Tooltip>
                )}
              </Box>
            </DialogActions>
          </>
        )}
      </Dialog>

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
      <Dialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: 3,
          },
        }}
      >
        <DialogTitle sx={{ color: "#8B0000", fontWeight: 600 }}>מחיקת רזומה</DialogTitle>
        <DialogContent>
          <Typography>
            האם אתה בטוח שברצונך למחוק את הרזומה של {selectedResume?.firstName} {selectedResume?.lastName}?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setDeleteOpen(false)} variant="outlined" sx={{ borderColor: "#ccc", color: "#666" }}>
            ביטול
          </Button>
          <Button
            onClick={handleDelete}
            variant="contained"
            disabled={loading}
            sx={{
              backgroundColor: "#f44336",
              "&:hover": { backgroundColor: "#d32f2f" },
            }}
          >
            מחק
          </Button>
        </DialogActions>
      </Dialog>

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
