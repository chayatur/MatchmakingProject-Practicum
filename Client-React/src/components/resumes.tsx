import type React from "react"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Container, Box, Typography, Paper } from "@mui/material"
import ResumeSearch from "./resumeSearch"
import ResumeList from "./resumesList"
import { fetchFiles, downloadFile, filterFiles } from "../slices/fileSlice"
import type { AppDispatch, RootState } from "../store"

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

  useEffect(() => {
    if (isLoggedIn) {
      dispatch(fetchFiles())
    }
  }, [dispatch, isLoggedIn])

  const handleSearch = (filters: SearchFilters) => {
    setSearchPerformed(true)

    // Check if we have any active filters
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
  }

  const handleDownload = (fileId: number, fileName: string) => {
    dispatch(downloadFile({ id: fileId, fileName }))
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
      management resumes
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          חיפוש, צפייה והורדת רזומות במערכת השידוכים
        </Typography>
      </Box>

      <ResumeSearch onSearch={handleSearch} isLoading={loading} />

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
