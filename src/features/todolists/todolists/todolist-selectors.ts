import {AppRootStateType} from "app/store";

const todolistSelector = (state: AppRootStateType) => state.todoLists

export {todolistSelector}