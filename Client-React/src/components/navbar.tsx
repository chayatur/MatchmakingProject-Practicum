import React from 'react';
import { Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';

const NavBar = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          life 🥂
        </Typography>
        
        <Button color="inherit" component={Link} to="/">בית</Button>
        <Button color="inherit" component={Link} to="/login">כניסה</Button>
        <Button color="inherit" component={Link} to="/register">הרשמה</Button>
        <Button color="inherit" component={Link} to="/FileUploader">העלאת קובץ</Button>
        <Button color="inherit" component={Link} to="/resumes">רזומות</Button> {/* הוסף כפתור לרזומות */}

        <Button color="inherit" component={Link} to="/about">קצת עלינו</Button> {/* ודא שהכפתור כאן */}
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
