import React from "react";
import { AppBar, Toolbar, Typography, Box, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Header: React.FC = () => {
    const navigate = useNavigate();

    return (
        <AppBar position="static" sx={{ background: 'linear-gradient(90deg, #800080, #d19a9a)' }}>
            <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6" sx={{ color: 'white' }}>
                    Welcome
                </Typography>
                <Box>
                    <Button 
                        variant="contained" 
                        sx={{ margin: '0 10px', opacity: '80%', backgroundColor: '#32cd32', '&:hover': { backgroundColor: '#28a745' } }} 
                        onClick={() => navigate('/register')}
                    >
                        הרשמה
                    </Button>
                    <Button 
                        variant="outlined" 
                        sx={{ margin: '0 10px', borderColor: 'white', color: 'white', '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' } }} 
                        onClick={() =>{ console.log("login"),navigate('/login') }}
                    >
                        כניסה
                    </Button>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Header;
