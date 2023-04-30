import {todolistActions} from "features/todolists/todolists/todolist-slice";
import {StatusCodes, TaskModelType, TaskStatuses, TaskType, todolistAPI} from "api/todolist-api";
import {Dispatch} from "redux";
import {AppRootStateType} from "app/store";
import {appErrorNetworkHandler, appErrorServerHandler} from "common/utils/app-error-handlers";
import {appActions} from "app/app-slice";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

//Reducer
const initialState: TodoListDataType = {}

const slice = createSlice({
    name: 'tasks',
    initialState: initialState,
    reducers: {
        updateTask: (state, action: PayloadAction<{ todolistId: string, taskId: string, updatedTask: TaskType }>) => {
            const taskIndex = state[action.payload.todolistId].findIndex(t => t.id === action.payload.taskId)
            if (taskIndex !== -1)
                state[action.payload.todolistId][taskIndex] = action.payload.updatedTask
        },
        setTasks: (state, action: PayloadAction<{ tasksData: TaskType[], todolistId: string }>) => {
            state[action.payload.todolistId] = action.payload.tasksData
        },
        removeTask: (state, action: PayloadAction<{ todolistId: string, taskId: string }>) => {
            const taskIndex = state[action.payload.todolistId].findIndex(t => t.id === action.payload.taskId)
            if (taskIndex !== -1)
                state[action.payload.todolistId].splice(taskIndex, 1)
        },
        addNewTask: (state, action: PayloadAction<{ todolistId: string, newTaskData: TaskType }>) => {
            state[action.payload.todolistId].push(action.payload.newTaskData)
        },
        cleanStateAfterLogout: () => initialState
    },
    extraReducers: builder => {
        builder
            .addCase(todolistActions.setTodolists, (state, action) => {
                action.payload.todolists.forEach(tl => state[tl.id] = [])
            })
            .addCase(todolistActions.removeTodoList, (state, action) => {
                delete state[action.payload.todolistId]
            })
            .addCase(todolistActions.addNewTodoList, (state, action) => {
                state[action.payload.newTodolist.id] = []
            })
    }
})

export const tasksActions = slice.actions
export const tasksSlice = slice.reducer

// Thunks
export const addNewTaskTC = (todolistId: string, title: string) => async (dispatch: Dispatch) => {
    try {
        dispatch(appActions.setStatus({status: 'loading'}))
        const response = await todolistAPI.createTask(todolistId, title)
        if (response.data.resultCode === StatusCodes.Ok) {
            dispatch(tasksActions.addNewTask({todolistId, newTaskData: response.data.data.item}))
            dispatch(appActions.setStatus({status: 'success'}))
        } else {
            if (response.data.resultCode === StatusCodes.Error) {
                appErrorServerHandler(response.data, dispatch)
            }
        }
    } catch (e) {
        appErrorNetworkHandler(e, dispatch)
    }
}
export const removeTaskTC = (todolistId: string, taskId: string) => async (dispatch: Dispatch) => {
    try {
        dispatch(appActions.setStatus({status: 'loading'}))
        dispatch(todolistActions.setTodolistStatus({status: 'loading', todolistId}))
        const response = await todolistAPI.removeTask(todolistId, taskId)
        if (response.data.resultCode === StatusCodes.Ok) {
            dispatch(tasksActions.removeTask({todolistId, taskId}))
            dispatch(appActions.setStatus({status: 'success'}))
        } else {
            if (response.data.resultCode === StatusCodes.Error) {
                appErrorServerHandler(response.data, dispatch)
            }
        }
    } catch (e) {
        appErrorNetworkHandler(e, dispatch)
    } finally {
        dispatch(todolistActions.setTodolistStatus({status: 'success', todolistId}))
    }
}
export const fetchTasksTC = (todolistId: string) => async (dispatch: Dispatch) => {
    dispatch(appActions.setStatus({status: 'loading'}))
    try {
        const response = await todolistAPI.getTasks(todolistId)
        if (response.status === 200) {
            dispatch(tasksActions.setTasks({tasksData: response.data.items, todolistId}))
            dispatch(appActions.setStatus({status: 'success'}))
        }
    } catch (e) {
        appErrorNetworkHandler(e, dispatch)
    }

}
export const updateTaskTC = (updatedTaskField: UpdatedTaskFieldType, taskId: string, todolistId: string) =>
    async (dispatch: Dispatch, getState: () => AppRootStateType) => {
        const findProcessedTask = getState().tasks[todolistId].find(task => task.id === taskId)
        if (!findProcessedTask) {
            console.warn('Task not found!')
            return
        }
        const updatedTask: TaskModelType = {
            title: findProcessedTask.title,
            description: findProcessedTask.description,
            completed: findProcessedTask.completed,
            status: findProcessedTask.status,
            priority: findProcessedTask.priority,
            startDate: findProcessedTask.startDate,
            deadline: findProcessedTask.deadline,
            ...updatedTaskField,
        }
        try {
            dispatch(appActions.setStatus({status: 'loading'}))
            dispatch(todolistActions.setTodolistStatus({status: 'loading', todolistId: todolistId}))
            const response = await todolistAPI.updateTask(updatedTask, todolistId, taskId)
            if (response.data.resultCode === StatusCodes.Ok) {
                dispatch(tasksActions.updateTask({todolistId, taskId, updatedTask: response.data.data.item}))
                dispatch(appActions.setStatus({status: 'success'}))
            } else {
                if (response.data.resultCode === StatusCodes.Error) {
                    appErrorServerHandler(response.data, dispatch)
                }
            }
        } catch (e) {
            appErrorNetworkHandler(e, dispatch)
        } finally {
            dispatch(todolistActions.setTodolistStatus({status: 'success', todolistId: todolistId}))
        }
    }

//Types
export type TodoListDataType = {
    [key: string]: TaskType[]
}
type UpdatedTaskFieldType = {
    title?: string
    description?: string
    completed?: boolean
    status?: TaskStatuses
    priority?: number
    startDate?: string
    deadline?: string
}