import type React from "react"
import { Box, Typography } from "@mui/material"

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
      <Box
        component="img"
        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/%D7%9C%D7%97%D7%99%D7%99%D7%9D.jpg-8mdWJd0R4S44AnIERwdrPPybeckoC8.jpeg"
        alt="לחיים - מחכים לשבירה שלך"
        sx={{
          height: logoHeight,
          objectFit: "contain",
        }}
      />
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
    </Box>
  )
}

export default AppLogo
