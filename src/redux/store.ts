import {combineReducers, createStore} from "redux";
import {todoListsReducer} from "./reducers/todoListsReducer";
import {todoListsDataReducer} from "./reducers/todoListsDataReducer";

const rootReducer = combineReducers({
    todoLists: todoListsReducer,
    tasks: todoListsDataReducer
})

export type RootStateType = ReturnType<typeof rootReducer>
export const store = createStore(rootReducer)


// @ts-ignore
window.store = store

