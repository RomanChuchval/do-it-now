import axios, {AxiosResponse} from "axios";
import {FormDataType} from "features/auth/Login";


const instance = axios.create({
    baseURL: 'https://social-network.samuraijs.com/api/1.1/',
    withCredentials: true,
    headers: {
        'API-KEY': '18834bd2-c0a1-4861-8b70-0a39eda94260'
    }
})

export const todolistAPI = {
    //Requests for Todolists
    getTodolists() {
         return instance.get<TodolistType[]>('todo-lists')
    },
    createTodolist(title: string) {
        return instance.post<ResponseType<{item: TodolistType}>, AxiosResponse<ResponseType<{item: TodolistType}>>>('todo-lists', {title})
    },
    deleteTodolist(id: string){
        return instance.delete<ResponseType>(`todo-lists/${id}`)
    },
    updateTodolistTitle(title: string, id: string){
        return instance.put<ResponseType, AxiosResponse<ResponseType>>(`todo-lists/${id}`, {title})
    },
    //Requests for Tasks
    getTasks(id: string){
        return instance.get<ResponseTasksType>(`todo-lists/${id}/tasks`)
    },
    createTask(id: string, title: string) {
        return instance.post<ResponseType<{item: TaskType}>, AxiosResponse<ResponseType<{item: TaskType}>>>(`todo-lists/${id}/tasks`, {title})
    },
    removeTask(todolistId: string, taskId: string) {
        return instance.delete<ResponseType>(`todo-lists/${todolistId}/tasks/${taskId}`)
    },
    updateTask(updatedTaskModel: TaskModelType, todolistId: string, taskId: string){
        return instance.put<ResponseType<{item: TaskType}>, AxiosResponse<ResponseType<{item: TaskType}>>>(`todo-lists/${todolistId}/tasks/${taskId}`, updatedTaskModel)
    }
}

export const authAPI = {
    login(loginData: FormDataType) {
        return instance.post<ResponseType<{userId: number}>, AxiosResponse<ResponseType<{userId: number}>>>('auth/login', loginData)
    },
    logout(){
        return instance.delete<ResponseType, AxiosResponse<ResponseType>>('auth/login')
    },
    me(){
        return instance.get<ResponseType<AuthMeDataType>>('auth/me')
    }
}

export type TodolistType = {
    id: string
    title: string
    addedDate: string
    order: string
}

export type ResponseType <T = {}> = {
    resultCode: number
    messages: string[]
    data: T
}

export type ResponseTasksType = {
    items: TaskType[]
    totalCount: number
    error: string
}

export type TaskType = {
    description: string
    title: string
    completed: boolean
    status: TaskStatuses
    priority: number
    startDate: string
    deadline: string
    id: string
    todoListId: string
    order: number
    addedDate: string
}
export type TaskModelType = {
    title: string
    description: string
    completed: boolean
    status: TaskStatuses
    priority: number
    startDate: string
    deadline: string
}
export type AuthMeDataType = {
    id: number
    email: string
    login: string
}
export enum TaskStatuses {
    New = 0,
    inProgress = 1,
    Completed = 3,
}

export enum StatusCodes {
    Ok = 0,
    Error = 1
}