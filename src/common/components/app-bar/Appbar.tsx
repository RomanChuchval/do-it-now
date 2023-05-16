import React, {memo, useCallback} from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import {useAuth} from "features/auth/hooks/useAuth";
import {SuperButton} from "common/components/super-button/SuperButton";


export const ButtonAppBar = memo(() => {
    const {isLoggedIn, logout} = useAuth()
    const onLogoutHandler =  () => {
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
                    {isLoggedIn && <SuperButton name={'Logout'} callback={onLogoutHandler}/>}
                </Toolbar>
            </AppBar>
        </Box>
    );
})
