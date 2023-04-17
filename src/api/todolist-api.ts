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
    async getTodolists() {
        const response = await instance.get<TodolistType[]>('todo-lists')
        return response.data
    },
    async createTodolist(title: string) {
        const response = await instance.post<{title: string}, AxiosResponse<ResponseType<{item: TodolistType}>>>('todo-lists', {title})
        return response.data
    },
    async deleteTodolist(id: string){
        const response = await instance.delete<ResponseType>(`todo-lists/${id}`)
        return response.data
    },
    async updateTodolistTitle(title: string, id: string){
        const response = await instance.put<{title: string}, AxiosResponse<ResponseType>>(`todo-lists/${id}`, {title})
        return response.data
    },
    //Requests for Tasks
    async getTasks(id: string){
        const response = await instance.get<ResponseTasksType>(`todo-lists/${id}/tasks`)
        return response.data
    },
    async createTask(id: string, title: string) {
        const response = await instance.post<{title: string}, AxiosResponse<ResponseType<{item: TaskType}>>>(`todo-lists/${id}/tasks`, {title})
        return response.data
    },
    async deleteTask(todolistId: string, taskId: string) {
        const response = await instance.delete<ResponseType>(`todo-lists/${todolistId}/tasks/${taskId}`)
        return response.data
    },
    async updateTask(updatedTaskModel: TaskModelType, todolistId: string, taskId: string){
        const response = await instance.put<TaskModelType, AxiosResponse<ResponseType<{item: TaskType}>>>(`todo-list/${todolistId}/tasks/${taskId}`, updatedTaskModel)
        return response.data
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
    status: number
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