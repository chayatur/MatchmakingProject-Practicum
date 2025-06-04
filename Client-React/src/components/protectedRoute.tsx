"use client"

import type React from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom"; // שינוי ל-useNavigate
import { useSelector } from "react-redux";
import { Box, CircularProgress, Typography } from "@mui/material";
import type { RootState } from "../store";

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, redirectTo = "/auth/login" }) => {
  const navigate = useNavigate(); // שימוש ב-useNavigate
  const { isLoggedIn, loading } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    // אם לא טוען ולא מחובר, הפנה
    if (!loading && !isLoggedIn) {
      navigate(redirectTo); // שימוש ב-navigate להכוונה
    }
  }, [isLoggedIn, loading, redirectTo, navigate]);

  // הצגת מצב טעינה
  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "50vh",
        }}
      >
        <CircularProgress sx={{ color: "#8B0000" }} />
        <Typography variant="body1" sx={{ mt: 2, color: "#8B0000" }}>
          טוען...
        </Typography>
      </Box>
    );
  }

  // אם מחובר, הצג את הילדים
  return isLoggedIn ? <>{children}</> : null;
};

export default ProtectedRoute;
