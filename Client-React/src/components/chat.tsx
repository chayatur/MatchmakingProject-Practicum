"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import {
  Box,
  Paper,
  TextField,
  IconButton,
  Typography,
  Avatar,
  Fab,
  Slide,
  Fade,
  CircularProgress,
  Chip,
  Tooltip,
  Alert,
  Snackbar,
  Divider,
  Menu,
  MenuItem,
  ListItemIcon,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material"
import {
  Send as SendIcon,
  Chat as ChatIcon,
  Close as CloseIcon,
  Clear as ClearIcon,
  SmartToy as AIIcon,
  Person as PersonIcon,
  Minimize as MinimizeIcon,
  Fullscreen as FullscreenIcon,
  FullscreenExit as FullscreenExitIcon,
  History as HistoryIcon,
  MoreVert as MoreVertIcon,
  DeleteSweep as DeleteSweepIcon,
} from "@mui/icons-material"
import type { RootState, AppDispatch } from "../store"
import {
  sendMessage,
  addMessage,
  clearMessages,
  clearError,
  loadUserChat,
  clearUserChat,
  clearChatHistory,
} from "../slices/chatSlice"
import "../styles/AIChatBox.css"
const AIChatBox = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { messages, isLoading, error, isTyping } = useSelector((state: RootState) => state.chat)
  const { user, isLoggedIn } = useSelector((state: RootState) => state.user)

  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [inputValue, setInputValue] = useState("")
  const [showError, setShowError] = useState(false)
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // שאלות מוכנות מראש
  const quickQuestions = [
    "איך מעלים רזומה למערכת?",
    "איך מחפשים רזומה?",
    "איך משתפים רזומה עם שדכן אחר?",
    "איך מוחקים רזומה?",
    "מה ה-AI מחלץ מהרזומה?",
    "אילו פורמטים נתמכים?",
    "איך עובד החיפוש המתקדם?",
    "מה ניתן לראות באזור האישי?",
  ]

  // טעינת שיחות המשתמש בעת התחברות
  useEffect(() => {
    if (isLoggedIn && user.id) {
      dispatch(loadUserChat(user.id))
    } else {
      dispatch(clearUserChat())
    }
  }, [isLoggedIn, user.id, dispatch])

  // גלילה אוטומטית להודעה האחרונה
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping])

  useEffect(() => {
    if (error) {
      setShowError(true)
    }
  }, [error])

  // פתיחת/סגירת הצ'אט
  const toggleChat = () => {
    if (!isLoggedIn) return
    setIsOpen(!isOpen)
    if (!isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 300)
    }
  }

  // שליחת הודעה
  const handleSendMessage = async (messageText?: string) => {
    const textToSend = messageText || inputValue.trim()
    if (!textToSend || !isLoggedIn) return

    const userMessage = {
      id: Date.now().toString(),
      content: textToSend,
      role: "user" as const,
      timestamp: new Date(),
    }

    dispatch(addMessage(userMessage))

    const prompt = `אתה עוזר AI של מערכת ניהול שידוכים. תפקידך לעזור לשדכנים להשתמש במערכת בצורה הטובה ביותר.

המערכת מיועדת לשדכנים מקצועיים לניהול רזומות של מועמדים לשידוך.

תכונות המערכת:
- העלאת רזומות: ניתן להעלות קבצי DOCX בלבד (עד 10MB), בגרירה ושחרור או לחיצה על "בחר קובץ", בעמוד "העלאת רזומה"
- ניתוח AI אוטומטי: לאחר העלאת הקובץ, המערכת מנתחת אוטומטית את הרזומה בעזרת בינה מלאכותית ושומרת את הפרטים (שם, גיל, גובה, עיסוק, מקום לימודים ועוד)
- רשימת רזומות: בעמוד "הרזומות שלי" רואים את כל הרזומות שהועלו, עם כפתורי צפייה, הורדה, שיתוף ומחיקה
- חיפוש וסינון: ניתן לחפש לפי שם פרטי, שם משפחה, כתובת. יש גם חיפוש מתקדם לפי שם האב, שם האם, מקום לימודים, עיסוק, טווח גילאים וטווח גבהים. החיפוש מתעדכן אוטומטית תוך כדי הקלדה
- שיתוף רזומות: לחיצה על כפתור השיתוף מאפשרת לשלוח את הרזומה לשדכן אחר במערכת
- מחיקת רזומות: לחיצה על כפתור המחיקה מוחקת את הרזומה לאחר אישור
- אזור אישי: ניתן לראות סטטיסטיקות, כמה רזומות הועלו וכמה שותפו
- מנהל המערכת: פאנל ניהול ב-Angular עם ניהול משתמשים, הרשאות ורזומות

ניווט:
- דף הבית: /home
- רשימת הרזומות: /resumes
- העלאת רזומה: /upload
- אזור אישי: /personal-area
- אודות: /about
- כניסה: /login
- הרשמה: /register

עבור שאלות שאינן קשורות למערכת, עדיין עזור בנושאי שידוכים ורזומות שידוכים.
ענה תמיד בעברית, בצורה ברורה וממוקדת.`
    dispatch(sendMessage({ prompt, question: textToSend }))

    setInputValue("")
  }

  // שליחת שאלה מוכנה
  const handleQuickQuestion = (question: string) => {
    handleSendMessage(question)
  }

  // טיפול בלחיצת Enter
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  // ניקוי הודעות
  const handleClearMessages = () => {
    dispatch(clearMessages())
    setMenuAnchor(null)
  }

  // מחיקת היסטוריה מלאה
  const handleClearHistory = () => {
    setDeleteDialogOpen(true)
    setMenuAnchor(null)
  }

  const confirmClearHistory = () => {
    dispatch(clearChatHistory())
    setDeleteDialogOpen(false)
  }

  // סגירת שגיאה
  const handleCloseError = () => {
    setShowError(false)
    dispatch(clearError())
  }

  // פורמט זמן
  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString("he-IL", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // אם המשתמש לא מחובר, לא להציג כלום
  if (!isLoggedIn) {
    return null
  }

  return (
    <>
      {/* כפתור פתיחת הצ'אט */}
      <Fab
        className={`chat-fab ${isOpen ? "chat-fab-open" : ""}`}
        onClick={toggleChat}
        sx={{
          position: "fixed",
          bottom: 24,
          right: 24,
          zIndex: 1350,
          background: "linear-gradient(135deg, #8B0000 0%, #DC143C 100%)",
          color: "white",
          width: 64,
          height: 64,
          boxShadow: "0 8px 32px rgba(139, 0, 0, 0.3)",
          "&:hover": {
            background: "linear-gradient(135deg, #5c0000 0%, #B22222 100%)",
            transform: "scale(1.1)",
          },
        }}
      >
        {isOpen ? <CloseIcon /> : <ChatIcon />}
      </Fab>

      {/* חלון הצ'אט */}
      <Slide direction="up" in={isOpen} mountOnEnter unmountOnExit>
        <Paper
          className={`chat-container ${isMinimized ? "minimized" : ""} ${isFullscreen ? "fullscreen" : ""}`}
          elevation={24}
          sx={{
            position: "fixed",
            bottom: isFullscreen ? 0 : 100,
            right: isFullscreen ? 0 : 24,
            width: isFullscreen ? "100vw" : isMinimized ? 320 : 420,
            height: isFullscreen ? "100vh" : isMinimized ? 60 : "auto",
            maxHeight: isFullscreen ? "100vh" : isMinimized ? 60 : "calc(100vh - 120px)",
            zIndex: 1340,
            borderRadius: isFullscreen ? 0 : 3,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            background: "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
            border: "1px solid rgba(139, 0, 0, 0.1)",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            boxShadow: "0 20px 60px rgba(139, 0, 0, 0.2)",
          }}
        >
          {/* כותרת הצ'אט */}
          <Box
            className="chat-header"
            sx={{
              background: "linear-gradient(135deg, #8B0000 0%, #DC143C 100%)",
              color: "white",
              p: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              position: "relative",
              zIndex: 1,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Avatar sx={{ bgcolor: "rgba(255,255,255,0.2)", width: 32, height: 32 }}>
                <AIIcon />
              </Avatar>
              <Box>
                <Typography variant="h6" sx={{ fontSize: "1rem", fontWeight: 600 }}>
                  עוזר AI לשידוכים 🤖
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.8 }}>
                  {isTyping ? "מקליד..." : `שלום ${user.username || "משתמש"}!`}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: "flex", gap: 0.5 }}>
              <Tooltip title="אפשרויות נוספות">
                <IconButton
                  size="small"
                  onClick={(e) => setMenuAnchor(e.currentTarget)}
                  sx={{ color: "white", opacity: 0.9, "&:hover": { opacity: 1 } }}
                >
                  <MoreVertIcon fontSize="small" />
                </IconButton>
              </Tooltip>

              <Tooltip title={isFullscreen ? "צא ממסך מלא" : "מסך מלא"}>
                <IconButton
                  size="small"
                  onClick={() => setIsFullscreen(!isFullscreen)}
                  sx={{ color: "white", opacity: 0.9, "&:hover": { opacity: 1 } }}
                >
                  {isFullscreen ? <FullscreenExitIcon fontSize="small" /> : <FullscreenIcon fontSize="small" />}
                </IconButton>
              </Tooltip>

              <Tooltip title={isMinimized ? "הרחב" : "מזער"}>
                <IconButton
                  size="small"
                  onClick={() => setIsMinimized(!isMinimized)}
                  sx={{ color: "white", opacity: 0.9, "&:hover": { opacity: 1 } }}
                >
                  <MinimizeIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>

          {!isMinimized && (
            <>
              {/* אזור ההודעות */}
              <Box
                className="chat-messages"
                sx={{
                  flex: 1,
                  overflowY: "auto",
                  minHeight: 300,
                  p: 2,
                  background: "linear-gradient(180deg, #ffffff 0%, #f8f9fa 100%)",
                }}
              >
                {messages.length === 0 ? (
                  <Box className="welcome-message" sx={{ textAlign: "center", py: 2 }}>
                    <AIIcon sx={{ fontSize: 48, color: "#8B0000", mb: 2 }} />
                    <Typography variant="h6" sx={{ color: "#8B0000", mb: 1 }}>
                      שלום {user.username || "משתמש"}! 👋
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                      אני כאן לעזור לך עם כל שאלה על השידוכים והמערכת
                    </Typography>

                    <Typography variant="subtitle2" sx={{ color: "#8B0000", mb: 2, fontWeight: 600 }}>
                      שאלות נפוצות:
                    </Typography>
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, justifyContent: "center" }}>
                      {quickQuestions.slice(0, 4).map((question, index) => (
                        <Chip
                          key={index}
                          label={question}
                          onClick={() => handleQuickQuestion(question)}
                          sx={{
                            bgcolor: "rgba(139, 0, 0, 0.1)",
                            color: "#8B0000",
                            fontSize: "0.75rem",
                            cursor: "pointer",
                            "&:hover": {
                              bgcolor: "rgba(139, 0, 0, 0.2)",
                              transform: "scale(1.05)",
                            },
                            transition: "all 0.3s ease",
                          }}
                        />
                      ))}
                    </Box>
                  </Box>
                ) : (
                  messages.map((message) => (
                    <Fade key={message.id} in={true} timeout={300}>
                      <Box
                        className={`message ${message.role}`}
                        sx={{
                          display: "flex",
                          mb: 2,
                          justifyContent: message.role === "user" ? "flex-end" : "flex-start",
                          direction: "rtl",
                        }}
                      >
                        <Box
                          sx={{
                            maxWidth: "85%",
                            display: "flex",
                            alignItems: "flex-end",
                            gap: 1,
                            flexDirection: message.role === "user" ? "row-reverse" : "row",
                          }}
                        >
                          <Avatar
                            sx={{
                              width: 32,
                              height: 32,
                              bgcolor: message.role === "user" ? "#8B0000" : "rgba(139,0,0,0.12)",
                              color: message.role === "user" ? "white" : "#8B0000",
                            }}
                          >
                            {message.role === "user" ? <PersonIcon /> : <AIIcon />}
                          </Avatar>

                          <Box>
                            <Paper
                              className={`message-bubble ${message.role}`}
                              elevation={2}
                              sx={{
                                p: 2,
                                borderRadius: 3,
                                background:
                                  message.role === "user"
                                    ? "linear-gradient(135deg, #8B0000 0%, #DC143C 100%)"
                                    : "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
                                color: message.role === "user" ? "white" : "#333",
                                border: message.role === "assistant" ? "1px solid #e0e0e0" : "none",
                                boxShadow:
                                  message.role === "user"
                                    ? "0 4px 16px rgba(139, 0, 0, 0.3)"
                                    : "0 2px 8px rgba(0, 0, 0, 0.1)",
                              }}
                            >
                              <Typography
                                variant="body1"
                                sx={{
                                  whiteSpace: "pre-wrap",
                                  lineHeight: 1.6,
                                  direction: "rtl",
                                  textAlign: "right",
                                  fontSize: "0.95rem",
                                }}
                              >
                                {message.content}
                              </Typography>
                            </Paper>

                            <Typography
                              variant="caption"
                              sx={{
                                color: "text.secondary",
                                mt: 0.5,
                                display: "block",
                                textAlign: message.role === "user" ? "right" : "left",
                              }}
                            >
                              {formatTime(message.timestamp)}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    </Fade>
                  ))
                )}

                {/* אנימציית הקלדה */}
                {isTyping && (
                  <Fade in={isTyping}>
                    <Box className="typing-indicator" sx={{ display: "flex", mb: 2, direction: "rtl" }}>
                      <Avatar sx={{ width: 32, height: 32, bgcolor: "rgba(139,0,0,0.12)", color: "#8B0000", mr: 1 }}>
                        <AIIcon />
                      </Avatar>
                      <Paper
                        elevation={2}
                        sx={{
                          p: 2,
                          borderRadius: 3,
                          background: "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
                          border: "1px solid #e0e0e0",
                        }}
                      >
                        <Box className="typing-dots">
                          <span></span>
                          <span></span>
                          <span></span>
                        </Box>
                      </Paper>
                    </Box>
                  </Fade>
                )}

                <div ref={messagesEndRef} />
              </Box>

              {/* שאלות מהירות */}
              {messages.length > 0 && (
                <Box sx={{ px: 2, pb: 1, flexShrink: 0 }}>
                  <Divider sx={{ mb: 1 }} />
                  <Typography variant="caption" sx={{ color: "text.secondary", mb: 1, display: "block" }}>
                    שאלות מהירות:
                  </Typography>
                  <Box sx={{ display: "flex", gap: 1, overflowX: "auto", pb: 1 }}>
                    {quickQuestions.slice(0, 3).map((question, index) => (
                      <Chip
                        key={index}
                        label={question}
                        size="small"
                        onClick={() => handleQuickQuestion(question)}
                        sx={{
                          bgcolor: "rgba(139, 0, 0, 0.05)",
                          color: "#8B0000",
                          fontSize: "0.7rem",
                          cursor: "pointer",
                          whiteSpace: "nowrap",
                          "&:hover": {
                            bgcolor: "rgba(139, 0, 0, 0.1)",
                          },
                        }}
                      />
                    ))}
                  </Box>
                </Box>
              )}

              {/* אזור הקלט */}
              <Box
                className="chat-input"
                sx={{
                  p: 2,
                  borderTop: "1px solid #e0e0e0",
                  background: "white",
                  flexShrink: 0,
                }}
              >
                <Box sx={{ display: "flex", gap: 1, alignItems: "flex-end" }}>
                  <TextField
                    inputRef={inputRef}
                    fullWidth
                    multiline
                    maxRows={3}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="הקלד את השאלה שלך..."
                    disabled={isLoading}
                    dir="rtl"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 3,
                        "&.Mui-focused fieldset": {
                          borderColor: "#8B0000",
                        },
                      },
                      "& .MuiInputLabel-root.Mui-focused": {
                        color: "#8B0000",
                      },
                    }}
                  />

                  <IconButton
                    onClick={() => handleSendMessage()}
                    disabled={!inputValue.trim() || isLoading}
                    sx={{
                      bgcolor: "#8B0000",
                      color: "white",
                      width: 48,
                      height: 48,
                      "&:hover": {
                        bgcolor: "#5c0000",
                      },
                      "&.Mui-disabled": {
                        bgcolor: "#ccc",
                      },
                    }}
                  >
                    {isLoading ? <CircularProgress size={20} sx={{ color: "white" }} /> : <SendIcon />}
                  </IconButton>
                </Box>

                {messages.length > 0 && (
                  <Box sx={{ mt: 1, display: "flex", justifyContent: "center" }}>
                    <Chip
                      label={`${messages.length} הודעות`}
                      size="small"
                      sx={{
                        bgcolor: "rgba(139, 0, 0, 0.1)",
                        color: "#8B0000",
                        fontSize: "0.75rem",
                      }}
                    />
                  </Box>
                )}
              </Box>
            </>
          )}
        </Paper>
      </Slide>

      {/* תפריט אפשרויות */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={() => setMenuAnchor(null)}
        sx={{ zIndex: 1500 }}
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: "0 8px 32px rgba(139, 0, 0, 0.15)",
            border: "1px solid rgba(139, 0, 0, 0.1)",
          },
        }}
      >
        <MenuItem onClick={handleClearMessages}>
          <ListItemIcon>
            <ClearIcon sx={{ color: "#8B0000" }} />
          </ListItemIcon>
          נקה שיחה נוכחית
        </MenuItem>
        <MenuItem onClick={handleClearHistory}>
          <ListItemIcon>
            <DeleteSweepIcon sx={{ color: "#F44336" }} />
          </ListItemIcon>
          מחק את כל ההיסטוריה
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => setMenuAnchor(null)}>
          <ListItemIcon>
            <HistoryIcon sx={{ color: "#666" }} />
          </ListItemIcon>
          {`${messages.length} הודעות בשיחה`}
        </MenuItem>
      </Menu>

      {/* דיאלוג אישור מחיקת היסטוריה */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: 3,
          },
        }}
      >
        <DialogTitle sx={{ color: "#8B0000", fontWeight: 600 }}>מחיקת היסטוריית צ'אט</DialogTitle>
        <DialogContent>
          <Typography>האם אתה בטוח שברצונך למחוק את כל היסטוריית השיחות? פעולה זו לא ניתנת לביטול.</Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button
            onClick={() => setDeleteDialogOpen(false)}
            variant="outlined"
            sx={{ borderColor: "#ccc", color: "#666" }}
          >
            ביטול
          </Button>
          <Button
            onClick={confirmClearHistory}
            variant="contained"
            sx={{
              backgroundColor: "#f44336",
              "&:hover": { backgroundColor: "#d32f2f" },
            }}
          >
            מחק הכל
          </Button>
        </DialogActions>
      </Dialog>

      {/* הודעת שגיאה */}
      <Snackbar
        open={showError}
        autoHideDuration={6000}
        onClose={handleCloseError}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={handleCloseError} severity="error" sx={{ width: "100%" }}>
          {error}
        </Alert>
      </Snackbar>
    </>
  )
}

export default AIChatBox
