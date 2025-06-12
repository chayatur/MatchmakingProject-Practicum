import type React from "react"
import { Box, Typography, Button, Grid, Container, Card, CardContent, Avatar } from "@mui/material"
import {
  Favorite as FavoriteIcon,
  Security as SecurityIcon,
  Speed as SpeedIcon,
  People as PeopleIcon,
  Star as StarIcon,
} from "@mui/icons-material"
import { useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
import type { RootState } from "../store"

const HomePage: React.FC = () => {
  const navigate = useNavigate()
  const { isLoggedIn } = useSelector((state: RootState) => state.user)

  const features = [
    {
      icon: <FavoriteIcon sx={{ fontSize: 40 }} />,
      title: "התאמות מושלמות",
      description: "מערכת AI מתקדמת למציאת ההתאמה הטובה ביותר",
      color: "#8B0000",
    },
    {
      icon: <SecurityIcon sx={{ fontSize: 40 }} />,
      title: "אבטחה מקסימלית",
      description: "הגנה מלאה על פרטיות המידע האישי",
      color: "#D4AF37",
    },
    {
      icon: <SpeedIcon sx={{ fontSize: 40 }} />,
      title: "תהליך מהיר",
      description: "העלאה ועיבוד מהיר של רזומות",
      color: "#4CAF50",
    },
    {
      icon: <PeopleIcon sx={{ fontSize: 40 }} />,
      title: "שיתוף בין שדכנים",
      description: "פלטפורמה לשיתוף פעיל בין שדכנים",
      color: "#FF9800",
    },
  ]

  const testimonials = [
    {
      name: "שרה כהן",
      role: "שדכנית מקצועית",
      content: "המערכת חסכה לי שעות רבות של עבודה וمساعدة לי למצוא התאמות מושלמות",
      rating: 5,
    },
    {
      name: "דוד לוי",
      role: "שדכן בכיר",
      content: "הטכנולוגיה המתקדמת והממשק הידידותי הפכו את העבודה לקלה ויעילה",
      rating: 5,
    },
    {
      name: "מרים גולד",
      role: "שדכנית",
      content: "אני ממליצה בחום על המערכת לכל שדכן שרוצה לשפר את השירות שלו",
      rating: 5,
    },
  ]

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #8B0000 0%, #5c0000 100%)",
          color: "white",
          py: 8,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage:
              'url("https://hebbkx1anhila5yf.public.blob.vercel-storage.com/%D7%9C%D7%97%D7%99%D7%99%D7%9D.jpg-8mdWJd0R4S44AnIERwdrPPybeckoC8.jpeg")',
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 0.1,
          }}
        />
        <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Box className="fade-in">
                <Typography
                  variant="h2"
                  sx={{
                    fontWeight: 700,
                    mb: 2,
                    fontSize: { xs: "2.5rem", md: "3.5rem" },
                  }}
                >
                  לחיים! 
                </Typography>
                <Typography
                  variant="h5"
                  sx={{
                    mb: 3,
                    opacity: 0.9,
                    fontWeight: 400,
                    lineHeight: 1.6,
                  }}
                >
                   AI מערכת ניהול שידוכים מתקדמת עם טכנולוגיית 
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    mb: 4,
                    opacity: 0.8,
                    fontSize: "1.1rem",
                    lineHeight: 1.7,
                  }}
                >
                  פלטפורמה חדשנית המאפשרת לשדכנים לנהל רזומות, לחפש התאמות ולשתף מידע בצורה יעילה ובטוחה
                </Typography>
                <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                  {!isLoggedIn ? (
                    <>
                      <Button
                        variant="contained"
                        size="large"
                        onClick={() => navigate("/register")}
                        sx={{
                          backgroundColor: "white",
                          color: "#8B0000",
                          fontWeight: 600,
                          px: 4,
                          py: 1.5,
                          "&:hover": {
                            backgroundColor: "#f5f5f5",
                            transform: "translateY(-2px)",
                            boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
                          },
                        }}
                      >
                        הרשמה למערכת
                      </Button>
                      <Button
                        variant="outlined"
                        size="large"
                        onClick={() => navigate("/login")}
                        sx={{
                          borderColor: "white",
                          color: "white",
                          fontWeight: 600,
                          px: 4,
                          py: 1.5,
                          "&:hover": {
                            borderColor: "white",
                            backgroundColor: "rgba(255,255,255,0.1)",
                            transform: "translateY(-2px)",
                          },
                        }}
                      >
                        כניסה למערכת
                      </Button>
                    </>
                  ) : (
                    <Button
                      variant="contained"
                      size="large"
                      onClick={() => navigate("/resumes")}
                      sx={{
                        backgroundColor: "white",
                        color: "#8B0000",
                        fontWeight: 600,
                        px: 4,
                        py: 1.5,
                        "&:hover": {
                          backgroundColor: "#f5f5f5",
                          transform: "translateY(-2px)",
                          boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
                        },
                      }}
                    >
                      כניסה למערכת
                    </Button>
                  )}
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                className="scale-in"
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <img
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/%D7%9C%D7%97%D7%99%D7%99%D7%9D.jpg-8mdWJd0R4S44AnIERwdrPPybeckoC8.jpeg"
                  alt="לחיים - מערכת שידוכים"
                  style={{
                    maxWidth: "300px",
                    width: "100%",
                    height: "auto",
                    borderRadius: "20px",
                    boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
                  }}
                />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box sx={{ textAlign: "center", mb: 6 }}>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              color: "#8B0000",
              mb: 2,
            }}
          >
            למה לבחור בנו?
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: "auto" }}>
            המערכת המתקדמת ביותר לניהול שידוכים עם טכנולוגיות חדשניות
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card
                className="card-elegant scale-in"
                sx={{
                  height: "100%",
                  textAlign: "center",
                  p: 2,
                  animation: `scaleIn 0.6s ease-out ${index * 0.1}s both`,
                }}
              >
                <CardContent>
                  <Box
                    sx={{
                      display: "inline-flex",
                      p: 2,
                      borderRadius: 3,
                      backgroundColor: `${feature.color}15`,
                      color: feature.color,
                      mb: 2,
                    }}
                  >
                    {feature.icon}
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: "#333" }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Statistics Section */}
      <Box sx={{ backgroundColor: "#f8f9fa", py: 8 }}>
        <Container maxWidth="lg">
          <Grid container spacing={4} sx={{ textAlign: "center" }}>
            <Grid item xs={12} sm={6} md={3}>
              <Box className="fade-in">
                <Typography variant="h3" sx={{ fontWeight: 700, color: "#8B0000", mb: 1 }}>
                  1000+
                </Typography>
                <Typography variant="h6" color="text.secondary">
                  רזומות במערכת
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Box className="fade-in">
                <Typography variant="h3" sx={{ fontWeight: 700, color: "#D4AF37", mb: 1 }}>
                  500+
                </Typography>
                <Typography variant="h6" color="text.secondary">
                  התאמות מוצלחות
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Box className="fade-in">
                <Typography variant="h3" sx={{ fontWeight: 700, color: "#4CAF50", mb: 1 }}>
                  100+
                </Typography>
                <Typography variant="h6" color="text.secondary">
                  שדכנים פעילים
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Box className="fade-in">
                <Typography variant="h3" sx={{ fontWeight: 700, color: "#FF9800", mb: 1 }}>
                  98%
                </Typography>
                <Typography variant="h6" color="text.secondary">
                  שביעות רצון
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Testimonials Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box sx={{ textAlign: "center", mb: 6 }}>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              color: "#8B0000",
              mb: 2,
            }}
          >
            מה אומרים עלינו
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: "auto" }}>
            חוות דעת של שדכנים מקצועיים שמשתמשים במערכת
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {testimonials.map((testimonial, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card
                className="card-elegant slide-up"
                sx={{
                  height: "100%",
                  p: 3,
                  animation: `slideUp 0.6s ease-out ${index * 0.2}s both`,
                }}
              >
                <CardContent>
                  <Box sx={{ display: "flex", mb: 2 }}>
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <StarIcon key={i} sx={{ color: "#D4AF37", fontSize: 20 }} />
                    ))}
                  </Box>
                  <Typography
                    variant="body1"
                    sx={{
                      mb: 3,
                      fontStyle: "italic",
                      lineHeight: 1.6,
                      color: "#555",
                    }}
                  >
                    "{testimonial.content}"
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Avatar sx={{ bgcolor: "#8B0000" }}>{testimonial.name.charAt(0)}</Avatar>
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        {testimonial.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {testimonial.role}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* CTA Section */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #8B0000 0%, #5c0000 100%)",
          color: "white",
          py: 8,
          textAlign: "center",
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h3" sx={{ fontWeight: 700, mb: 2 }}>
          ? רוצים להיות חלק 
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
            הצטרפו למערכת הניהול המתקדמת ביותר לשידוכים
          </Typography>
          {!isLoggedIn && (
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate("/register")}
              sx={{
                backgroundColor: "white",
                color: "#8B0000",
                fontWeight: 600,
                px: 6,
                py: 2,
                fontSize: "1.1rem",
                "&:hover": {
                  backgroundColor: "#f5f5f5",
                  transform: "translateY(-2px)",
                  boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
                },
              }}
            >
              הרשמו עכשיו
            </Button>
          )}
        </Container>
      </Box>

      {/* Footer Section */}
      <Box
        sx={{
          backgroundColor: "linear-gradient(135deg, #8B0000 0%, #5c0000 100%)",
          color: "white",
          py: 8,
          textAlign: "center",
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} sx={{ textAlign: "center" }}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                יצירת קשר
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
                Email: contact@example.com
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                נאום
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
                הרשמו לאנימציה שלנו כדי לקבל עדכונים וטיפים!
              </Typography>
              <Button variant="outlined" size="large" sx={{ color: "white", borderColor: "white" }}>
                הרשם לאנימציה
              </Button>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  )
}

export default HomePage
