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
} from "@mui/material"
import DownloadIcon from "@mui/icons-material/Download"
import VisibilityIcon from "@mui/icons-material/Visibility"
import CloseIcon from "@mui/icons-material/Close"
import PersonIcon from "@mui/icons-material/Person"
import SchoolIcon from "@mui/icons-material/School"
import WorkIcon from "@mui/icons-material/Work"
import LocationOnIcon from "@mui/icons-material/LocationOn"
import HeightIcon from "@mui/icons-material/Height"
import CakeIcon from "@mui/icons-material/Cake"
import FamilyRestroomIcon from "@mui/icons-material/FamilyRestroom"
import type { FileData } from "../types/file"

interface ResumeListProps {
  resumes: FileData[]
  isLoading: boolean
  error?: string
  onDownload: (fileId: number, fileName: string) => void
}

const ResumeList: React.FC<ResumeListProps> = ({ resumes, isLoading, error, onDownload }) => {
  const [selectedResume, setSelectedResume] = useState<FileData | null>(null)
  const [open, setOpen] = useState(false)
  const [page, setPage] = useState(1)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
  const itemsPerPage = 10

  const handleOpen = (resume: FileData) => {
    setSelectedResume(resume)
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleDownload = (resume: FileData) => {
    if (resume.id && resume.fileName) {
      onDownload(resume.id, resume.fileName);
    } else {
      alert('שגיאה: לא ניתן להוריד את הקובץ.');
    }
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value)
  }

  const startIndex = (page - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const displayedResumes = resumes.slice(startIndex, endIndex)
  const totalPages = Math.ceil(resumes.length / itemsPerPage)

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
        <CircularProgress sx={{ color: "#8B0000" }} />
        <Typography variant="body1" sx={{ ml: 2 }}>טוען רזומות...</Typography>
      </Box>
    )
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ my: 2 }}>
        {error}
      </Alert>
    )
  }

  if (resumes.length === 0) {
    return (
      <Paper
        elevation={2}
        sx={{
          p: 3,
          textAlign: "center",
          backgroundColor: "#f9f5f5",
          border: "1px solid #e5d6d6",
        }}
      >
        <Typography variant="h6" color="#8B0000">
          לא נמצאו רזומות
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          נסה לשנות את פרמטרי החיפוש או להעלות רזומות חדשות
        </Typography>
      </Paper>
    )
  }

  return (
    <Box>
      <Paper
        elevation={3}
        sx={{
          borderRadius: 2,
          overflow: "hidden",
          backgroundColor: "#fff",
          border: "1px solid #e5d6d6",
        }}
      >
        <Box
          sx={{
            p: 2,
            backgroundColor: "#8B0000",
            color: "white",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h6">רזומות ({resumes.length})</Typography>
          <Chip
            label={`עמוד ${page} מתוך ${totalPages || 1}`}
            size="small"
            sx={{
              backgroundColor: "rgba(255, 255, 255, 0.2)",
              color: "white",
            }}
          />
        </Box>

        <List sx={{ width: "100%", bgcolor: "background.paper" }}>
          {displayedResumes.map((resume, index) => (
            <React.Fragment key={resume.id}>
              {index > 0 && <Divider component="li" />}
              <ListItem
                alignItems="flex-start"
                sx={{
                  transition: "background-color 0.2s",
                  "&:hover": {
                    backgroundColor: "rgba(139, 0, 0, 0.04)",
                  },
                  py: 2,
                }}
                secondaryAction={
                  <Box>
                    <Tooltip title="צפה בפרטים">
                      <IconButton
                        edge="end"
                        aria-label="view"
                        onClick={() => handleOpen(resume)}
                        sx={{
                          color: "#8B0000",
                          mr: 1,
                        }}
                      >
                        <VisibilityIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="הורד רזומה">
                      <IconButton
                        edge="end"
                        aria-label="download"
                        onClick={() => handleDownload(resume)}
                        sx={{ color: "#8B0000" }}
                      >
                        <DownloadIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                }
              >
                <ListItemText
                  primary={
                    <Typography
                      variant="subtitle1"
                      sx={{
                        fontWeight: "bold",
                        color: "#8B0000",
                        direction: "rtl",
                      }}
                    >
                      {resume.firstName} {resume.lastName}
                    </Typography>
                  }
                  secondary={
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
                    </Box>
                  }
                />
              </ListItem>
            </React.Fragment>
          ))}
        </List>

        {totalPages > 1 && (
          <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={handlePageChange}
              color="standard"
              size={isMobile ? "small" : "medium"}
              sx={{
                "& .MuiPaginationItem-root.Mui-selected": {
                  backgroundColor: "rgba(139, 0, 0, 0.8)",
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

      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth="md"
        PaperProps={{
          sx: {
            borderRadius: 2,
            overflow: "hidden",
          },
        }}
      >
        {selectedResume && (
          <>
            <DialogTitle
              sx={{
                backgroundColor: "#8B0000",
                color: "white",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                p: 2,
              }}
            >
              <Typography variant="h6">
                פרטי רזומה: {selectedResume.firstName} {selectedResume.lastName}
              </Typography>
              <IconButton
                aria-label="close"
                onClick={handleClose}
                sx={{
                  color: "white",
                }}
              >
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            <DialogContent dividers sx={{ p: 3 }}>
              <Grid container spacing={3} dir="rtl">
                <Grid item xs={12} md={6}>
                  <Paper elevation={1} sx={{ p: 2, height: "100%" }}>
                    <Typography
                      variant="h6"
                      gutterBottom
                      sx={{ color: "#8B0000", display: "flex", alignItems: "center", gap: 1 }}
                    >
                      <PersonIcon /> פרטים אישיים
                    </Typography>
                    <Box sx={{ mt: 2 }}>
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
                  <Paper elevation={1} sx={{ p: 2, height: "100%" }}>
                    <Typography
                      variant="h6"
                      gutterBottom
                      sx={{ color: "#8B0000", display: "flex", alignItems: "center", gap: 1 }}
                    >
                      <FamilyRestroomIcon /> פרטי משפחה
                    </Typography>
                    <Box sx={{ mt: 2 }}>
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
                  <Paper elevation={1} sx={{ p: 2, height: "100%" }}>
                    <Typography
                      variant="h6"
                      gutterBottom
                      sx={{ color: "#8B0000", display: "flex", alignItems: "center", gap: 1 }}
                    >
                      <SchoolIcon /> השכלה
                    </Typography>
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="body1" gutterBottom>
                        <strong>מקום לימודים:</strong> {selectedResume.placeOfStudy || "לא צוין"}
                      </Typography>
                    </Box>
                  </Paper>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Paper elevation={1} sx={{ p: 2, height: "100%" }}>
                    <Typography
                      variant="h6"
                      gutterBottom
                      sx={{ color: "#8B0000", display: "flex", alignItems: "center", gap: 1 }}
                    >
                      <WorkIcon /> תעסוקה
                    </Typography>
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="body1" gutterBottom>
                        <strong>עיסוק:</strong> {selectedResume.occupation || "לא צוין"}
                      </Typography>
                    </Box>
                  </Paper>
                </Grid>

                <Grid item xs={12}>
                  <Paper elevation={1} sx={{ p: 2, backgroundColor: "rgba(139, 0, 0, 0.04)" }}>
                    <Typography variant="body2" color="text.secondary">
                      <strong>מזהה קובץ:</strong> {selectedResume.id}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>שם קובץ:</strong> {selectedResume.fileName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>תאריך העלאה:</strong> {new Date(selectedResume.createdAt).toLocaleDateString("he-IL")}
                    </Typography>
                    {selectedResume.updatedAt && (
                      <Typography variant="body2" color="text.secondary">
                        <strong>תאריך עדכון:</strong> {new Date(selectedResume.updatedAt).toLocaleDateString("he-IL")}
                      </Typography>
                    )}
                  </Paper>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions sx={{ p: 2, justifyContent: "space-between" }}>
              <Button
                onClick={handleClose}
                sx={{
                  color: "#8B0000",
                  "&:hover": {
                    backgroundColor: "rgba(139, 0, 0, 0.04)",
                  },
                }}
              >
                סגור
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  )
}

export default ResumeList
