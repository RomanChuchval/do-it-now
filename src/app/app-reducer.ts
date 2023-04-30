//Constants for AC
import { toggleIsLoggedInAC} from "features/auth/auth-reducer";
import {AppDispatch} from "app/store";
import {authAPI, StatusCodes} from "api/todolist-api";
import {appErrorNetworkHandler, appErrorServerHandler} from "common/utils/app-error-handlers";

const SET_LOADING = 'APP/SET_LOADING'
const SET_ERROR = 'APP/SET_ERROR'
const SET_IS_INITIALIZED = 'APP/SET_IS_INITIALIZED'



const initialState = {
    status: 'idle' as AppStatus,
    error: null as string | null,
    initialized: false
}
export const appReducer = (state: InitialStateType = initialState, action: AppActionsType): InitialStateType => {
    switch (action.type) {
        case SET_LOADING:
            return {...state, status: action.payload.status}
        case SET_ERROR:
            return {...state, error: action.payload.ErrorValue}
        case SET_IS_INITIALIZED:
            return {...state, initialized: action.payload.status}
        default:
            return state
    }
}

//ActionCreators
export const setErrorAC = (ErrorValue: string | null) => (
    {type: SET_ERROR, payload: {ErrorValue}} as const
)
export const setLoadingAC = (status: AppStatus) => (
    {type: SET_LOADING, payload: {status}} as const
)

export const setIsInitializedAC = (status: boolean) => ({type: SET_IS_INITIALIZED, payload: {status}} as const)

export const initializeAppTC = () => async (dispatch: AppDispatch) => {
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

//Types
export type AppStatus = 'idle' | 'loading' | 'success' | 'failed'
export type SetLoadingACType = ReturnType<typeof setLoadingAC>
export type SetErrorACType = ReturnType<typeof setErrorAC>
export type SetIsAuthorizedACType = ReturnType<typeof setIsInitializedAC>
export type AppActionsType = SetLoadingACType | SetErrorACType | SetIsAuthorizedACType
export type InitialStateType = typeof initialState