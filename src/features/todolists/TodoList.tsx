import React, {useCallback, useEffect} from 'react';
import s from 'features/todolists/TodoList.module.css'
import {SuperButton} from "common/components/super-button/SuperButton";
import {InputBlock} from 'common/components/input-block/InputBlock';
import {EditableSpan} from "common/components/editable-span/EditableSpan";
import Task from "features/tasks/Task";
import {
    FilterValuesType,
    todolistsActions, todolistsThunks
} from "features/todolists/todolists-slice";
import {tasksThunks} from "features/tasks/tasks-slice";
import {TaskStatuses} from "api/todolist-api";
import {AppStatus} from "app/app-slice";
import {useAppDispatch} from "app/hooks/use-AppDispatch";
import {useAppSelector} from "app/hooks/use-AppSelector";
import {tasksSelector} from "features/tasks/tasks-selector";
import {AppRootStateType} from "app/store";

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

    const tasks = useAppSelector((state: AppRootStateType) => tasksSelector(state, todoListId))
    const dispatch = useAppDispatch()

    useEffect( () => {
        dispatch(tasksThunks.fetchTasks({todoListId}))
    }, [])

    // filter tasks for map
    const filteredTasks = () => {
        return filter === 'completed' ? tasks.filter(el => el.status === TaskStatuses.Completed)
            : filter === 'active' ? tasks.filter(el => el.status === TaskStatuses.New || el.status === TaskStatuses.inProgress)
                : tasks
    }
    let tasksList = filteredTasks().map(task => {
        return <Task key={task.id}
                     todolistId={todoListId}
                     task={task}
                     todolistStatus={todolistStatus}
        />
    })

    const changeFilterAllHandler = useCallback(() => {
        dispatch(todolistsActions.changeFilter({todoListId, filter: 'all'}))
    }, [dispatch, todoListId])

    const changeFilterActiveHandler = useCallback(() => {
        dispatch(todolistsActions.changeFilter({todoListId, filter: 'active'}))
    }, [dispatch, todoListId])

    const changeFilterCompletedHandler = useCallback(() => {
        dispatch(todolistsActions.changeFilter({todoListId, filter: 'completed'}))
    }, [dispatch, todoListId])

    const removeTodoListHandler = useCallback(() => {
        dispatch(todolistsThunks.removeTodolist({todoListId}))
    }, [dispatch, todoListId])

    const addTaskHandler = useCallback((title: string) => {
        dispatch(tasksThunks.createTask({todoListId, title}))
    }, [dispatch, todoListId])

    const changeTodoListTitleHandler = useCallback((title: string) => {
        dispatch(todolistsThunks.updateTodolistTitle({title, todoListId }))
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


