import {authAPI, StatusCodes} from "api/todolist-api";
import {appErrorNetworkHandler, appErrorServerHandler} from "common/utils/app-error-handlers";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {authFulfilled, authPending, authThunks} from "features/auth/auth-slice";
import {createAppAsyncThunk} from "common/utils/createAppAsyncThunk";
import {todolistsFulfilled, todolistsPending} from "features/todolists/todolists-slice";
import {tasksFulfilled, tasksPending} from "features/tasks/tasks-slice";

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
        setStatus: (state, action: PayloadAction<{ status: AppStatus }>) => {
            state.status = action.payload.status
        },
        setInitialized: (state, action: PayloadAction<{ initialized: boolean }>) => {
            state.initialized = action.payload.initialized
        }
    },
    extraReducers: builder => {
        builder
            .addCase(authThunks.login.fulfilled, (state) => {
                state.initialized = true
            })
            .addMatcher(todolistsPending, (state) => {
                state.status = 'loading'
            })
            .addMatcher(tasksPending, (state) => {
                state.status = 'loading'
            })
            .addMatcher(authPending, (state) => {
                state.status = 'loading'
            })
            .addMatcher(todolistsFulfilled, (state) => {
                state.status = 'success'
            })
            .addMatcher(tasksFulfilled, (state) => {
                state.status = 'success'
            })
            .addMatcher(authFulfilled, (state) => {
                state.status = 'success'
            })
    }
})

export const initializeApp = createAppAsyncThunk<void>(
    'app/init',
    async (data, {rejectWithValue, dispatch}) => {
        try {
            const res = await authAPI.me()
            if (res.data.resultCode === StatusCodes.Ok) {
                dispatch(appActions.setInitialized({initialized: true}))
            } else {
                appErrorServerHandler(res.data, dispatch)
                return rejectWithValue(null)
            }
        } catch (e) {
            appErrorNetworkHandler(e, dispatch)
            return rejectWithValue(null)
        } finally {
            dispatch(appActions.setInitialized({initialized: true}))
        }
    })
export const appActions = slice.actions
export const appSlice = slice.reducer
export const appThunks = {initializeApp}

//Types
export type AppStatus = 'idle' | 'loading' | 'success' | 'failed'