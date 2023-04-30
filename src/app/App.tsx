import React, {useEffect} from 'react';
import s from './App.module.css';
import ButtonAppBar from "../common/components/app-bar/Appbar";
import {useAppDispatch, useAppSelector} from "app/store";
import LinearProgress from "@mui/material/LinearProgress";
import {AppStatus, initializeAppTC} from "app/app-slice";
import {ErrorSnackbar} from "common/components/snackbar/ErrorSnackbar";
import {TodolistsList} from "features/todolists/TodolistsList";
import {Route, Routes} from "react-router-dom";
import {Login} from "features/auth/Login";
import {CircularProgress} from "@mui/material";


const App = () => {
    const dispatch = useAppDispatch()
    const appStatus = useAppSelector<AppStatus>(state => state.app.status)
    const isInitialized = useAppSelector<boolean>(state => state.app.initialized)

    useEffect(() => {
        dispatch(initializeAppTC())
    }, [dispatch])

    return (
        <>
            <ButtonAppBar/>
            <div className={s.progress_container}>
                {appStatus === 'loading' && <LinearProgress color="secondary"/>}
            </div>
            <div className={s.app}>
                {!isInitialized
                    ? <div className={s.initialized_container}>
                        <CircularProgress color="secondary" size={150}/>
                    </div>
                    : <>
                        <Routes>
                            <Route path={'/'} element={<TodolistsList/>}/>
                            <Route path={'/login'} element={<Login/>}/>
                        </Routes>
                        <ErrorSnackbar/>
                    </>
                }
            </div>
        </>

    );
}
export default App;
