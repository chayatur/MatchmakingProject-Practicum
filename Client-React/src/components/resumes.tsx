import type React from "react"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Container, Box, Typography, Paper, Button, Collapse } from "@mui/material"
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

const ResumesPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { filteredFiles, loading, error } = useSelector((state: RootState) => state.files)
  const isLoggedIn = useSelector((state: RootState) => state.user.isLoggedIn)
  const [searchPerformed, setSearchPerformed] = useState(false)
  const [showSearch, setShowSearch] = useState(false)

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
  const handleSearch = (filters: SearchFilters) => {
    console.log(searchPerformed);
    
    setSearchPerformed(true)
  
    const hasFilters = Object.entries(filters).some(([key, value]) => {
      if (typeof value === "string") return value.trim() !== ""
      if (key === "minAge") return value !== 18
      if (key === "maxAge") return value !== 50
      if (key === "minHeight") return value !== 150
      if (key === "maxHeight") return value !== 200
      return false
    })
  
    if (hasFilters) {
      // זה יעבד מיד כי זה reducer רגיל, לא async
      dispatch(filterFiles(filters))
    } else {
      dispatch(fetchFiles()) // זה נשאר async
    }
  }

  const handleDownload = (fileName: string) => {
    dispatch(downloadFile({ fileName }))
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
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
            יש להתחבר למערכת כדי לצפות ברזומות
          </Typography>
        </Paper>
      )}
    </Container>
  )
}

export default ResumesPage
