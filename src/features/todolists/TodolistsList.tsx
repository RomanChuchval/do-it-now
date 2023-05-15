import React, {memo, useCallback, useEffect} from 'react';
import s from "app/App.module.css";
import {TodoList} from "features/todolists/TodoList";
import {InputBlock} from "common/components/input-block/InputBlock";
import {Navigate} from "react-router-dom";
import {useAppDispatch} from "app/hooks/use-AppDispatch";
import {useAppSelector} from "app/hooks/use-AppSelector";
import {todolistsSelector} from "features/todolists/todolist-selectors";
import {isLoggedInSelector} from "features/auth/auth-selectors";
import {todolistsThunks} from "features/todolists/todolists-slice";

export const TodolistsList = memo(() => {

    const dispatch = useAppDispatch()
    const todoLists = useAppSelector(todolistsSelector)
    const isLoggedIn = useAppSelector(isLoggedInSelector)

    useEffect( ()=>{
        if(isLoggedIn) {
            dispatch(todolistsThunks.fetchTodolists())
        }
    }, [dispatch, isLoggedIn] )

    const mappedTodoList =  todoLists.map(tl => {
        return (
            <TodoList
                key={tl.id}
                todoListId={tl.id}
                todolistStatus={tl.todolistStatus}
                title={tl.title}
                filter={tl.filter}
            />
        )
    })

    const addNewTodoList = useCallback((title: string) => {
        dispatch(todolistsThunks.createTodolist({title}))
    }, [dispatch])

    if(!isLoggedIn) {
        return <Navigate to={'/login'} />
    }
    return (
        <>
            <div className={s.add_todoList_block}>
                <InputBlock callback={addNewTodoList}/>
            </div>
            <div className={s.todoLists_wrapper}>
                {mappedTodoList}
            </div>
        </>
    );
});

