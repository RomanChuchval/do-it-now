//CONSTANTS
import {FormDataType} from "features/auth/Login";
import {authAPI, StatusCodes} from "api/todolist-api";
import {appErrorNetworkHandler, appErrorServerHandler} from "common/utils/app-error-handlers";
import {AppDispatch} from "app/store";
import {appActions} from "app/app-slice";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

export const CLEAN_STATE_AFTER_LOGOUT = 'auth/CLEAN_STATE_AFTER_LOGOUT'

//REDUCER
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

//ACTION_CREATORS
export const cleanStateAfterLogoutAC = () => ({type: CLEAN_STATE_AFTER_LOGOUT } as const)

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
            dispatch(cleanStateAfterLogoutAC())
            dispatch(appActions.setStatus({status: 'success'}))
        } else {
            appErrorServerHandler(response.data, dispatch)
        }
    } catch (e) {
        appErrorNetworkHandler(e, dispatch)
    }
}

//TYPES
export type CleanStateAfterLogoutACType = ReturnType<typeof cleanStateAfterLogoutAC>