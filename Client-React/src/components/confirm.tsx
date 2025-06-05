"use client"

import type React from "react"
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  Box,
  CircularProgress,
} from "@mui/material"
import { Warning as WarningIcon } from "@mui/icons-material"

interface ConfirmDialogProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  loading?: boolean
  severity?: "warning" | "error" | "info"
}

const Confirm: React.FC<ConfirmDialogProps> = ({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "אישור",
  cancelText = "ביטול",
  loading = false,
  severity = "warning",
}) => {
  const getColor = () => {
    switch (severity) {
      case "error":
        return "#F44336"
      case "warning":
        return "#FF9800"
      case "info":
        return "#2196F3"
      default:
        return "#FF9800"
    }
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          overflow: "hidden",
        },
      }}
    >
      <DialogTitle sx={{ textAlign: "center", pt: 4, pb: 2 }}>
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
          <Box
            sx={{
              width: 64,
              height: 64,
              borderRadius: "50%",
              backgroundColor: `${getColor()}20`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <WarningIcon sx={{ fontSize: 32, color: getColor() }} />
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 600, color: "#333" }}>
            {title}
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ textAlign: "center", pb: 2 }}>
        <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.6 }}>
          {message}
        </Typography>
      </DialogContent>

      <DialogActions sx={{ p: 3, justifyContent: "center", gap: 2 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          disabled={loading}
          sx={{
            minWidth: 100,
            borderColor: "#ccc",
            color: "#666",
            "&:hover": {
              borderColor: "#999",
              backgroundColor: "rgba(0, 0, 0, 0.04)",
            },
          }}
        >
          {cancelText}
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          disabled={loading}
          sx={{
            minWidth: 100,
            backgroundColor: getColor(),
            color: "white",
            "&:hover": {
              backgroundColor: getColor(),
              filter: "brightness(0.9)",
            },
            "&.Mui-disabled": {
              backgroundColor: `${getColor()}60`,
            },
          }}
          startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
        >
          {loading ? "מוחק..." : confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default Confirm
