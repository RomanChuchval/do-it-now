import {AppDispatch} from "app/store";
import {authAPI, StatusCodes} from "api/todolist-api";
import {appErrorNetworkHandler, appErrorServerHandler} from "common/utils/app-error-handlers";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {authActions} from "features/auth/auth-slice";

const initialState = {
    status: 'idle' as AppStatus,
    error: null as string | null,
    initialized: false
}
const slice = createSlice({
    name: 'app',
    initialState: initialState,
    reducers: {
        setError: (state, action: PayloadAction<{ error: string | null }>) => {
            state.error = action.payload.error
        },
        setStatus: (state, action: PayloadAction<{status: AppStatus }>) => {
            state.status = action.payload.status
        },
        setInitialized: (state, action: PayloadAction<{initialized: boolean}>) => {
            state.initialized = action.payload.initialized
        }
    }
})

export const appActions = slice.actions
export const appSlice = slice.reducer

export const initializeAppTC = () => async (dispatch: AppDispatch) => {
    try {
        const response = await authAPI.me()
        if (response.data.resultCode === StatusCodes.Ok) {
            dispatch(authActions.setIsLoggedIn({isLoggedIn: true}))
        } else {
            appErrorServerHandler(response.data, dispatch)
        }
    } catch (e) {
        appErrorNetworkHandler(e, dispatch)
    } finally {
        dispatch(appActions.setInitialized({initialized: true}))
    }
}

//Types
export type AppStatus = 'idle' | 'loading' | 'success' | 'failed'