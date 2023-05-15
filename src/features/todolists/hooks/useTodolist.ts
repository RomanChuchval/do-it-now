import {useAppSelector} from "app/hooks/use-AppSelector";
import {AppRootStateType} from "app/store";
import {tasksSelector} from "features/tasks/tasks-selector";
import {useAppDispatch} from "app/hooks/use-AppDispatch";
import {TaskStatuses} from "api/todolist-api";
import {FilterValuesType, todolistsActions, todolistsThunks} from "features/todolists/todolists-slice";
import {useCallback, useEffect} from "react";
import {tasksThunks} from "features/tasks/tasks-slice";

export const useTodolist = (todolistId: string, filter: FilterValuesType) => {
    const tasks = useAppSelector((state: AppRootStateType) => tasksSelector(state, todolistId))
    const dispatch = useAppDispatch()

    useEffect( () => {
        dispatch(tasksThunks.fetchTasks({todolistId}))
    }, [])

    const filteredTasks = () => {
        return filter === 'completed' ? tasks.filter(el => el.status === TaskStatuses.Completed)
            : filter === 'active' ? tasks.filter(el => el.status === TaskStatuses.New || el.status === TaskStatuses.inProgress)
                : tasks
    }
    const toggleFilterToAll = useCallback(() => {
        dispatch(todolistsActions.changeFilter({todolistId, filter: 'all'}))
    }, [dispatch, todolistId])

    const toggleFilterToActive = useCallback(() => {
        dispatch(todolistsActions.changeFilter({todolistId, filter: 'active'}))
    }, [dispatch, todolistId])

    const toggleFilterToCompleted = useCallback(() => {
        dispatch(todolistsActions.changeFilter({todolistId, filter: 'completed'}))
    }, [dispatch, todolistId])

    const removeTodolist = useCallback(() => {
        dispatch(todolistsThunks.removeTodolist({todolistId}))
    }, [dispatch, todolistId])

    const addTaskHandler = useCallback((title: string) => {
        dispatch(tasksThunks.createTask({todolistId, title}))
    }, [dispatch, todolistId])

    const changeTodoListTitleHandler = useCallback((title: string) => {
        dispatch(todolistsThunks.updateTodolistTitle({title, todolistId }))
    }, [dispatch, todolistId])

    const addTask = useCallback ((title: string) => {
        dispatch(tasksThunks.createTask({todolistId, title}))
    }, [dispatch, todolistId] )

    const changeTodolistTitle = useCallback ((title: string) => {
        dispatch(todolistsThunks.updateTodolistTitle({title, todolistId }))
    }, [dispatch, todolistId] )

    return {
        filteredTasks,
        toggleFilterToActive,
        toggleFilterToAll,
        toggleFilterToCompleted,
        removeTodolist,
        addTaskHandler,
        changeTodoListTitleHandler,
        addTask,
        changeTodolistTitle
    }
}