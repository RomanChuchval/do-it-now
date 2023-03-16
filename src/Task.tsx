import React, {ChangeEvent, useCallback} from 'react';
import s from "./TodoList.module.css";
import {SuperButton} from "./SuperButton";
import {EditableSpan} from "./EditableSpan";
import Checkbox from "@mui/material/Checkbox";
import {TodoListType} from "./AppWithRedux";
import {useDispatch} from "react-redux";
import {changeTaskStatusAC, changeTaskTitleAC, removeTaskAC} from "./redux/reducers/todoListsDataReducer";


type TaskPropsType = {
    todoListId: string
    task: TodoListType
}

const Task: React.FC<TaskPropsType> = React.memo( (
    {
        todoListId,
        task
    }
) => {

    const dispatch = useDispatch()

    const removeTaskHandler = useCallback (() => {
        dispatch(removeTaskAC(todoListId, task.id))
    }, [dispatch, todoListId, task.id])

    const changeTaskStatusHandler = useCallback ((e: ChangeEvent<HTMLInputElement>) => {
        dispatch(changeTaskStatusAC(todoListId, task.id, e.currentTarget.checked))
    }, [dispatch, todoListId, task.id])

    const changeTaskTitleHandler = useCallback ((newTitle: string) => {
        dispatch(changeTaskTitleAC(todoListId, task.id, newTitle))
    } , [dispatch, todoListId, task.id ])

    return (
        <>
            <li className={s.task_list_item}>
                <SuperButton name={'x'} btnType={'trash'} callback={removeTaskHandler}/>
                <EditableSpan title={task.taskName} callback={changeTaskTitleHandler}/>
                <Checkbox color="primary" onChange={changeTaskStatusHandler} checked={task.isDone}/>
            </li>
        </>
    );
});

export default Task;