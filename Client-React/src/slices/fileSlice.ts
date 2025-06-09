// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
// import axios from "axios"
// import { FileData } from "../types/file"
// import { User } from "../types/user"

// interface FilesState {
//   files: FileData[]
//   filteredFiles: FileData[]
//   users: User[]
//   loading: boolean
//   error: string | null
//   currentFile: FileData | null
//   uploadProgress: number
// }

// const initialState: FilesState = {
//   files: [],
//   filteredFiles: [],
//   users: [],
//   loading: false,
//   error: null,
//   currentFile: null,
//   uploadProgress: 0,
// }

// const API_BASE = "http://localhost:5138/api"

// // Fetch all files - מתאים לשרת הקיים שלך
// export const fetchFiles = createAsyncThunk("files/fetchFiles", async (_, { rejectWithValue, getState }) => {
//   try {
//     const state = getState() as any
//     const currentUserId = state.user.userId

//     const response = await axios.get<FileData[]>(`${API_BASE}/AIResponse`)

//     const filesWithOwnership = response.data.map((file) => ({
//       ...file,
//       isOwner: file.userId === currentUserId,
//     }))

//     return filesWithOwnership.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
//   } catch (error: any) {
//     return rejectWithValue(error.response?.data?.message || "שגיאה בטעינת הקבצים")
//   }
// })

// // Download file - מתאים לשרת הקיים שלך
// export const downloadFile = createAsyncThunk(
//   "files/downloadFile",
//   async ({ fileName }: { fileName: string }, { rejectWithValue }) => {
//     try {
//       // נשתמש בשירות Download_ShowFiles הקיים שלך
//       const urlResponse = await axios.get(
//         `${API_BASE}/Download_ShowFiles/download-url?fileName=${encodeURIComponent(fileName)}`,
//       )

//       if (urlResponse.data?.url) {
//         const fileResponse = await axios.get(urlResponse.data.url, { responseType: "blob" })

//         const url = window.URL.createObjectURL(new Blob([fileResponse.data]))
//         const link = document.createElement("a")
//         link.href = url
//         link.download = fileName
//         document.body.appendChild(link)
//         link.click()
//         document.body.removeChild(link)
//         window.URL.revokeObjectURL(url)

//         return { fileName, success: true }
//       }
//       throw new Error("לא ניתן לקבל קישור להורדה")
//     } catch (error: any) {
//       return rejectWithValue(error.response?.data?.message || "שגיאה בהורדת הקובץ")
//     }
//   },
// )

// // View original file
// export const viewOriginalFile = createAsyncThunk(
//   "files/viewOriginalFile",
//   async ({ fileName }: { fileName: string }, { rejectWithValue }) => {
//     try {
//       const response = await axios.get(
//         `${API_BASE}/Download_ShowFiles/download-url?fileName=${encodeURIComponent(fileName)}`,
//       )

//       if (response.data?.url) {
//         window.open(response.data.url, "_blank")
//         return { fileName, success: true }
//       }
//       throw new Error("לא ניתן לפתוח את הקובץ")
//     } catch (error: any) {
//       return rejectWithValue(error.response?.data?.message || "שגיאה בפתיחת הקובץ")
//     }
//   },
// )

// // Update file - נשתמש ב-AIResponse endpoint הקיים
// export const updateFile = createAsyncThunk(
//   "files/updateFile",
//   async ({ id, data }: { id: number; data: Partial<FileData> }, { rejectWithValue }) => {
//     try {
//       const response = await axios.put(`${API_BASE}/AIResponse/${id}`, data)
//       return response.data
//     } catch (error: any) {
//       return rejectWithValue(error.response?.data?.message || "שגיאה בעדכון הקובץ")
//     }
//   },
// )

// // Delete file - נשתמש ב-AIResponse endpoint הקיים
// export const deleteFile = createAsyncThunk("files/deleteFile", async (id: number, { rejectWithValue }) => {
//   try {
//     await axios.delete(`${API_BASE}/AIResponse/${id}`)
//     return id
//   } catch (error: any) {
//     return rejectWithValue(error.response?.data?.message || "שגיאה במחיקת הקובץ")
//   }
// })

