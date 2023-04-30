import React, {useCallback} from 'react';
import s from 'features/todolists/todolist/TodoList.module.css'
import {SuperButton} from "common/components/super-button/SuperButton";
import {InputBlock} from 'common/components/input-block/InputBlock';
import {EditableSpan} from "common/components/editable-span/EditableSpan";
import Task from "features/todolists/task/Task";
import {useAppDispatch, useAppSelector} from "app/store";
import {
    changeFilterAC,
    changeTodolistTitleTC,
    FilterValuesType,
    removeTodolistTC
} from "features/todolists/todolist/todolist-reducer";
import {addNewTaskTC} from "features/todolists/task/tasks-reducer";
import {TaskStatuses, TaskType} from "api/todolist-api";
import {AppStatus} from "app/app-slice";

export type TodoListPropsType = {
    todoListId: string
    title: string
    filter: FilterValuesType
    todolistStatus: AppStatus
}

export const TodoList: React.FC<TodoListPropsType> = React.memo((
    {
        todoListId,
        title,
        filter,
        todolistStatus
    }
) => {

    const tasks = useAppSelector<TaskType[]>(state => state.tasks[todoListId])
    const dispatch = useAppDispatch()

    // filter tasks for map
    const filteredTodoList = () => {
        return filter === 'completed' ? tasks.filter(el => el.status === TaskStatuses.Completed)
            : filter === 'active' ? tasks.filter(el => el.status === TaskStatuses.inProgress)
                : tasks
    }

    let tasksList = filteredTodoList().map(task => {
        return <Task key={task.id}
                     todoListId={todoListId}
                     task={task}
                     todolistStatus={todolistStatus}
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
            <div className={`${s.todolist_wrapper} ${todolistStatus === 'loading' && s.todolist_disable}`}>
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


