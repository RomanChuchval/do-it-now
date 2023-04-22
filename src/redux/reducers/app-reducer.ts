//Constants for AC
const SET_LOADING = 'APP/SET_LOADING'
const SET_ERROR = 'APP/SET_ERROR'



const initialState = {
    status: 'idle' as AppStatus,
    error: null as string | null
}
export const appReducer = (state: InitialStateType = initialState, action: AppActionsType): InitialStateType => {
    switch (action.type) {
        case SET_LOADING:
            return {...state, status: action.payload.status}
        case SET_ERROR:
            return {...state, error: action.payload.ErrorValue}
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

//Types
export type AppStatus = 'idle' | 'loading' | 'success' | 'failed'
export type SetLoadingACType = ReturnType<typeof setLoadingAC>
export type SetErrorACType = ReturnType<typeof setErrorAC>
export type AppActionsType = SetLoadingACType | SetErrorACType
export type InitialStateType = typeof initialState