// // Fetch users for sharing - נשתמש ב-User endpoint הקיים
// export const fetchUsers = createAsyncThunk("files/fetchUsers", async (_, { rejectWithValue }) => {
//   try {
//     const response = await axios.get<User[]>(`${API_BASE}/User`)
//     return response.data
//   } catch (error: any) {
//     return rejectWithValue(error.response?.data?.message || "שגיאה בטעינת המשתמשים")
//   }
// })

// // Share file - פונקציה פשוטה לשיתוף (ללא שרת נפרד)
// export const shareFile = createAsyncThunk(
//   "files/shareFile",
//   async (
//     { resumeFileId, sharedWithUserId }: { resumeFileId: number; sharedWithUserId: number },
//     { rejectWithValue },
//   ) => {
//     try {
//       // כרגע נחזיר הודעת הצלחה - אפשר להוסיף לוגיקה נוספת בעתיד
//       return {
//         resumeFileId,
//         sharedWithUserId,
//         sharedAt: new Date().toISOString(),
//         success: true,
//       }
//     } catch (error: any) {
//       return rejectWithValue("שגיאה בשיתוף הקובץ")
//     }
//   },
// )

// const filesSlice = createSlice({
//   name: "files",
//   initialState,
//   reducers: {
//     clearFilters: (state) => {
//       state.filteredFiles = state.files
//     },
//     setCurrentFile: (state, action) => {
//       state.currentFile = action.payload
//     },
//     clearCurrentFile: (state) => {
//       state.currentFile = null
//     },
//     setLoading: (state, action) => {
//       state.loading = action.payload
//     },
//     setError: (state, action) => {
//       state.error = action.payload
//     },
//     clearError: (state) => {
//       state.error = null
//     },
//     setUploadProgress: (state, action) => {
//       state.uploadProgress = action.payload
//     },
//     filterFiles: (state, action) => {
//       const filters = action.payload

//       if (!filters || Object.keys(filters).length === 0) {
//         state.filteredFiles = state.files
//         return
//       }

//       state.filteredFiles = state.files.filter((file) => {
//         let match = true

//         if (filters.firstName && file.firstName) {
//           match = match && file.firstName.toLowerCase().includes(filters.firstName.toLowerCase())
//         }
//         if (filters.lastName && file.lastName) {
//           match = match && file.lastName.toLowerCase().includes(filters.lastName.toLowerCase())
//         }
//         if (filters.fatherName && file.fatherName) {
//           match = match && file.fatherName.toLowerCase().includes(filters.fatherName.toLowerCase())
//         }
//         if (filters.motherName && file.motherName) {
//           match = match && file.motherName.toLowerCase().includes(filters.motherName.toLowerCase())
//         }
//         if (filters.address && file.address) {
//           match = match && file.address.toLowerCase().includes(filters.address.toLowerCase())
//         }
//         if (filters.placeOfStudy && file.placeOfStudy) {
//           match = match && file.placeOfStudy.toLowerCase().includes(filters.placeOfStudy.toLowerCase())
//         }
//         if (filters.occupation && file.occupation) {
//           match = match && file.occupation.toLowerCase().includes(filters.occupation.toLowerCase())
//         }

//         if (filters.minAge !== undefined && filters.maxAge !== undefined && file.age) {
//           match = match && file.age >= filters.minAge && file.age <= filters.maxAge
//         }
//         if (filters.minHeight !== undefined && filters.maxHeight !== undefined && file.height) {
//           match = match && file.height >= filters.minHeight && file.height <= filters.maxHeight
//         }

//         return match
//       })
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       // fetchFiles
//       .addCase(fetchFiles.pending, (state) => {
//         state.loading = true
//         state.error = null
//       })
//       .addCase(fetchFiles.fulfilled, (state, action) => {
//         state.loading = false
//         state.files = action.payload
//         state.filteredFiles = action.payload
//       })
//       .addCase(fetchFiles.rejected, (state, action) => {
//         state.loading = false
//         state.error = action.payload as string
//       })

//       // downloadFile
//       .addCase(downloadFile.pending, (state) => {
//         state.loading = true
//         state.error = null
//       })
//       .addCase(downloadFile.fulfilled, (state) => {
//         state.loading = false
//       })
//       .addCase(downloadFile.rejected, (state, action) => {
//         state.loading = false
//         state.error = action.payload as string
//       })

