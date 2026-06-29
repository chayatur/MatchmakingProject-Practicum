import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import axios from "axios"
import type { FileData } from "../types/file"
import type { User } from "../types/user"
import type { SharedResume } from "../types/share"
import type { RootState } from "../store"

interface FilesState {
  files: FileData[]
  filteredFiles: FileData[]
  users: User[]
  loading: boolean
  error: string | null
  currentFile: FileData | null
  uploadProgress: number
  sharedFiles: FileData[]
  sharings: SharedResume[]
}

const initialState: FilesState = {
  files: [],
  filteredFiles: [],
  users: [],
  loading: false,
  error: null,
  currentFile: null,
  uploadProgress: 0,
  sharedFiles: [],
  sharings: [],
}

const API_BASE = "https://matchmakingproject-practicum.onrender.com/api"

export const fetchFiles = createAsyncThunk("files/fetchFiles", async (_, { rejectWithValue, getState }) => {
  try {
    const state = getState() as RootState
    const currentUserId = state.user?.userId

    if (!currentUserId) return []

    const response = await axios.get<FileData[]>(`${API_BASE}/AIResponse/${currentUserId}/permitted`)

    const files = response.data.map((file) => ({
      ...file,
      isOwner: file.userId === currentUserId,
      isSharedWithMe: file.userId !== currentUserId,
    }))

    return files
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "שגיאה בטעינת הקבצים")
  }
})

// Download file
export const downloadFile = createAsyncThunk(
  "files/downloadFile",
  async ({ fileName }: { fileName: string }, { rejectWithValue }) => {
    try {
      const urlResponse = await axios.get(
        `${API_BASE}/Download_ShowFiles/download-url?fileName=${encodeURIComponent(fileName)}`,
      )
      console.log(urlResponse.data)
      if (urlResponse.data?.url) {
        return urlResponse.data
      }
      throw new Error("לא ניתן לקבל קישור להורדה")
    } catch (error: any) {
      console.error(error)
      return rejectWithValue(error.response?.data?.message || "שגיאה בהורדת הקובץ")
    }
  },
)

// viewOriginalFile
export const viewOriginalFile = createAsyncThunk(
  "files/viewOriginalFile",
  async ({ fileName }: { fileName: string }, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${API_BASE}/Download_ShowFiles/download-url?fileName=${encodeURIComponent(fileName)}`,
      )
      if (response.data?.url) {
        return { fileName, url: response.data.url, success: true }
      }
      throw new Error("לא ניתן לפתוח את הקובץ")
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "שגיאה בפתיחת הקובץ")
    }
  },
)

// Update file
export const updateFile = createAsyncThunk(
  "files/updateFile",
  async ({ id, data }: { id: number; data: Partial<FileData> }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_BASE}/AIResponse/${id}`, data)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "שגיאה בעדכון הקובץ")
    }
  },
)

// Delete file
export const deleteFile = createAsyncThunk("files/deleteFile", async (id: number, { rejectWithValue }) => {
  try {
    await axios.delete(`${API_BASE}/AIResponse/${id}`)
    return id
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "שגיאה במחיקת הקובץ")
  }
})

// Fetch users for sharing
export const fetchUsers = createAsyncThunk("files/fetchUsers", async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get<User[]>(`${API_BASE}/User`)
    return response.data
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "שגיאה בטעינת המשתמשים")
  }
})

// shareFile thunk
export const shareFile = createAsyncThunk(
  "files/shareFile",
  async (
    {
      resumeFileId,
      sharedByUserId,
      sharedWithUserId,
      shareAll = false,
    }: {
      resumeFileId: number
      sharedByUserId: number
      sharedWithUserId?: number
      shareAll?: boolean
    },
    { rejectWithValue, getState, dispatch },
  ) => {
    try {
      const state = getState() as RootState
      const user = state.user.user

      if (!user || !user.id) {
        throw new Error("User information is incomplete or not logged in.")
      }

      const payload: Record<string, any> = {
        userId: sharedByUserId,
        resumeFileId,
        shareAll,
      }

      if (sharedWithUserId !== undefined && sharedWithUserId !== null) {
        payload.sharedWithUserId = sharedWithUserId
      }

      console.log("🚀 shareFile: Sending payload to API:", payload)
      const response = await axios.post(`${API_BASE}/Sharing`, payload)
      console.log("✅ shareFile: API response:", response.data)

      console.log("🔄 shareFile: Dispatching fetchFiles to refresh data...")
      dispatch(fetchFiles())

      return response.data
    } catch (error: any) {
      console.error("❌ shareFile: Failed to share file:", error.response?.data || error.message)
      return rejectWithValue(error.response?.data || "שגיאה בשיתוף הקובץ")
    }
  },
)

