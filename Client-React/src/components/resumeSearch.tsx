import type React from "react"
import { useState, useEffect } from "react"
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
  Collapse,
} from "@mui/material"
import {
  Search as SearchIcon,
  FilterList as FilterListIcon,
  Clear as ClearIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
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

const fieldStyle = {
  "& .MuiOutlinedInput-root": {
    "&.Mui-focused fieldset": { borderColor: "#8B0000" },
  },
  "& .MuiInputLabel-root.Mui-focused": { color: "#8B0000" },
}

const ResumeSearch: React.FC<ResumeSearchProps> = ({ onSearch }) => {
  const [filters, setFilters] = useState<SearchFilters>(initialFilters)
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [activeFilters, setActiveFilters] = useState<string[]>([])
  const isLoggedIn = useSelector((state: RootState) => state.user.isLoggedIn)

  const handleFilterChange = (field: keyof SearchFilters, value: string | number) => {
    setFilters((prev) => ({ ...prev, [field]: value }))
  }

  // live search — מסנן אוטומטית 300ms אחרי כל הקלדה
  useEffect(() => {
    const timer = setTimeout(() => {
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
    }, 300)
    return () => clearTimeout(timer)
  }, [filters, onSearch])

  const handleClearFilters = () => {
    setFilters(initialFilters)
    setActiveFilters([])
    onSearch(initialFilters)
  }

  const handleRemoveFilter = (filter: string) => {
    const updated = {
      ...filters,
      [filter]:
        typeof initialFilters[filter as keyof SearchFilters] === "string"
          ? ""
          : initialFilters[filter as keyof SearchFilters],
    }
    setFilters(updated)
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
      <Paper elevation={3} sx={{ p: 3, textAlign: "center", backgroundColor: "#f9f5f5", border: "1px solid #e5d6d6", mb: 4 }}>
        <Typography variant="h6" color="#8B0000">
          יש להתחבר למערכת כדי לחפש רזומות
        </Typography>
      </Paper>
    )
  }

  return (
    <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 3, border: "1px solid rgba(139,0,0,0.1)" }}>
      {/* כותרת */}
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <FilterListIcon sx={{ color: "#8B0000" }} />
          <Typography variant="h6" sx={{ fontWeight: 600, color: "#8B0000" }}>
            חיפוש וסינון
          </Typography>
          {activeFilters.length > 0 && (
            <Chip
              label={`${activeFilters.length} סינונים פעילים`}
              size="small"
              sx={{ backgroundColor: "#8B0000", color: "white", fontWeight: 600 }}
            />
          )}
        </Box>
        {activeFilters.length > 0 && (
          <Button
            size="small"
            startIcon={<ClearIcon />}
            onClick={handleClearFilters}
            sx={{ color: "#8B0000", "&:hover": { backgroundColor: "rgba(139,0,0,0.05)" } }}
          >
            נקה הכל
          </Button>
        )}
      </Box>

      {/* שדות בסיסיים */}
      <Grid container spacing={2}>
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth size="small" label="שם פרטי" value={filters.firstName} dir="rtl"
            onChange={(e) => handleFilterChange("firstName", e.target.value)}
            InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: "#8B0000", fontSize: 18 }} /></InputAdornment> }}
            sx={fieldStyle}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth size="small" label="שם משפחה" value={filters.lastName} dir="rtl"
            onChange={(e) => handleFilterChange("lastName", e.target.value)}
            sx={fieldStyle}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth size="small" label="כתובת" value={filters.address} dir="rtl"
            onChange={(e) => handleFilterChange("address", e.target.value)}
            sx={fieldStyle}
          />
        </Grid>
      </Grid>

      {/* כפתור חיפוש מתקדם */}
      <Box sx={{ mt: 2, display: "flex", alignItems: "center" }}>
        <Button
          size="small"
          onClick={() => setShowAdvanced(!showAdvanced)}
          endIcon={showAdvanced ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          sx={{ color: "#8B0000", textTransform: "none", "&:hover": { backgroundColor: "rgba(139,0,0,0.05)" } }}
        >
          {showAdvanced ? "הסתר חיפוש מתקדם" : "חיפוש מתקדם"}
        </Button>
      </Box>

      {/* שדות מתקדמים */}
      <Collapse in={showAdvanced}>
        <Divider sx={{ my: 2 }} />
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <TextField fullWidth size="small" label="שם האב" value={filters.fatherName} dir="rtl"
              onChange={(e) => handleFilterChange("fatherName", e.target.value)} sx={fieldStyle} />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField fullWidth size="small" label="שם האם" value={filters.motherName} dir="rtl"
              onChange={(e) => handleFilterChange("motherName", e.target.value)} sx={fieldStyle} />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField fullWidth size="small" label="מקום לימודים" value={filters.placeOfStudy} dir="rtl"
              onChange={(e) => handleFilterChange("placeOfStudy", e.target.value)} sx={fieldStyle} />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField fullWidth size="small" label="עיסוק" value={filters.occupation} dir="rtl"
              onChange={(e) => handleFilterChange("occupation", e.target.value)} sx={fieldStyle} />
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="body2" gutterBottom dir="rtl" sx={{ color: "#8B0000", fontWeight: 500 }}>
              טווח גילאים: {filters.minAge}–{filters.maxAge}
            </Typography>
            <Slider
              value={[filters.minAge, filters.maxAge]}
              onChange={(_, v) => { const [min, max] = v as number[]; handleFilterChange("minAge", min); handleFilterChange("maxAge", max) }}
              valueLabelDisplay="auto" min={18} max={70}
              sx={{ color: "#8B0000" }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="body2" gutterBottom dir="rtl" sx={{ color: "#8B0000", fontWeight: 500 }}>
              טווח גבהים: {filters.minHeight}–{filters.maxHeight} ס"מ
            </Typography>
            <Slider
              value={[filters.minHeight, filters.maxHeight]}
              onChange={(_, v) => { const [min, max] = v as number[]; handleFilterChange("minHeight", min); handleFilterChange("maxHeight", max) }}
              valueLabelDisplay="auto" min={140} max={210}
              sx={{ color: "#8B0000" }}
            />
          </Grid>
        </Grid>
      </Collapse>

      {/* תגיות סינון פעיל */}
      {activeFilters.length > 0 && (
        <Box sx={{ mt: 2, display: "flex", flexWrap: "wrap", gap: 1 }}>
          {activeFilters.map((filter) => (
            <Chip
              key={filter}
              label={getFilterLabel(filter)}
              onDelete={() => handleRemoveFilter(filter)}
              size="small"
              sx={{
                backgroundColor: "rgba(139,0,0,0.1)",
                color: "#8B0000",
                "& .MuiChip-deleteIcon": { color: "#8B0000" },
              }}
            />
          ))}
        </Box>
      )}
    </Paper>
  )
}

export default ResumeSearch
