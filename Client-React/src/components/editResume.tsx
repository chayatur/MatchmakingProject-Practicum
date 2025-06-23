
import type React from "react"
import { useState, useEffect, useCallback } from "react"
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  Typography,
  IconButton,
  Box,
  CircularProgress,
  Fade,
} from "@mui/material"
import { Close as CloseIcon, Save as SaveIcon } from "@mui/icons-material"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "../store"
import { updateFile } from "../slices/fileSlice"
import type { FileData } from "../types/file"
import "../styles/editResume.css"
interface EditResumeDialogProps {
  open: boolean
  onClose: () => void
  resume: FileData
  onSuccess?: () => void
}

const EditResumeDialog: React.FC<EditResumeDialogProps> = ({ open, onClose, resume, onSuccess }) => {
  const dispatch = useDispatch<AppDispatch>()
  const { loading } = useSelector((state: RootState) => state.files)

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

  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (resume && open) {
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
      setErrors({})
    }
  }, [resume, open])

  const handleChange = useCallback(
    (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value
      setFormData((prev) => ({ ...prev, [field]: value }))

      // Clear error when user types
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: "" }))
      }
    },
    [errors],
  )

  const validateForm = useCallback(() => {
    const newErrors: Record<string, string> = {}

    if (!formData.firstName.trim()) {
      newErrors.firstName = "שם פרטי הוא שדה חובה"
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "שם משפחה הוא שדה חובה"
    }

    if (formData.age && (isNaN(Number(formData.age)) || Number(formData.age) < 0 || Number(formData.age) > 120)) {
      newErrors.age = "גיל לא תקין"
    }

    if (
      formData.height &&
      (isNaN(Number(formData.height)) || Number(formData.height) < 0 || Number(formData.height) > 250)
    ) {
      newErrors.height = "גובה לא תקין"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [formData])

  const handleSave = useCallback(async () => {
    if (!validateForm()) return

    try {
      const updateData = {
        ...formData,
        age: formData.age ? Number(formData.age) : undefined,
        height: formData.height ? Number(formData.height) : undefined,
      }

      await dispatch(updateFile({ id: resume.id, data: updateData })).unwrap()
      onSuccess?.()
      onClose()
    } catch (error) {
      console.error("Failed to update resume:", error)
    }
  }, [dispatch, resume.id, formData, validateForm, onSuccess, onClose])

  const handleClose = useCallback(() => {
    setErrors({})
    onClose()
  }, [onClose])

  return (
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
      <DialogTitle className="header-gradient" sx={{ color: "white", p: 3 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            עריכת רזומה: {resume.firstName} {resume.lastName}
          </Typography>
          <IconButton onClick={handleClose} sx={{ color: "white" }}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <Fade in={open}>
        <DialogContent sx={{ p: 4 }}>
          <Grid container spacing={3} dir="rtl">
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="שם פרטי *"
                value={formData.firstName}
                onChange={handleChange("firstName")}
                error={!!errors.firstName}
                helperText={errors.firstName}
                variant="outlined"
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
                label="שם משפחה *"
                value={formData.lastName}
                onChange={handleChange("lastName")}
                error={!!errors.lastName}
                helperText={errors.lastName}
                variant="outlined"
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
                label="שם האב"
                value={formData.fatherName}
                onChange={handleChange("fatherName")}
                variant="outlined"
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
                label="שם האם"
                value={formData.motherName}
                onChange={handleChange("motherName")}
                variant="outlined"
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

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="כתובת"
                value={formData.address}
                onChange={handleChange("address")}
                variant="outlined"
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
                label="גיל"
                type="number"
                value={formData.age}
                onChange={handleChange("age")}
                error={!!errors.age}
                helperText={errors.age}
                variant="outlined"
                inputProps={{ min: 0, max: 120 }}
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
                label="גובה (ס״מ)"
                type="number"
                value={formData.height}
                onChange={handleChange("height")}
                error={!!errors.height}
                helperText={errors.height}
                variant="outlined"
                inputProps={{ min: 0, max: 250 }}
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
                label="עיסוק"
                value={formData.occupation}
                onChange={handleChange("occupation")}
                variant="outlined"
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
                label="מקום לימודים"
                value={formData.placeOfStudy}
                onChange={handleChange("placeOfStudy")}
                variant="outlined"
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
        </DialogContent>
      </Fade>

      <DialogActions sx={{ p: 3, justifyContent: "space-between" }}>
        <Button onClick={handleClose} className="btn-secondary" disabled={loading}>
          ביטול
        </Button>
        <Button
          onClick={handleSave}
          disabled={loading}
          className="btn-primary"
          startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
        >
          {loading ? "שומר..." : "שמור שינויים"}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default EditResumeDialog

// import type React from "react"
// import { useState, useEffect, useCallback } from "react"
// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   TextField,
//   Button,
//   Grid,
//   Typography,
//   IconButton,
//   Box,
//   CircularProgress,
//   Fade,
// } from "@mui/material"
// import { Close as CloseIcon, Save as SaveIcon } from "@mui/icons-material"
// import { useDispatch, useSelector } from "react-redux"
// import type { AppDispatch, RootState } from "../store"
// import { updateFile } from "../slices/fileSlice"
// import type { FileData } from "../types/file"

// interface EditResumeDialogProps {
//   open: boolean
//   onClose: () => void
//   resume: FileData
//   onSuccess?: () => void
// }

// const EditResumeDialog: React.FC<EditResumeDialogProps> = ({ open, onClose, resume, onSuccess }) => {
//   const dispatch = useDispatch<AppDispatch>()
//   const { loading } = useSelector((state: RootState) => state.files)

//   const [formData, setFormData] = useState({
//     firstName: "",
//     lastName: "",
//     fatherName: "",
//     motherName: "",
//     address: "",
//     age: 0, // שדה חובה
//     height: 0, // שדה חובה
//     occupation: "",
//     placeOfStudy: "",
//   })

//   const [errors, setErrors] = useState<Record<string, string>>({})

//   useEffect(() => {
//     if (resume && open) {
//       setFormData({
//         firstName: resume.firstName || "",
//         lastName: resume.lastName || "",
//         fatherName: resume.fatherName || "",
//         motherName: resume.motherName || "",
//         address: resume.address || "",
//         age: resume.age || 0,
//         height: resume.height || 0,
//         occupation: resume.occupation || "",
//         placeOfStudy: resume.placeOfStudy || "",
//       })
//       setErrors({})
//     }
//   }, [resume, open])

//   const handleChange = useCallback(
//     (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
//       const value = event.target.value
//       setFormData((prev) => ({ ...prev, [field]: value }))

//       // Clear error when user types
//       if (errors[field]) {
//         setErrors((prev) => ({ ...prev, [field]: "" }))
//       }
//     },
//     [errors],
//   )

//   const validateForm = useCallback(() => {
//     const newErrors: Record<string, string> = {}

//     if (!formData.firstName.trim()) {
//       newErrors.firstName = "שם פרטי הוא שדה חובה"
//     }

//     if (!formData.lastName.trim()) {
//       newErrors.lastName = "שם משפחה הוא שדה חובה"
//     }

//     if (isNaN(Number(formData.age)) || Number(formData.age) <= 0 || Number(formData.age) > 120) {
//       newErrors.age = "גיל לא תקין"
//     }

//     if (isNaN(Number(formData.height)) || Number(formData.height) <= 0 || Number(formData.height) > 250) {
//       newErrors.height = "גובה לא תקין"
//     }

//     setErrors(newErrors)
//     return Object.keys(newErrors).length === 0
//   }, [formData])

//   const handleSave = useCallback(async () => {
//     if (!validateForm()) return

//     try {
//       const updateData = {
//         ...formData,
//         age: Number(formData.age), // מבטיח שהגיל הוא מספר
//         height: Number(formData.height), // מבטיח שהגובה הוא מספר
//       }

//       await dispatch(updateFile({ id: resume.id, data: updateData })).unwrap()
//       onSuccess?.()
//       onClose()
//     } catch (error) {
//       console.error("Failed to update resume:", error)
//     }
//   }, [dispatch, resume.id, formData, validateForm, onSuccess, onClose])

//   const handleClose = useCallback(() => {
//     setErrors({})
//     onClose()
//   }, [onClose])

//   return (
//     <Dialog
//       open={open}
//       onClose={handleClose}
//       fullWidth
//       maxWidth="md"
//       PaperProps={{
//         sx: {
//           borderRadius: 3,
//           overflow: "hidden",
//         },
//       }}
//     >
//       <DialogTitle className="header-gradient" sx={{ color: "white", p: 3 }}>
//         <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
//           <Typography variant="h6" sx={{ fontWeight: 600 }}>
//             עריכת רזומה: {resume.firstName} {resume.lastName}
//           </Typography>
//           <IconButton onClick={handleClose} sx={{ color: "white" }}>
//             <CloseIcon />
//           </IconButton>
//         </Box>
//       </DialogTitle>

//       <Fade in={open}>
//         <DialogContent sx={{ p: 4 }}>
//           <Grid container spacing={3} dir="rtl">
//             <Grid item xs={12} sm={6}>
//               <TextField
//                 fullWidth
//                 label="שם פרטי *"
//                 value={formData.firstName}
//                 onChange={handleChange("firstName")}
//                 error={!!errors.firstName}
//                 helperText={errors.firstName}
//                 variant="outlined"
//                 sx={{
//                   "& .MuiOutlinedInput-root": {
//                     "&.Mui-focused fieldset": {
//                       borderColor: "#8B0000",
//                     },
//                   },
//                   "& .MuiInputLabel-root.Mui-focused": {
//                     color: "#8B0000",
//                   },
//                 }}
//               />
//             </Grid>

//             <Grid item xs={12} sm={6}>
//               <TextField
//                 fullWidth
//                 label="שם משפחה *"
//                 value={formData.lastName}
//                 onChange={handleChange("lastName")}
//                 error={!!errors.lastName}
//                 helperText={errors.lastName}
//                 variant="outlined"
//                 sx={{
//                   "& .MuiOutlinedInput-root": {
//                     "&.Mui-focused fieldset": {
//                       borderColor: "#8B0000",
//                     },
//                   },
//                   "& .MuiInputLabel-root.Mui-focused": {
//                     color: "#8B0000",
//                   },
//                 }}
//               />
//             </Grid>

//             <Grid item xs={12} sm={6}>
//               <TextField
//                 fullWidth
//                 label="שם האב"
//                 value={formData.fatherName}
//                 onChange={handleChange("fatherName")}
//                 variant="outlined"
//                 sx={{
//                   "& .MuiOutlinedInput-root": {
//                     "&.Mui-focused fieldset": {
//                       borderColor: "#8B0000",
//                     },
//                   },
//                   "& .MuiInputLabel-root.Mui-focused": {
//                     color: "#8B0000",
//                   },
//                 }}
//               />
//             </Grid>

//             <Grid item xs={12} sm={6}>
//               <TextField
//                 fullWidth
//                 label="שם האם"
//                 value={formData.motherName}
//                 onChange={handleChange("motherName")}
//                 variant="outlined"
//                 sx={{
//                   "& .MuiOutlinedInput-root": {
//                     "&.Mui-focused fieldset": {
//                       borderColor: "#8B0000",
//                     },
//                   },
//                   "& .MuiInputLabel-root.Mui-focused": {
//                     color: "#8B0000",
//                   },
//                 }}
//               />
//             </Grid>

//             <Grid item xs={12}>
//               <TextField
//                 fullWidth
//                 label="כתובת"
//                 value={formData.address}
//                 onChange={handleChange("address")}
//                 variant="outlined"
//                 sx={{
//                   "& .MuiOutlinedInput-root": {
//                     "&.Mui-focused fieldset": {
//                       borderColor: "#8B0000",
//                     },
//                   },
//                   "& .MuiInputLabel-root.Mui-focused": {
//                     color: "#8B0000",
//                   },
//                 }}
//               />
//             </Grid>

//             <Grid item xs={12} sm={6}>
//               <TextField
//                 fullWidth
//                 label="גיל *"
//                 type="number"
//                 value={formData.age}
//                 onChange={handleChange("age")}
//                 error={!!errors.age}
//                 helperText={errors.age}
//                 variant="outlined"
//                 inputProps={{ min: 0, max: 120 }}
//                 sx={{
//                   "& .MuiOutlinedInput-root": {
//                     "&.Mui-focused fieldset": {
//                       borderColor: "#8B0000",
//                     },
//                   },
//                   "& .MuiInputLabel-root.Mui-focused": {
//                     color: "#8B0000",
//                   },
//                 }}
//               />
//             </Grid>

//             <Grid item xs={12} sm={6}>
//               <TextField
//                 fullWidth
//                 label="גובה (ס״מ) *"
//                 type="number"
//                 value={formData.height}
//                 onChange={handleChange("height")}
//                 error={!!errors.height}
//                 helperText={errors.height}
//                 variant="outlined"
//                 inputProps={{ min: 0, max: 250 }}
//                 sx={{
//                   "& .MuiOutlinedInput-root": {
//                     "&.Mui-focused fieldset": {
//                       borderColor: "#8B0000",
//                     },
//                   },
//                   "& .MuiInputLabel-root.Mui-focused": {
//                     color: "#8B0000",
//                   },
//                 }}
//               />
//             </Grid>

//             <Grid item xs={12} sm={6}>
//               <TextField
//                 fullWidth
//                 label="עיסוק"
//                 value={formData.occupation}
//                 onChange={handleChange("occupation")}
//                 variant="outlined"
//                 sx={{
//                   "& .MuiOutlinedInput-root": {
//                     "&.Mui-focused fieldset": {
//                       borderColor: "#8B0000",
//                     },
//                   },
//                   "& .MuiInputLabel-root.Mui-focused": {
//                     color: "#8B0000",
//                   },
//                 }}
//               />
//             </Grid>

//             <Grid item xs={12} sm={6}>
//               <TextField
//                 fullWidth
//                 label="מקום לימודים"
//                 value={formData.placeOfStudy}
//                 onChange={handleChange("placeOfStudy")}
//                 variant="outlined"
//                 sx={{
//                   "& .MuiOutlinedInput-root": {
//                     "&.Mui-focused fieldset": {
//                       borderColor: "#8B0000",
//                     },
//                   },
//                   "& .MuiInputLabel-root.Mui-focused": {
//                     color: "#8B0000",
//                   },
//                 }}
//               />
//             </Grid>
//           </Grid>
//         </DialogContent>
//       </Fade>

//       <DialogActions sx={{ p: 3, justifyContent: "space-between" }}>
//         <Button onClick={handleClose} className="btn-secondary" disabled={loading}>
//           ביטול
//         </Button>
//         <Button
//           onClick={handleSave}
//           disabled={loading}
//           className="btn-primary"
//           startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
//         >
//           {loading ? "שומר..." : "שמור שינויים"}
//         </Button>
//       </DialogActions>
//     </Dialog>
//   )
// }

// export default EditResumeDialog
