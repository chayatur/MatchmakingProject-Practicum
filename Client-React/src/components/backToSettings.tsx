"use client"

import type React from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { IconButton, Tooltip, Zoom } from "@mui/material"
import { Settings as SettingsIcon } from "@mui/icons-material"
import "../styles/setting.css"

const BackToSettingsButton: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()

  // הצג את הכפתור רק בדפים שקשורים להגדרות
  const shouldShow = ["/profile", "/personalArea"].includes(location.pathname)

  if (!shouldShow) return null

  return (
    <Zoom in={shouldShow}>
      <Tooltip title="חזור להגדרות" placement="left">
        <IconButton
          className="back-to-settings"
          onClick={() => navigate("/settings")}
          sx={{
            position: "fixed",
            top: 100,
            right: 24,
            zIndex: 1000,
            background: "linear-gradient(135deg, #8b0000 0%, #dc143c 100%)",
            color: "white",
            width: 56,
            height: 56,
            "&:hover": {
              background: "linear-gradient(135deg, #5c0000 0%, #b22222 100%)",
              transform: "scale(1.1)",
            },
            boxShadow: "0 4px 16px rgba(139, 0, 0, 0.3)",
            transition: "all 0.3s ease",
          }}
        >
          <SettingsIcon />
        </IconButton>
      </Tooltip>
    </Zoom>
  )
}

export default BackToSettingsButton
