import {applyMiddleware, combineReducers, createStore} from "redux";
import {todolistReducer, TodolistsActionsType} from "./reducers/todolist-reducer";
import {TasksActionsType, tasksReducer} from "./reducers/tasks-reducer";
import thunk, {ThunkDispatch} from "redux-thunk";
import {TypedUseSelectorHook, useDispatch, useSelector} from "react-redux";
import {AppActionsType, appReducer} from "./reducers/app-reducer";
import {AuthActionsType, authReducer} from "./reducers/auth-reducer";

const rootReducer = combineReducers({
    todoLists: todolistReducer,
    tasks: tasksReducer,
    app: appReducer,
    auth: authReducer
})

export const store = createStore(rootReducer, applyMiddleware(thunk))

export type AppRootStateType = ReturnType<typeof rootReducer>
type AppActionsTypes = TodolistsActionsType | AppActionsType | TasksActionsType | AuthActionsType
export type AppThunkDispatch = ThunkDispatch<AppRootStateType, any, AppActionsTypes>
export const useAppDispatch = () => useDispatch<AppThunkDispatch>();
export const useAppSelector: TypedUseSelectorHook<AppRootStateType> = useSelector


// @ts-ignore
window.store = store

