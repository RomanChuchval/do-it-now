import {todolistReducer, TodolistsActionsType} from "features/todolists/todolist/todolist-reducer";
import {TasksActionsType, tasksReducer} from "features/todolists/task/tasks-reducer";
import {TypedUseSelectorHook, useDispatch, useSelector} from "react-redux";
import {AppActionsType, appReducer} from "app/app-reducer";
import {AuthActionsType, authReducer} from "features/auth/auth-reducer";
import {combineReducers, configureStore, ThunkDispatch} from "@reduxjs/toolkit";

const rootReducer = combineReducers({
    todoLists: todolistReducer,
    tasks: tasksReducer,
    app: appReducer,
    auth: authReducer
})

export const store = configureStore({
    reducer: rootReducer
})

// export const store = createStore(rootReducer, applyMiddleware(thunk))
export type AppRootStateType = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch;

type AppActionsTypes = TodolistsActionsType | AppActionsType | TasksActionsType | AuthActionsType
export type AppThunkDispatch = ThunkDispatch<AppRootStateType, any, AppActionsTypes>

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<AppRootStateType> = useSelector

// @ts-ignore
window.store = store

