import React, {memo, useCallback} from 'react';
import s from "app/App.module.css";
import {TodoList} from "features/todolists/TodoList";
import {InputBlock} from "common/components/input-block/InputBlock";
import {useTodolistsList} from "features/todolists/hooks/useTodolistsList";

export const TodolistsList = memo(() => {
    const {todoLists, addNewTodoList} = useTodolistsList()

    const addNewTodoListHandler = useCallback((title: string) => {
       addNewTodoList(title)
    }, [addNewTodoList])

    const mappedTodoList =  todoLists.map(tl => {
        return (
            <TodoList
                key={tl.id}
                todolistId={tl.id}
                todolistStatus={tl.todolistStatus}
                title={tl.title}
                filter={tl.filter}
            />
        )
    })
    return (
        <>
            <div className={s.add_todoList_block}>
                <InputBlock callback={addNewTodoListHandler}/>
            </div>
            <div className={s.todoLists_wrapper}>
                {mappedTodoList}
            </div>
        </>
    );
});

