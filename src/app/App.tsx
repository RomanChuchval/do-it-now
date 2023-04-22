import React, {useEffect} from 'react';
import s from './App.module.css';
import ButtonAppBar from "./app-bar/Appbar";
import {useAppDispatch, useAppSelector} from "../redux/store";
import LinearProgress from "@mui/material/LinearProgress";
import {AppStatus} from "../redux/reducers/app-reducer";
import {ErrorSnackbar} from "../components/snackbar/ErrorSnackbar";
import {TodolistsList} from "../components/todolist/TodolistsList";
import {Route, Routes} from "react-router-dom";
import {Login} from "../components/Login";
import {initializeMeTC} from "../redux/reducers/auth-reducer";
import {CircularProgress} from "@mui/material";


const App = () => {
    const dispatch = useAppDispatch()
    const appStatus = useAppSelector<AppStatus>(state => state.app.status)
    const isInitialized = useAppSelector<boolean>(state => state.auth.initialized)

    useEffect(() => {
        dispatch(initializeMeTC())
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
