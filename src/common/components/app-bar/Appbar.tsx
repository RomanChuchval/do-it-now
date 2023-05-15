import React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import {useAuth} from "features/auth/hooks/useAuth";


export default function ButtonAppBar() {
    const {isLoggedIn, logout} = useAuth()
    const onLogoutHandler = () => {
        logout()
    }

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar sx={{justifyContent: 'space-between'}}>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{ mr: 2 }}
                    >
                        <MenuIcon />
                    </IconButton>
                    {isLoggedIn && <Button color="inherit" onClick={onLogoutHandler}>Logout</Button>}
                </Toolbar>
            </AppBar>
        </Box>
    );
}