const filesSlice = createSlice({
  name: "files",
  initialState,
  reducers: {
    clearFilters: (state) => {
      state.filteredFiles = state.files
    },
    setCurrentFile: (state, action: PayloadAction<FileData | null>) => {
      state.currentFile = action.payload
    },
    clearCurrentFile: (state) => {
      state.currentFile = null
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
    clearError: (state) => {
      state.error = null
    },
    setUploadProgress: (state, action: PayloadAction<number>) => {
      state.uploadProgress = action.payload
    },
    filterFiles: (state, action: PayloadAction<any>) => {
      const filters = action.payload
      console.log("🔍 filters received:", filters)
      console.log("📄 state.files BEFORE filter:", state.files)

      if (!filters || Object.keys(filters).length === 0) {
        console.log("🔄 No filters applied, restoring all files")
        state.filteredFiles = state.files
        return
      }

      const contains = (field: string | null | undefined, term: string) =>
        !!field && field.trim().toLowerCase().includes(term.trim().toLowerCase())

      state.filteredFiles = state.files.filter((file) => {
        if (filters.firstName && !contains(file.firstName, filters.firstName)) return false
        if (filters.lastName && !contains(file.lastName, filters.lastName)) return false
        if (filters.fatherName && !contains(file.fatherName, filters.fatherName)) return false
        if (filters.motherName && !contains(file.motherName, filters.motherName)) return false
        if (filters.address && !contains(file.address, filters.address)) return false
        if (filters.placeOfStudy && !contains(file.placeOfStudy, filters.placeOfStudy)) return false
        if (filters.occupation && !contains(file.occupation, filters.occupation)) return false
        if (filters.minAge !== 18 || filters.maxAge !== 50) {
          if (!file.age || file.age < filters.minAge || file.age > filters.maxAge) return false
        }
        if (filters.minHeight !== 150 || filters.maxHeight !== 200) {
          const heightCm = file.height ? file.height * 100 : null
          if (!heightCm || heightCm < filters.minHeight || heightCm > filters.maxHeight) return false
        }
        return true
      })
      console.log("🎯 Filtered files result:", state.filteredFiles)
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchFiles
      .addCase(fetchFiles.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchFiles.fulfilled, (state, action: PayloadAction<FileData[]>) => {
        state.loading = false
        state.files = action.payload
        state.filteredFiles = action.payload
      })
      .addCase(fetchFiles.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      // downloadFile
      .addCase(downloadFile.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(downloadFile.fulfilled, (state) => {
        state.loading = false
      })
      .addCase(downloadFile.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      // viewOriginalFile
      .addCase(viewOriginalFile.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(viewOriginalFile.fulfilled, (state) => {
        state.loading = false
      })
      .addCase(viewOriginalFile.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      // updateFile
      .addCase(updateFile.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateFile.fulfilled, (state, action: PayloadAction<FileData>) => {
        state.loading = false
        const index = state.files.findIndex((file) => file.id === action.payload.id)
        if (index !== -1) {
          state.files[index] = { ...state.files[index], ...action.payload }
          state.filteredFiles = state.files
        }
      })
      .addCase(updateFile.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      // deleteFile
      .addCase(deleteFile.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(deleteFile.fulfilled, (state, action: PayloadAction<number>) => {
        state.loading = false
        state.files = state.files.filter((file) => file.id !== action.payload)
        state.filteredFiles = state.filteredFiles.filter((file) => file.id !== action.payload)
      })
      .addCase(deleteFile.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      // fetchUsers
      .addCase(fetchUsers.fulfilled, (state, action: PayloadAction<User[]>) => {
        state.users = action.payload
      })

      // shareFile
      .addCase(shareFile.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(shareFile.fulfilled, (state) => {
        state.loading = false
      })
      .addCase(shareFile.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  },
})

export const {
  clearFilters,
  setCurrentFile,
  clearCurrentFile,
  filterFiles,
  setLoading,
  setError,
  clearError,
  setUploadProgress,
} = filesSlice.actions

export default filesSlice.reducer
