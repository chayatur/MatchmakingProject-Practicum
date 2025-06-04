"use client"

import type React from "react"
import { useState } from "react"
import { useSelector } from "react-redux"
import type { RootState } from "../store"
import { Box, TextField, Button, Grid, Typography, Paper, InputAdornment, Chip, Slider, Divider } from "@mui/material"
import SearchIcon from "@mui/icons-material/Search"
import FilterListIcon from "@mui/icons-material/FilterList"
import ClearIcon from "@mui/icons-material/Clear"

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

const initialFilters: SearchFilters = {
  firstName: "",
  lastName: "",
  fatherName: "",
  motherName: "",
  address: "",
  placeOfStudy: "",
  occupation: "",
  minAge: 18,
  maxAge: 50,
  minHeight: 150,
  maxHeight: 200,
}

interface ResumeSearchProps {
  onSearch: (filters: SearchFilters) => void
  isLoading?: boolean
}

const ResumeSearch: React.FC<ResumeSearchProps> = ({ onSearch, isLoading = false }) => {
  const [filters, setFilters] = useState<SearchFilters>(initialFilters)
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [activeFilters, setActiveFilters] = useState<string[]>([])
  const isLoggedIn = useSelector((state: RootState) => state.user.isLoggedIn)

  const handleFilterChange = (field: keyof SearchFilters, value: string | number) => {
    setFilters((prev) => ({ ...prev, [field]: value }))
  }

  const handleSearch = () => {
    const newActiveFilters = Object.entries(filters)
      .filter(([key, value]) => {
        if (typeof value === "string") return value.trim() !== ""
        if (key === "minAge") return value !== initialFilters.minAge
        if (key === "maxAge") return value !== initialFilters.maxAge
        if (key === "minHeight") return value !== initialFilters.minHeight
        if (key === "maxHeight") return value !== initialFilters.maxHeight
        return false
      })
      .map(([key]) => key)

    setActiveFilters(newActiveFilters)
    onSearch(filters)
  }

  const handleClearFilters = () => {
    setFilters(initialFilters)
    setActiveFilters([])
  }

  const handleRemoveFilter = (filter: string) => {
    setFilters((prev) => ({
      ...prev,
      [filter]:
        typeof initialFilters[filter as keyof SearchFilters] === "string"
          ? ""
          : initialFilters[filter as keyof SearchFilters],
    }))
    setActiveFilters((prev) => prev.filter((f) => f !== filter))
  }

  const getFilterLabel = (key: string): string => {
    const labels: Record<string, string> = {
      firstName: "שם פרטי",
      lastName: "שם משפחה",
      fatherName: "שם האב",
      motherName: "שם האם",
      address: "כתובת",
      placeOfStudy: "מקום לימודים",
      occupation: "עיסוק",
      minAge: "גיל מינימלי",
      maxAge: "גיל מקסימלי",
      minHeight: "גובה מינימלי",
      maxHeight: "גובה מקסימלי",
    }
    return labels[key] || key
  }

  if (!isLoggedIn) {
    return (
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
         <div> יש להתחבר למערכת כדי לחפש רזומות</div>
        </Typography>
      </Paper>
    )
  }

  return (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        mb: 4,
        borderRadius: 2,
        backgroundColor: "#fff",
        border: "1px solid #e5d6d6",
      }}
    >
      <Typography
        variant="h5"
        gutterBottom
        sx={{
          color: "#8B0000",
          fontWeight: "bold",
          textAlign: "center",
          mb: 3,
        }}
      >
        <div>
        חיפוש רזומות
        </div>
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="שם פרטי"
            value={filters.firstName}
            onChange={(e) => handleFilterChange("firstName", e.target.value)}
            variant="outlined"
            dir="rtl"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: "#8B0000" }} />
                </InputAdornment>
              ),
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                "&.Mui-focused fieldset": {
                  borderColor: "#8B0000",
                },
              },
              "& .MuiInputLabel-root.Mui-focused": {
                color: "#8B0000",
              },
            }}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="שם משפחה"
            value={filters.lastName}
            onChange={(e) => handleFilterChange("lastName", e.target.value)}
            variant="outlined"
            dir="rtl"
            sx={{
              "& .MuiOutlinedInput-root": {
                "&.Mui-focused fieldset": {
                  borderColor: "#8B0000",
                },
              },
              "& .MuiInputLabel-root.Mui-focused": {
                color: "#8B0000",
              },
            }}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="כתובת"
            value={filters.address}
            onChange={(e) => handleFilterChange("address", e.target.value)}
            variant="outlined"
            dir="rtl"
            sx={{
              "& .MuiOutlinedInput-root": {
                "&.Mui-focused fieldset": {
                  borderColor: "#8B0000",
                },
              },
              "& .MuiInputLabel-root.Mui-focused": {
                color: "#8B0000",
              },
            }}
          />
        </Grid>
      </Grid>

      <Box sx={{ mt: 2, mb: 2 }}>
        <Button
          variant="text"
          onClick={() => setShowAdvanced(!showAdvanced)}
          startIcon={<FilterListIcon />}
          sx={{
            color: "#8B0000",
            "&:hover": {
              backgroundColor: "rgba(139, 0, 0, 0.04)",
            },
          }}
        >
          {showAdvanced ? "הסתר חיפוש מתקדם" : "הצג חיפוש מתקדם"}
        </Button>
      </Box>

      {showAdvanced && (
        <Box sx={{ mt: 2, mb: 3 }}>
          <Divider sx={{ mb: 3 }} />
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="שם האב"
                value={filters.fatherName}
                onChange={(e) => handleFilterChange("fatherName", e.target.value)}
                variant="outlined"
                dir="rtl"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "&.Mui-focused fieldset": {
                      borderColor: "#8B0000",
                    },
                  },
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: "#8B0000",
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="שם האם"
                value={filters.motherName}
                onChange={(e) => handleFilterChange("motherName", e.target.value)}
                variant="outlined"
                dir="rtl"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "&.Mui-focused fieldset": {
                      borderColor: "#8B0000",
                    },
                  },
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: "#8B0000",
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="מקום לימודים"
                value={filters.placeOfStudy}
                onChange={(e) => handleFilterChange("placeOfStudy", e.target.value)}
                variant="outlined"
                dir="rtl"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "&.Mui-focused fieldset": {
                      borderColor: "#8B0000",
                    },
                  },
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: "#8B0000",
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="עיסוק"
                value={filters.occupation}
                onChange={(e) => handleFilterChange("occupation", e.target.value)}
                variant="outlined"
                dir="rtl"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "&.Mui-focused fieldset": {
                      borderColor: "#8B0000",
                    },
                  },
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: "#8B0000",
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography gutterBottom dir="rtl">
                <div>
                טווח גילאים: {filters.minAge} - {filters.maxAge}
                </div>
              </Typography>
              <Slider
                value={[filters.minAge, filters.maxAge]}
                onChange={(_, newValue) => {
                  const [min, max] = newValue as number[]
                  handleFilterChange("minAge", min)
                  handleFilterChange("maxAge", max)
                }}
                valueLabelDisplay="auto"
                min={18}
                max={70}
                sx={{
                  color: "#8B0000",
                  "& .MuiSlider-thumb": {
                    "&:hover, &.Mui-focusVisible": {
                      boxShadow: "0px 0px 0px 8px rgba(139, 0, 0, 0.16)",
                    },
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography gutterBottom dir="rtl">
                <div>
                טווח גבהים (ס"מ): {filters.minHeight} - {filters.maxHeight}
                </div>
              </Typography>
              <Slider
                value={[filters.minHeight, filters.maxHeight]}
                onChange={(_, newValue) => {
                  const [min, max] = newValue as number[]
                  handleFilterChange("minHeight", min)
                  handleFilterChange("maxHeight", max)
                }}
                valueLabelDisplay="auto"
                min={140}
                max={210}
                sx={{
                  color: "#8B0000",
                  "& .MuiSlider-thumb": {
                    "&:hover, &.Mui-focusVisible": {
                      boxShadow: "0px 0px 0px 8px rgba(139, 0, 0, 0.16)",
                    },
                  },
                }}
              />
            </Grid>
          </Grid>
        </Box>
      )}

      {activeFilters.length > 0 && (
        <Box sx={{ mt: 2, mb: 2 }}>
          <Typography variant="subtitle2" gutterBottom dir="rtl">
            <div>
            סינון פעיל:
            </div>
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
            {activeFilters.map((filter) => (
              <Chip
                key={filter}
                label={`${getFilterLabel(filter)}`}
                onDelete={() => handleRemoveFilter(filter)}
                sx={{
                  backgroundColor: "rgba(139, 0, 0, 0.1)",
                  color: "#8B0000",
                  "& .MuiChip-deleteIcon": {
                    color: "#8B0000",
                    "&:hover": {
                      color: "#5c0000",
                    },
                  },
                }}
              />
            ))}
            <Chip
              label="נקה הכל"
              onClick={handleClearFilters}
              sx={{
                backgroundColor: "rgba(139, 0, 0, 0.05)",
                color: "#8B0000",
                "&:hover": {
                  backgroundColor: "rgba(139, 0, 0, 0.1)",
                },
              }}
            />
          </Box>
        </Box>
      )}

      <Box sx={{ mt: 3, display: "flex", justifyContent: "center", gap: 2 }}>
        <Button
          variant="contained"
          onClick={handleSearch}
          disabled={isLoading}
          startIcon={<SearchIcon />}
          sx={{
            backgroundColor: "#8B0000",
            color: "white",
            "&:hover": {
              backgroundColor: "#5c0000",
            },
            minWidth: 120,
          }}
        >
          {isLoading ? "מחפש..." : "חפש"}
        </Button>
        <Button
          variant="outlined"
          onClick={handleClearFilters}
          startIcon={<ClearIcon />}
          sx={{
            borderColor: "#8B0000",
            color: "#8B0000",
            "&:hover": {
              borderColor: "#5c0000",
              backgroundColor: "rgba(139, 0, 0, 0.04)",
            },
          }}
        >
          <div>
          נקה סינון
          </div>
        </Button>
      </Box>
    </Paper>
  )
}

export default ResumeSearch
