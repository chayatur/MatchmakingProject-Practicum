"use client"

import type React from "react"
import { useState, useEffect, useCallback, useMemo } from "react"
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
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  CircularProgress,
  Fade,
  InputAdornment,
} from "@mui/material"
import { Close as CloseIcon, Share as ShareIcon, Person as PersonIcon, Search as SearchIcon } from "@mui/icons-material"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "../store"
import { shareFile, fetchUsers, fetchSharedFiles } from "../slices/fileSlice"
import type { FileData } from "../types/file"

interface ShareDialogProps {
  open: boolean
  onClose: () => void
  resume: FileData
  onSuccess?: () => void
}

const ShareDialog: React.FC<ShareDialogProps> = ({ open, onClose, resume, onSuccess }) => {
  const dispatch = useDispatch<AppDispatch>()
  const { users, loading } = useSelector((state: RootState) => state.files)

  const [searchTerm, setSearchTerm] = useState("")
  const [sharingUserId, setSharingUserId] = useState<number | null>(null)

  useEffect(() => {
    if (open && users.length === 0) {
      dispatch(fetchUsers())
    }
  }, [open, users.length, dispatch])

  useEffect(() => {
    if (open) {
      setSearchTerm("")
      setSharingUserId(null)
    }
  }, [open])

  const filteredUsers = useMemo(() => {
    if (!searchTerm) return users.filter((user) => user.id !== resume.userId)

    return users.filter(
      (user) =>
        user.id !== resume.userId &&
        (user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase())),
    )
  }, [users, searchTerm, resume.userId])

  const handleSearchChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value)
  }, [])

  const handleShare = useCallback(
    async (userId: number) => {
      setSharingUserId(userId)

      try {
     const   currentUserId=Number(sessionStorage.getItem('userId'))
     console.log(currentUserId,'current');
     console.log(resume.id,'resumeId');
     console.log(userId,'toShareWith');
      
        await dispatch(
          shareFile({
            resumeFileId: resume.id,
            sharedWithUserId:userId ,
            sharedByUserId:currentUserId
          }),
        ).unwrap()

        onSuccess?.()
        onClose()
      } catch (error) {
        console.error("Failed to share file:", error)
      } finally {
        setSharingUserId(null)
      }
    },
    [dispatch, resume.id, onSuccess, onClose],
  )

  const handleClose = useCallback(() => {
    setSearchTerm("")
    setSharingUserId(null)
    onClose()
  }, [onClose])

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          borderRadius: 3,
          overflow: "hidden",
        },
      }}
    >
      <DialogTitle className="header-gradient" sx={{ color: "white", p: 3 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            שיתוף רזומה: {resume.firstName} {resume.lastName}
          </Typography>
          <IconButton onClick={handleClose} sx={{ color: "white" }}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <Fade in={open}>
        <DialogContent sx={{ p: 3 }}>
          <TextField
            fullWidth
            label="חיפוש משתמשים"
            value={searchTerm}
            onChange={handleSearchChange}
            variant="outlined"
            placeholder="הקלד שם משתמש או אימייל..."
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: "#8B0000" }} />
                </InputAdornment>
              ),
            }}
            sx={{
              mb: 3,
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

          <Typography variant="subtitle1" gutterBottom sx={{ color: "#8B0000", fontWeight: 600 }}>
            בחר משתמש לשיתוף ({filteredUsers.length} משתמשים):
          </Typography>

          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
              <CircularProgress sx={{ color: "#8B0000" }} />
            </Box>
          ) : (
            <List sx={{ maxHeight: 300, overflow: "auto" }}>
              {filteredUsers.length === 0 ? (
                <Box sx={{ textAlign: "center", py: 4 }}>
                  <Typography variant="body2" color="text.secondary">
                    {searchTerm ? "לא נמצאו משתמשים התואמים לחיפוש" : "לא נמצאו משתמשים"}
                  </Typography>
                </Box>
              ) : (
                filteredUsers.map((user) => (
                  <Fade in={true} timeout={300} key={user.id}>
                    <ListItem
                      sx={{
                        borderRadius: 2,
                        mb: 1,
                        border: "1px solid #e5d6d6",
                        transition: "all 0.3s ease",
                        "&:hover": {
                          backgroundColor: "rgba(139, 0, 0, 0.04)",
                          transform: "translateY(-2px)",
                          boxShadow: "0 4px 12px rgba(139, 0, 0, 0.1)",
                        },
                      }}
                    >
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: "#8B0000" }}>
                          <PersonIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText primary={user.username || "משתמש"} secondary={user.email} sx={{ flex: 1 }} />
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => handleShare(user.id)}
                        disabled={sharingUserId == user.id}
                        className="btn-primary"
                        startIcon={
                          sharingUserId == user.id ? <CircularProgress size={16} color="inherit" /> : <ShareIcon />
                        }
                        sx={{ minWidth: 100 }}
                      >
                        {sharingUserId === user.id ? "משתף..." : "שתף"}
                      </Button>
                    </ListItem>
                  </Fade>
                ))
              )}
            </List>
          )}
        </DialogContent>
      </Fade>

      <DialogActions sx={{ p: 3 }}>
        <Button onClick={handleClose} className="btn-secondary">
          סגור
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ShareDialog
