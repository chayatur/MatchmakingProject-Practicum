"use client"

import React, { useEffect, useState } from "react"
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  LinearProgress,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  IconButton,
  Divider,
} from "@mui/material"
import {
  People as PeopleIcon,
  Description as DescriptionIcon,
  Share as ShareIcon,
  TrendingUp as TrendingUpIcon,
  Visibility as VisibilityIcon,
  Download as DownloadIcon,
  AccessTime as AccessTimeIcon,
  Person as PersonIcon,
} from "@mui/icons-material"
import { useSelector, useDispatch } from "react-redux"
import type { RootState, AppDispatch } from "../store"
import { fetchFiles, fetchSharedFiles } from "../slices/fileSlice"

interface DashboardStats {
  totalResumes: number
  myResumes: number
  sharedWithMe: number
  recentActivity: number
}

const Dashboard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { files, sharedFiles, loading } = useSelector((state: RootState) => state.files)
  const { user } = useSelector((state: RootState) => state.user)

  const [stats, setStats] = useState<DashboardStats>({
    totalResumes: 0,
    myResumes: 0,
    sharedWithMe: 0,
    recentActivity: 0,
  })

  useEffect(() => {
    dispatch(fetchFiles())
    dispatch(fetchSharedFiles())
  }, [dispatch])

  useEffect(() => {
    if (files.length > 0) {
      const myResumes = files.filter((file) => file.isOwner).length
      const recentActivity = files.filter((file) => {
        const fileDate = new Date(file.createdAt)
        const weekAgo = new Date()
        weekAgo.setDate(weekAgo.getDate() - 7)
        return fileDate > weekAgo
      }).length

      setStats({
        totalResumes: files.length,
        myResumes,
        sharedWithMe: sharedFiles.length,
        recentActivity,
      })
    }
  }, [files, sharedFiles])

  const recentFiles = files.slice(0, 5)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("he-IL", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const StatCard = ({
    title,
    value,
    icon,
    color,
    subtitle,
  }: {
    title: string
    value: number
    icon: React.ReactNode
    color: string
    subtitle?: string
  }) => (
    <Card className="card-elegant scale-in" sx={{ height: "100%" }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, color, mb: 0.5 }}>
              {value}
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 600, color: "text.primary" }}>
              {title}
            </Typography>
            {subtitle && (
              <Typography variant="caption" color="text.secondary">
                {subtitle}
              </Typography>
            )}
          </Box>
          <Box
            sx={{
              p: 2,
              borderRadius: 2,
              backgroundColor: `${color}15`,
              color,
            }}
          >
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  )

  return (
    <Box className="fade-in" sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: "#8B0000", mb: 1 }}>
          ברוכים הבאים, {user.username || "משתמש"}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          סקירה כללית של פעילות השידוכים שלך
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="סה״כ רזומות"
            value={stats.totalResumes}
            icon={<DescriptionIcon sx={{ fontSize: 28 }} />}
            color="#8B0000"
            subtitle="במערכת"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="הרזומות שלי"
            value={stats.myResumes}
            icon={<PersonIcon sx={{ fontSize: 28 }} />}
            color="#D4AF37"
            subtitle="שהעלתי"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="שותפו איתי"
            value={stats.sharedWithMe}
            icon={<ShareIcon sx={{ fontSize: 28 }} />}
            color="#4CAF50"
            subtitle="רזומות"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="פעילות השבוע"
            value={stats.recentActivity}
            icon={<TrendingUpIcon sx={{ fontSize: 28 }} />}
            color="#FF9800"
            subtitle="רזומות חדשות"
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Recent Activity */}
        <Grid item xs={12} lg={8}>
          <Paper className="card-elegant" sx={{ p: 3, height: "fit-content" }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
              <AccessTimeIcon sx={{ color: "#8B0000", mr: 1 }} />
              <Typography variant="h5" sx={{ fontWeight: 600, color: "#8B0000" }}>
                רזומות אחרונות
              </Typography>
            </Box>

            {loading ? (
              <Box sx={{ width: "100%", mb: 2 }}>
                <LinearProgress
                  sx={{
                    backgroundColor: "rgba(139, 0, 0, 0.1)",
                    "& .MuiLinearProgress-bar": {
                      backgroundColor: "#8B0000",
                    },
                  }}
                />
              </Box>
            ) : (
              <List sx={{ p: 0 }}>
                {recentFiles.map((file, index) => (
                  <React.Fragment key={file.id}>
                    <ListItem
                      sx={{
                        px: 0,
                        py: 2,
                        "&:hover": {
                          backgroundColor: "rgba(139, 0, 0, 0.04)",
                          borderRadius: 2,
                        },
                      }}
                    >
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: file.isOwner ? "#8B0000" : "#D4AF37" }}>
                          <PersonIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                              {file.firstName} {file.lastName}
                            </Typography>
                            {file.isOwner && file.firstName && file.lastName && (
                              <Chip
                                label="שלי"
                                size="small"
                                sx={{
                                  backgroundColor: "#D4AF37",
                                  color: "white",
                                  fontSize: "0.7rem",
                                }}
                              />
                            )}
                          </Box>
                        }
                        secondary={
                          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mt: 0.5 }}>
                            <Typography variant="caption" color="text.secondary">
                              {formatDate(file.createdAt)}
                            </Typography>
                            {file.age && (
                              <Chip
                                label={`גיל ${file.age}`}
                                size="small"
                                variant="outlined"
                                sx={{ fontSize: "0.7rem" }}
                              />
                            )}
                          </Box>
                        }
                      />
                      <Box sx={{ display: "flex", gap: 1 }}>
                        <IconButton size="small" sx={{ color: "#8B0000" }}>
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                        <IconButton size="small" sx={{ color: "#8B0000" }}>
                          <DownloadIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </ListItem>
                    {index < recentFiles.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            )}

            {recentFiles.length === 0 && !loading && (
              <Box sx={{ textAlign: "center", py: 4 }}>
                <Typography variant="body2" color="text.secondary">
                  אין רזומות להצגה
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12} lg={4}>
          <Paper className="card-elegant" sx={{ p: 3, height: "fit-content" }}>
            <Typography variant="h6" sx={{ fontWeight: 600, color: "#8B0000", mb: 3 }}>
              פעולות מהירות
            </Typography>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Box
                className="card-elegant"
                sx={{
                  p: 2,
                  cursor: "pointer",
                  "&:hover": {
                    backgroundColor: "rgba(139, 0, 0, 0.04)",
                  },
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Box
                    sx={{
                      p: 1.5,
                      borderRadius: 2,
                      backgroundColor: "rgba(139, 0, 0, 0.1)",
                      color: "#8B0000",
                    }}
                  >
                    <DescriptionIcon />
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      העלאת רזומה חדשה
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      הוסף רזומה למערכת
                    </Typography>
                  </Box>
                </Box>
              </Box>

              <Box
                className="card-elegant"
                sx={{
                  p: 2,
                  cursor: "pointer",
                  "&:hover": {
                    backgroundColor: "rgba(212, 175, 55, 0.04)",
                  },
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Box
                    sx={{
                      p: 1.5,
                      borderRadius: 2,
                      backgroundColor: "rgba(212, 175, 55, 0.1)",
                      color: "#D4AF37",
                    }}
                  >
                    <PeopleIcon />
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      חיפוש רזומות
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      מצא התאמות מושלמות
                    </Typography>
                  </Box>
                </Box>
              </Box>

              <Box
                className="card-elegant"
                sx={{
                  p: 2,
                  cursor: "pointer",
                  "&:hover": {
                    backgroundColor: "rgba(76, 175, 80, 0.04)",
                  },
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Box
                    sx={{
                      p: 1.5,
                      borderRadius: 2,
                      backgroundColor: "rgba(76, 175, 80, 0.1)",
                      color: "#4CAF50",
                    }}
                  >
                    <ShareIcon />
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      שיתוף עם שדכנים
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      שתף רזומות עם עמיתים
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}

export default Dashboard
