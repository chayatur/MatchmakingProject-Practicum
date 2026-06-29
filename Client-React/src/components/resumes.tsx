import type React from "react"
import { useEffect, useState, useCallback } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Container, Box, Typography, Paper, Button, Collapse, Link } from "@mui/material"
import { Search as SearchIcon, ExpandMore as ExpandMoreIcon, ExpandLess as ExpandLessIcon } from "@mui/icons-material"


import type { AppDispatch, RootState } from "../store"
import ResumeList from "./resumesList"
import ResumeSearch from "./resumeSearch"
import { downloadFile, fetchFiles, filterFiles } from "../slices/fileSlice"

interface SearchFilters {
  firstName: string
  lastName: string
  fatherName: string
  motherName: string
  address: string
  placeOfStudy: string
  occupation: string
  minAge: number
  maxAge: number
  minHeight: number
  maxHeight: number
}

// דף ניהול הרזומות — שולף את כל הרזומות מהסטור, מציג חיפוש ורשימה
const ResumesPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { filteredFiles, loading, error } = useSelector((state: RootState) => state.files)
  const isLoggedIn = useSelector((state: RootState) => state.user.isLoggedIn)
  const [showSearch, setShowSearch] = useState(false)

  // שולף את כל הקבצים מהשרת בכל פעם שמצב ההתחברות משתנה
  useEffect(() => {
    console.log(isLoggedIn,'isLogin');

    if (isLoggedIn) {
      dispatch(fetchFiles())
    }
  }, [dispatch, isLoggedIn])

  // const handleSearch = (filters: SearchFilters) => {
  //   setSearchPerformed(true)

  //   // Check if we have any active filters
  //   const hasFilters = Object.entries(filters).some(([key, value]) => {
  //     if (typeof value === "string") return value.trim() !== ""
  //     if (key === "minAge") return value !== 18
  //     if (key === "maxAge") return value !== 50
  //     if (key === "minHeight") return value !== 150
  //     if (key === "maxHeight") return value !== 200
  //     return false
  //   })

  //   if (hasFilters) {
  //     dispatch(filterFiles(filters))
  //   } else {
  //     dispatch(fetchFiles())
  //   }
  // }
  // מטפל בחיפוש: אם יש פילטרים פעילים — מסנן, אחרת מחזיר את כל הרזומות
  const handleSearch = useCallback((filters: SearchFilters) => {
    const hasFilters = Object.entries(filters).some(([key, value]) => {
      if (typeof value === "string") return value.trim() !== ""
      if (key === "minAge") return value !== 18
      if (key === "maxAge") return value !== 50
      if (key === "minHeight") return value !== 150
      if (key === "maxHeight") return value !== 200
      return false
    })
    if (hasFilters) {
      dispatch(filterFiles(filters))
    } else {
      dispatch(fetchFiles())
    }
  }, [dispatch])

  // מפעיל הורדת קובץ רזומה לפי שם הקובץ
  const handleDownload = (fileName: string) => {
    dispatch(downloadFile({ fileName }))
  }

  return (
    <Container maxWidth={false} sx={{ py: 4 }}>
      <Box sx={{ mb: 4, textAlign: "center" }}>
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{
            color: "#8B0000",
            fontWeight: "bold",
            position: "relative",
            display: "inline-block",
            "&::after": {
              content: '""',
              position: "absolute",
              bottom: -8,
              left: "25%",
              width: "50%",
              height: 3,
              backgroundColor: "#8B0000",
              borderRadius: 2,
            },
          }}
        >
          ניהול רזומות
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          חיפוש, צפייה והורדת רזומות במערכת השידוכים
        </Typography>
      </Box>

      {/* Search Toggle Button */}
      {isLoggedIn && (
        <Box sx={{ mb: 3, textAlign: "center" }}>
          <Button
            variant="contained"
            onClick={() => setShowSearch(!showSearch)}
            startIcon={<SearchIcon />}
            endIcon={showSearch ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            sx={{
              backgroundColor: "#8B0000",
              color: "white",
              "&:hover": {
                backgroundColor: "#5c0000",
              },
              px: 4,
              py: 1.5,
              borderRadius: 3,
              fontWeight: 600,
            }}
          >
            {showSearch ? "הסתר חיפוש" : "הצג חיפוש"}
          </Button>
        </Box>
      )}

      {/* Search Component */}
      <Collapse in={showSearch}>
        <ResumeSearch onSearch={handleSearch} isLoading={loading} />
      </Collapse>

      {isLoggedIn ? (
        <ResumeList
          resumes={filteredFiles}
          isLoading={loading}
          error={error || undefined}
          onDownload={handleDownload}
        />
      ) : (
        <Paper
        elevation={3}
        sx={{
          p: 3,
          textAlign: "center",
          backgroundColor: "#f9f5f5",
          border: "1px solid #e5d6d6",
        }}
      >
        <Typography variant="h6" color="#8B0000">
          <Link href="/login" color="#8B0000" underline="hover">
          יש להתחבר למערכת כדי לצפות ברזומות.
          </Link>
        </Typography>
      </Paper>
      )}
    </Container>
  )
}

export default ResumesPage
