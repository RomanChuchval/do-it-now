import {setErrorAC, SetErrorACType, setLoadingAC, SetLoadingACType} from "../redux/reducers/app-reducer";
import {ResponseType} from "../api/todolist-api";
import {Dispatch} from "redux";
import {isAxiosError} from "axios";

export const appErrorServerHandler = <D>(responseData: ResponseType<D>, dispatch: ErrorUtilsDispatchType) => {
    if(responseData.messages.length) {
        dispatch(setErrorAC(responseData.messages[0]))
    } else {
        dispatch(setErrorAC('Some error'))
    }
    dispatch(setLoadingAC('failed'))
}

export const appErrorNetworkHandler = (e: unknown, dispatch:ErrorUtilsDispatchType) => {
    const error = isAxiosError(e) ? e.message : 'Some Error!'
    dispatch(setErrorAC(error))
    dispatch(setLoadingAC('failed'))
}

type ErrorUtilsDispatchType = Dispatch<SetLoadingACType | SetErrorACType>