import {todolistSlice} from "features/todolists/todolists/todolist-slice";
import { tasksSlice} from "features/todolists/task/tasks-slice";
import { appSlice} from "app/app-slice";
import { authSlice} from "features/auth/auth-slice";
import { configureStore} from "@reduxjs/toolkit";


export const store = configureStore({
    reducer: {
        todoLists: todolistSlice,
        tasks: tasksSlice,
        app: appSlice,
        auth: authSlice
    }
})

export type AppRootStateType = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch;
// @ts-ignore
window.store = store

