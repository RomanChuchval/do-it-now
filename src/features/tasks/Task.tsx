import React, {ChangeEvent, useCallback} from 'react';
import s from "features/todolists/TodoList.module.css";
import {SuperButton} from "common/components/super-button/SuperButton";
import {EditableSpan} from "common/components/editable-span/EditableSpan";
import Checkbox from "@mui/material/Checkbox";
import {tasksThunks} from "features/tasks/tasks-slice";
import {TaskStatuses, TaskType} from "api/todolist-api";
import {AppStatus} from "app/app-slice";
import {useAppDispatch} from "app/hooks/use-AppDispatch";

type TaskPropsType = {
    todolistId: string
    task: TaskType
    todolistStatus: AppStatus
}

const Task: React.FC<TaskPropsType> = React.memo( (
    {
        todolistId,
        task,
        todolistStatus
    }
) => {

    const dispatch = useAppDispatch()

    const removeTaskHandler = useCallback (() => {
        dispatch(tasksThunks.removeTask({taskId: task.id, todolistId}))
    }, [dispatch, todolistId, task.id])

    const changeTaskStatusHandler = useCallback ((e: ChangeEvent<HTMLInputElement>) => {
        const taskStatus = e.currentTarget.checked ? TaskStatuses.Completed : TaskStatuses.inProgress
        dispatch(tasksThunks.updateTask({taskId: task.id, todolistId, updatedTaskField: {status: taskStatus}}))
    }, [dispatch, todolistId, task.id])

    const changeTaskTitleHandler = useCallback ((title: string) => {
        dispatch(tasksThunks.updateTask({taskId: task.id, todolistId, updatedTaskField: {title}}))
    } , [dispatch, todolistId, task.id ])

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