import React, {useEffect} from 'react';
import s from './App.module.css';
import {
    fetchTodolistsTC,
} from "../redux/reducers/todolist-reducer";
import ButtonAppBar from "./app-bar/Appbar";
import {useAppDispatch, useAppSelector} from "../redux/store";
import LinearProgress from "@mui/material/LinearProgress";
import {AppStatus} from "../redux/reducers/app-reducer";
import {ErrorSnackbar} from "../components/snackbar/ErrorSnackbar";
import {TodolistsList} from "../components/todolist/TodolistsList";
import {Route, Routes} from "react-router-dom";
import {Login} from "../components/Login";


const App = () => {
    const dispatch = useAppDispatch()
    const appStatus = useAppSelector<AppStatus>(state => state.app.status)

    useEffect( ()=>{
        dispatch(fetchTodolistsTC())
    }, [dispatch] )




    return (
        <>
            <ButtonAppBar/>
            <div className={s.progress_container}>
                {appStatus === 'loading' && <LinearProgress color="secondary" />}
            </div>
            <div className={s.app}>

                <Routes>
                    <Route path={'/'} element={<TodolistsList />} />
                    <Route path={'/login'} element={<Login />} />
                </Routes>
                <ErrorSnackbar />
            </div>
        </>

    );
}
export default App;
