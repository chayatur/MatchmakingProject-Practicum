import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import fileReducer from './slices/fileSlice'; 
const store = configureStore({
    reducer: {
        user: userReducer,
        files: fileReducer, 
    },
});

// הגדרת RootState
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
