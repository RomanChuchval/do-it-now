import {
    CreateTodolistRequest,
    RemoveTodolistRequest,
    StatusCodes,
    todolistAPI,
    TodolistType,
    CommonRequestData
} from "api/todolist-api";
import {appActions, AppStatus} from "app/app-slice";
import {appErrorNetworkHandler, appErrorServerHandler} from "common/utils/app-error-handlers";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {createAppAsyncThunk} from "common/utils/createAppAsyncThunk";

// SLICE
const initialState: TodolistDomainType[] = []
const slice = createSlice({
    name: 'todolist',
    initialState: initialState,
    reducers: {
        changeFilter: (state, action: PayloadAction<{ todoListId: string, filter: FilterValuesType }>) => {
            const todolist = state.find(tl => tl.id === action.payload.todoListId)
            if (todolist)
                todolist.filter = action.payload.filter
        },
        setTodolistStatus: (state, action: PayloadAction<{ status: AppStatus, todolistId: string }>) => {
            const todolist = state.find(tl => tl.id === action.payload.todolistId)
            if (todolist)
                todolist.todolistStatus = action.payload.status
        },
        cleanStateAfterLogout: () => initialState
    },
    extraReducers: builder => {
        builder
            .addCase(updateTodolistTitle.fulfilled, (state, action) => {
                const todolist = state.find(tl => tl.id === action.payload.todoListId)
                if (todolist)
                    todolist.title = action.payload.title
            })
            .addCase(removeTodolist.fulfilled, (state, action) => {
                const todolistIndex = state.findIndex(tl => tl.id === action.payload.todoListId)
                if (todolistIndex !== -1)
                    state.splice(todolistIndex, 1)
            })
            .addCase(createTodolist.fulfilled, (state,action) => {
                state.unshift({...action.payload.newTodolist, filter: 'all', todolistStatus: 'idle'})
            })
            .addCase(fetchTodolists.fulfilled, (state, action) => {
                return action.payload.todolists.map(tl => ({...tl, filter: 'all', todolistStatus: 'idle'}))
            })
    }
});

//THUNKS
const updateTodolistTitle = createAppAsyncThunk<CommonRequestData, CommonRequestData>(
    'todolists/updateTitle',
    async (data, {rejectWithValue, dispatch}) => {
        try {
            const res = await todolistAPI.updateTodolistTitle(data)
            if (res.data.resultCode === StatusCodes.Ok) {
                return {title: data.title, todoListId: data.todoListId}
            } else {
                appErrorServerHandler(res.data, dispatch)
                return rejectWithValue(null)
            }
        } catch (e) {
            appErrorNetworkHandler(e, dispatch)
            return rejectWithValue(null)
        }
    })

const removeTodolist = createAppAsyncThunk<RemoveTodolistRequest, RemoveTodolistRequest>(
    'todolists/remove',
    async (data, {rejectWithValue, dispatch}) => {
        try {
            const res = await todolistAPI.deleteTodolist(data)
            if (res.data.resultCode === StatusCodes.Ok) {
                return {todoListId: data.todoListId}
            } else {
                appErrorServerHandler(res.data, dispatch)
                return rejectWithValue(null)
            }
        } catch (e) {
            appErrorNetworkHandler(e, dispatch)
            return rejectWithValue(null)
        }
    })

const createTodolist = createAppAsyncThunk<{ newTodolist: TodolistType }, CreateTodolistRequest>(
    'todolists/create',
    async (data, {rejectWithValue, dispatch}) => {
        try {
            const response = await todolistAPI.createTodolist(data)
            if (response.data.resultCode === StatusCodes.Ok) {
                return {newTodolist: response.data.data.item}
            } else {
                appErrorServerHandler(response.data, dispatch)
                return rejectWithValue(null)
            }
        } catch (e) {
            appErrorNetworkHandler(e, dispatch)
            return rejectWithValue(null)
        }
    })

