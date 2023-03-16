import React, {useCallback} from 'react';
import s from './App.module.css';
import {TodoList} from "./TodoList";
import {v1} from "uuid";
import {InputBlock} from "./InputBlock";
import {addNewTodoListAC} from "./redux/reducers/todoListsReducer";
import ButtonAppBar from "./Appbar";
import {useDispatch, useSelector} from "react-redux";
import {RootStateType} from "./redux/store";

export type FilterValuesType = 'all' | 'active' | 'completed'
export type TodoListsType = {
    todoListId: string
    title: string
    filter: FilterValuesType
}
export type TodoListDataType = {
    [key: string]: TodoListType[]
}
export type TodoListType = {
    id: string
    taskName: string
    isDone: boolean
}

const AppWithRedux = () => {
    const dispatch = useDispatch()
    const todoLists = useSelector<RootStateType, Array<TodoListsType>>(state => state.todoLists)

    const addNewTodoList = useCallback ((title: string) => {
        const newTodolistId = v1()
        dispatch(addNewTodoListAC(title, newTodolistId))
    } , [dispatch])

    const mappedTodoList = todoLists.map(tl => {
        return (
            <TodoList
                key={tl.todoListId}
                todoListId={tl.todoListId}
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

export default AppWithRedux;
