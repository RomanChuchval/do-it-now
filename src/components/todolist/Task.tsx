import React, {ChangeEvent, useCallback} from 'react';
import s from "./TodoList.module.css";
import {SuperButton} from "../super-button/SuperButton";
import {EditableSpan} from "../editable-span/EditableSpan";
import Checkbox from "@mui/material/Checkbox";
import {useDispatch} from "react-redux";
import {changeTaskStatusAC, changeTaskTitleAC, removeTaskAC} from "../../redux/reducers/todoListsDataReducer";
import {TaskStatuses, TaskType} from "../../api/todolist-api";

type TaskPropsType = {
    todoListId: string
    task: TaskType
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
                <EditableSpan title={task.title} callback={changeTaskTitleHandler}/>
                <Checkbox color="primary" onChange={changeTaskStatusHandler} checked={task.status === TaskStatuses.Completed}/>
            </li>
        </>
    );
});

export default Task;