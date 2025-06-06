
import { useEffect } from "react"
import { useSelector } from "react-redux"
import { Container, Box } from "@mui/material"
import RegisterForm from "./registerForm" 
import type { RootState } from "../../store"
import { useNavigate } from "react-router-dom"

const Register = () => {
  const { isLoggedIn } = useSelector((state: RootState) => state.user)
const navigate=useNavigate();
  useEffect(() => {
    if (isLoggedIn) {
         navigate( "/resumes" )
    }
  }, [isLoggedIn])

  return (
    <Container maxWidth="md">
      <Box sx={{ py: 8 }}>
        <RegisterForm />
      </Box>
    </Container>
  )
}

export default Register
