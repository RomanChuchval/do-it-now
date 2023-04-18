import {StatusCodes, todolistAPI, TodolistType} from "../../api/todolist-api";
import {Dispatch} from "redux";

export const REMOVE_TODO_LIST = 'REMOVE-TODO-LIST'
const CHANGE_FILTER = 'CHANGE-FILTER'
export const ADD_NEW_TODO_LIST = 'ADD-NEW-TODO-LIST'
const CHANGE_TODO_LIST_TITLE = 'CHANGE-TODO-LIST-TITLE'
export const SET_TODO_LISTS = 'SET_TODO_LISTS'


// Reducer
const initialState: TodolistDomainType[] = []

export const todolistReducer = (state: TodolistDomainType[] = initialState, action: TodolistsActionsType): TodolistDomainType[] => {
    switch (action.type) {
        case SET_TODO_LISTS:
            return action.payload.data.map(tl => ({...tl, filter: 'all'}))
        case REMOVE_TODO_LIST:
            return state.filter(tl => tl.id !== action.payload.todoListID)
        case CHANGE_FILTER:
            return state.map(tl => tl.id === action.payload.todoListID
                ? {...tl, filter: action.payload.filter}
                : tl)
        case ADD_NEW_TODO_LIST:
            return [{...action.payload.newTodolist, filter: 'all'}, ...state]
        case CHANGE_TODO_LIST_TITLE:
            return state.map(tl => tl.id === action.payload.todoListId
            ? {...tl, title: action.payload.newTitle}
            : tl)
        default:
            return state
    }
}

// Action Creators
export const changeFilterAC = (todoListID: string, filter: FilterValuesType) => (
    {type: CHANGE_FILTER, payload: {todoListID, filter}}) as const
export const changeTodoListTitleAC = (todoListId: string, newTitle: string) => (
    {type: CHANGE_TODO_LIST_TITLE, payload: {todoListId, newTitle}}) as const
export const addNewTodoListAC = (newTodolist: TodolistType) => (
    {type: ADD_NEW_TODO_LIST, payload: {newTodolist}}) as const
export const removeTodoListAC = (todoListID: string) => (
    {type: REMOVE_TODO_LIST, payload: {todoListID}}) as const
export const setTodolistsAC = (data: TodolistType[]) => (
    {type: SET_TODO_LISTS, payload: {data}}) as const


//Thunks
export const changeTodolistTitleTC = (todolistId: string, newTitle: string) => async (dispatch: Dispatch) => {
    const responseData = await todolistAPI.updateTodolistTitle(newTitle, todolistId)
    if(responseData.data.resultCode === StatusCodes.Ok) {
        dispatch(changeTodoListTitleAC(todolistId, newTitle))
    }
}
export const removeTodolistTC = (todolistId: string) => async (dispatch: Dispatch) => {
    await todolistAPI.deleteTodolist(todolistId)
    dispatch(removeTodoListAC(todolistId))
}
export const createTodolistTC = (title: string) => async (dispatch: Dispatch) => {
    const responseData = await todolistAPI.createTodolist(title)
    if(responseData.data.resultCode === StatusCodes.Ok) {
        dispatch(addNewTodoListAC(responseData.data.data.item))
    }
}
export const fetchTodolistsTC = () => async (dispatch: Dispatch) => {
    const responseData = await todolistAPI.getTodolists()
    dispatch(setTodolistsAC(responseData.data))
}

// Types
export type FilterValuesType = 'all' | 'active' | 'completed'
export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType
}
type TodolistsActionsType = RemoveTodoListACType
    | ChangeTodoListTitleACType
    | AddNewTodoListACType
    | ChangeFilterACType
    | SetTodolistsACType
type ChangeTodoListTitleACType = ReturnType<typeof changeTodoListTitleAC>
export type RemoveTodoListACType = ReturnType<typeof removeTodoListAC>
export type AddNewTodoListACType = ReturnType<typeof addNewTodoListAC>
export type SetTodolistsACType = ReturnType<typeof setTodolistsAC>
type ChangeFilterACType = ReturnType<typeof changeFilterAC>


