//CONSTANTS
import {AppThunkDispatch} from "../store";
import {FormDataType} from "../../components/Login";
import {setLoadingAC} from "./app-reducer";
import {authAPI, StatusCodes} from "../../api/todolist-api";
import {appErrorNetworkHandler, appErrorServerHandler} from "../../utils/app-error-handlers";

const TOGGLE_IS_LOGGED_IN = 'auth/TOGGLE_IS_LOGGED_IN'
const SET_IS_INITIALIZED = 'auth/SET_IS_INITIALIZED'
export const CLEAN_STATE_AFTER_LOGOUT = 'auth/CLEAN_STATE_AFTER_LOGOUT'

//REDUCER
const authInitialState = {
    isLoggedIn: false,
    initialized: false
}

export const authReducer = (state: AuthInitialStateType = authInitialState, action: AuthActionsType): AuthInitialStateType => {
    switch (action.type) {
        case TOGGLE_IS_LOGGED_IN:
            return {...state, isLoggedIn: action.payload.status}
        case SET_IS_INITIALIZED:
            return {...state, initialized: action.payload.status}
        default:
            return state
    }
}

//ACTION_CREATORS
export const toggleIsLoggedInAC = (status: boolean) => ({type: TOGGLE_IS_LOGGED_IN, payload: {status}} as const)
export const setIsInitializedAC = (status: boolean) => ({type: SET_IS_INITIALIZED, payload: {status}} as const)
export const cleanStateAfterLogoutAC = () => ({type: CLEAN_STATE_AFTER_LOGOUT } as const)

//THUNKS
export const loginTC = (data: FormDataType) => async (dispatch: AppThunkDispatch) => {
    dispatch(setLoadingAC('loading'))
    try {
        const response = await authAPI.login(data)
        if (response.data.resultCode === StatusCodes.Ok) {
            dispatch(toggleIsLoggedInAC(true))
            dispatch(setLoadingAC('success'))
        } else {
            appErrorServerHandler(response.data, dispatch)
        }
    } catch (e) {
        appErrorNetworkHandler(e, dispatch)
    }
}
export const logoutTC = () => async (dispatch: AppThunkDispatch) => {
    dispatch(setLoadingAC('loading'))
    try {
        const response = await authAPI.logout()
        if (response.data.resultCode === StatusCodes.Ok) {
            dispatch(toggleIsLoggedInAC(false))
            dispatch(cleanStateAfterLogoutAC())
            dispatch(setLoadingAC('success'))
        } else {
            appErrorServerHandler(response.data, dispatch)
        }
    } catch (e) {
        appErrorNetworkHandler(e, dispatch)
    }
}
export const initializeAppTC = () => async (dispatch: AppThunkDispatch) => {
    try {
        const response = await authAPI.me()
        if (response.data.resultCode === StatusCodes.Ok) {
            dispatch(toggleIsLoggedInAC(true))
        } else {
            appErrorServerHandler(response.data, dispatch)
        }
    } catch (e) {
        appErrorNetworkHandler(e, dispatch)
    } finally {
        dispatch(setIsInitializedAC(true))
    }
}

//TYPES
export type AuthInitialStateType = typeof authInitialState
export type AuthActionsType = ToggleIsLoggedInACType
    | SetIsAuthorizedACType
export type ToggleIsLoggedInACType = ReturnType<typeof toggleIsLoggedInAC>
export type SetIsAuthorizedACType = ReturnType<typeof setIsInitializedAC>
export type CleanStateAfterLogoutACType = ReturnType<typeof cleanStateAfterLogoutAC>