const fetchTodolists = createAppAsyncThunk<{ todolists: TodolistType[] }>(
    'todolists/fetch',
    async (data, {rejectWithValue, dispatch}) => {
        dispatch(appActions.setStatus({status: 'loading'}))
        try {
            const res = await todolistAPI.getTodolists()
            return {todolists: res.data}
        } catch (e) {
            appErrorNetworkHandler(e, dispatch)
            return rejectWithValue(null)
        }
    })

export const todolistsThunks = {updateTodolistTitle, removeTodolist, createTodolist, fetchTodolists}
export const todolistsActions = slice.actions
export const todolistsSlice = slice.reducer

// TYPES
export type FilterValuesType = 'all' | 'active' | 'completed'
export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType
    todolistStatus: AppStatus
}


// export const changeTodolistTitleTC = (todolistId: string, newTitle: string) => async (dispatch: Dispatch) => {
//     try {
//         dispatch(appActions.setStatus({status: 'loading'}))
//         dispatch(todolistsActions.setTodolistStatus({status: 'loading', todolistId}))
//         const response = await todolistAPI.updateTodolistTitle(newTitle, todolistId)
//         if (response.data.resultCode === StatusCodes.Ok) {
//             dispatch(todolistsActions.changeTodoListTitle({todolistId, newTitle}))
//             dispatch(appActions.setStatus({status: 'success'}))
//         } else {
//             if (response.data.resultCode === StatusCodes.Error) {
//                 appErrorServerHandler(response.data, dispatch)
//             }
//         }
//     } catch (e) {
//         appErrorNetworkHandler(e, dispatch)
//     } finally {
//         dispatch(todolistsActions.setTodolistStatus({status: 'success', todolistId}))
//     }
// }
// export const removeTodolistTC = (todolistId: string) => async (dispatch: Dispatch) => {
//     try {
//         dispatch(appActions.setStatus({status: 'loading'}))
//         dispatch(todolistsActions.setTodolistStatus({status: 'loading', todolistId}))
//         const response = await todolistAPI.deleteTodolist(todolistId)
//         if (response.data.resultCode === StatusCodes.Ok) {
//             dispatch(todolistsActions.removeTodoList({todolistId}))
//             dispatch(appActions.setStatus({status: 'success'}))
//         } else {
//             if (response.data.resultCode === StatusCodes.Error) {
//                 appErrorServerHandler(response.data, dispatch)
//             }
//         }
//     } catch (e) {
//         appErrorNetworkHandler(e, dispatch)
//     } finally {
//         dispatch(todolistsActions.setTodolistStatus({status: 'success', todolistId}))
//     }
// }
// export const createTodolistTC = (title: string) => async (dispatch: Dispatch) => {
//     try {
//         dispatch(appActions.setStatus({status: 'loading'}))
//         const response = await todolistAPI.createTodolist(title)
//         if (response.data.resultCode === StatusCodes.Ok) {
//             dispatch(todolistsActions.addNewTodoList({newTodolist: response.data.data.item}))
//             dispatch(appActions.setStatus({status: 'success'}))
//         } else {
//             if (response.data.resultCode === StatusCodes.Error) {
//                 appErrorServerHandler(response.data, dispatch)
//             }
//         }
//     } catch (e) {
//         appErrorNetworkHandler(e, dispatch)
//     }
// }
// export const fetchTodolistsTC = () => async (dispatch: AppDispatch) => {
//     dispatch(appActions.setStatus({status: 'loading'}))
//     try {
//         const response = await todolistAPI.getTodolists()
//         dispatch(todolistsActions.setTodolists({todolists: response.data}))
//         response.data.forEach((el) => dispatch(fetchTasksTC(el.id)))
//         dispatch(appActions.setStatus({status: 'success'}))
//     } catch (e) {
//         appErrorNetworkHandler(e, dispatch)
//     }
// }



