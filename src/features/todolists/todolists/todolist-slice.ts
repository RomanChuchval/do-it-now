import {StatusCodes, todolistAPI, TodolistType} from "api/todolist-api";
import {Dispatch} from "redux";
import {appActions, AppStatus} from "app/app-slice";
import {appErrorNetworkHandler, appErrorServerHandler} from "common/utils/app-error-handlers";
import {fetchTasksTC} from "features/todolists/task/tasks-slice";
import {AppDispatch} from "app/store";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

// SLICE
const initialState: TodolistDomainType[] = []

const slice = createSlice({
    name: 'todolist',
    initialState: initialState,
    reducers: {
        changeFilter: (state, action: PayloadAction<{ todoListId: string, filter: FilterValuesType }>) => {
            const todolist = state.find(tl => tl.id === action.payload.todoListId)
            if (todolist)
                todolist.filter = action.payload.filter
        },
        changeTodoListTitle: (state, action: PayloadAction<{ todolistId: string, newTitle: string }>) => {
            const todolist = state.find(tl => tl.id === action.payload.todolistId)
            if (todolist)
                todolist.title = action.payload.newTitle
        },
        addNewTodoList: (state, action: PayloadAction<{ newTodolist: TodolistType }>) => {
            state.unshift({...action.payload.newTodolist, filter: 'all', todolistStatus: 'idle'})
        },
        removeTodoList: (state, action: PayloadAction<{ todolistId: string }>) => {
            const todolistIndex = state.findIndex(tl => tl.id === action.payload.todolistId)
            if (todolistIndex !== -1)
                state.splice(todolistIndex, 1)
        },
        setTodolistStatus: (state, action: PayloadAction<{ status: AppStatus, todolistId: string }>) => {
            const todolist = state.find(tl => tl.id === action.payload.todolistId)
            if (todolist)
                todolist.todolistStatus = action.payload.status
        },
        setTodolists: (state, action: PayloadAction<{ todolists: TodolistType[] }>) => {
            return action.payload.todolists.map(tl => ({...tl, filter: 'all', todolistStatus: 'idle'}))
        },
        cleanStateAfterLogout: () => initialState
    }
});
export const todolistActions = slice.actions
export const todolistSlice = slice.reducer

//THUNKS
export const changeTodolistTitleTC = (todolistId: string, newTitle: string) => async (dispatch: Dispatch) => {
    try {
        dispatch(appActions.setStatus({status: 'loading'}))
        dispatch(todolistActions.setTodolistStatus({status: 'loading', todolistId}))
        const response = await todolistAPI.updateTodolistTitle(newTitle, todolistId)
        if (response.data.resultCode === StatusCodes.Ok) {
            dispatch(todolistActions.changeTodoListTitle({todolistId, newTitle}))
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
export const removeTodolistTC = (todolistId: string) => async (dispatch: Dispatch) => {
    try {
        dispatch(appActions.setStatus({status: 'loading'}))
        dispatch(todolistActions.setTodolistStatus({status: 'loading', todolistId}))
        const response = await todolistAPI.deleteTodolist(todolistId)
        if (response.data.resultCode === StatusCodes.Ok) {
            dispatch(todolistActions.removeTodoList({todolistId}))
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
export const createTodolistTC = (title: string) => async (dispatch: Dispatch) => {
    try {
        dispatch(appActions.setStatus({status: 'loading'}))
        const response = await todolistAPI.createTodolist(title)
        if (response.data.resultCode === StatusCodes.Ok) {
            dispatch(todolistActions.addNewTodoList({newTodolist: response.data.data.item}))
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
        dispatch(todolistActions.setTodolists({todolists: response.data}))
        response.data.forEach((el) => dispatch(fetchTasksTC(el.id)))
        dispatch(appActions.setStatus({status: 'success'}))
    } catch (e) {
        appErrorNetworkHandler(e, dispatch)
    }
}

// TYPES
export type FilterValuesType = 'all' | 'active' | 'completed'
export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType
    todolistStatus: AppStatus
}


