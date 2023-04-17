import {
    ADD_NEW_TODO_LIST,
    AddNewTodoListACType,
    REMOVE_TODO_LIST,
    RemoveTodoListACType, SET_TODO_LISTS, SetTodolistsACType,
} from "./todoListsReducer";
import {TaskType, todolistAPI} from "../../api/todolist-api";
import {Dispatch} from "redux";

const CHANGE_TASK_STATUS = 'CHANGE-TASK-STATUS'
const CHANGE_TASK_TITLE = 'CHANGE-TASK-TITLE'
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
        // case REMOVE_TASK:
        //     return {
        //         ...state, [action.payload.todoListID]:
        //             state[action.payload.todoListID]
        //                 .filter(t => t.id !== action.payload.taskID)
        //     }
        // case CHANGE_TASK_STATUS:
        //     return {
        //         ...state, [action.payload.todoListID]:
        //             state[action.payload.todoListID]
        //                 .map(t => t.id === action.payload.taskID
        //                     ? {...t, isDone: action.payload.newStatus}
        //                     : t)
        //     }
        case ADD_NEW_TASK:
            return {
                ...state, [action.payload.todoListID]:
                    [action.payload.newTaskData, ...state[action.payload.todoListID]]
            }
        // case CHANGE_TASK_TITLE:
        //     return {
        //         ...state, [action.payload.todoListId]:
        //             state[action.payload.todoListId]
        //                 .map(t => t.id === action.payload.taskId
        //                     ? {...t, taskName: action.payload.newTitle}
        //                     : t)
        //     }
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
export const changeTaskStatusAC = (todoListID: string, taskID: string, newStatus: boolean) => (
    {type: CHANGE_TASK_STATUS, payload: {todoListID, taskID, newStatus}}) as const
export const changeTaskTitleAC = (todoListId: string, taskId: string, newTitle: string) => (
    {type: CHANGE_TASK_TITLE, payload: {todoListId, taskId, newTitle}}) as const
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
export const fetchTasksTC = (todolistId: string) => async (dispatch: Dispatch) => {
    const responseData = await todolistAPI.getTasks(todolistId)
    dispatch(setTasksAC(responseData.data.items, todolistId))
}

//Types
export type TodoListDataType = {
    [key: string]: TaskType[]
}
type FinalActionType = ReturnType<typeof removeTaskAC>
    | ReturnType<typeof changeTaskStatusAC>
    | ReturnType<typeof changeTaskTitleAC>
    | ReturnType<typeof addNewTaskAC>
    | ReturnType<typeof setTasksAC>
    | RemoveTodoListACType
    | AddNewTodoListACType
    | SetTodolistsACType
