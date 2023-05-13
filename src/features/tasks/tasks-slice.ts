import {todolistsThunks} from "features/todolists/todolists-slice";
import {
    StatusCodes,
    TaskModelType,
    TaskStatuses,
    TaskType,
    todolistAPI, CommonRequestData,
    RemoveTaskRequest, FetchTasksRequest
} from "api/todolist-api";
import {appErrorNetworkHandler, appErrorServerHandler} from "common/utils/app-error-handlers";
import {appActions} from "app/app-slice";
import {createSlice} from "@reduxjs/toolkit";
import {createAppAsyncThunk} from "common/utils/createAppAsyncThunk";

//Reducer
const initialState: TodoListDataType = {}

const slice = createSlice({
    name: 'tasks',
    initialState: initialState,
    reducers: {
        cleanStateAfterLogout: () => initialState
    },
    extraReducers: builder => {
        builder
            .addCase(todolistsThunks.removeTodolist.fulfilled, (state, action) => {
                delete state[action.payload.todoListId]
            })
            .addCase(todolistsThunks.createTodolist.fulfilled, (state, action) => {
                state[action.payload.newTodolist.id] = []
            })
            .addCase(todolistsThunks.fetchTodolists.fulfilled, (state, action) => {
                action.payload.todolists.forEach(tl => state[tl.id] = [])
            })
            .addCase(createTask.fulfilled, (state, action) => {
                state[action.payload.todolistId].push(action.payload.newTaskData)
            })
            .addCase(removeTask.fulfilled, (state, action) => {
                const taskIndex = state[action.payload.todolistId].findIndex(t => t.id === action.payload.taskId)
                if (taskIndex !== -1)
                    state[action.payload.todolistId].splice(taskIndex, 1)
            })
            .addCase(fetchTasks.fulfilled, (state, action) => {
                state[action.payload.todolistId] = action.payload.tasksData
            })
            .addCase(updateTask.fulfilled, (state, action) => {
                const taskIndex = state[action.payload.todolistId].findIndex(t => t.id === action.payload.taskId)
                if (taskIndex !== -1)
                    state[action.payload.todolistId][taskIndex] = action.payload.updatedTask
        })
    }
})

const createTask = createAppAsyncThunk<{ todolistId: string, newTaskData: TaskType }, CommonRequestData>(
    'tasks/create',
    async (data, {rejectWithValue, dispatch}) => {
        try {
            dispatch(appActions.setStatus({status: 'loading'}))
            const res = await todolistAPI.createTask({title: data.title, todoListId: data.todoListId})
            if (res.data.resultCode === StatusCodes.Ok) {
                return {todolistId: data.todoListId, newTaskData: res.data.data.item}
            } else {
                appErrorServerHandler(res.data, dispatch)
                return rejectWithValue(null)
            }
        } catch (e) {
            appErrorNetworkHandler(e, dispatch)
            return rejectWithValue(null)
        }
    })
const removeTask = createAppAsyncThunk<{ todolistId: string, taskId: string }, RemoveTaskRequest>(
    'tasks/remove',
    async (data, {rejectWithValue, dispatch}) => {
        try {
            const response = await todolistAPI.removeTask({taskId: data.taskId, todolistId: data.todolistId})
            if (response.data.resultCode === StatusCodes.Ok) {
                return {todolistId: data.todolistId, taskId: data.taskId}
            } else {
                appErrorServerHandler(response.data, dispatch)
                return rejectWithValue(null)
            }
        } catch (e) {
            appErrorNetworkHandler(e, dispatch)
            return rejectWithValue(null)
        }
    })
const fetchTasks = createAppAsyncThunk<{ tasksData: TaskType[], todolistId: string }, FetchTasksRequest>(
    'tasks/fetch',
    async (data, {rejectWithValue, dispatch}) => {
        dispatch(appActions.setStatus({status: 'loading'}))
        try {
            const res = await todolistAPI.fetchTasks({todoListId: data.todoListId})
            dispatch(appActions.setStatus({status: 'success'}))
            return {tasksData: res.data.items, todolistId: data.todoListId}
        } catch (e) {
            appErrorNetworkHandler(e, dispatch)
            return rejectWithValue(null)
        }
    })
