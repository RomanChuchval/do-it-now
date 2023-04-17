import axios, {AxiosResponse} from "axios";


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
        return instance.post<{title: string}, AxiosResponse<ResponseType<{item: TodolistType}>>>('todo-lists', {title})
    },
    async deleteTodolist(id: string){
        return instance.delete<ResponseType>(`todo-lists/${id}`)
    },
    async updateTodolistTitle(title: string, id: string){
        return instance.put<{title: string}, AxiosResponse<ResponseType>>(`todo-lists/${id}`, {title})
    },
    //Requests for Tasks
    async getTasks(id: string){
        return instance.get<ResponseTasksType>(`todo-lists/${id}/tasks`)
    },
    async createTask(id: string, title: string) {
        return instance.post<{title: string}, AxiosResponse<ResponseType<{item: TaskType}>>>(`todo-lists/${id}/tasks`, {title})
    },
    async deleteTask(todolistId: string, taskId: string) {
        return instance.delete<ResponseType>(`todo-lists/${todolistId}/tasks/${taskId}`)
    },
    async updateTask(updatedTaskModel: TaskModelType, todolistId: string, taskId: string){
        return instance.put<TaskModelType, AxiosResponse<ResponseType<{item: TaskType}>>>(`todo-list/${todolistId}/tasks/${taskId}`, updatedTaskModel)
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
    status: number
    priority: number
    startDate: string
    deadline: string
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