//       // viewOriginalFile
//       .addCase(viewOriginalFile.pending, (state) => {
//         state.loading = true
//         state.error = null
//       })
//       .addCase(viewOriginalFile.fulfilled, (state) => {
//         state.loading = false
//       })
//       .addCase(viewOriginalFile.rejected, (state, action) => {
//         state.loading = false
//         state.error = action.payload as string
//       })

//       // updateFile
//       .addCase(updateFile.pending, (state) => {
//         state.loading = true
//         state.error = null
//       })
//       .addCase(updateFile.fulfilled, (state, action) => {
//         state.loading = false
//         const index = state.files.findIndex((file) => file.id === action.payload.id)
//         if (index !== -1) {
//           state.files[index] = { ...state.files[index], ...action.payload }
//           state.filteredFiles = state.files
//         }
//       })
//       .addCase(updateFile.rejected, (state, action) => {
//         state.loading = false
//         state.error = action.payload as string
//       })

//       // deleteFile
//       .addCase(deleteFile.pending, (state) => {
//         state.loading = true
//         state.error = null
//       })
//       .addCase(deleteFile.fulfilled, (state, action) => {
//         state.loading = false
//         state.files = state.files.filter((file) => file.id !== action.payload)
//         state.filteredFiles = state.filteredFiles.filter((file) => file.id !== action.payload)
//       })
//       .addCase(deleteFile.rejected, (state, action) => {
//         state.loading = false
//         state.error = action.payload as string
//       })

//       // fetchUsers
//       .addCase(fetchUsers.fulfilled, (state, action) => {
//         state.users = action.payload
//       })

//       // shareFile
//       .addCase(shareFile.pending, (state) => {
//         state.loading = true
//         state.error = null
//       })
//       .addCase(shareFile.fulfilled, (state) => {
//         state.loading = false
//       })
//       .addCase(shareFile.rejected, (state, action) => {
//         state.loading = false
//         state.error = action.payload as string
//       })
//   },
// })

// export const {
//   clearFilters,
//   setCurrentFile,
//   clearCurrentFile,
//   filterFiles,
//   setLoading,
//   setError,
//   clearError,
//   setUploadProgress,
// } = filesSlice.actions

// export default filesSlice.reducer


// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
// import axios from "axios"
// import { FileData } from "../types/file"
// import { User } from "../types/user"

// interface FilesState {
//   files: FileData[]
//   filteredFiles: FileData[]
//   users: User[]
//   loading: boolean
//   error: string | null
//   currentFile: FileData | null
//   uploadProgress: number
// }

// const initialState: FilesState = {
//   files: [],
//   filteredFiles: [],
//   users: [],
//   loading: false,
//   error: null,
//   currentFile: null,
//   uploadProgress: 0,
// }

// const API_BASE = "http://localhost:5138/api"

// // Fetch all files
// export const fetchFiles = createAsyncThunk("files/fetchFiles", async (_, { rejectWithValue, getState }) => {
//   try {
//     const state = getState() as any
//     const currentUserId = state.user.userId

//     const response = await axios.get<FileData[]>(`${API_BASE}/AIResponse`)

//     const filesWithOwnership = response.data.map((file) => ({
//       ...file,
//       isOwner: file.userId === currentUserId,
//     }))

//     return filesWithOwnership.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
//   } catch (error: any) {
//     return rejectWithValue(error.response?.data?.message || "שגיאה בטעינת הקבצים")
//   }
// })

// // Download file
// export const downloadFile = createAsyncThunk(
//   "files/downloadFile",
//   async ({ fileName }: { fileName: string }, { rejectWithValue }) => {
//     try {
//       const urlResponse = await axios.get(
//         `${API_BASE}/Download_ShowFiles/download-url?fileName=${encodeURIComponent(fileName)}`,
//       )

//       if (urlResponse.data?.url) {
//         const fileResponse = await axios.get(urlResponse.data.url, { responseType: "blob" })

//         const url = window.URL.createObjectURL(new Blob([fileResponse.data]))
//         const link = document.createElement("a")
//         link.href = url
//         link.download = fileName
//         document.body.appendChild(link)
//         link.click()
//         document.body.removeChild(link)
//         window.URL.revokeObjectURL(url)

