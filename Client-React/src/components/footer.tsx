import React from "react";
import { AppBar, Toolbar, Typography } from '@mui/material';

const Footer: React.FC = () => {
    return (
        <AppBar position="static" sx={{ top: 'auto', bottom: 0, background: '#32cd32' }}>
            <Toolbar sx={{ display: 'flex', justifyContent: 'center' }}>
                <Typography variant="body1" color="inherit">
                    © 2025 זכויות יוצרים
                </Typography>
            </Toolbar>
        </AppBar>
    );
};

export default Footer;
