import {
    ADD_NEW_TODO_LIST,
    AddNewTodoListACType,
    REMOVE_TODO_LIST,
    RemoveTodoListACType, SET_TODO_LISTS, SetTodoListsACType, setTodolistStatusAC,
} from "./todolist-reducer";
import {StatusCodes, TaskModelType, TaskStatuses, TaskType, todolistAPI} from "../../api/todolist-api";
import {Dispatch} from "redux";
import {AppRootStateType} from "../store";
import {setLoadingAC} from "./app-reducer";
import {appErrorNetworkHandler, appErrorServerHandler} from "../../utils/app-error-handlers";

const UPDATE_TASK = 'UPDATE_TASK'
const ADD_NEW_TASK = 'ADD-NEW-TASK'
const REMOVE_TASK = 'REMOVE-TASK'
const SET_TASKS = 'SET_TASKS'

//Reducer
const initialState: TodoListDataType = {}
export const tasksReducer = (state: TodoListDataType = initialState, action: TasksActionsType): TodoListDataType => {

    switch (action.type) {
        case SET_TODO_LISTS:
            const stateCopy = {...state}
            action.payload.data.forEach((tl) => stateCopy[tl.id] = [])
            return stateCopy
        case SET_TASKS:
            return {...state, [action.payload.todolistId]: action.payload.tasksData}
        case REMOVE_TASK:
            return {
                ...state, [action.payload.todoListID]:
                    state[action.payload.todoListID]
                        .filter(t => t.id !== action.payload.taskID)
            }
        case UPDATE_TASK:
            return {
                ...state, [action.payload.todoListID]: state[action.payload.todoListID].map((task) => (
                    task.id === action.payload.taskID ? action.payload.updatedTask : task
                ))
            }
        case ADD_NEW_TASK:
            return {
                ...state, [action.payload.todoListID]:
                    [action.payload.newTaskData, ...state[action.payload.todoListID]]
            }
        case REMOVE_TODO_LIST:
            delete (state[action.payload.todoListID])
            return state

        case ADD_NEW_TODO_LIST:
            return {...state, [action.payload.newTodolist.id]: []}
        default:
            return state
    }
}

//Action Creators
export const updateTaskAC = (todoListID: string, taskID: string, updatedTask: TaskType) => (
    {type: UPDATE_TASK, payload: {todoListID, taskID, updatedTask}}) as const
export const addNewTaskAC = (todoListID: string, newTaskData: TaskType) => (
    {type: ADD_NEW_TASK, payload: {todoListID, newTaskData}}) as const
export const setTasksAC = (tasksData: TaskType[], todolistId: string) => (
    {type: SET_TASKS, payload: {tasksData, todolistId}} as const)
export const removeTaskAC = (todoListID: string, taskID: string) => (
    {type: REMOVE_TASK, payload: {todoListID, taskID}}) as const

// Thunks
export const addNewTaskTC = (todolistId: string, title: string) => async (dispatch: Dispatch) => {
    try {
        dispatch(setLoadingAC('loading'))
        const response = await todolistAPI.createTask(todolistId, title)
        if (response.data.resultCode === StatusCodes.Ok) {
            dispatch(addNewTaskAC(todolistId, response.data.data.item))
            dispatch(setLoadingAC('success'))
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
        dispatch(setLoadingAC('loading'))
        dispatch(setTodolistStatusAC('loading',todolistId ))
        const response = await todolistAPI.removeTask(todolistId, taskId)
        if (response.data.resultCode === StatusCodes.Ok) {
            dispatch(removeTaskAC(todolistId, taskId))
            dispatch(setLoadingAC('success'))
        } else {
            if (response.data.resultCode === StatusCodes.Error) {
                appErrorServerHandler(response.data, dispatch)
            }
        }
    } catch (e) {
        appErrorNetworkHandler(e, dispatch)
    } finally {
        dispatch(setTodolistStatusAC('success',todolistId ))
    }
}
export const fetchTasksTC = (todolistId: string) => async (dispatch: Dispatch) => {
    try {
        dispatch(setLoadingAC('loading'))
        const response = await todolistAPI.getTasks(todolistId)
        if (response.status === 200) {
            dispatch(setTasksAC(response.data.items, todolistId))
            dispatch(setLoadingAC('success'))
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
            dispatch(setLoadingAC('loading'))
            dispatch(setTodolistStatusAC('loading',todolistId ))
            const response = await todolistAPI.updateTask(updatedTask, todolistId, taskId)
            if (response.data.resultCode === StatusCodes.Ok) {
                dispatch(updateTaskAC(todolistId, taskId, response.data.data.item))
                dispatch(setLoadingAC('success'))
            } else {
                if (response.data.resultCode === StatusCodes.Error) {
                    appErrorServerHandler(response.data, dispatch)
                }
            }
        } catch (e) {
            appErrorNetworkHandler(e, dispatch)
        } finally {
            dispatch(setTodolistStatusAC('success',todolistId ))
        }
    }

//Types
export type TodoListDataType = {
    [key: string]: TaskType[]
}
export type TasksActionsType = ReturnType<typeof removeTaskAC>
    | ReturnType<typeof updateTaskAC>
    | ReturnType<typeof addNewTaskAC>
    | ReturnType<typeof setTasksAC>
    | RemoveTodoListACType
    | AddNewTodoListACType
    | SetTodoListsACType

type UpdatedTaskFieldType = {
    title?: string
    description?: string
    completed?: boolean
    status?: TaskStatuses
    priority?: number
    startDate?: string
    deadline?: string
}