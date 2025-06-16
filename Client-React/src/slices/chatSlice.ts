import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios"

export interface ChatMessage {
  id: string
  content: string
  role: "user" | "assistant"
  timestamp: Date
  isTyping?: boolean
}

interface ChatState {
  messages: ChatMessage[]
  isLoading: boolean
  error: string | null
  isTyping: boolean
  currentUserId: number | null
}

const initialState: ChatState = {
  messages: [],
  isLoading: false,
  error: null,
  isTyping: false,
  currentUserId: null,
}

// פונקציות עזר לשמירה ב-localStorage
const getChatStorageKey = (userId: number) => `chat_messages_${userId}`

const saveChatToStorage = (userId: number, messages: ChatMessage[]) => {
  try {
    localStorage.setItem(getChatStorageKey(userId), JSON.stringify(messages))
  } catch (error) {
    console.error("Error saving chat to localStorage:", error)
  }
}

const loadChatFromStorage = (userId: number): ChatMessage[] => {
  try {
    const stored = localStorage.getItem(getChatStorageKey(userId))
    if (stored) {
      const messages = JSON.parse(stored)
      return messages.map((msg: any) => ({
        ...msg,
        timestamp: new Date(msg.timestamp),
      }))
    }
  } catch (error) {
    console.error("Error loading chat from localStorage:", error)
  }
  return []
}

// Async thunk לשליחת הודעה לשרת
export const sendMessage = createAsyncThunk(
  "chat/sendMessage",
  async ({ prompt, question }: { prompt: string; question: string }, { rejectWithValue }) => {
    try {
      const response = await axios.post("https://matchmakingproject-practicum.onrender.com/api/Chat", {
        prompt: prompt,
        question: question,
      })

      console.log("Response from server:", response.data)
      const data = response.data
      const aiMessage = data.choices[0].message.content

      return aiMessage
    } catch (error: any) {
      console.error("Error sending message:", error)
      return rejectWithValue(error.response?.data || "שגיאה בשליחת ההודעה")
    }
  },
)

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    addMessage: (state, action) => {
      state.messages.push(action.payload)
      if (state.currentUserId) {
        saveChatToStorage(state.currentUserId, state.messages)
      }
    },
    clearMessages: (state) => {
      state.messages = []
      if (state.currentUserId) {
        saveChatToStorage(state.currentUserId, [])
      }
    },
    setTyping: (state, action) => {
      state.isTyping = action.payload
    },
    clearError: (state) => {
      state.error = null
    },
    loadUserChat: (state, action) => {
      const userId = action.payload
      state.currentUserId = userId
      state.messages = loadChatFromStorage(userId)
    },
    clearUserChat: (state) => {
      state.messages = []
      state.currentUserId = null
    },
    deleteMessage: (state, action) => {
      const messageId = action.payload
      state.messages = state.messages.filter((msg) => msg.id !== messageId)
      if (state.currentUserId) {
        saveChatToStorage(state.currentUserId, state.messages)
      }
    },
    clearChatHistory: (state) => {
      if (state.currentUserId) {
        localStorage.removeItem(getChatStorageKey(state.currentUserId))
      }
      state.messages = []
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendMessage.pending, (state) => {
        state.isLoading = true
        state.isTyping = true
        state.error = null
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.isLoading = false
        state.isTyping = false

        const aiMessage: ChatMessage = {
          id: Date.now().toString() + "_ai",
          content: action.payload,
          role: "assistant",
          timestamp: new Date(),
        }
        state.messages.push(aiMessage)

        if (state.currentUserId) {
          saveChatToStorage(state.currentUserId, state.messages)
        }
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.isLoading = false
        state.isTyping = false
        state.error = action.payload as string
      })
  },
})

export const {
  addMessage,
  clearMessages,
  setTyping,
  clearError,
  loadUserChat,
  clearUserChat,
  deleteMessage,
  clearChatHistory,
} = chatSlice.actions
export default chatSlice.reducer
