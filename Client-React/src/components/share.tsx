import React, { useState, useEffect } from "react"
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
  IconButton,
  Box,
  Snackbar,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
} from "@mui/material"
import { Close as CloseIcon, Share as ShareIcon, Person as PersonIcon, Search as SearchIcon } from "@mui/icons-material"
import { useDispatch } from "react-redux"
import axios from "axios"
import type { AppDispatch } from "../store"
import { shareFile } from "../slices/fileSlice"
import "../styles/share.css"
import { FileData } from "../types/file"
import { User } from "../types/user"

interface ShareDialogProps {
  open: boolean
  onClose: () => void
  resume: FileData | null
}

const ShareDialog: React.FC<ShareDialogProps> = ({ open, onClose, resume }) => {
  const dispatch = useDispatch<AppDispatch>()

  const [users, setUsers] = useState<User[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(false)
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: "success" | "error" }>({
    open: false,
    message: "",
    severity: "success",
  })

  useEffect(() => {
    if (open) {
      fetchUsers()
    }
  }, [open])

  const fetchUsers = async () => {
    try {
      const response = await axios.get<User[]>("http://localhost:5138/api/User")
      // Filter out current user
      const filteredUsers = response.data.filter((user) => resume && user.id !== resume.userId)
      setUsers(filteredUsers)
    } catch (error) {
      console.error("Error fetching users:", error)
      setSnackbar({
        open: true,
        message: "שגיאה בטעינת רשימת המשתמשים",
        severity: "error",
      })
    }
  }

  const filteredUsers = users.filter(
    (user) =>
      user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleShare = async (userId: number) => {
    if (!resume) return

    setLoading(true)
    try {
      await dispatch(
        shareFile({
          resumeFileId: resume.id,
          sharedWithUserId: userId,
        })
      ).unwrap()

      setSnackbar({
        open: true,
        message: "הרזומה שותפה בהצלחה",
        severity: "success",
      })

      setTimeout(() => {
        onClose()
      }, 1500)
    } catch (error) {
      setSnackbar({
        open: true,
        message: "שגיאה בשיתוף הרזומה",
        severity: "error",
      })
    } finally {
      setLoading(false)
    }
  }

  if (!resume) {
    return null
  }

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        fullWidth
        maxWidth="sm"
        className="share-dialog"
        PaperProps={{
          sx: {
            borderRadius: 3,
            overflow: "hidden",
          },
        }}
      >
        <DialogTitle className="share-header">
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              שיתוף רזומה: {resume.firstName} {resume.lastName}
            </Typography>
            <IconButton onClick={onClose} sx={{ color: "white" }}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent className="share-content">
          <TextField
            fullWidth
            label="חיפוש משתמשים"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            variant="outlined"
            className="search-field"
            InputProps={{
              startAdornment: <SearchIcon sx={{ color: "#8B0000", mr: 1 }} />,
            }}
          />

          <Typography variant="subtitle1" gutterBottom sx={{ color: "#8B0000", fontWeight: 600, mb: 2 }}>
            בחר משתמש לשיתוף:
          </Typography>

          <List className="users-list">
            {filteredUsers.map((user) => (
              <ListItem key={user.id} className="user-item">
                <ListItemAvatar>
                  <Avatar className="user-avatar">
                    <PersonIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={user.username || "משתמש"}
                  secondary={user.email}
                  sx={{ flex: 1, mr: 2 }}
                />
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => handleShare(user.id)}
                  disabled={loading}
                  className="share-button"
                  startIcon={<ShareIcon />}
                >
                  שתף
                </Button>
              </ListItem>
            ))}
          </List>

          {filteredUsers.length === 0 && (
            <Box className="empty-state">
              <PersonIcon className="empty-state-icon" />
              <Typography variant="body2" color="text.secondary">
                {searchTerm ? "לא נמצאו משתמשים התואמים לחיפוש" : "לא נמצאו משתמשים"}
              </Typography>
            </Box>
          )}
        </DialogContent>

        <DialogActions className="dialog-actions">
          <Button onClick={onClose} className="close-button">
            סגור
          </Button>
        </DialogActions>
      </Dialog>

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
    </>
  )
}

export default ShareDialog
