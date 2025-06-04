import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { User, Login, Response } from '../types/user';

const url = 'http://localhost:5138/api/Auth';

// Async thunk for logging in a user
export const loginUser = createAsyncThunk<Response, Login>('user/login',
    async (userData, { rejectWithValue }) => {
        try {
            const response = await axios.post<Response>(`${url}/login`, userData);
            console.log("Response from login:", response.data); // הוסף לוג כאן
            const { user, token } = response.data;
            sessionStorage.setItem('token', token);
            return { user, token }; 
        } catch (e: any) {  
            return rejectWithValue(e.message);
        }
    }
);

// Async thunk for registering a user
export const registerUser = createAsyncThunk<Response, User>('user/register',
    async (userData, { rejectWithValue }) => {
        try {
            const response = await axios.post<Response>(`${url}/register`, userData);
            const { user, token } = response.data;
            sessionStorage.setItem('token', token);
            return { user, token }; 
        } catch (e: any) {
            return rejectWithValue(e.message);
        }
    }
);

// Async thunk for logging out a user
export const logoutUser = createAsyncThunk('user/logout', async () => {
    sessionStorage.removeItem('token'); 
    return; 
});

const userSlice = createSlice({
    name: 'user',
    initialState: { 
        user: {} as User, 
        userId: null as number | null,
        loading: false, 
        msg: '',
        isLoggedIn: false 
    },
    reducers: {
        setUserId: (state, action) => {
            state.userId = action.payload;
            state.isLoggedIn = true; 
        },
        clearUser: (state) => {
            state.user = {} as User; 
            state.userId = null; 
            state.isLoggedIn = false; 
        }
    },
    extraReducers: (builder) => {
        builder
        .addCase(loginUser.fulfilled, (state, action) => {
            state.user = action.payload.user;
            state.userId = action.payload.user.id; 
            state.loading = false;
            state.msg = '';
            state.isLoggedIn = true; // עדכון סטטוס כניסה
        })
        .addCase(loginUser.rejected, (state, action) => {
            state.loading = false;
            state.msg = action.payload as string || "Login failed";
            console.error("Login error:", action.payload); // הוסף לוג כאן
        })
        .addCase(loginUser.pending, (state) => {
            state.loading = true;
        })
        .addCase(registerUser.fulfilled, (state, action) => {
            state.user = action.payload.user;
            state.userId = action.payload.user.id; 
            state.loading = false;
            state.msg = '';
            state.isLoggedIn = true; 
        })
        .addCase(registerUser.rejected, (state, action) => {
            state.loading = false;
            state.msg = action.payload as string || "Registration failed";
        })
        .addCase(registerUser.pending, (state) => {
            state.loading = true;
        })
        .addCase(logoutUser.fulfilled, (state) => {
            state.user = {} as User; 
            state.userId = null;
            state.isLoggedIn = false; 
        });
    }
});

export const { setUserId, clearUser } = userSlice.actions; 
export default userSlice.reducer;
