//CONSTANTS
import {FormDataType} from "features/auth/Login";
import {authAPI, StatusCodes} from "api/todolist-api";
import {appErrorNetworkHandler, appErrorServerHandler} from "common/utils/app-error-handlers";
import {AppDispatch} from "app/store";
import {appActions} from "app/app-slice";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {todolistActions} from "features/todolists/todolists/todolist-slice";
import {tasksActions} from "features/todolists/task/tasks-slice";

//SLICE
const authInitialState = {
    isLoggedIn: false
}
const slice = createSlice({
    name: 'auth',
    initialState: authInitialState,
    reducers: {
        setIsLoggedIn: (state, action: PayloadAction<{isLoggedIn: boolean}>) => {
            state.isLoggedIn = action.payload.isLoggedIn
        }
    }
})

export const authSlice = slice.reducer
export const authActions = slice.actions

//THUNKS
export const loginTC = (data: FormDataType) => async (dispatch: AppDispatch) => {
    dispatch(appActions.setStatus({status: 'loading'}))
    try {
        const response = await authAPI.login(data)
        if (response.data.resultCode === StatusCodes.Ok) {
            dispatch(authActions.setIsLoggedIn({isLoggedIn: true}))
            dispatch(appActions.setStatus({status: 'success'}))
        } else {
            appErrorServerHandler(response.data, dispatch)
        }
    } catch (e) {
        appErrorNetworkHandler(e, dispatch)
    }
}
export const logoutTC = () => async (dispatch: AppDispatch) => {
    dispatch(appActions.setStatus({status: 'loading'}))
    try {
        const response = await authAPI.logout()
        if (response.data.resultCode === StatusCodes.Ok) {
            dispatch(authActions.setIsLoggedIn({isLoggedIn: false}))
            dispatch(todolistActions.cleanStateAfterLogout())
            dispatch(tasksActions.cleanStateAfterLogout())
            dispatch(appActions.setStatus({status: 'success'}))
        } else {
            appErrorServerHandler(response.data, dispatch)
        }
    } catch (e) {
        appErrorNetworkHandler(e, dispatch)
    }
}