import React, {memo, useCallback, useEffect} from 'react';
import s from "app/App.module.css";
import {TodoList} from "features/todolists/todolists/TodoList";
import {createTodolistTC, fetchTodolistsTC, TodolistDomainType} from "features/todolists/todolists/todolist-slice";
import {InputBlock} from "common/components/input-block/InputBlock";
import {Navigate} from "react-router-dom";
import {useAppDispatch} from "app/hooks/use-AppDispatch";
import {useAppSelector} from "app/hooks/use-AppSelector";

export const TodolistsList = memo(() => {

    const dispatch = useAppDispatch()
    const todoLists = useAppSelector<Array<TodolistDomainType>>(state => state.todoLists)
    const isLoggedIn = useAppSelector<boolean>(state => state.auth.isLoggedIn)

    useEffect( ()=>{
        if(isLoggedIn) {
            dispatch(fetchTodolistsTC())
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
        dispatch(createTodolistTC(title))
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

