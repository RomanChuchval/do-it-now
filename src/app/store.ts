import {todolistReducer, TodolistsActionsType} from "features/todolists/todolist/todolist-reducer";
import {TasksActionsType, tasksReducer} from "features/todolists/task/tasks-reducer";
import {TypedUseSelectorHook, useDispatch, useSelector} from "react-redux";
import { appSlice} from "app/app-slice";
import { authSlice} from "features/auth/auth-slice";
import { configureStore, ThunkDispatch} from "@reduxjs/toolkit";


export const store = configureStore({
    reducer: {
        todoLists: todolistReducer,
        tasks: tasksReducer,
        app: appSlice,
        auth: authSlice
    }
})


// export const store = createStore(rootReducer, applyMiddleware(thunk))
export type AppRootStateType = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch;

type AppActionsTypes = TodolistsActionsType | TasksActionsType
export type AppThunkDispatch = ThunkDispatch<AppRootStateType, any, AppActionsTypes>

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<AppRootStateType> = useSelector

// @ts-ignore
window.store = store

