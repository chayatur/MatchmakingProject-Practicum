"use client"

import React, { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom" // שינוי ל-useNavigate
import { Box, Button, Avatar, Menu, MenuItem, ListItemIcon, Divider, IconButton, Tooltip } from "@mui/material"
import { Person, Logout, Settings, Dashboard } from "@mui/icons-material"
import { logoutUser, checkAuthStatus } from "../../slices/userSlice"
import type { AppDispatch, RootState } from "../../store"

const AuthStatus: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate() // שימוש ב-useNavigate
  const { isLoggedIn, user, authChecked } = useSelector((state: RootState) => state.user)
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)

  useEffect(() => {
    if (!authChecked) {
      dispatch(checkAuthStatus())
    }
  }, [dispatch, authChecked])

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleLogout = async () => {
    handleClose()
    await dispatch(logoutUser())
    navigate("/auth/login") // שינוי ל-navigate
  }

  const handleNavigate = (path: string) => {
    handleClose()
    navigate(path) // שינוי ל-navigate
  }

  // Get initials for avatar
  const getInitials = () => {
    if (user.username) {
      return user.username.charAt(0).toUpperCase()
    }
    if (user.email) {
      return user.email.charAt(0).toUpperCase()
    }
    return "U"
  }

  if (!isLoggedIn) {
    return (
      <Box sx={{ display: "flex", gap: 1 }}>
        <Button
          variant="outlined"
          onClick={() => navigate("/auth/login")} // שינוי ל-navigate
          sx={{
            borderColor: "#8B0000",
            color: "#8B0000",
            "&:hover": {
              borderColor: "#5c0000",
              backgroundColor: "rgba(139, 0, 0, 0.04)",
            },
          }}
        >
          התחברות
        </Button>
        <Button
          variant="contained"
          onClick={() => navigate("/auth/register")} // שינוי ל-navigate
          sx={{
            backgroundColor: "#8B0000",
            color: "white",
            "&:hover": {
              backgroundColor: "#5c0000",
            },
          }}
        >
          הרשמה
        </Button>
      </Box>
    )
  }

  return (
    <Box>
      <Tooltip title="הגדרות חשבון">
        <IconButton
          onClick={handleClick}
          size="small"
          sx={{ ml: 2 }}
          aria-controls={open ? "account-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
        >
          <Avatar
            sx={{
              width: 40,
              height: 40,
              bgcolor: "#8B0000",
              fontSize: 16,
            }}
          >
            {getInitials()}
          </Avatar>
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            mt: 1.5,
            "& .MuiAvatar-root": {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            "&:before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem onClick={() => handleNavigate("/profile")}>
          <ListItemIcon>
            <Person fontSize="small" sx={{ color: "#8B0000" }} />
          </ListItemIcon>
          הפרופיל שלי
        </MenuItem>
        <MenuItem onClick={() => handleNavigate("/resumes")}>
          <ListItemIcon>
            <Dashboard fontSize="small" sx={{ color: "#8B0000" }} />
          </ListItemIcon>
          רזומות
        </MenuItem>
        <MenuItem onClick={() => handleNavigate("/auth/change-password")}>
          <ListItemIcon>
            <Settings fontSize="small" sx={{ color: "#8B0000" }} />
          </ListItemIcon>
          שינוי סיסמה
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <Logout fontSize="small" sx={{ color: "#8B0000" }} />
          </ListItemIcon>
          התנתקות
        </MenuItem>
      </Menu>
    </Box>
  )
}

export default AuthStatus
