
import {v1} from "uuid";
import {FilterValuesType, TodoListsType} from "../../AppWithRedux";

type FinalActionType = RemoveTodoListACType
    | ChangeFilterAC
    | AddNewTodoListAC
    | ChangeTodoListTitleAC

export type RemoveTodoListACType = ReturnType<typeof removeTodoListAC>
type ChangeFilterAC = ReturnType<typeof changeFilterAC>
export type AddNewTodoListAC = ReturnType<typeof addNewTodoListAC>
type ChangeTodoListTitleAC = ReturnType<typeof changeTodoListTitleAC>

export const REMOVE_TODO_LIST = 'REMOVE-TODO-LIST'
const CHANGE_FILTER = 'CHANGE-FILTER'
export const ADD_NEW_TODO_LIST = 'ADD-NEW-TODO-LIST'
const CHANGE_TODO_LIST_TITLE = 'CHANGE-TODO-LIST-TITLE'

export const todoListId1 = v1()
export const todoListId2 = v1()

const initialState: Array<TodoListsType> = [
    {todoListId: todoListId1, title: 'What to do', filter: 'all'},
    {todoListId: todoListId2, title: 'What to buy', filter: 'all'},
]

export const todoListsReducer = (state: Array<TodoListsType> = initialState, action: FinalActionType) => {
    switch (action.type) {
        case REMOVE_TODO_LIST:
            return state.filter(tl => tl.todoListId !== action.payload.todoListID)
        case CHANGE_FILTER:
            return state.map(tl => tl.todoListId === action.payload.todoListID
                ? {...tl, filter: action.payload.filter}
                : tl)
        case ADD_NEW_TODO_LIST:
            let newTodoList: TodoListsType = {
                todoListId: action.payload.id,
                title: action.payload.title,
                filter: 'all'
            }
            return [...state, newTodoList]
        case CHANGE_TODO_LIST_TITLE:
            return state.map(tl => tl.todoListId === action.payload.todoListId
            ? {...tl, title: action.payload.newTitle}
            : tl)
        default:
            return state
    }

}

export const removeTodoListAC = (todoListID: string) => {
    return {
        type: REMOVE_TODO_LIST,
        payload: {
            todoListID
        }
    } as const
}

export const changeFilterAC = (todoListID: string, filter: FilterValuesType) => {
    return {
        type: CHANGE_FILTER,
        payload: {
            todoListID,
            filter
        }
    } as const
}

export const addNewTodoListAC = (title: string, id: string) => {
    return {
        type: ADD_NEW_TODO_LIST,
        payload: {
            title,
            id
        }
    } as const
}

export const changeTodoListTitleAC = (todoListId: string, newTitle: string) => {
    return {
        type: CHANGE_TODO_LIST_TITLE,
        payload: {
            todoListId,
            newTitle
        }
    } as const
}