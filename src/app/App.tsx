import React, {useCallback, useEffect} from 'react';
import s from './App.module.css';
import {TodoList} from "../components/todolist/TodoList";
import {InputBlock} from "../components/input-block/InputBlock";
import {
    createTodolistTC,
    fetchTodolistsTC,
    TodolistDomainType
} from "../redux/reducers/todolist-reducer";
import ButtonAppBar from "./app-bar/Appbar";
import {useAppDispatch, useAppSelector} from "../redux/store";
import LinearProgress from "@mui/material/LinearProgress";
import {AppStatus} from "../redux/reducers/app-reducer";
import {ErrorSnackbar} from "../components/snackbar/ErrorSnackbar";


const App = () => {
    const dispatch = useAppDispatch()
    const todoLists = useAppSelector<Array<TodolistDomainType>>(state => state.todoLists)
    const appStatus = useAppSelector<AppStatus>(state => state.app.status)

    useEffect( ()=>{
        dispatch(fetchTodolistsTC())
    }, [dispatch] )

    const addNewTodoList = useCallback ((title: string) => {
        dispatch(createTodolistTC(title))
    } , [dispatch])

    const mappedTodoList = todoLists.map(tl => {
        return (
            <TodoList
                key={tl.id}
                todoListId={tl.id}
                title={tl.title}
                filter={tl.filter}
            />
        )
    })

    return (
        <>
            <ButtonAppBar/>
            {appStatus === 'loading' && <LinearProgress color="secondary" />}
            <div className={s.app}>
                <div className={s.add_todoList_block}>
                    <InputBlock callback={addNewTodoList}/>
                </div>
                <div className={s.todoLists_wrapper}>
                    {mappedTodoList}
                </div>
                <ErrorSnackbar />
            </div>
        </>

    );
}

export default App;
