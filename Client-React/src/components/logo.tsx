import type React from "react"
import { Box, Typography } from "@mui/material"
import logo from '../logo/cups.jpg'
interface AppLogoProps {
  size?: "small" | "medium" | "large"
  showText?: boolean
}

const AppLogo: React.FC<AppLogoProps> = ({ size = "medium", showText = true }) => {
  // Size mapping
  const sizeMap = {
    small: { logoHeight: 30, fontSize: "1.2rem" },
    medium: { logoHeight: 40, fontSize: "1.5rem" },
    large: { logoHeight: 60, fontSize: "2rem" },
  }

  const { logoHeight, fontSize } = sizeMap[size]

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
       {showText && (
        <Typography
          variant="h6"
          sx={{
            fontWeight: "bold",
            color: "#8B0000",
            fontSize,
            fontFamily: '"Heebo", "Roboto", "Arial", sans-serif',
          }}
        >
          לחיים
        </Typography>
      )}
      <Box
        component="img"
        src={logo}
        alt="לחיים - מערכת שידוכים"
        sx={{
          height: logoHeight,
          objectFit: "contain",
        }}
      />
     
    </Box>
  )
}

export default AppLogo
