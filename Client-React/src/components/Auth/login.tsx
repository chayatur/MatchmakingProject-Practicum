

import React, { useEffect } from "react"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom" 
import { Container, Box } from "@mui/material"
import LoginForm from "./loginForm"
import type { RootState } from "../../store"

const LoginPage: React.FC = () => {
  const navigate = useNavigate()
  const { isLoggedIn } = useSelector((state: RootState) => state.user)

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/resumes") 
    }
  }, [isLoggedIn, navigate])

  return (
    <Container maxWidth="sm">
      <Box sx={{ py: 8 }}>
        <LoginForm />
      </Box>
    </Container>
  )
}

export default LoginPage