//         return { fileName, success: true }
//       }
//       throw new Error("לא ניתן לקבל קישור להורדה")
//     } catch (error: any) {
//       return rejectWithValue(error.response?.data?.message || "שגיאה בהורדת הקובץ")
//     }
//   },
// )

// export const viewOriginalFile = createAsyncThunk(
//   "files/viewOriginalFile",
//   async ({ fileName }: { fileName: string }, { rejectWithValue }) => {
//     try {
//       const response = await axios.get(
//         `${API_BASE}/Download_ShowFiles/download-url?fileName=${encodeURIComponent(fileName)}`,
//       );

//       if (response.data?.url) {
//         const token = localStorage.getItem("authToken"); // קבלת הטוקן מה-localStorage

//         if (token) {
//           const urlWithToken = `${response.data.url}?token=${token}`; // הוספת הטוקן ל-URL
//           window.open(urlWithToken, "_blank");
//           return { fileName, success: true };
//         } else {
//           throw new Error("לא ניתן לפתוח את הקובץ: משתמש לא מחובר");
//         }
//       }
//       throw new Error("לא ניתן לפתוח את הקובץ");
//     } catch (error: any) {
//       return rejectWithValue(error.response?.data?.message || "שגיאה בפתיחת הקובץ");
//     }
//   },
// );

// // Update file
// export const updateFile = createAsyncThunk(
//   "files/updateFile",
//   async ({ id, data }: { id: number; data: Partial<FileData> }, { rejectWithValue }) => {
//     try {
//       const response = await axios.put(`${API_BASE}/AIResponse/${id}`, data)
//       return response.data
//     } catch (error: any) {
//       return rejectWithValue(error.response?.data?.message || "שגיאה בעדכון הקובץ")
//     }
//   },
// )

// // Delete file
// export const deleteFile = createAsyncThunk("files/deleteFile", async (id: number, { rejectWithValue }) => {
//   try {
//     await axios.delete(`${API_BASE}/ResumeFile/${id}`)
//     return id
//   } catch (error: any) {
//     return rejectWithValue(error.response?.data?.message || "שגיאה במחיקת הקובץ")
//   }
// })

// // Fetch users for sharing
// export const fetchUsers = createAsyncThunk("files/fetchUsers", async (_, { rejectWithValue }) => {
//   try {
//     const response = await axios.get<User[]>(`${API_BASE}/User`)
//     return response.data
//   } catch (error: any) {
//     return rejectWithValue(error.response?.data?.message || "שגיאה בטעינת המשתמשים")
//   }
// })

// // Share file
// export const shareFile = createAsyncThunk(
//   "files/shareFile",
//   async (
//     { resumeFileId, sharedWithUserId }: { resumeFileId: number; sharedWithUserId: number },
//     { rejectWithValue },
//   ) => {
//     try {
//       return {
//         resumeFileId,
//         sharedWithUserId,
//         sharedAt: new Date().toISOString(),
//         success: true,
//       }
//     } catch (error: any) {
//       return rejectWithValue("שגיאה בשיתוף הקובץ")
//     }
//   },
// )

// const filesSlice = createSlice({
//   name: "files",
//   initialState,
//   reducers: {
//     clearFilters: (state) => {
//       state.filteredFiles = state.files
//     },
//     setCurrentFile: (state, action) => {
//       state.currentFile = action.payload
//     },
//     clearCurrentFile: (state) => {
//       state.currentFile = null
//     },
//     setLoading: (state, action) => {
//       state.loading = action.payload
//     },
//     setError: (state, action) => {
//       state.error = action.payload
//     },
//     clearError: (state) => {
//       state.error = null
//     },
//     setUploadProgress: (state, action) => {
//       state.uploadProgress = action.payload
//     },
//     filterFiles: (state, action) => {
//       const filters = action.payload

//       if (!filters || Object.keys(filters).length === 0) {
//         state.filteredFiles = state.files
//         return
//       }

//       state.filteredFiles = state.files.filter((file) => {
//         let match = true

