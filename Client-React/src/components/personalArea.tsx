import type React from "react"
import { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import {
    Container,
    Grid,
    Paper,
    Typography,
    Box,
    Card,
    CardContent,
    Avatar,
    Button,
    List,
    ListItem,
    ListItemText,
    ListItemAvatar,
    Chip,
    LinearProgress,
    IconButton,
    Tooltip,
    Divider,
    useTheme,
    useMediaQuery,
} from "@mui/material"
import {
    Description as DescriptionIcon,
    Share as ShareIcon,
    Upload as UploadIcon,
    Person as PersonIcon,
    TrendingUp as TrendingUpIcon,
    AccessTime as AccessTimeIcon,
    Visibility as VisibilityIcon,
    Settings as SettingsIcon,
    Add as AddIcon,
    Search as SearchIcon,
} from "@mui/icons-material"
import type { RootState, AppDispatch } from "../store"
import { fetchFiles } from "../slices/fileSlice"
import "../styles/personalArea.css"

interface DashboardStats {
    totalResumes: number
    myResumes: number
    sharedWithMe: number
    recentUploads: number
}

interface QuickAction {
    title: string
    description: string
    icon: React.ReactNode
    path: string
    color: string
}

const PersonalArea = () => {
    const dispatch = useDispatch<AppDispatch>()
    const navigate = useNavigate()
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down("md"))

    const { user, isLoggedIn } = useSelector((state: RootState) => state.user)
    const { files, loading } = useSelector((state: RootState) => state.files)

    const [stats, setStats] = useState<DashboardStats>({
        totalResumes: 0,
        myResumes: 0,
        sharedWithMe: 0,
        recentUploads: 0,
    })

    useEffect(() => {
        if (isLoggedIn) {
            dispatch(fetchFiles())
        }
    }, [dispatch, isLoggedIn])

    useEffect(() => {
        if (files.length > 0 && user.id) {
            const myResumes = files.filter((file) => file.userId === user.id)
            const sharedWithMe = files.filter((file) => file.userId !== user.id)
            const recentUploads = files.filter((file) => {
                const uploadDate = new Date(file.createdAt)
                const weekAgo = new Date()
                weekAgo.setDate(weekAgo.getDate() - 7)
                return uploadDate > weekAgo
            })

            setStats({
                totalResumes: files.length,
                myResumes: myResumes.length,
                sharedWithMe: sharedWithMe.length,
                recentUploads: recentUploads.length,
            })
        }
    }, [files, user.id])

    const quickActions: QuickAction[] = [
        {
            title: "העלאת רזומה",
            description: "העלה רזומה חדשה למערכת",
            icon: <UploadIcon />,
            path: "/FileUploader",
            color: "#8B0000",
        },
        {
            title: "חיפוש רזומות",
            description: "חפש רזומות במערכת",
            icon: <SearchIcon />,
            path: "/resumes",
            color: "#D4AF37",
        },
        {
            title: "הפרופיל שלי",
            description: "עדכן את הפרטים האישיים",
            icon: <PersonIcon />,
            path: "/profile",
            color: "#4CAF50",
        },
        {
            title: "הגדרות",
            description: "נהל את הגדרות החשבון",
            icon: <SettingsIcon />,
            path: "/SettingsPage",
            color: "#FF9800",
        },
    ]

    const getRecentFiles = () => {
        return files
            .filter((file) => file.userId === user.id)
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .slice(0, 5)
    }

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
            return "תאריך לא חוקי"; 
        }

        const now = new Date();
        const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

        if (diffInHours < 1) return "לפני כמה דקות";
        if (diffInHours < 24) return `לפני ${diffInHours} שעות`;
        if (diffInHours < 48) return "אתמול";

        return date.toLocaleDateString("he-IL", {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    }

    const getGreeting = () => {
        const hour = new Date().getHours()
        if (hour < 12) return "בוקר טוב"
        if (hour < 17) return "צהריים טובים"
        if (hour < 21) return "ערב טוב"
        return "לילה טוב"
    }

    const getInitials = () => {
        if (user.username) {
            return user.username.charAt(0).toUpperCase()
        }
        if (user.email) {
            return user.email.charAt(0).toUpperCase()
        }
        return "U"
    }

    if (!isLoggedIn) {
        return (
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Paper elevation={3} sx={{ p: 4, textAlign: "center" }}>
                    <Typography variant="h5" color="#8B0000" gutterBottom>
                        יש להתחבר למערכת כדי לצפות בדשבורד
                    </Typography>
                    <Button
                        variant="contained"
                        onClick={() => navigate("/login")}
                        sx={{
                            mt: 2,
                            backgroundColor: "#8B0000",
                            "&:hover": { backgroundColor: "#5c0000" },
                        }}
                    >
                        התחבר למערכת
                    </Button>
                </Paper>
            </Container>
        )
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4 }} className="dashboard-container">


            {/* Header Section */}
            <Paper elevation={3} className="dashboard-header" sx={{ mb: 4, overflow: "hidden" }}>
                <Box sx={{ p: 3 }}>
                    <Grid container spacing={3} alignItems="center">
                        <Grid item>
                            <Avatar
                                sx={{
                                    width: 80,
                                    height: 80,
                                    bgcolor: "#8B0000",
                                    fontSize: "2rem",
                                    fontWeight: "bold",
                                    boxShadow: "0 8px 25px rgba(139, 0, 0, 0.3)",
                                }}
                            >
                                {getInitials()}
                            </Avatar>
                        </Grid>
                        <Grid item xs>
                            <Typography variant="h4" sx={{ color: "#8B0000", fontWeight: "bold", mb: 1 }}>
                                {getGreeting()}, {user.username || "משתמש"}!
                            </Typography>
                            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                                ברוך הבא לדשבורד האישי שלך במערכת השידוכים
                            </Typography>
                            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                                <Chip
                                    icon={<AccessTimeIcon />}
                                    label={`פעיל מאז ${user.createdAt ? formatDate(user.createdAt) : "תאריך לא זמין"}`}
                                    variant="outlined"
                                    sx={{ borderColor: "#8B0000", color: "#8B0000" }}
                                />

                                <Chip
                                    icon={<DescriptionIcon />}
                                    label={`${stats.myResumes} רזומות`}
                                    variant="outlined"
                                    sx={{ borderColor: "#D4AF37", color: "#D4AF37" }}
                                />
                            </Box>
                        </Grid>
                        {!isMobile && (
                            <Grid item>
                                <Button
                                    variant="contained"
                                    startIcon={<AddIcon />}
                                    onClick={() => navigate("/FileUploader")}
                                    sx={{
                                        backgroundColor: "#8B0000",
                                        "&:hover": { backgroundColor: "#5c0000" },
                                        borderRadius: 3,
                                        px: 3,
                                        py: 1.5,
                                    }}
                                >
                                    העלאת רזומה חדשה
                                </Button>
                            </Grid>
                        )}
                    </Grid>
                </Box>
            </Paper>

            {/* Stats Grid */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <Card className="stat-card" elevation={2}>
                        <CardContent sx={{ textAlign: "center", p: 3 }}>
                            <Box
                                sx={{
                                    width: 60,
                                    height: 60,
                                    borderRadius: "50%",
                                    background: "linear-gradient(135deg, #8B0000, #DC143C)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    mx: "auto",
                                    mb: 2,
                                    color: "white",
                                }}
                            >
                                <DescriptionIcon fontSize="large" />
                            </Box>
                            <Typography variant="h4" sx={{ fontWeight: "bold", color: "#8B0000", mb: 1 }}>
                                {stats.totalResumes}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                סה"כ רזומות במערכת
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Card className="stat-card" elevation={2}>
                        <CardContent sx={{ textAlign: "center", p: 3 }}>
                            <Box
                                sx={{
                                    width: 60,
                                    height: 60,
                                    borderRadius: "50%",
                                    background: "linear-gradient(135deg, #D4AF37, #B8941F)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    mx: "auto",
                                    mb: 2,
                                    color: "white",
                                }}
                            >
                                <PersonIcon fontSize="large" />
                            </Box>
                            <Typography variant="h4" sx={{ fontWeight: "bold", color: "#D4AF37", mb: 1 }}>
                                {stats.myResumes}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                הרזומות שלי
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Card className="stat-card" elevation={2}>
                        <CardContent sx={{ textAlign: "center", p: 3 }}>
                            <Box
                                sx={{
                                    width: 60,
                                    height: 60,
                                    borderRadius: "50%",
                                    background: "linear-gradient(135deg, #4CAF50, #388E3C)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    mx: "auto",
                                    mb: 2,
                                    color: "white",
                                }}
                            >
                                <ShareIcon fontSize="large" />
                            </Box>
                            <Typography variant="h4" sx={{ fontWeight: "bold", color: "#4CAF50", mb: 1 }}>
                                {stats.sharedWithMe}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                רזומות ששותפו איתי
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Card className="stat-card" elevation={2}>
                        <CardContent sx={{ textAlign: "center", p: 3 }}>
                            <Box
                                sx={{
                                    width: 60,
                                    height: 60,
                                    borderRadius: "50%",
                                    background: "linear-gradient(135deg, #FF9800, #F57C00)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    mx: "auto",
                                    mb: 2,
                                    color: "white",
                                }}
                            >
                                <TrendingUpIcon fontSize="large" />
                            </Box>
                            <Typography variant="h4" sx={{ fontWeight: "bold", color: "#FF9800", mb: 1 }}>
                                {stats.recentUploads}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                העלאות השבוע
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Main Content Grid */}
            <Grid container spacing={3}>
                {/* Quick Actions */}
                <Grid item xs={12} md={6}>
                    <Paper elevation={2} sx={{ height: "100%" }}>
                        <Box sx={{ p: 3, borderBottom: "1px solid #e0e0e0" }}>
                            <Typography variant="h6" sx={{ fontWeight: "bold", color: "#8B0000" }}>
                                פעולות מהירות
                            </Typography>
                        </Box>
                        <Box sx={{ p: 3 }}>
                            <Grid container spacing={2}>
                                {quickActions.map((action, index) => (
                                    <Grid item xs={12} sm={6} key={index}>
                                        <Card
                                            className="quick-action-card"
                                            elevation={1}
                                            sx={{
                                                cursor: "pointer",
                                                transition: "all 0.3s ease",
                                                "&:hover": {
                                                    transform: "translateY(-4px)",
                                                    boxShadow: `0 8px 25px ${action.color}20`,
                                                },
                                            }}
                                            onClick={() => navigate(action.path)}
                                        >
                                            <CardContent sx={{ textAlign: "center", p: 2 }}>
                                                <Box
                                                    sx={{
                                                        width: 50,
                                                        height: 50,
                                                        borderRadius: "50%",
                                                        backgroundColor: `${action.color}15`,
                                                        color: action.color,
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent: "center",
                                                        mx: "auto",
                                                        mb: 1,
                                                    }}
                                                >
                                                    {action.icon}
                                                </Box>
                                                <Typography variant="subtitle2" sx={{ fontWeight: "bold", mb: 0.5 }}>
                                                    {action.title}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    {action.description}
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
                        </Box>
                    </Paper>
                </Grid>

                {/* Recent Files */}
                <Grid item xs={12} md={6}>
                    <Paper elevation={2} sx={{ height: "100%" }}>
                        <Box sx={{ p: 3, borderBottom: "1px solid #e0e0e0" }}>
                            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <Typography variant="h6" sx={{ fontWeight: "bold", color: "#8B0000" }}>
                                    רזומות אחרונות
                                </Typography>
                                <Button size="small" onClick={() => navigate("/resumes")} sx={{ color: "#8B0000", fontWeight: "bold" }}>
                                    צפה בהכל
                                </Button>
                            </Box>
                        </Box>
                        <Box sx={{ p: 0 }}>
                            {loading ? (
                                <Box sx={{ p: 3 }}>
                                    <LinearProgress sx={{ mb: 2, "& .MuiLinearProgress-bar": { backgroundColor: "#8B0000" } }} />
                                    <Typography variant="body2" color="text.secondary" textAlign="center">
                                        טוען רזומות...
                                    </Typography>
                                </Box>
                            ) : getRecentFiles().length > 0 ? (
                                <List>
                                    {getRecentFiles().map((file, index) => (
                                        <Box key={file.id}>
                                            <ListItem
                                                className="recent-file-item"
                                                sx={{
                                                    transition: "all 0.3s ease",
                                                    "&:hover": {
                                                        backgroundColor: "rgba(139, 0, 0, 0.04)",
                                                    },
                                                }}
                                            >
                                                <ListItemAvatar>
                                                    <Avatar sx={{ bgcolor: "#8B0000" }}>
                                                        <DescriptionIcon />
                                                    </Avatar>
                                                </ListItemAvatar>
                                                <ListItemText
                                                    primary={
                                                        <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
                                                            {file.firstName} {file.lastName}
                                                        </Typography>
                                                    }
                                                    secondary={
                                                        <Box>
                                                            <Typography variant="caption" color="text.secondary">
                                                                {formatDate(file.createdAt)}
                                                            </Typography>
                                                            {file.age && (
                                                                <Chip
                                                                    label={`גיל ${file.age}`}
                                                                    size="small"
                                                                    sx={{
                                                                        ml: 1,
                                                                        height: 20,
                                                                        fontSize: "0.7rem",
                                                                        backgroundColor: "rgba(139, 0, 0, 0.1)",
                                                                        color: "#8B0000",
                                                                    }}
                                                                />
                                                            )}
                                                        </Box>
                                                    }
                                                />
                                                <Tooltip title="צפה ברזומה">
                                                    <IconButton size="small" onClick={() => navigate("/resumes")} sx={{ color: "#8B0000" }}>
                                                        <VisibilityIcon />
                                                    </IconButton>
                                                </Tooltip>
                                            </ListItem>
                                            {index < getRecentFiles().length - 1 && <Divider />}
                                        </Box>
                                    ))}
                                </List>
                            ) : (
                                <Box sx={{ p: 3, textAlign: "center" }}>
                                    <DescriptionIcon sx={{ fontSize: 48, color: "#ccc", mb: 2 }} />
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                        עדיין לא העלית רזומות
                                    </Typography>
                                    <Button
                                        variant="outlined"
                                        startIcon={<UploadIcon />}
                                        onClick={() => navigate("/FileUploader")}
                                        sx={{
                                            borderColor: "#8B0000",
                                            color: "#8B0000",
                                            "&:hover": {
                                                borderColor: "#5c0000",
                                                backgroundColor: "rgba(139, 0, 0, 0.04)",
                                            },
                                        }}
                                    >
                                        העלה רזומה ראשונה
                                    </Button>
                                </Box>
                            )}
                        </Box>
                    </Paper>
                </Grid>

                {/* Activity Summary */}
                <Grid item xs={12}>
                    <Paper elevation={2}>
                        <Box sx={{ p: 3, borderBottom: "1px solid #e0e0e0" }}>
                            <Typography variant="h6" sx={{ fontWeight: "bold", color: "#8B0000" }}>
                                סיכום פעילות
                            </Typography>
                        </Box>
                        <Box sx={{ p: 3 }}>
                            <Grid container spacing={3}>
                                <Grid item xs={12} md={4}>
                                    <Box sx={{ textAlign: "center" }}>
                                        <Typography variant="h3" sx={{ fontWeight: "bold", color: "#8B0000", mb: 1 }}>
                                            {((stats.myResumes / Math.max(stats.totalResumes, 1)) * 100).toFixed(0)}%
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            מהרזומות במערכת הן שלי
                                        </Typography>
                                        <LinearProgress
                                            variant="determinate"
                                            value={(stats.myResumes / Math.max(stats.totalResumes, 1)) * 100}
                                            sx={{
                                                mt: 2,
                                                height: 8,
                                                borderRadius: 4,
                                                "& .MuiLinearProgress-bar": { backgroundColor: "#8B0000" },
                                            }}
                                        />
                                    </Box>
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <Box sx={{ textAlign: "center" }}>
                                        <Typography variant="h3" sx={{ fontWeight: "bold", color: "#D4AF37", mb: 1 }}>
                                            {stats.sharedWithMe}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            רזומות ששותפו איתי
                                        </Typography>
                                        <LinearProgress
                                            variant="determinate"
                                            value={(stats.sharedWithMe / Math.max(stats.totalResumes, 1)) * 100}
                                            sx={{
                                                mt: 2,
                                                height: 8,
                                                borderRadius: 4,
                                                "& .MuiLinearProgress-bar": { backgroundColor: "#D4AF37" },
                                            }}
                                        />
                                    </Box>
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <Box sx={{ textAlign: "center" }}>
                                        <Typography variant="h3" sx={{ fontWeight: "bold", color: "#4CAF50", mb: 1 }}>
                                            {stats.recentUploads}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            העלאות השבוע האחרון
                                        </Typography>
                                        <LinearProgress
                                            variant="determinate"
                                            value={Math.min((stats.recentUploads / 10) * 100, 100)}
                                            sx={{
                                                mt: 2,
                                                height: 8,
                                                borderRadius: 4,
                                                "& .MuiLinearProgress-bar": { backgroundColor: "#4CAF50" },
                                            }}
                                            
                                        />
                                    </Box>
                                </Grid>
                            </Grid>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    )
}

export default PersonalArea
