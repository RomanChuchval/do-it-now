//CONSTANTS
import {FormDataType} from "features/auth/Login";
import {authAPI, StatusCodes} from "api/todolist-api";
import {appErrorNetworkHandler, appErrorServerHandler} from "common/utils/app-error-handlers";
import {AppDispatch} from "app/store";
import {appActions} from "app/app-slice";

const TOGGLE_IS_LOGGED_IN = 'auth/TOGGLE_IS_LOGGED_IN'
export const CLEAN_STATE_AFTER_LOGOUT = 'auth/CLEAN_STATE_AFTER_LOGOUT'

//REDUCER
const authInitialState = {
    isLoggedIn: false
}

export const authReducer = (state: AuthInitialStateType = authInitialState, action: AuthActionsType): AuthInitialStateType => {
    switch (action.type) {
        case TOGGLE_IS_LOGGED_IN:
            return {...state, isLoggedIn: action.payload.status}
        default:
            return state
    }
}

//ACTION_CREATORS
export const toggleIsLoggedInAC = (status: boolean) => ({type: TOGGLE_IS_LOGGED_IN, payload: {status}} as const)
export const cleanStateAfterLogoutAC = () => ({type: CLEAN_STATE_AFTER_LOGOUT } as const)

//THUNKS
export const loginTC = (data: FormDataType) => async (dispatch: AppDispatch) => {
    dispatch(appActions.setStatus({status: 'loading'}))
    try {
        const response = await authAPI.login(data)
        if (response.data.resultCode === StatusCodes.Ok) {
            dispatch(toggleIsLoggedInAC(true))
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
            dispatch(toggleIsLoggedInAC(false))
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
export type AuthInitialStateType = typeof authInitialState
export type AuthActionsType = ReturnType<typeof toggleIsLoggedInAC>
export type CleanStateAfterLogoutACType = ReturnType<typeof cleanStateAfterLogoutAC>