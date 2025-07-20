import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import axios from "axios"
import type { FileData } from "../types/file"
import type { User } from "../types/user"
import type { SharedResume } from "../types/share" // Import SharedResume type
import type { RootState } from "../store" // Ensure RootState is correctly imported

interface FilesState {
  files: FileData[]
  filteredFiles: FileData[]
  users: User[]
  loading: boolean
  error: string | null
  currentFile: FileData | null
  uploadProgress: number
  sharedFiles: FileData[] // This might become redundant if fetchFiles handles it
  sharings: SharedResume[] // Add this to store raw sharing data (though not directly used in state after processing)
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
  sharings: [], // Initialize
}

const API_BASE = "https://matchmakingproject-practicum.onrender.com/api"

// Fetch all files and their sharing status for the current user
export const fetchFiles = createAsyncThunk("files/fetchFiles", async (_, { rejectWithValue, getState }) => {
  try {
    const state = getState() as RootState
    const currentUserId = state.user?.userId // Use optional chaining for safety

    console.log("🚀 fetchFiles: Current userId from state:", currentUserId)

    // 1. Fetch all resumes
    const filesResponse = await axios.get<FileData[]>(`${API_BASE}/AIResponse`)
    console.log("📦 fetchFiles: Raw files from /AIResponse:", filesResponse.data)

    let allFiles: FileData[] = filesResponse.data

    // 2. If currentUserId exists, fetch shared resumes for this user
    if (currentUserId) {
      try {
        const sharedResumesResponse = await axios.get<SharedResume[]>(`${API_BASE}/Sharing/by-user/${currentUserId}`)
        // Log the raw response data to help debug backend issues
        console.log(
          "📦 fetchFiles: Raw shared resumes from /Sharing/by-user (for current user):",
          sharedResumesResponse.data,
        )

        // Create a Set of resumeFileIds that are shared *with* the current user
        const sharedResumeIds = new Set<number>()
        sharedResumesResponse.data.forEach((sharing) => {
          // *** זהו התיקון הממוקד: גישה ישירה ל-resumefileID במקום resumefile.id ***
          if (sharing && typeof sharing.resumefileID === "number") {
            sharedResumeIds.add(sharing.resumefileID)
          } else {
            // Log the malformed object for easier debugging
            console.warn("⚠️ fetchFiles: Skipping malformed shared resume object:", sharing)
          }
        })
        console.log("🎯 fetchFiles: Shared resume IDs for current user:", Array.from(sharedResumeIds))

        // 3. Mark files as 'isSharedWithMe' and 'isOwner'
        allFiles = allFiles.map((file) => {
          const isOwner = file.userId === currentUserId
          const isSharedWithMe = sharedResumeIds.has(file.id)
          console.log(
            `Processing file ID ${file.id}: isOwner=${isOwner}, isSharedWithMe=${isSharedWithMe} (sharedResumeIds.has(${file.id}) is ${sharedResumeIds.has(file.id)})`,
          )
          return {
            ...file,
            isOwner: isOwner,
            isSharedWithMe: isSharedWithMe,
          }
        })
      } catch (sharedError: any) {
        console.warn(
          "⚠️ fetchFiles: Could not fetch shared files for current user:",
          sharedError.response?.data || sharedError.message,
        )
        // Continue without shared status if fetching shared files fails
        allFiles = allFiles.map((file) => ({
          ...file,
          isOwner: file.userId === currentUserId,
          isSharedWithMe: false, // Default to false if shared data cannot be fetched
        }))
      }
    } else {
      // If no currentUserId (user not logged in), no files are "shared with me" or owned
      console.log("ℹ️ fetchFiles: No current user ID, setting isOwner and isSharedWithMe to false for all files.")
      allFiles = allFiles.map((file) => ({
        ...file,
        isOwner: false,
        isSharedWithMe: false,
      }))
    }

    const sortedFiles = allFiles.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    console.log("✅ fetchFiles: Final processed and sorted files:", sortedFiles)
    return sortedFiles
  } catch (error: any) {
    console.error("❌ fetchFiles: Error fetching files:", error.response?.data || error.message)
    return rejectWithValue(error.response?.data?.message || "שגיאה בטעינת הקבצים")
  }
})

// Download file (no changes needed)
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

// viewOriginalFile (no changes needed, adjusted to open in new tab)
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

// Update file (no changes needed)
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

// Delete file (no changes needed)
export const deleteFile = createAsyncThunk("files/deleteFile", async (id: number, { rejectWithValue }) => {
  try {
    await axios.delete(`${API_BASE}/ResumeFile/${id}`)
    return id
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "שגיאה במחיקת הקובץ")
  }
})

// Fetch users for sharing (no changes needed)
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
    { rejectWithValue, getState, dispatch }, // Add dispatch here
  ) => {
    try {
      const state = getState() as RootState
      const user = state.user.user // Access user directly from state.user.user

      if (!user || !user.id) {
        // Check for user.id for sharing
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

      // After successful sharing, re-fetch all files to update their shared status.
      // This is crucial because the backend doesn't return the full Sharing object
      // and we need to update the `isSharedWithMe` flag for the relevant resume.
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
      // Use 'any' for filters if type is complex
      const filters = action.payload
      console.log("🔍 filters received:", filters)
      console.log("📄 state.files BEFORE filter:", state.files)

      if (!filters || Object.keys(filters).length === 0) {
        console.log("🔄 No filters applied, restoring all files")
        state.filteredFiles = state.files
        return
      }

      state.filteredFiles = state.files.filter((file) => {
        let match = true
        if (filters.firstName && file.firstName) {
          match = match && file.firstName.trim().toLowerCase().includes(filters.firstName.trim().toLowerCase())
        }
        if (filters.lastName && file.lastName) {
          match = match && file.lastName.toLowerCase().includes(filters.lastName.toLowerCase())
        }
        if (filters.fatherName && file.fatherName) {
          match = match && file.fatherName.toLowerCase().includes(filters.fatherName.toLowerCase())
        }
        if (filters.motherName && file.motherName) {
          match = match && file.motherName.toLowerCase().includes(filters.motherName.toLowerCase())
        }
        if (filters.address && file.address) {
          match = match && file.address.toLowerCase().includes(filters.address.toLowerCase())
        }
        if (filters.placeOfStudy && file.placeOfStudy) {
          match = match && file.placeOfStudy.toLowerCase().includes(filters.placeOfStudy.toLowerCase())
        }
        if (filters.occupation && file.occupation) {
          match = match && file.occupation.toLowerCase().includes(filters.occupation.toLowerCase())
        }
        if (filters.minAge && filters.maxAge && file.age) {
          match = match && file.age >= filters.minAge && file.age <= filters.maxAge
        }
        if (filters.minHeight && filters.maxHeight && file.height) {
          match = match && file.height * 100 >= filters.minHeight && file.height * 100 <= filters.maxHeight
        }
        return match
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
        state.filteredFiles = action.payload // Update filteredFiles as well
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
          state.filteredFiles = state.files // Re-apply filters or re-set to all files
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
        // No need for action.payload here, as we re-fetch files
        state.loading = false
        // The re-fetch of files is handled by dispatch(fetchFiles()) inside the thunk
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
