import {AppRootStateType} from "app/store";

const tasksSelector = (state: AppRootStateType, todolistId: string) => {
    return state.tasks[todolistId]
}

export {tasksSelector}