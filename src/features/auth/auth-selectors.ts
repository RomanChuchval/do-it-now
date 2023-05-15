import {AppRootStateType} from "app/store";

const isLoggedInSelector = (state: AppRootStateType) => {
    return state.auth.isLoggedIn
}

export {isLoggedInSelector}