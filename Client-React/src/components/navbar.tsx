import type React from "react"
import { useState } from "react"
import {
  AppBar,
  Toolbar,
  Button,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Divider,
  Avatar,
  Menu,
  MenuItem,
  useMediaQuery,
  useTheme,
  Chip,
} from "@mui/material"
import {
  Menu as MenuIcon,
  Home as HomeIcon,
  Description as DescriptionIcon,
  Dashboard as DashboardIcon,
  Upload as UploadIcon,
  Info as InfoIcon,
  Person as PersonIcon,
  Logout as LogoutIcon,
  Settings as SettingsIcon,
} from "@mui/icons-material"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import type { RootState, AppDispatch } from "../store"
import { logoutUser } from "../slices/userSlice"
import AppLogo from "./logo"

const NavBar= () => {
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch<AppDispatch>()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))

  const { isLoggedIn, user } = useSelector((state: RootState) => state.user)

  const [drawerOpen, setDrawerOpen] = useState(false)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const menuItems = [
    { name: "דף הבית", path: "/", icon: <HomeIcon />, public: true },
   { name: "סקירה כללית", path: "/dashboard", icon: <DashboardIcon />, public: false },
    { name: "רזומות", path: "/resumes", icon: <DescriptionIcon />, public: false },
    { name: "העלאת קובץ", path: "/FileUploader", icon: <UploadIcon />, public: false },
    { name: "אודות", path: "/about", icon: <InfoIcon />, public: true },
  ]

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen)
  }

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handleLogout = async () => {
    await dispatch(logoutUser())
    handleMenuClose()
    navigate("/")
  }

  const getInitials = () => {
    if (user.username) {
      return user.username.charAt(0).toUpperCase()
    }
    if (user.email) {
      return user.email.charAt(0).toUpperCase()
    }
    return "U"
  }

  const isActivePath = (path: string) => {
    return location.pathname === path
  }

  const drawer = (
    <Box sx={{ width: 280, height: "100%", backgroundColor: "#fafafa" }}>
      <Box sx={{ p: 3, textAlign: "center", borderBottom: "1px solid #e0e0e0" }}>
        <AppLogo size="medium" />
      </Box>

      <List sx={{ px: 2, py: 1 }}>
        {menuItems
          .filter((item) => item.public || isLoggedIn)
          .map((item) => (
            <ListItem key={item.name} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                component={Link}
                to={item.path}
                onClick={() => setDrawerOpen(false)}
                sx={{
                  borderRadius: 2,
                  py: 1.5,
                  backgroundColor: isActivePath(item.path) ? "rgba(139, 0, 0, 0.1)" : "transparent",
                  color: isActivePath(item.path) ? "#8B0000" : "#333",
                  "&:hover": {
                    backgroundColor: "rgba(139, 0, 0, 0.05)",
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    color: isActivePath(item.path) ? "#8B0000" : "#666",
                    minWidth: 40,
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={<span>{item.name}</span>} 
                  sx={{
                    "& .MuiListItemText-primary": {
                      fontWeight: isActivePath(item.path) ? 600 : 400,
                    },
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
      </List>

      {!isLoggedIn && (
        <>
          <Divider sx={{ mx: 2, my: 2 }} />
          <Box sx={{ px: 2 }}>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => {
                navigate("/login")
                setDrawerOpen(false)
              }}
              sx={{
                mb: 1,
                borderColor: "#8B0000",
                color: "#8B0000",
                "&:hover": {
                  borderColor: "#5c0000",
                  backgroundColor: "rgba(139, 0, 0, 0.04)",
                },
              }}
            >
              כניסה
            </Button>
            <Button
              fullWidth
              variant="contained"
              onClick={() => {
                navigate("/register")
                setDrawerOpen(false)
              }}
              sx={{
                backgroundColor: "#8B0000",
                "&:hover": {
                  backgroundColor: "#5c0000",
                },
              }}
            >
              הרשמה
            </Button>
          </Box>
        </>
      )}
    </Box>
  )

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          backgroundColor: "white",
          borderBottom: "1px solid #e0e0e0",
          color: "#333",
        }}
      >
        <Toolbar sx={{ px: { xs: 2, sm: 3 } }}>
          {/* Mobile menu button */}
          {isMobile && (
            <IconButton edge="start" onClick={handleDrawerToggle} sx={{ mr: 2, color: "#8B0000" }}>
              <MenuIcon />
            </IconButton>
          )}

          {/* Logo */}
          <Box sx={{ flexGrow: isMobile ? 1 : 0, display: "flex", justifyContent: isMobile ? "center" : "flex-start" }}>
            <AppLogo size={isMobile ? "small" : "medium"} />
          </Box>

          {/* Desktop menu */}
          {!isMobile && (
            <Box sx={{ flexGrow: 1, display: "flex", justifyContent: "center", mx: 4 }}>
              {menuItems
                .filter((item) => item.public || isLoggedIn)
                .map((item) => (
                  <Button
                    key={item.name}
                    component={Link}
                    to={item.path}
                    startIcon={item.icon}
                    sx={{
                      mx: 1,
                      px: 2,
                      py: 1,
                      color: isActivePath(item.path) ? "#8B0000" : "#666",
                      fontWeight: isActivePath(item.path) ? 600 : 400,
                      backgroundColor: isActivePath(item.path) ? "rgba(139, 0, 0, 0.05)" : "transparent",
                      borderRadius: 2,
                      "&:hover": {
                        backgroundColor: "rgba(139, 0, 0, 0.05)",
                        color: "#8B0000",
                      },
                      position: "relative",
                      "&::after": isActivePath(item.path)
                        ? {
                            content: '""',
                            position: "absolute",
                            bottom: 0,
                            left: "25%",
                            width: "50%",
                            height: 2,
                            backgroundColor: "#8B0000",
                            borderRadius: 1,
                          }
                        : {},
                    }}
                  >
                    {item.name}
                  </Button>
                ))}
            </Box>
          )}

          {/* Auth section */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {isLoggedIn ? (
              <>
                <Chip
                  label={`שלום, ${user.username || "משתמש"}`}
                  variant="outlined"
                  sx={{
                    borderColor: "#8B0000",
                    color: "#8B0000",
                    display: { xs: "none", sm: "flex" },
                  }}
                />
                <IconButton onClick={handleMenuClick} sx={{ p: 0.5 }}>
                  <Avatar
                    sx={{
                      width: 36,
                      height: 36,
                      bgcolor: "#8B0000",
                      fontSize: 16,
                    }}
                  >
                    {getInitials()}
                  </Avatar>
                </IconButton>
              </>
            ) : (
              !isMobile && (
                <Box sx={{ display: "flex", gap: 1 }}>
                  <Button
                    variant="outlined"
                    onClick={() => navigate("/login")}
                    sx={{
                      borderColor: "#8B0000",
                      color: "#8B0000",
                      "&:hover": {
                        borderColor: "#5c0000",
                        backgroundColor: "rgba(139, 0, 0, 0.04)",
                      },
                    }}
                  >
                    כניסה
                  </Button>
                  <Button
                    variant="contained"
                    onClick={() => navigate("/register")}
                    sx={{
                      backgroundColor: "#8B0000",
                      "&:hover": {
                        backgroundColor: "#5c0000",
                      },
                    }}
                  >
                    הרשמה
                  </Button>
                </Box>
              )
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Mobile drawer */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        PaperProps={{
          sx: {
            backgroundImage: "none",
          },
        }}
      >
        {drawer}
      </Drawer>

      {/* User menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: "0 8px 32px rgba(139, 0, 0, 0.15)",
            border: "1px solid rgba(139, 0, 0, 0.1)",
            mt: 1,
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem
          onClick={() => {
            navigate("/profile")
            handleMenuClose()
          }}
        >
          <ListItemIcon>
            <PersonIcon sx={{ color: "#8B0000" }} />
          </ListItemIcon>
          הפרופיל שלי
        </MenuItem>
        <MenuItem
          onClick={() => {
            navigate("/settings")
            handleMenuClose()
          }}
        >
          <ListItemIcon>
            <SettingsIcon sx={{ color: "#8B0000" }} />
          </ListItemIcon>
          הגדרות
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout} sx={{ color: "#F44336" }}>
          <ListItemIcon>
            <LogoutIcon sx={{ color: "#F44336" }} />
          </ListItemIcon>
          התנתקות
        </MenuItem>
      </Menu>
    </>
  )
}

export default NavBar
