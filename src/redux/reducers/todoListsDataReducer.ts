import {v1} from "uuid";
import {
    ADD_NEW_TODO_LIST,
    AddNewTodoListAC,
    REMOVE_TODO_LIST,
    RemoveTodoListACType,
    todoListId1,
    todoListId2
} from "./todoListsReducer";
import {TodoListDataType} from "../../AppWithRedux";

const REMOVE_TASK = 'REMOVE-TASK'
const CHANGE_TASK_STATUS = 'CHANGE-TASK-STATUS'
const ADD_NEW_TASK = 'ADD-NEW-TASK'
const CHANGE_TASK_TITLE = 'CHANGE-TASK-TITLE'

type FinalActionType = RemoveTaskACType
    | ChangeTaskStatusACType
    | AddNewTaskACType
    | ChangeTaskTitleACType
    | AddNewTodoListAC
    | RemoveTodoListACType

type RemoveTaskACType = ReturnType<typeof removeTaskAC>
type ChangeTaskStatusACType = ReturnType<typeof changeTaskStatusAC>
type AddNewTaskACType = ReturnType<typeof addNewTaskAC>
type ChangeTaskTitleACType = ReturnType<typeof changeTaskTitleAC>

const initialState: TodoListDataType = {
    [todoListId1]: [
        {id: v1(), taskName: 'React', isDone: false},
        {id: v1(), taskName: 'Redux', isDone: true},
        {id: v1(), taskName: 'Axios', isDone: false},
    ],
    [todoListId2]: [
        {id: v1(), taskName: 'HTML', isDone: true},
        {id: v1(), taskName: 'CSS', isDone: false},
        {id: v1(), taskName: 'Axios', isDone: true}
    ]
}

export const todoListsDataReducer = (state: TodoListDataType = initialState, action: FinalActionType) => {

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
        case REMOVE_TODO_LIST:
            delete (state[action.payload.todoListID])
            return state

        case ADD_NEW_TODO_LIST:
            return {...state, [action.payload.id]: []}
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

// export const removeFullTasksListAC = (todoListId: string) => {
//     return {
//         type: REMOVE_FULL_TASKS_LIST,
//         payload: {
//             todoListId
//         }
//     } as const
// }

// export const addNewTasksListForNewTodoListAC = (todoListId: string) => {
//     return {
//         type: ADD_NEW_TASKS_LIST_FOR_NEW_TODO_LIST,
//         payload: {
//             todoListId
//         }
//     } as const
// }