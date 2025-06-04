import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios"
import { FileData } from "../types/file"
import { SharingData } from "../types/share"

interface FilesState {
  files: FileData[]
  filteredFiles: FileData[]
  sharedFiles: SharingData[]
  loading: boolean
  error: string | null
  currentFile: FileData | null
  uploadProgress: number
}

const initialState: FilesState = {
  files: [],
  filteredFiles: [],
  sharedFiles: [],
  loading: false,
  error: null,
  currentFile: null,
  uploadProgress: 0,
}

// Fetch all files with ownership info
export const fetchFiles = createAsyncThunk("files/fetchFiles", async (_, { rejectWithValue, getState }) => {
  try {
    const state = getState() as any
    const currentUserId = state.user.userId

    const response = await axios.get<FileData[]>("http://localhost:5138/api/AIResponse")

    // Mark files as owned by current user
    const filesWithOwnership = response.data.map((file) => ({
      ...file,
      isOwner: file.userId === currentUserId,
    }))

    // Sort by creation date (newest first)
    const sortedFiles = filesWithOwnership.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )

    return sortedFiles
  } catch (e: any) {
    return rejectWithValue(e.response?.data?.message || e.message || "Failed to fetch files")
  }
})

// Download file with corrected API call
export const downloadFile = createAsyncThunk(
  "files/downloadFile",
  async ({ fileName }: { fileName: string }, { rejectWithValue }) => {
    try {
      // First get the download URL
      const urlResponse = await axios.get(
        `http://localhost:5138/api/Download_ShowFiles/download-url?fileName=${encodeURIComponent(fileName)}`,
      )

      if (urlResponse.data && urlResponse.data.url) {
        // Use the pre-signed URL to download the file
        const fileResponse = await axios.get(urlResponse.data.url, {
          responseType: "blob",
        })

        const url = window.URL.createObjectURL(new Blob([fileResponse.data]))
        const link = document.createElement("a")
        link.href = url
        link.setAttribute("download", fileName)
        document.body.appendChild(link)
        link.click()
        link.parentNode?.removeChild(link)
        window.URL.revokeObjectURL(url)

        return { fileName, success: true }
      } else {
        throw new Error("Failed to get download URL")
      }
    } catch (e: any) {
      return rejectWithValue(e.response?.data?.message || e.message || "Failed to download file")
    }
  },
)

// Update file data with correct field names and HTTP method
export const updateFile = createAsyncThunk(
  "files/updateFile",
  async ({ id, data }: { id: number; data: Partial<FileData> }, { rejectWithValue }) => {
    try {
      // Log the data before sending
      console.log("Updating file data:", { id, data });

      const response = await axios.put(`http://localhost:5138/api/AIResponse/${id}`, data, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      return response.data
    } catch (e: any) {
      return rejectWithValue(e.response?.data?.message || e.message || "Failed to update file")
    }
  },
)

// Delete file with correct HTTP method
export const deleteFile = createAsyncThunk("files/deleteFile", async (id: number, { rejectWithValue }) => {
  try {
    await axios.delete(`http://localhost:5138/api/AIResponse/${id}`)
    return id
  } catch (e: any) {
    return rejectWithValue(e.response?.data?.message || e.message || "Failed to delete file")
  }
})

// Share file with corrected field names and HTTP method
export const shareFile = createAsyncThunk(
  "files/shareFile",
  async (
    { resumeFileId, sharedWithUserId }: { resumeFileId: number; sharedWithUserId: number },
    { rejectWithValue },
  ) => {
    try {
      const shareData = {
        ResumefileID: resumeFileId, // Match server field name
        SharedWithUserID: sharedWithUserId, // Match server field name
        SharedAt: new Date().toISOString(),
      }

      // Log the shareData before sending
      console.log("Sharing data:", shareData);

      const response = await axios.post("http://localhost:5138/api/Sharing", shareData, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      return response.data
    } catch (e: any) {
      return rejectWithValue(e.response?.data?.message || e.message || "Failed to share file")
    }
  },
)

// Fetch shared files
export const fetchSharedFiles = createAsyncThunk("files/fetchSharedFiles", async (_, { rejectWithValue, getState }) => {
  try {
    const state = getState() as any
    const currentUserId = state.user.userId

    const response = await axios.get<SharingData[]>(`http://localhost:5138/api/Sharing/user/${currentUserId}`)
    return response.data
  } catch (e: any) {
    return rejectWithValue(e.response?.data?.message || e.message || "Failed to fetch shared files")
  }
})

const filesSlice = createSlice({
  name: "files",
  initialState,
  reducers: {
    clearFilters: (state) => {
      state.filteredFiles = state.files
    },
    setCurrentFile: (state, action) => {
      state.currentFile = action.payload
    },
    clearCurrentFile: (state) => {
      state.currentFile = null
    },
    setLoading: (state, action) => {
      state.loading = action.payload
    },
    setError: (state, action) => {
      state.error = action.payload
    },
    setUploadProgress: (state, action) => {
      state.uploadProgress = action.payload
    },
    filterFiles: (state, action) => {
      const filters = action.payload

      if (!filters || Object.keys(filters).length === 0) {
        state.filteredFiles = state.files
        return
      }

      state.filteredFiles = state.files.filter((file) => {
        let match = true

        // String filters
        if (filters.firstName && file.firstName) {
          match = match && file.firstName.toLowerCase().includes(filters.firstName.toLowerCase())
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

        // Number range filters
        if (filters.minAge !== undefined && filters.maxAge !== undefined && file.age) {
          match = match && file.age >= filters.minAge && file.age <= filters.maxAge
        }
        if (filters.minHeight !== undefined && filters.maxHeight !== undefined && file.height) {
          match = match && file.height >= filters.minHeight && file.height <= filters.maxHeight
        }

        return match
      })
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchFiles
      .addCase(fetchFiles.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchFiles.fulfilled, (state, action) => {
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

      // updateFile
      .addCase(updateFile.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateFile.fulfilled, (state, action) => {
        state.loading = false
        const index = state.files.findIndex((file) => file.id === action.payload.id)
        if (index !== -1) {
          state.files[index] = action.payload
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
      .addCase(deleteFile.fulfilled, (state, action) => {
        state.loading = false
        state.files = state.files.filter((file) => file.id !== action.payload)
        state.filteredFiles = state.filteredFiles.filter((file) => file.id !== action.payload)
      })
      .addCase(deleteFile.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      // shareFile
      .addCase(shareFile.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(shareFile.fulfilled, (state, action) => {
        state.loading = false
        state.sharedFiles.push(action.payload)
      })
      .addCase(shareFile.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      // fetchSharedFiles
      .addCase(fetchSharedFiles.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchSharedFiles.fulfilled, (state, action) => {
        state.loading = false
        state.sharedFiles = action.payload
      })
      .addCase(fetchSharedFiles.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  },
})

export const { clearFilters, setCurrentFile, clearCurrentFile, filterFiles, setLoading, setError, setUploadProgress } =
  filesSlice.actions

export default filesSlice.reducer
