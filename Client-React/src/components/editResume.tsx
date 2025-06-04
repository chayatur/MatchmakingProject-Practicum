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
  Grid,
} from "@mui/material"
import { Close as CloseIcon, Save as SaveIcon } from "@mui/icons-material"
import { useDispatch } from "react-redux"
import type { AppDispatch } from "../store"
import { updateFile } from "../slices/fileSlice"
import type { FileData } from "../types/file"
import "../styles/editResume.css"

interface EditResumeDialogProps {
  open: boolean
  onClose: () => void
  resume: FileData
}

const EditResumeDialog: React.FC<EditResumeDialogProps> = ({ open, onClose, resume }) => {
  const dispatch = useDispatch<AppDispatch>()

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    fatherName: "",
    motherName: "",
    address: "",
    age: "",
    height: "",
    occupation: "",
    placeOfStudy: "",
  })

  const [loading, setLoading] = useState(false)
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: "success" | "error" }>({
    open: false,
    message: "",
    severity: "success",
  })

  useEffect(() => {
    if (resume) {
      setFormData({
        firstName: resume.firstName || "",
        lastName: resume.lastName || "",
        fatherName: resume.fatherName || "",
        motherName: resume.motherName || "",
        address: resume.address || "",
        age: resume.age?.toString() || "",
        height: resume.height?.toString() || "",
        occupation: resume.occupation || "",
        placeOfStudy: resume.placeOfStudy || "",
      })
    }
  }, [resume])

  const handleChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [field]: event.target.value,
    }))
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      const updateData = {
        ...formData,
        age: Number.parseInt(formData.age) || 0,
        height: Number.parseInt(formData.height) || 0,
      }

      await dispatch(updateFile({ id: resume.id, data: updateData })).unwrap()
      setSnackbar({ open: true, message: "הרזומה עודכנה בהצלחה", severity: "success" })
      setTimeout(() => {
        onClose()
      }, 1500)
    } catch (error) {
      setSnackbar({ open: true, message: "שגיאה בעדכון הרזומה", severity: "error" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        fullWidth
        maxWidth="md"
        className="edit-dialog"
        PaperProps={{
          sx: {
            borderRadius: 3,
            overflow: "hidden",
          },
        }}
      >
        <DialogTitle className="edit-header">
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              עריכת רזומה: {resume.firstName} {resume.lastName}
            </Typography>
            <IconButton onClick={onClose} sx={{ color: "white" }}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent className="edit-content">
          <Grid container spacing={3} className="form-grid">
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="שם פרטי"
                value={formData.firstName}
                onChange={handleChange("firstName")}
                variant="outlined"
                className="edit-field"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="שם משפחה"
                value={formData.lastName}
                onChange={handleChange("lastName")}
                variant="outlined"
                className="edit-field"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="שם האב"
                value={formData.fatherName}
                onChange={handleChange("fatherName")}
                variant="outlined"
                className="edit-field"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="שם האם"
                value={formData.motherName}
                onChange={handleChange("motherName")}
                variant="outlined"
                className="edit-field"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="כתובת"
                value={formData.address}
                onChange={handleChange("address")}
                variant="outlined"
                className="edit-field"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="גיל"
                type="number"
                value={formData.age}
                onChange={handleChange("age")}
                variant="outlined"
                className="edit-field"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="גובה (ס״מ)"
                type="number"
                value={formData.height}
                onChange={handleChange("height")}
                variant="outlined"
                className="edit-field"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="עיסוק"
                value={formData.occupation}
                onChange={handleChange("occupation")}
                variant="outlined"
                className="edit-field"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="מקום לימודים"
                value={formData.placeOfStudy}
                onChange={handleChange("placeOfStudy")}
                variant="outlined"
                className="edit-field"
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions className="edit-actions">
          <Button onClick={onClose} className="cancel-button">
            ביטול
          </Button>
          <Button onClick={handleSave} disabled={loading} className="save-button" startIcon={<SaveIcon />}>
            {loading ? "שומר..." : "שמור שינויים"}
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

export default EditResumeDialog
