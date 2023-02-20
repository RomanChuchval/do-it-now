import {TodoListDataType} from "../App";
import {v1} from "uuid";

const REMOVE_TASK = 'REMOVE-TASK'
const CHANGE_TASK_STATUS = 'CHANGE-TASK-STATUS'
const ADD_NEW_TASK = 'ADD-NEW-TASK'
const CHANGE_TASK_TITLE = 'CHANGE-TASK-TITLE'
const REMOVE_FULL_TASKS_LIST = 'REMOVE-FULL-TASKS-LIST'
const ADD_NEW_TASKS_LIST_FOR_NEW_TODO_LIST = 'ADD-NEW-TASKS-LIST-FOR-NEW-TODO-LIST'


type FinalActionType = RemoveTaskACType
    | ChangeTaskStatusACType
    | AddNewTaskACType
    | ChangeTaskTitleACType
    | RemoveFullTasksListAC
    | AddNewTasksListForNewTodoListAC

type RemoveTaskACType = ReturnType<typeof removeTaskAC>
type ChangeTaskStatusACType = ReturnType<typeof changeTaskStatusAC>
type AddNewTaskACType = ReturnType<typeof addNewTaskAC>
type ChangeTaskTitleACType = ReturnType<typeof changeTaskTitleAC>
type RemoveFullTasksListAC = ReturnType<typeof removeFullTasksListAC>
type AddNewTasksListForNewTodoListAC = ReturnType<typeof addNewTasksListForNewTodoListAC>

export const todoListsDataReducer = (state: TodoListDataType, action: FinalActionType) => {

    switch (action.type) {
        case REMOVE_TASK:
            return {
                ...state, [action.payload.todoListID]:
                    state[action.payload.todoListID]
                        .filter(t => t.id !== action.payload.taskID)
            }
        case CHANGE_TASK_STATUS:
            return {
                ...state, [action.payload.todoListID]:
                    state[action.payload.todoListID]
                        .map(t => t.id === action.payload.taskID
                            ? {...t, isDone: action.payload.newStatus}
                            : t)
            }
        case ADD_NEW_TASK:
            let newTask = {id: v1(), taskName: action.payload.title, isDone: false}
            return {
                ...state, [action.payload.todoListID]:
                    [newTask, ...state[action.payload.todoListID]]
            }
        case CHANGE_TASK_TITLE:
            return {
                ...state, [action.payload.todoListId]:
                    state[action.payload.todoListId]
                        .map(t => t.id === action.payload.taskId
                            ? {...t, taskName: action.payload.newTitle}
                            : t)
            }
        case REMOVE_FULL_TASKS_LIST:
            delete (state[action.payload.todoListId])
            return state
        case ADD_NEW_TASKS_LIST_FOR_NEW_TODO_LIST:
            return {
                ...state, [action.payload.todoListId]: []
            }
        default:
            return state
    }

}

export const removeTaskAC = (todoListID: string, taskID: string) => {
    return {
        type: REMOVE_TASK,
        payload: {
            todoListID,
            taskID
        }
    } as const
}
export const changeTaskStatusAC = (todoListID: string, taskID: string, newStatus: boolean) => {
    return {
        type: CHANGE_TASK_STATUS,
        payload: {
            todoListID,
            taskID,
            newStatus
        }
    } as const
}
export const addNewTaskAC = (todoListID: string, title: string) => {
    return {
        type: ADD_NEW_TASK,
        payload: {
            todoListID,
            title
        }
    } as const
}
export const changeTaskTitleAC = (todoListId: string, taskId: string, newTitle: string) => {
    return {
        type: CHANGE_TASK_TITLE,
        payload: {
            todoListId,
            taskId,
            newTitle
        }
    } as const
}

export const removeFullTasksListAC = (todoListId: string) => {
    return {
        type: REMOVE_FULL_TASKS_LIST,
        payload: {
            todoListId
        }
    } as const
}

export const addNewTasksListForNewTodoListAC = (todoListId: string) => {
    return {
        type: ADD_NEW_TASKS_LIST_FOR_NEW_TODO_LIST,
        payload: {
            todoListId
        }
    } as const
}