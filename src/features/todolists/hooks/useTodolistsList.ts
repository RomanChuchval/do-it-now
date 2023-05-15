import {useAuth} from "features/auth/hooks/useAuth";
import {useAppDispatch} from "app/hooks/use-AppDispatch";
import {useAppSelector} from "app/hooks/use-AppSelector";
import {todolistsSelector} from "features/todolists/todolist-selectors";
import {useCallback, useEffect} from "react";
import {todolistsThunks} from "features/todolists/todolists-slice";
import {useNavigate} from "react-router-dom";

export const useTodolistsList = () => {
    const {isLoggedIn} = useAuth()
    const dispatch = useAppDispatch()
    const todoLists = useAppSelector(todolistsSelector)
    const navigate = useNavigate()


    useEffect( ()=>{
        if(isLoggedIn) {
            dispatch(todolistsThunks.fetchTodolists())
        } else {
            navigate('/login')
        }
    }, [dispatch, navigate, isLoggedIn])

    const addNewTodoList = useCallback((title: string) => {
        dispatch(todolistsThunks.createTodolist({title}))
    }, [dispatch])

    return {
        todoLists,
        addNewTodoList
    }
}