//         if (filters.firstName && file.firstName) {
//           match = match && file.firstName.toLowerCase().includes(filters.firstName.toLowerCase())
//         }
//         if (filters.lastName && file.lastName) {
//           match = match && file.lastName.toLowerCase().includes(filters.lastName.toLowerCase())
//         }
//         if (filters.fatherName && file.fatherName) {
//           match = match && file.fatherName.toLowerCase().includes(filters.fatherName.toLowerCase())
//         }
//         if (filters.motherName && file.motherName) {
//           match = match && file.motherName.toLowerCase().includes(filters.motherName.toLowerCase())
//         }
//         if (filters.address && file.address) {
//           match = match && file.address.toLowerCase().includes(filters.address.toLowerCase())
//         }
//         if (filters.placeOfStudy && file.placeOfStudy) {
//           match = match && file.placeOfStudy.toLowerCase().includes(filters.placeOfStudy.toLowerCase())
//         }
//         if (filters.occupation && file.occupation) {
//           match = match && file.occupation.toLowerCase().includes(filters.occupation.toLowerCase())
//         }

//         if (filters.minAge !== undefined && filters.maxAge !== undefined && file.age) {
//           match = match && file.age >= filters.minAge && file.age <= filters.maxAge
//         }
//         if (filters.minHeight !== undefined && filters.maxHeight !== undefined && file.height) {
//           match = match && file.height >= filters.minHeight && file.height <= filters.maxHeight
//         }

//         return match
//       })
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       // fetchFiles
//       .addCase(fetchFiles.pending, (state) => {
//         state.loading = true
//         state.error = null
//       })
//       .addCase(fetchFiles.fulfilled, (state, action) => {
//         state.loading = false
//         state.files = action.payload
//         state.filteredFiles = action.payload
//       })
//       .addCase(fetchFiles.rejected, (state, action) => {
//         state.loading = false
//         state.error = action.payload as string
//       })

//       // downloadFile
//       .addCase(downloadFile.pending, (state) => {
//         state.loading = true
//         state.error = null
//       })
//       .addCase(downloadFile.fulfilled, (state) => {
//         state.loading = false
//       })
//       .addCase(downloadFile.rejected, (state, action) => {
//         state.loading = false
//         state.error = action.payload as string
//       })

//       // viewOriginalFile
//       .addCase(viewOriginalFile.pending, (state) => {
//         state.loading = true
//         state.error = null
//       })
//       .addCase(viewOriginalFile.fulfilled, (state) => {
//         state.loading = false
//       })
//       .addCase(viewOriginalFile.rejected, (state, action) => {
//         state.loading = false
//         state.error = action.payload as string
//       })

//       // updateFile
//       .addCase(updateFile.pending, (state) => {
//         state.loading = true
//         state.error = null
//       })
//       .addCase(updateFile.fulfilled, (state, action) => {
//         state.loading = false
//         const index = state.files.findIndex((file) => file.id === action.payload.id)
//         if (index !== -1) {
//           state.files[index] = { ...state.files[index], ...action.payload }
//           state.filteredFiles = state.files
//         }
//       })
//       .addCase(updateFile.rejected, (state, action) => {
//         state.loading = false
//         state.error = action.payload as string
//       })

//       // deleteFile
//       .addCase(deleteFile.pending, (state) => {
//         state.loading = true
//         state.error = null
//       })
//       .addCase(deleteFile.fulfilled, (state, action) => {
//         state.loading = false
//         state.files = state.files.filter((file) => file.id !== action.payload)
//         state.filteredFiles = state.filteredFiles.filter((file) => file.id !== action.payload)
//       })
//       .addCase(deleteFile.rejected, (state, action) => {
//         state.loading = false
//         state.error = action.payload as string
//       })

//       // fetchUsers
//       .addCase(fetchUsers.fulfilled, (state, action) => {
//         state.users = action.payload
//       })

//       // shareFile
//       .addCase(shareFile.pending, (state) => {
//         state.loading = true
//         state.error = null
//       })
//       .addCase(shareFile.fulfilled, (state) => {
//         state.loading = false
//       })
//       .addCase(shareFile.rejected, (state, action) => {
//         state.loading = false
//         state.error = action.payload as string
//       })
//   },
// })

// export const {
//   clearFilters,
//   setCurrentFile,
//   clearCurrentFile,
//   filterFiles,
//   setLoading,
//   setError,
//   clearError,
//   setUploadProgress,
// } = filesSlice.actions

// export default filesSlice.reducer


import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios"
import { FileData } from "../types/file"
import { User } from "../types/user"