const updateTask = createAppAsyncThunk<{ todolistId: string, taskId: string, updatedTask: TaskType },
    { todolistId: string, taskId: string, updatedTaskField: UpdatedTaskFieldType }>(
    'tasks/update',
    async (data, {rejectWithValue, dispatch, getState}) => {
        const findProcessedTask = getState().tasks[data.todolistId].find(task => task.id === data.taskId)
        if (!findProcessedTask) {
            return rejectWithValue(null)
        }
        const updatedTask: TaskModelType = {
            title: findProcessedTask.title,
            description: findProcessedTask.description,
            completed: findProcessedTask.completed,
            status: findProcessedTask.status,
            priority: findProcessedTask.priority,
            startDate: findProcessedTask.startDate,
            deadline: findProcessedTask.deadline,
            ...data.updatedTaskField,
        }
        try {
            const res = await todolistAPI
                .updateTask({updatedTaskModel: updatedTask, taskId: data.taskId, todolistId: data.todolistId})
            if (res.data.resultCode === StatusCodes.Ok) {
                return {updatedTask: res.data.data.item, taskId: data.taskId, todolistId: data.todolistId}
            } else {
                appErrorServerHandler(res.data, dispatch)
                return rejectWithValue(null)
            }
        } catch (e) {
            appErrorNetworkHandler(e, dispatch)
            return rejectWithValue(null)
        }
    }
)

export const tasksActions = slice.actions
export const tasksSlice = slice.reducer
export const tasksThunks = {createTask, removeTask, fetchTasks, updateTask}

// Thunks
// export const addNewTaskTC = (todolistId: string, title: string) => async (dispatch: Dispatch) => {
//     try {
//         dispatch(appActions.setStatus({status: 'loading'}))
//         const response = await todolistAPI.createTask(todolistId, title)
//         if (response.data.resultCode === StatusCodes.Ok) {
//             dispatch(tasksActions.addNewTask({todolistId, newTaskData: response.data.data.item}))
//             dispatch(appActions.setStatus({status: 'success'}))
//         } else {
//             if (response.data.resultCode === StatusCodes.Error) {
//                 appErrorServerHandler(response.data, dispatch)
//             }
//         }
//     } catch (e) {
//         appErrorNetworkHandler(e, dispatch)
//     }
// }
// export const removeTaskTC = (todolistId: string, taskId: string) => async (dispatch: Dispatch) => {
//     try {
//         dispatch(appActions.setStatus({status: 'loading'}))
//         dispatch(todolistsActions.setTodolistStatus({status: 'loading', todolistId}))
//         const response = await todolistAPI.removeTask(todolistId, taskId)
//         if (response.data.resultCode === StatusCodes.Ok) {
//             dispatch(tasksActions.removeTask({todolistId, taskId}))
//             dispatch(appActions.setStatus({status: 'success'}))
//         } else {
//             if (response.data.resultCode === StatusCodes.Error) {
//                 appErrorServerHandler(response.data, dispatch)
//             }
//         }
//     } catch (e) {
//         appErrorNetworkHandler(e, dispatch)
//     } finally {
//         dispatch(todolistsActions.setTodolistStatus({status: 'success', todolistId}))
//     }
// }
// export const fetchTasksTC = (todolistId: string) => async (dispatch: Dispatch) => {
//     dispatch(appActions.setStatus({status: 'loading'}))
//     try {
//         const response = await todolistAPI.getTasks(todolistId)
//         if (response.status === 200) {
//             dispatch(tasksActions.setTasks({tasksData: response.data.items, todolistId}))
//             dispatch(appActions.setStatus({status: 'success'}))
//         }
//     } catch (e) {
//         appErrorNetworkHandler(e, dispatch)
//     }
// }
// export const updateTaskTC = (updatedTaskField: UpdatedTaskFieldType, taskId: string, todolistId: string) =>
//     async (dispatch: Dispatch, getState: () => AppRootStateType) => {
//         const findProcessedTask = getState().tasks[todolistId].find(task => task.id === taskId)
//         if (!findProcessedTask) {
//             console.warn('Task not found!')
//             return
//         }
//         const updatedTask: TaskModelType = {
//             title: findProcessedTask.title,
//             description: findProcessedTask.description,
//             completed: findProcessedTask.completed,
//             status: findProcessedTask.status,
//             priority: findProcessedTask.priority,
//             startDate: findProcessedTask.startDate,
//             deadline: findProcessedTask.deadline,
//             ...updatedTaskField,
//         }
//         try {
//             dispatch(appActions.setStatus({status: 'loading'}))
//             dispatch(todolistsActions.setTodolistStatus({status: 'loading', todolistId: todolistId}))
//             const response = await todolistAPI.updateTask(updatedTask, todolistId, taskId)
//             if (response.data.resultCode === StatusCodes.Ok) {
//                 dispatch(tasksActions.updateTask({todolistId, taskId, updatedTask: response.data.data.item}))
//                 dispatch(appActions.setStatus({status: 'success'}))
//             } else {
//                 if (response.data.resultCode === StatusCodes.Error) {
//                     appErrorServerHandler(response.data, dispatch)
//                 }
//             }
//         } catch (e) {
//             appErrorNetworkHandler(e, dispatch)
//         } finally {
//             dispatch(todolistsActions.setTodolistStatus({status: 'success', todolistId: todolistId}))
//         }
//     }

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