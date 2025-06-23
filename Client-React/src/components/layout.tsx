import { useEffect } from "react"
import { Outlet } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { Box, CssBaseline, ThemeProvider, createTheme } from "@mui/material"
import type { RootState, AppDispatch } from "../store"
import { checkAuthStatus } from "../slices/userSlice"
import NavBar from "./navbar"
import AIChatBox from "./chat"
import Footer from "./footer"

const theme = createTheme({
  direction: "rtl",
  palette: {
    primary: {
      main: "#8B0000",
    },
  },
  typography: {
    fontFamily: '"Segoe UI", "Roboto", "Arial", sans-serif',
  },
})

const Layout = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { authChecked } = useSelector((state: RootState) => state.user)

  useEffect(() => {
    if (!authChecked) {
      dispatch(checkAuthStatus())
    }
  }, [dispatch, authChecked])

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        <NavBar />
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <Outlet />
        </Box>
        <AIChatBox />
      </Box>
    <Footer/>
    </ThemeProvider>
  )
}

export default Layout
