import React, {memo, useCallback, useEffect} from 'react';
import s from "../../app/App.module.css";
import {TodoList} from "./TodoList";
import {useAppDispatch, useAppSelector} from "../../redux/store";
import {createTodolistTC, fetchTodolistsTC, TodolistDomainType} from "../../redux/reducers/todolist-reducer";
import {InputBlock} from "../input-block/InputBlock";
import {Navigate} from "react-router-dom";

export const TodolistsList = memo(() => {

    const dispatch = useAppDispatch()
    const todoLists = useAppSelector<Array<TodolistDomainType>>(state => state.todoLists)
    const isLoggedIn = useAppSelector<boolean>(state => state.auth.isLoggedIn)

    useEffect( ()=>{
        dispatch(fetchTodolistsTC())
    }, [dispatch] )

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

