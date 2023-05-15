import {useAppSelector} from "app/hooks/use-AppSelector";
import {useAppDispatch} from "app/hooks/use-AppDispatch";
import {authThunks} from "features/auth/auth-slice";
import {isLoggedInSelector} from "features/auth/auth-selectors";
import {useCallback} from "react";
import {LoginRequestData} from "api/todolist-api";

export const useAuth = () => {
    const isLoggedIn = useAppSelector<boolean>(isLoggedInSelector)
    const dispatch = useAppDispatch()

    const login = useCallback((data: LoginRequestData) => {
        dispatch(authThunks.login(data))
    }, [dispatch])

    const logout = useCallback(() => {
        dispatch(authThunks.logout())
    }, [dispatch])
    return {isLoggedIn, login, logout}
}