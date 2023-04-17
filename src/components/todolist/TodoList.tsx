import React, {useCallback, useEffect} from 'react';
import s from './TodoList.module.css'
import {SuperButton} from "../super-button/SuperButton";
import {InputBlock} from "../input-block/InputBlock";
import {EditableSpan} from "../editable-span/EditableSpan";
import Task from "./Task";
import {useAppDispatch, useAppSelector} from "../../redux/store";
import {
    changeFilterAC,
    changeTodoListTitleAC, changeTodolistTitleTC,
    FilterValuesType,
    removeTodolistTC
} from "../../redux/reducers/todoListsReducer";
import {addNewTaskTC, fetchTasksTC} from "../../redux/reducers/todoListsDataReducer";
import {TaskStatuses, TaskType} from "../../api/todolist-api";

export type TodoListPropsType = {
    todoListId: string
    title: string
    filter: FilterValuesType
}

export const TodoList: React.FC<TodoListPropsType> = React.memo((
    {
        todoListId,
        title,
        filter,
    }
) => {

    const tasks = useAppSelector<TaskType[]>(state => state.tasks[todoListId])
    const dispatch = useAppDispatch()

    useEffect( ()=>{
        dispatch(fetchTasksTC(todoListId))
    }, [] )

    // filter tasks for map

    const filteredTodoList = () => {
        return filter === 'completed' ? tasks.filter(el => el.status === TaskStatuses.Completed)
            : filter === 'active' ? tasks.filter(el => el.status === TaskStatuses.New)
                : tasks
    }

    let tasksList = filteredTodoList().map(task => {
        return <Task key={task.id}
                     todoListId={todoListId}
                     task={task}
        />
    })

    const changeFilterAllHandler = useCallback(() => {
        dispatch(changeFilterAC(todoListId, 'all'))
    }, [dispatch, todoListId])

    const changeFilterActiveHandler = useCallback(() => {
        dispatch(changeFilterAC(todoListId, 'active'))
    }, [dispatch, todoListId])

    const changeFilterCompletedHandler = useCallback(() => {
        dispatch(changeFilterAC(todoListId, 'completed'))
    }, [dispatch, todoListId])

    const removeTodoListHandler = useCallback(() => {
        dispatch(removeTodolistTC(todoListId))
    }, [dispatch, todoListId])

    const addTaskHandler = useCallback((title: string) => {
        dispatch(addNewTaskTC(todoListId, title))
    }, [dispatch, todoListId])

    const changeTodoListTitleHandler = useCallback((newTitle: string) => {
        dispatch(changeTodolistTitleTC(todoListId, newTitle))
    }, [dispatch, todoListId])


    return (
        <>
            <div className={s.todolist_wrapper}>
                <div>
                    <div className={s.todolist_header_wrapper}>
                        <EditableSpan callback={changeTodoListTitleHandler} title={title}/>
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
});

