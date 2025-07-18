import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { FileData } from "../types/file";

const BASEURL = "https://matchmakingproject-practicum.onrender.com/api/AIResponse";

interface FilesState {
  files: FileData[];
  filteredFiles: FileData[];
  loading: boolean;
  error: string | null;
  currentFile: FileData | null;
}

const initialState: FilesState = {
  files: [],
  filteredFiles: [],
  loading: false,
  error: null,
  currentFile: null,
};

// Fetch all files
export const fetchFiles = createAsyncThunk("files/fetchFiles", async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get<FileData[]>(`${BASEURL}`);
    return response.data;
  } catch (e: any) {
    return rejectWithValue(e.message || "Failed to fetch files");
  }
});

// Fetch file by ID
export const fetchFileById = createAsyncThunk("files/fetchFileById", async (id: number, { rejectWithValue }) => {
  try {
    const response = await axios.get<FileData>(`${BASEURL}/${id}`);
    return response.data;
  } catch (e: any) {
    return rejectWithValue(e.message || "Failed to fetch file");
  }
});

// Download file
export const downloadFile = createAsyncThunk(
  "files/downloadFile",
  async ({ fileName }: { fileName: string }, { rejectWithValue }) => {
    try {
      const urlResponse = await axios.get(`${BASEURL}/download/${fileName}`, {
        responseType: "blob",
      });

      // Create a URL for the blob
      const url = window.URL.createObjectURL(new Blob([urlResponse.data]));

      // Create a temporary link and trigger download
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName); // שם הקובץ להורדה
      document.body.appendChild(link);
      link.click();

      // Clean up
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url); // לנקות את ה-URL שנוצר

      return { success: true };
    } catch (e: any) {
      return rejectWithValue(e.message || "Failed to download file");
    }
  },
);

// Search files with filters
export const searchFiles = createAsyncThunk("files/searchFiles", async (filters: any, { rejectWithValue }) => {
  try {
    const response = await axios.post<FileData[]>(`${BASEURL}/search`, filters);
    return response.data;
  } catch (e: any) {
    return rejectWithValue(e.message || "Failed to search files");
  }
});

const filesSlice = createSlice({
  name: "files",
  initialState,
  reducers: {
    clearFilters: (state) => {
      state.filteredFiles = state.files;
    },
    setCurrentFile: (state, action) => {
      state.currentFile = action.payload;
    },
    clearCurrentFile: (state) => {
      state.currentFile = null;
    },
    // Local filtering (client-side)
    filterFiles: (state, action) => {
      const filters = action.payload;

      if (!filters || Object.keys(filters).length === 0) {
        state.filteredFiles = state.files;
        return;
      }

      state.filteredFiles = state.files.filter((file) => {
        let match = true;

        // String filters
        if (filters.firstName && file.firstName) {
          match = match && file.firstName.toLowerCase().includes(filters.firstName.toLowerCase());
        }
        if (filters.lastName && file.lastName) {
          match = match && file.lastName.toLowerCase().includes(filters.lastName.toLowerCase());
        }
        if (filters.fatherName && file.fatherName) {
          match = match && file.fatherName.toLowerCase().includes(filters.fatherName.toLowerCase());
        }
        if (filters.motherName && file.motherName) {
          match = match && file.motherName.toLowerCase().includes(filters.motherName.toLowerCase());
        }
        if (filters.address && file.address) {
          match = match && file.address.toLowerCase().includes(filters.address.toLowerCase());
        }
        if (filters.placeOfStudy && file.placeOfStudy) {
          match = match && file.placeOfStudy.toLowerCase().includes(filters.placeOfStudy.toLowerCase());
        }
        if (filters.occupation && file.occupation) {
          match = match && file.occupation.toLowerCase().includes(filters.occupation.toLowerCase());
        }

        // Number range filters
        if (filters.minAge !== undefined && filters.maxAge !== undefined && file.age) {
          match = match && file.age >= filters.minAge && file.age <= filters.maxAge;
        }
        if (filters.minHeight !== undefined && filters.maxHeight !== undefined && file.height) {
          match = match && file.height >= filters.minHeight && file.height <= filters.maxHeight;
        }

        return match;
      });
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchFiles
      .addCase(fetchFiles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFiles.fulfilled, (state, action) => {
        state.loading = false;
        state.files = action.payload;
        state.filteredFiles = action.payload;
      })
      .addCase(fetchFiles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // fetchFileById
      .addCase(fetchFileById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFileById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentFile = action.payload;
      })
      .addCase(fetchFileById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // downloadFile
      .addCase(downloadFile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(downloadFile.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(downloadFile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // searchFiles
      .addCase(searchFiles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchFiles.fulfilled, (state, action) => {
        state.loading = false;
        state.filteredFiles = action.payload;
      })
      .addCase(searchFiles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

// Export actions
export const { clearFilters, setCurrentFile, clearCurrentFile, filterFiles } = filesSlice.actions;

export default filesSlice.reducer;
