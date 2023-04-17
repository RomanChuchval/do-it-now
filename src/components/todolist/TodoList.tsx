import React, {useCallback} from 'react';
import s from './TodoList.module.css'
import {SuperButton} from "../super-button/SuperButton";
import {InputBlock} from "../input-block/InputBlock";
import {EditableSpan} from "../editable-span/EditableSpan";
import {FilterValuesType, TodoListType} from "../../app/AppWithRedux";
import Task from "./Task";
import {useDispatch, useSelector} from "react-redux";
import {RootStateType} from "../../redux/store";
import {changeFilterAC, changeTodoListTitleAC, removeTodoListAC} from "../../redux/reducers/todoListsReducer";
import {addNewTaskAC} from "../../redux/reducers/todoListsDataReducer";

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

    const tasks = useSelector<RootStateType, TodoListType[]>(state => state.tasks[todoListId])
    const dispatch = useDispatch()

    // filter tasks for map
    // let filteredTasks = tasks
    // if (filter === 'completed') filteredTasks = tasks.filter(el => el.isDone)
    // else if (filter === 'active') filteredTasks = tasks.filter(el => !el.isDone)

    const filteredTodoList = () => {
        console.log('filtering')
        return filter === 'completed' ? tasks.filter(el => el.isDone)
            : filter === 'active' ? tasks.filter(el => !el.isDone)
                : tasks
    }

    // const todoData: TodoListType[] = filteredTodoList()

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
        dispatch(removeTodoListAC(todoListId))
    }, [dispatch, todoListId])

    const addTaskHandler = useCallback((title: string) => {
        dispatch(addNewTaskAC(todoListId, title))
    }, [dispatch, todoListId])

    const changeTodoListTitleHandler = useCallback((title: string) => {
        dispatch(changeTodoListTitleAC(todoListId, title))
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


