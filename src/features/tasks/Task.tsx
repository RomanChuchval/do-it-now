import React, {ChangeEvent, useCallback} from 'react';
import s from "features/todolists/TodoList.module.css";
import {SuperButton} from "common/components/super-button/SuperButton";
import {EditableSpan} from "common/components/editable-span/EditableSpan";
import Checkbox from "@mui/material/Checkbox";
import {TaskStatuses, TaskType} from "api/todolist-api";
import {AppStatus} from "app/app-slice";
import {useTasks} from "features/tasks/hooks/useTasks";

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

    const {removeTask, changeTaskStatus, changeTaskTitle} = useTasks(task, todolistId)

    const removeTaskHandler = useCallback (() => {
        removeTask()
    }, [removeTask])

    const changeTaskStatusHandler = useCallback ((e: ChangeEvent<HTMLInputElement>) => {
        changeTaskStatus(e)
    }, [changeTaskStatus])

    const changeTaskTitleHandler = useCallback ((title: string) => {
        changeTaskTitle(title)
    } , [changeTaskTitle])

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