import React, {ChangeEvent} from 'react';
import {FilterValuesType, TodoListType} from "./App";
import s from './TodoList.module.css'
import {SuperButton} from "./SuperButton";
import {InputBlock} from "./InputBlock";
import {EditableSpan} from "./EditableSpan";
import Checkbox from '@mui/material/Checkbox';

export type TodoListPropsType = {
    todoListId: string
    title: string
    filter: FilterValuesType
    todoData: TodoListType[]
    changeFilter: (todoListID: string, filter: FilterValuesType) => void
    removeTodoList: (todoListID: string) => void
    removeTask: (todoListID: string, taskID: string) => void
    changeTaskStatus: (todoListID: string, taskID: string, newStatus: boolean) => void
    addNewTask: (todoListID: string, title: string) => void
    changeTodoListTitle: (todoListId: string, newTitle: string) => void
    changeTaskTitle: (todoListId: string, taskId: string, newTitle: string) => void
}

export const TodoList: React.FC<TodoListPropsType> = (
    {
        todoListId,
        title,
        filter,
        todoData,
        changeFilter,
        removeTodoList,
        removeTask,
        changeTaskStatus,
        addNewTask,
        changeTodoListTitle,
        changeTaskTitle
    }
) => {
    const onChangeTaskTitle = (taskId:string, newTitle: string) => {
        changeTaskTitle(todoListId, taskId, newTitle)
    }

    let tasksList = todoData.map(task => {
        const removeTaskHandler = () => {
            removeTask(todoListId, task.id)
        }
        const changeTaskStatusHandler = (e: ChangeEvent<HTMLInputElement>) => {
            changeTaskStatus(todoListId, task.id, e.currentTarget.checked)
        }

       const changeTaskTitleHandler = (newTitle: string) => {
           onChangeTaskTitle(task.id, newTitle)
       }

        return (
            <li key={task.id}>
                <SuperButton name={'x'} btnType={'trash'} callback={removeTaskHandler}/>
                <EditableSpan title={task.taskName} callback={changeTaskTitleHandler} />
                <Checkbox color="primary" onChange={changeTaskStatusHandler} checked={task.isDone} />
            </li>
        )
    })
    const changeFilterAllHandler = () => {
        changeFilter(todoListId, 'all')
    }
    const changeFilterActiveHandler = () => {
        changeFilter(todoListId, 'active')
    }
    const changeFilterCompletedHandler = () => {
        changeFilter(todoListId, 'completed')
    }
    const removeTodoListHandler = () => {
        removeTodoList(todoListId)
    }
    const addTaskHandler = (title: string) => {
        addNewTask(todoListId, title)
    }

    const changeTodoListTitleHandler = (title: string) => {
        changeTodoListTitle(todoListId, title)
    }
    return (
        <>
            <div className={s.todolist_wrapper}>
                <div>
                    <div className={s.todolist_header_wrapper}>
                        <EditableSpan callback={changeTodoListTitleHandler} title={title} />
                        <SuperButton name={'Remove'} btnType={'delete'} callback={removeTodoListHandler}/>
                    </div>
                </div>
                <div>
                    <InputBlock callback={addTaskHandler}/>
                </div>
                <div className={s.task_list_wrapper}>
                    <ul className={s.tasks_list}>
                        {tasksList.length > 0 ? tasksList : 'Tasks list is empty'}
                    </ul>
                </div>
                <div className={s.filter_button_wrapper}>
                    <SuperButton filter={filter} value={'all'}
                                 name={'All'} callback={changeFilterAllHandler}/>
                    <SuperButton filter={filter} value={'active'}
                                 name={'Active'} callback={changeFilterActiveHandler}/>
                    <SuperButton filter={filter} value={'completed'}
                                 name={'Completed'} callback={changeFilterCompletedHandler}/>
                </div>
            </div>
        </>
    );
};


