import type React from "react"
import { useState } from "react"
import { useSelector } from "react-redux"
import type { RootState } from "../store"
import {
  Box,
  TextField,
  Button,
  Grid,
  Typography,
  Paper,
  InputAdornment,
  Chip,
  Slider,
  Divider,
  Drawer,
  IconButton,
  Tooltip,
  Fade,
} from "@mui/material"
import {
  Search as SearchIcon,
  FilterList as FilterListIcon,
  Clear as ClearIcon,
  Close as CloseIcon,
} from "@mui/icons-material"

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
  const [drawerOpen, setDrawerOpen] = useState(false)
  const isLoggedIn = useSelector((state: RootState) => state.user.isLoggedIn)

  const handleFilterChange = (field: keyof SearchFilters, value: string | number) => {
    setFilters((prev) => ({ ...prev, [field]: value }))
  }

  const handleSearch = () => {
    // Update active filters list
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
    setDrawerOpen(false)
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

  const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
    if (
      event.type === "keydown" &&
      ((event as React.KeyboardEvent).key === "Tab" || (event as React.KeyboardEvent).key === "Shift")
    ) {
      return
    }
    setDrawerOpen(open)
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
          mb: 4,
        }}
      >
        <Typography variant="h6" color="#8B0000">
          יש להתחבר למערכת כדי לחפש רזומות
        </Typography>
      </Paper>
    )
  }

  const searchDrawer = (
    <Box
      sx={{
        width: { xs: "100%", sm: 400 },
        p: 3,
        height: "100%",
        overflow: "auto",
        backgroundColor: "#fff",
      }}
      role="presentation"
    >
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, color: "#8B0000" }}>
          חיפוש מתקדם
        </Typography>
        <IconButton onClick={toggleDrawer(false)} sx={{ color: "#8B0000" }}>
          <CloseIcon />
        </IconButton>
      </Box>

      <Divider sx={{ mb: 3 }} />

      <Grid container spacing={2}>
        <Grid item xs={12}>
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
        <Grid item xs={12}>
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
        <Grid item xs={12}>
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

        <Grid item xs={12}>
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
        </Grid>

        {showAdvanced && (
          <>
            <Grid item xs={12}>
              <Divider sx={{ mb: 2 }} />
            </Grid>
            <Grid item xs={12}>
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
            <Grid item xs={12}>
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
            <Grid item xs={12}>
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
            <Grid item xs={12}>
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
            <Grid item xs={12}>
              <Typography gutterBottom dir="rtl">
                טווח גילאים: {filters.minAge} - {filters.maxAge}
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
            <Grid item xs={12}>
              <Typography gutterBottom dir="rtl">
                טווח גבהים (ס"מ): {filters.minHeight} - {filters.maxHeight}
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
          </>
        )}
      </Grid>

      {activeFilters.length > 0 && (
        <Box sx={{ mt: 3, mb: 2 }}>
          <Typography variant="subtitle2" gutterBottom dir="rtl">
            סינון פעיל:
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

      <Box sx={{ mt: 4, display: "flex", justifyContent: "space-between", gap: 2 }}>
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
            flex: 1,
          }}
        >
          נקה סינון
        </Button>
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
            flex: 2,
          }}
        >
          {isLoading ? "מחפש..." : "חפש"}
        </Button>
      </Box>
    </Box>
  )

  return (
    <Box sx={{ mb: 4, display: "flex", justifyContent: "flex-end" }}>
      <Tooltip title="פתח חיפוש מתקדם">
        <Button
          variant="contained"
          onClick={toggleDrawer(true)}
          startIcon={<FilterListIcon />}
          sx={{
            backgroundColor: "#8B0000",
            color: "white",
            "&:hover": {
              backgroundColor: "#5c0000",
            },
          }}
        >
          סינון 
        </Button>
      </Tooltip>

      <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer(false)}>
        {searchDrawer}
      </Drawer>

      {activeFilters.length > 0 && (
        <Fade in={true}>
          <Box sx={{ mr: 2 }}>
            <Paper
              elevation={1}
              sx={{
                p: 1,
                px: 2,
                display: "flex",
                alignItems: "center",
                borderRadius: 4,
                backgroundColor: "rgba(139, 0, 0, 0.05)",
              }}
            >
              <Typography variant="body2" sx={{ mr: 1, color: "#8B0000" }}>
                סינון פעיל: {activeFilters.length}
              </Typography>
              <Chip
                label="נקה"
                size="small"
                onClick={handleClearFilters}
                deleteIcon={<ClearIcon />}
                onDelete={handleClearFilters}
                sx={{
                  backgroundColor: "rgba(139, 0, 0, 0.1)",
                  color: "#8B0000",
                  "& .MuiChip-deleteIcon": {
                    color: "#8B0000",
                  },
                }}
              />
            </Paper>
          </Box>
        </Fade>
      )}
    </Box>
  )
}

export default ResumeSearch
