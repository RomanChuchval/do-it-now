import React, {useEffect} from 'react';
import s from './App.module.css';
import ButtonAppBar from "../common/components/app-bar/Appbar";
import LinearProgress from "@mui/material/LinearProgress";
import {initializeAppTC} from "app/app-slice";
import {ErrorSnackbar} from "common/components/snackbar/ErrorSnackbar";
import {TodolistsList} from "features/todolists/todolists/TodolistsList";
import {Route, Routes} from "react-router-dom";
import {Login} from "features/auth/Login";
import {CircularProgress} from "@mui/material";
import {useAppSelector} from "app/hooks/use-AppSelector";
import {useAppDispatch} from "app/hooks/use-AppDispatch";
import {isInitializedSelector, statusSelector} from "app/app-selectors";


const App = () => {
    const dispatch = useAppDispatch()
    const appStatus = useAppSelector(statusSelector)
    const isInitialized = useAppSelector(isInitializedSelector)

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
