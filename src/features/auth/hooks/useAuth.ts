import {useAppSelector} from "app/hooks/use-AppSelector";
import {useAppDispatch} from "app/hooks/use-AppDispatch";
import {LoginRequestData} from "features/auth/hooks/useAuthForm";
import {authThunks} from "features/auth/auth-slice";
import {isLoggedInSelector} from "features/auth/auth-selectors";

export const useAuth = () => {
    const isLoggedIn = useAppSelector<boolean>(isLoggedInSelector)
    const dispatch = useAppDispatch()

    const login = (data: LoginRequestData) => {
        dispatch(authThunks.login(data))
    }

    const logout = () => {
        dispatch(authThunks.logout())
    }
    return {isLoggedIn, login, logout}
}