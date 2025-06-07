import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios"
import type { User, UserDTO, Login, Response } from "../types/user"

const url = "http://localhost:5138/api/Auth"

// Async thunk for logging in a user
export const loginUser = createAsyncThunk<Response, Login>("user/login", async (userData, { rejectWithValue }) => {
  try {
    const response = await axios.post<Response>(`${url}/login`, userData)
    console.log("Response from login:", response.data)
    const { user, token } = response.data
    sessionStorage.setItem("token", token)
    return { user, token }
  } catch (e: any) {
    return rejectWithValue(e.message)
  }
})

// Async thunk for registering a user
export const registerUser = createAsyncThunk<Response, User>("user/register", async (userData, { rejectWithValue }) => {
  try {
    const response = await axios.post<Response>(`${url}/register`, userData)
    const { user, token } = response.data
    sessionStorage.setItem("token", token)
    return { user, token }
  } catch (e: any) {
    return rejectWithValue(e.message)
  }
})

// Async thunk for logging out a user
export const logoutUser = createAsyncThunk("user/logout", async () => {
  sessionStorage.removeItem("token")
  return
})

// Async thunk for updating user profile - משתמש ב-UserDTO
export const updateUserProfile = createAsyncThunk<User, Partial<User>>(
  "user/updateProfile",
  async (userData, { rejectWithValue }) => {
    try {
      const token = sessionStorage.getItem("token")
      
      // המר את הנתונים ל-UserDTO format (עם שמות שדות גדולים)
      const userDTO: UserDTO = {
        ID: userData.id!,
        Username: userData.username || "",
        Email: userData.email || "",
        Address: userData.address || "",
        Phone: userData.phone || "",
      }

      console.log("Sending UserDTO to server:", userDTO)

      const response = await axios.put<UserDTO>(`http://localhost:5138/api/User/${userData.id}`, userDTO, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      
      // המר את התגובה חזרה ל-User format (עם שמות שדות קטנים)
      const updatedUser: User = {
        id: response.data.ID,
        username: response.data.Username,
        email: response.data.Email,
        address: response.data.Address,
        phone: response.data.Phone,
        updatedAt: new Date().toISOString(),
      }
      
      return updatedUser
    } catch (e: any) {
      return rejectWithValue(e.message)
    }
  },
)

// Async thunk for checking auth status
export const checkAuthStatus = createAsyncThunk("user/checkAuth", async (_, { rejectWithValue }) => {
  try {
    const token = sessionStorage.getItem("token")

    if (!token) {
      return rejectWithValue("No token found")
    }

    const response = await axios.get<User>(`${url}/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    return { user: response.data, token }
  } catch (e: any) {
    sessionStorage.removeItem("token")
    return rejectWithValue(e.message)
  }
})

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: {} as User,
    userId: null as number | null,
    loading: false,
    msg: "",
    isLoggedIn: false,
    authChecked: false,
  },
  reducers: {
    setUserId: (state, action) => {
      state.userId = action.payload
      state.isLoggedIn = true
    },
    clearUser: (state) => {
      state.user = {} as User
      state.userId = null
      state.isLoggedIn = false
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload.user
        state.userId = action.payload.user.id
        state.loading = false
        state.msg = ""
        state.isLoggedIn = true
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false
        state.msg = (action.payload as string) || "Login failed"
        console.error("Login error:", action.payload)
      })
      .addCase(loginUser.pending, (state) => {
        state.loading = true
        state.msg = ""
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.user = action.payload.user
        state.userId = action.payload.user.id
        state.loading = false
        state.msg = ""
        state.isLoggedIn = true
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false
        state.msg = (action.payload as string) || "Registration failed"
      })
      .addCase(registerUser.pending, (state) => {
        state.loading = true
        state.msg = ""
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = {} as User
        state.userId = null
        state.isLoggedIn = false
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        // עדכן את המשתמש הקיים עם הנתונים החדשים
        state.user = { ...state.user, ...action.payload }
        state.loading = false
        state.msg = ""
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false
        state.msg = (action.payload as string) || "Profile update failed"
      })
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true
        state.msg = ""
      })
      .addCase(checkAuthStatus.fulfilled, (state, action) => {
        if (action.payload) {
          state.user = action.payload.user
          state.userId = action.payload.user.id
          state.isLoggedIn = true
        }
        state.loading = false
        state.authChecked = true
      })
      .addCase(checkAuthStatus.rejected, (state) => {
        state.user = {} as User
        state.userId = null
        state.isLoggedIn = false
        state.loading = false
        state.authChecked = true
      })
      .addCase(checkAuthStatus.pending, (state) => {
        state.loading = true
      })
  },
})

export const { setUserId, clearUser } = userSlice.actions
export default userSlice.reducer