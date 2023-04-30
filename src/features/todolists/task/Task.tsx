import React, {ChangeEvent, useCallback} from 'react';
import s from "features/todolists/todolist/TodoList.module.css";
import {SuperButton} from "common/components/super-button/SuperButton";
import {EditableSpan} from "common/components/editable-span/EditableSpan";
import Checkbox from "@mui/material/Checkbox";
import {removeTaskTC, updateTaskTC} from "features/todolists/task/tasks-reducer";
import {TaskStatuses, TaskType} from "api/todolist-api";
import {useAppDispatch} from "app/store";
import {AppStatus} from "app/app-reducer";

type TaskPropsType = {
    todoListId: string
    task: TaskType
    todolistStatus: AppStatus
}

const Task: React.FC<TaskPropsType> = React.memo( (
    {
        todoListId,
        task,
        todolistStatus
    }
) => {

    const dispatch = useAppDispatch()

    const removeTaskHandler = useCallback (() => {
        dispatch(removeTaskTC(todoListId, task.id))
    }, [dispatch, todoListId, task.id])

    const changeTaskStatusHandler = useCallback ((e: ChangeEvent<HTMLInputElement>) => {
        const taskStatus = e.currentTarget.checked ? TaskStatuses.Completed : TaskStatuses.inProgress
        dispatch(updateTaskTC({status: taskStatus}, task.id, todoListId))
    }, [dispatch, todoListId, task.id])

    const changeTaskTitleHandler = useCallback ((newTitle: string) => {
        dispatch(updateTaskTC({title: newTitle}, task.id, todoListId))
    } , [dispatch, todoListId, task.id ])

    return (
        <>
            <li className={s.task_list_item}>
                <SuperButton name={'x'} btnType={'trash'} callback={removeTaskHandler}/>
                <EditableSpan title={task.title} callback={changeTaskTitleHandler}/>
                <Checkbox color="primary" onChange={changeTaskStatusHandler}
                          checked={task.status === TaskStatuses.Completed}
                          disabled={todolistStatus === 'loading'}
                />
            </li>
        </>
    );
});

export default Task;