import {ResultCodesEnum, TaskType, todolistsApi, UpdateTaskModelType} from '../api/todolists-api';
import {Dispatch} from 'redux';
import {appActions} from './app-reducer';
import {batch} from 'react-redux';
import {appErrorHandle, netWorkErrorHandle} from '../utils/error-utils';

export type InitialStateType = {
    [key: string]: TaskType[]
}

const initialState = {

}

export const taskReducer = (state: InitialStateType = {}, action: TaskActionsType) => {
    switch (action.type) {
        case 'TASKS/SET_TASKS': {
            return({
                ...state,
                [action.payload.todolistId]: [...action.payload.tasks]
            })
        }
        case 'TASKS/ADDED_TASK': {
            return({
                ...state,
                [action.payload.task.todoListId]: [...state[action.payload.task.todoListId], {...action.payload.task}]
            })
        }
        case 'TASKS/DELETED_TASK': {
            return({
                ...state,
                [action.payload.todolistId]: [
                    ...state[action.payload.todolistId]
                        .filter(t => t.id !== action.payload.taskId)
                ]
            })
        }
        case 'TASKS/UPDATED_TASK': {
            return({
                ...state,
                [action.payload.model.todoListId]: [
                    ...state[action.payload.model.todoListId]
                        .map(t => t.id === action.payload.model.id
                            ? {...t, ...action.payload.model}
                            : t)
                ]
            })
        }
        default: return state
    }
}
type InferActionsType<T> = T extends {[key: string]: infer U} ? U: never
type TaskActionsType = ReturnType<InferActionsType<typeof taskActions>>

export const taskActions = {
    setTasks: (todolistId: string, tasks: TaskType[]) => ({type: 'TASKS/SET_TASKS', payload: {todolistId, tasks}} as const),
    addedTask: (task: TaskType) => ({type: 'TASKS/ADDED_TASK', payload: {task}} as const),
    deletedTask: (todolistId: string, taskId: string) => ({type: 'TASKS/DELETED_TASK', payload: {todolistId, taskId}} as const),
    updatedTask: (model: UpdateTaskModelType) => ({type: 'TASKS/UPDATED_TASK', payload: {model}} as const)
}


export const fetchTasks = (todolistId: string) => async (dispatch: Dispatch) => {
    dispatch(appActions.statusChangedAC('loading'))
    try {
        const {data} = await todolistsApi.getTasks(todolistId)
        batch(() => {
            dispatch(taskActions.setTasks(todolistId, data.items))
            dispatch(appActions.statusChangedAC('succeeded'))
        })
    }
    catch(error) {
        netWorkErrorHandle(error, dispatch)
    }
}
export const deleteTask = (todolistId: string, taskId: string) => async (dispatch: Dispatch) => {
    dispatch(appActions.statusChangedAC('loading'))
    try {
        const {data} = await  todolistsApi.deleteTask(todolistId, taskId)
        if (data.resultCode === ResultCodesEnum.Success) {
           batch( () => {
               dispatch(taskActions.deletedTask(todolistId, taskId))
               dispatch(appActions.statusChangedAC('succeeded'))
           })
        } else {
            appErrorHandle(data, dispatch)
        }
    }
    catch(error) {
        netWorkErrorHandle(error, dispatch)
    }
}
export const addTask = (todolistId: string, title: string) => async (dispatch: Dispatch) => {
    dispatch(appActions.statusChangedAC('loading'))
    try {
        const {data} = await todolistsApi.createTask(todolistId, title)
        if (data.resultCode === ResultCodesEnum.Success) {
            batch(() => {
                dispatch(taskActions.addedTask(data.data.item))
                dispatch(appActions.statusChangedAC('succeeded'))
            })
        } else {
            appErrorHandle(data, dispatch)
        }
    }
    catch(error) {
        netWorkErrorHandle(error, dispatch)
    }
}
export const updateTask = (todolistId: string, taskId: string, model: UpdateTaskModelType) => async (dispatch: Dispatch) => {
    dispatch(appActions.statusChangedAC('loading'))
    try {
        const {data} = await todolistsApi.updateTask(todolistId, taskId, model)
        if (data.resultCode === ResultCodesEnum.Success) {
            dispatch(taskActions.updatedTask(data.data))
        } else {
            appErrorHandle(data, dispatch)
        }
    }
    catch(error) {
        netWorkErrorHandle(error, dispatch)
    }
}