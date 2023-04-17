import {AnyAction, applyMiddleware, combineReducers, createStore} from "redux";
import {todoListsReducer} from "./reducers/todoListsReducer";
import {todoListsDataReducer} from "./reducers/todoListsDataReducer";
import thunk, {ThunkDispatch} from "redux-thunk";
import {TypedUseSelectorHook, useDispatch, useSelector} from "react-redux";

const rootReducer = combineReducers({
    todoLists: todoListsReducer,
    tasks: todoListsDataReducer
})

export const store = createStore(rootReducer, applyMiddleware(thunk))
export type AppRootStateType = ReturnType<typeof rootReducer>

export type AppThunkDispatch = ThunkDispatch<AppRootStateType, any, AnyAction>
export const useAppDispatch = () => useDispatch<AppThunkDispatch>();
export const useAppSelector: TypedUseSelectorHook<AppRootStateType> = useSelector


// @ts-ignore
window.store = store

