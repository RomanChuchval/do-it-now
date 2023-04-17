import {
    ADD_NEW_TODO_LIST,
    AddNewTodoListACType,
    REMOVE_TODO_LIST,
    RemoveTodoListACType, SET_TODO_LISTS, SetTodolistsACType,
} from "./todoListsReducer";
import {StatusCodes, TaskModelType, TaskStatuses, TaskType, todolistAPI} from "../../api/todolist-api";
import {Dispatch} from "redux";
import {AppRootStateType} from "../store";

const UPDATE_TASK = 'UPDATE_TASK'
const ADD_NEW_TASK = 'ADD-NEW-TASK'
const REMOVE_TASK = 'REMOVE-TASK'
const SET_TASKS = 'SET_TASKS'

//Reducer
const initialState: TodoListDataType = {}
export const todoListsDataReducer = (state: TodoListDataType = initialState, action: FinalActionType): TodoListDataType => {

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
    const newTaskData = await todolistAPI.createTask(todolistId, title)
    dispatch(addNewTaskAC(todolistId, newTaskData.data.data.item))
}
export const removeTaskTC = (todolistId: string, taskId: string) => async (dispatch: Dispatch) => {
    const responseData = await todolistAPI.removeTask(todolistId, taskId)
    if (responseData.data.resultCode === StatusCodes.Ok) {
        dispatch(removeTaskAC(todolistId, taskId))
    }
}
export const fetchTasksTC = (todolistId: string) => async (dispatch: Dispatch) => {
    const responseData = await todolistAPI.getTasks(todolistId)
    dispatch(setTasksAC(responseData.data.items, todolistId))
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
        const responseData = await todolistAPI.updateTask(updatedTask, todolistId, taskId)
        if (responseData.data.resultCode === StatusCodes.Ok) {
            dispatch(updateTaskAC(todolistId, taskId, responseData.data.data.item))
        }
    }


//Types
export type TodoListDataType = {
    [key: string]: TaskType[]
}
type FinalActionType = ReturnType<typeof removeTaskAC>
    | ReturnType<typeof updateTaskAC>
    | ReturnType<typeof addNewTaskAC>
    | ReturnType<typeof setTasksAC>
    | RemoveTodoListACType
    | AddNewTodoListACType
    | SetTodolistsACType

type UpdatedTaskFieldType = {
    title?: string
    description?: string
    completed?: boolean
    status?: TaskStatuses
    priority?: number
    startDate?: string
    deadline?: string
}