interface FilesState {
  files: FileData[]
  filteredFiles: FileData[]
  users: User[]
  loading: boolean
  error: string | null
  currentFile: FileData | null
  uploadProgress: number
  sharedFiles: FileData[] // הוספת sharedFiles
}

const initialState: FilesState = {
  files: [],
  filteredFiles: [],
  users: [],
  loading: false,
  error: null,
  currentFile: null,
  uploadProgress: 0,
  sharedFiles: [], // הוספת sharedFiles
}

const API_BASE = "http://localhost:5138/api"

// Fetch all files
export const fetchFiles = createAsyncThunk("files/fetchFiles", async (_, { rejectWithValue, getState }) => {
  try {
    const state = getState() as any
    const currentUserId = state.user.userId

    const response = await axios.get<FileData[]>(`${API_BASE}/AIResponse`)

    const filesWithOwnership = response.data.map((file) => ({
      ...file,
      isOwner: file.userId === currentUserId,
    }))

    return filesWithOwnership.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "שגיאה בטעינת הקבצים")
  }
})

// Fetch shared files
export const fetchSharedFiles = createAsyncThunk("files/fetchSharedFiles", async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get<FileData[]>(`${API_BASE}/sharedFiles`) // הנח שיש לך endpoint כזה
    return response.data
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "שגיאה בטעינת הקבצים המשותפים")
  }
})

// Download file
export const downloadFile = createAsyncThunk(
  "files/downloadFile",
  async ({ fileName }: { fileName: string }, { rejectWithValue }) => {
    try {
      const urlResponse = await axios.get(
        `${API_BASE}/Download_ShowFiles/download-url?fileName=${encodeURIComponent(fileName)}`
      );

      console.log(urlResponse.data); // הדפסת התגובה מהשרת לבדיקה
      return urlResponse.data;
      if (urlResponse.data?.url) {
        const token = localStorage.getItem("authToken"); // קבלת הטוקן מה-localStorage
        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        const fileResponse = await axios.get(urlResponse.data.url, {
          responseType: "blob",
          headers, // הוספת ה-Headers לבקשה
        });
        const url = window.URL.createObjectURL(new Blob([fileResponse.data]));

        // Instead of downloading here, just return the URL
        return url; // Return the URL for further use
      }
      throw new Error("לא ניתן לקבל קישור להורדה");
    } catch (error: any) {
      console.error(error);
      return rejectWithValue(error.response?.data?.message || "שגיאה בהורדת הקובץ");
    }
  }
);


export const viewOriginalFile = createAsyncThunk(
  "files/viewOriginalFile",
  async ({ fileName }: { fileName: string }, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${API_BASE}/Download_ShowFiles/download-url?fileName=${encodeURIComponent(fileName)}`,
      );

      if (response.data?.url) {
        return { fileName, url: response.data.url, success: true }; // מחזיר את ה-URL
      }
      throw new Error("לא ניתן לפתוח את הקובץ");
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "שגיאה בפתיחת הקובץ");
    }
  },
);


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
    await axios.delete(`${API_BASE}/ResumeFile/${id}`)
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


export const shareFile = createAsyncThunk(
  "files/shareFile",
  async (
    { resumeFileId, sharedWithUserId }: { resumeFileId: number; sharedWithUserId: number },
    { rejectWithValue },
  ) => {
    try {
      return {
        resumeFileId,
        sharedWithUserId,
        sharedAt: new Date().toISOString(),
        success: true,
      }
    } catch (error: any) {
      return rejectWithValue("שגיאה בשיתוף הקובץ")
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
    clearError: (state) => {
      state.error = null
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

      // fetchSharedFiles
      .addCase(fetchSharedFiles.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchSharedFiles.fulfilled, (state, action) => {
        state.loading = false
        state.sharedFiles = action.payload // עדכון sharedFiles
      })
      .addCase(fetchSharedFiles.rejected, (state, action) => {
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
      .addCase(updateFile.fulfilled, (state, action) => {
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
      .addCase(deleteFile.fulfilled, (state, action) => {
        state.loading = false
        state.files = state.files.filter((file) => file.id !== action.payload)
        state.filteredFiles = state.filteredFiles.filter((file) => file.id !== action.payload)
      })
      .addCase(deleteFile.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      // fetchUsers
      .addCase(fetchUsers.fulfilled, (state, action) => {
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
