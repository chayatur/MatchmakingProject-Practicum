import { configureStore } from "@reduxjs/toolkit"
import userReducer from "./slices/userSlice"
import filesReducer from "./slices/fileSlice"
import settingsReducer from "./slices/settingsSlice"

export const store = configureStore({
  reducer: {
    user: userReducer,
    files: filesReducer,
    settings: settingsReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
