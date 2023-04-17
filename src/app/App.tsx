import React, {useCallback, useEffect} from 'react';
import s from './App.module.css';
import {TodoList} from "../components/todolist/TodoList";
import {v1} from "uuid";
import {InputBlock} from "../components/input-block/InputBlock";
import {
    addNewTodoListAC,
    createTodolistTC,
    fetchTodolistsTC,
    TodolistDomainType
} from "../redux/reducers/todoListsReducer";
import ButtonAppBar from "./app-bar/Appbar";
import {useAppDispatch, useAppSelector} from "../redux/store";


const App = () => {
    const dispatch = useAppDispatch()
    const todoLists = useAppSelector<Array<TodolistDomainType>>(state => state.todoLists)

    useEffect( ()=>{
        dispatch(fetchTodolistsTC())
    }, [] )

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
            <div className={s.app}>
                <div className={s.add_todoList_block}>
                    <InputBlock callback={addNewTodoList}/>
                </div>
                <div className={s.todoLists_wrapper}>
                    {mappedTodoList}
                </div>
            </div>
        </>

    );
}

export default App;
