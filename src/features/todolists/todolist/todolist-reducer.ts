import {StatusCodes, todolistAPI, TodolistType} from "api/todolist-api";
import {Dispatch} from "redux";
import {appActions, AppStatus} from "app/app-slice";
import {appErrorNetworkHandler, appErrorServerHandler} from "common/utils/app-error-handlers";
import {CLEAN_STATE_AFTER_LOGOUT, CleanStateAfterLogoutACType} from "features/auth/auth-reducer";
import {fetchTasksTC} from "features/todolists/task/tasks-reducer";
import {AppDispatch} from "app/store";

export const REMOVE_TODO_LIST = 'REMOVE-TODO-LIST'
const CHANGE_FILTER = 'CHANGE-FILTER'
export const ADD_NEW_TODO_LIST = 'ADD-NEW-TODO-LIST'
const CHANGE_TODO_LIST_TITLE = 'CHANGE-TODO-LIST-TITLE'
export const SET_TODO_LISTS = 'SET_TODO_LISTS'
export const SET_TODO_LIST_STATUS = 'SET_TODO_LIST_STATUS'


// Reducer
const initialState: TodolistDomainType[] = []

export const todolistReducer = (state: TodolistDomainType[] = initialState, action: TodolistsActionsType): TodolistDomainType[] => {
    switch (action.type) {
        case SET_TODO_LISTS:
            return action.payload.data.map(tl => ({...tl, filter: 'all', todolistStatus: 'idle'}))
        case REMOVE_TODO_LIST:
            return state.filter(tl => tl.id !== action.payload.todoListID)
        case CHANGE_FILTER:
            return state.map(tl => tl.id === action.payload.todoListID
                ? {...tl, filter: action.payload.filter}
                : tl)
        case ADD_NEW_TODO_LIST:
            return [{...action.payload.newTodolist, filter: 'all', todolistStatus: 'idle'}, ...state]
        case CHANGE_TODO_LIST_TITLE:
            return state.map(tl => tl.id === action.payload.todoListId
                ? {...tl, title: action.payload.newTitle}
                : tl)
        case SET_TODO_LIST_STATUS:
            return state.map(tl => tl.id === action.payload.todolistId
                ? {...tl, todolistStatus: action.payload.status}
                : tl)
        case CLEAN_STATE_AFTER_LOGOUT:
            return []
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
export const setTodolistStatusAC = (status: AppStatus, todolistId: string) => (
    {type: SET_TODO_LIST_STATUS, payload: {status, todolistId}}) as const
export const setTodolistsAC = (data: TodolistType[]) => (
    {type: SET_TODO_LISTS, payload: {data}}) as const


//Thunks
export const changeTodolistTitleTC = (todolistId: string, newTitle: string) => async (dispatch: Dispatch) => {
    try {
        dispatch(appActions.setStatus({status: 'loading'}))
        dispatch(setTodolistStatusAC('loading', todolistId))
        const response = await todolistAPI.updateTodolistTitle(newTitle, todolistId)
        if (response.data.resultCode === StatusCodes.Ok) {
            dispatch(changeTodoListTitleAC(todolistId, newTitle))
            dispatch(appActions.setStatus({status: 'success'}))
        } else {
            if (response.data.resultCode === StatusCodes.Error) {
                appErrorServerHandler(response.data, dispatch)
            }
        }
    } catch (e) {
        appErrorNetworkHandler(e, dispatch)
    } finally {
        dispatch(setTodolistStatusAC('success', todolistId))
    }
}
export const removeTodolistTC = (todolistId: string) => async (dispatch: Dispatch) => {
    try {
        dispatch(appActions.setStatus({status: 'loading'}))
        dispatch(setTodolistStatusAC('loading', todolistId))
        const response = await todolistAPI.deleteTodolist(todolistId)
        if (response.data.resultCode === StatusCodes.Ok) {
            dispatch(removeTodoListAC(todolistId))
            dispatch(appActions.setStatus({status: 'success'}))
        } else {
            if (response.data.resultCode === StatusCodes.Error) {
                appErrorServerHandler(response.data, dispatch)
            }
        }
    } catch (e) {
        appErrorNetworkHandler(e, dispatch)
    } finally {
        dispatch(setTodolistStatusAC('success', todolistId))
    }

}
export const createTodolistTC = (title: string) => async (dispatch: Dispatch) => {
    try {
        dispatch(appActions.setStatus({status: 'loading'}))
        const response = await todolistAPI.createTodolist(title)
        if (response.data.resultCode === StatusCodes.Ok) {
            dispatch(addNewTodoListAC(response.data.data.item))
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
export const fetchTodolistsTC = () => async (dispatch: AppDispatch) => {
    dispatch(appActions.setStatus({status: 'loading'}))
    try {
        const response = await todolistAPI.getTodolists()
        dispatch(setTodolistsAC(response.data))
        response.data.forEach( (el) => dispatch(fetchTasksTC(el.id)))
    } catch (e) {
        appErrorNetworkHandler(e, dispatch)
    }
}

// Types
export type FilterValuesType = 'all' | 'active' | 'completed'
export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType
    todolistStatus: AppStatus
}
export type TodolistsActionsType = RemoveTodoListACType
    | ChangeTodoListTitleACType
    | AddNewTodoListACType
    | ChangeFilterACType
    | SetTodoListsACType
    | SetTodolistStatusACType
    | CleanStateAfterLogoutACType
type ChangeTodoListTitleACType = ReturnType<typeof changeTodoListTitleAC>
export type RemoveTodoListACType = ReturnType<typeof removeTodoListAC>
export type AddNewTodoListACType = ReturnType<typeof addNewTodoListAC>
export type SetTodoListsACType = ReturnType<typeof setTodolistsAC>
export type SetTodolistStatusACType = ReturnType<typeof setTodolistStatusAC>
type ChangeFilterACType = ReturnType<typeof changeFilterAC>


