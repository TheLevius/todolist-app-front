import axios from 'axios';

//axios configured instance
const incu = axios.create({
    baseURL: 'https://social-network.samuraijs.com/api/1.1/',
    withCredentials: true,
    headers: {
        'API-KEY': '83ff2ca7-a319-4045-8f15-c83797dc9c95'
    }
});

//API
export const authAPI = {
    me() {
        return incu.get<ResponseType<AuthInfoType>>(`auth/me`)
    },
    login(data: LoginReqParamsType) {
        return incu.post<ResponseType<LoginResDataType>>(`auth/login`, {data})
    },
    logout() {
        return incu.delete<ResponseType>(`auth/login`)
    }
}

export const todolistsApi = {
    getTodolists() {
        return incu.get<TodolistType[]>(`todo-lists`);
    },
    createTodolist(title: string) {
        return incu.post<ResponseType<{item: TodolistType}>>(`todo-lists`, {title});
    },
    deleteTodolist(todolistId: string) {
        return incu.delete<ResponseType>(`todo-lists/${todolistId}`);
    },
    updateTodolist(todolistId: string, title: string) {
        return incu.put<ResponseType>(`todo-lists/${todolistId}`, {title});
    },
    getTasks(todolistId: string) {
        return incu.get<GetTasksType>(`todo-lists/${todolistId}/tasks`);
    },
    createTask(todolistId: string, title: string) {
        return incu.post<ResponseType<{items: TaskType[]}>>(`todo-lists/${todolistId}/tasks`, {title});
    },
    deleteTask(todolistId: string, taskId: string) {
        return incu.delete<ResponseType>(`todo-lists/${todolistId}/tasks/${taskId}`);
    },
    updateTask(todolistId: string, taskId: string, model: UpdateTaskModelType) {
        return incu.put<ResponseType>(`todo-lists/${todolistId}/tasks/${taskId}`, model)
    }

}

//types
export type ResponseType<D = {}> = {
    resultCode: number;
    messages: string[];
    data: D
}

//authTypes
export type LoginReqParamsType = {
    login: string;
    password: string;
    rememberMe: boolean;
    captcha?: string;
}

export type LoginResDataType = {
    userId: string
}
export type AuthInfoType = {
    id: number;
    email: string;
    login: string;
}

//TodosTypes
export type TodolistType = {
    id: string;
    addedDate: string;
    order: number;
    title: string;
}

//TasksTypes
export type GetTasksType = {
    items: TaskType[];
    totalCount: number;
    error: string | null;
}

export type TaskType = {
    description: string;
    title: string;
    status: TaskStatusesType;
    priority: TaskPrioritiesType;
    startDate: string;
    deadline: string;
    id: string;
    todoListId: string;
    order: number;
    addedDate: string;
}

export type UpdateTaskModelType = {
    title: string;
    description: string;
    startDate: string;
    deadline: string;
    status: TaskStatusesType;
    priority: TaskPrioritiesType;
}

export enum TaskStatusesType {
    New = 0,
    InProgress = 1,
    Completed = 2,
    Draft = 3
}

export enum TaskPrioritiesType {
    Low = 0,
    Middle = 1,
    Hi = 2,
    Urgently = 3,
    Later = 4
}