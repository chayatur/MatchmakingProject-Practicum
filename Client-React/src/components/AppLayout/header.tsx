"use client"

import type React from "react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Container,
  Button,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
} from "@mui/material"
import MenuIcon from "@mui/icons-material/Menu"
import AppLogo from '../logo'
import AuthStatus from "./status"

const pages = [
  { name: "דף הבית", path: "/" },
  { name: "רזומות", path: "/resumes" },
  { name: "אודות", path: "/about" },
  { name: "צור קשר", path: "/contact" },
]

const Header: React.FC = () => {
  const navigate = useNavigate() // שימוש ב-useNavigate מ-React Router
  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget)
  }

  const handleCloseNavMenu = () => {
    setAnchorElNav(null)
  }

  const handleNavigate = (path: string) => {
    handleCloseNavMenu()
    setDrawerOpen(false)
    navigate(path) // שימוש ב-navigate במקום router.push
  }

  const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
    if (
      event.type === "keydown" &&
      ((event as React.KeyboardEvent).key === "Tab" || (event as React.KeyboardEvent).key === "Shift")
    ) {
      return
    }

    setDrawerOpen(open)
  }

  return (
    <AppBar position="static" sx={{ backgroundColor: "white", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* Logo for desktop */}
          <Box sx={{ display: { xs: "none", md: "flex" }, mr: 2 }}>
            <AppLogo size="medium" />
          </Box>

          {/* Mobile menu */}
          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="menu"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={toggleDrawer(true)}
              color="inherit"
              sx={{ color: "#8B0000" }}
            >
              <MenuIcon />
            </IconButton>
            <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer(false)}>
              <Box
                sx={{ width: 250 }}
                role="presentation"
                onClick={toggleDrawer(false)}
                onKeyDown={toggleDrawer(false)}
              >
                <Box sx={{ p: 2, display: "flex", justifyContent: "center" }}>
                  <AppLogo size="medium" />
                </Box>
                <Divider />
                <List>
                  {pages.map((page) => (
                    <ListItem key={page.name} disablePadding>
                      <ListItemButton onClick={() => handleNavigate(page.path)}>
                        <ListItemText
                          primary={page.name}
                          sx={{ textAlign: "right" }}
                        />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              </Box>
            </Drawer>
          </Box>

          {/* Logo for mobile */}
          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" }, justifyContent: "center" }}>
            <AppLogo size="small" />
          </Box>

          {/* Desktop menu */}
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" }, justifyContent: "center" }}>
            {pages.map((page) => (
              <Button
                key={page.name}
                onClick={() => handleNavigate(page.path)}
                sx={{
                  my: 2,
                  mx: 1,
                  color: "#333",
                  display: "block",
                  "&:hover": {
                    backgroundColor: "rgba(139, 0, 0, 0.04)",
                    color: "#8B0000",
                  },
                }}
              >
                {page.name}
              </Button>
            ))}
          </Box>

          {/* Auth status */}
          <Box sx={{ flexGrow: 0 }}>
            <AuthStatus />
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  )
}

export default Header
