import {authAPI, ResultCodesEnum, todolistsApi, TodolistType} from '../api/todolists-api';
import {appActions, RequestStatusType} from './app-reducer';
import {Dispatch} from 'redux';
import {batch} from 'react-redux';
import {appErrorHandle, netWorkErrorHandle} from '../utils/error-utils';

const initialState:  TodolistDomainType[] = [];

export const todolistReducer = (state: TodolistDomainType[] = initialState, action: TodolistActionsType) => {
    switch (action.type) {
        case 'TODOLIST/ADDED_TODOLIST': {
            return([{...action.payload, filter: 'all', entityStatus: 'idle'},...state])
        }
        case 'TODOLIST/DELETED_TODOLIST': {
            return(state.filter(tl => tl.id !== action.payload.todolistId))
        }
        case 'TODOLIST/CHANGED_TODOLIST_TITLE': {
            return(state.map( tl => (tl.id === action.payload.todolistId ? {...tl, title: action.payload.title} : tl) ))
        }
        case 'TODOLIST/CHANGED_TODOLIST_FILTER': {
            return(state.map( tl => (tl.id === action.payload.todolistId ? {...tl, filter: action.payload.filter} : tl) ))
        }
        case 'TODOLIST/CHANGED_TODOLIST_STATUS': {
            return(state.map( tl => (tl.id === action.payload.todolistId ? {...tl, entityStatus: action.payload.entityStatus} : tl) ))
        }
        case 'TODOLIST/SETTLED_TODOLISTS': {
            return(state.map( tl => ({...tl, filter: 'all', entityStatus: 'idle'} as TodolistDomainType) ))
        }
        default: return state;
    }
}

type InferActionsType<T> = T extends {[key: string]: infer U} ? U : never;
export type TodolistActionsType = ReturnType<InferActionsType<typeof todolistActions>>

export const todolistActions = {
    addedTodolist: (todolist: TodolistType) => ({type: 'TODOLIST/ADDED_TODOLIST', payload: {todolist} } as const),
    deletedTodolist: (todolistId: string) => ({type: 'TODOLIST/DELETED_TODOLIST', payload: {todolistId} } as const),
    changedTodolistTitle: (todolistId: string, title: string) => ({type: 'TODOLIST/CHANGED_TODOLIST_TITLE', payload: {todolistId, title} } as const),
    changedTodolistFilter: (todolistId: string, filter: FilterValuesType) => ({type: 'TODOLIST/CHANGED_TODOLIST_FILTER', payload: {todolistId, filter}} as const),
    changedTodolistEntityStatus: (todolistId: string, entityStatus: RequestStatusType) => (
        {type: 'TODOLIST/CHANGED_TODOLIST_STATUS', payload: {todolistId, entityStatus}} as const
    ),
    setTodolist: (todolists: TodolistType[]) => ({type: 'TODOLIST/SETTLED_TODOLISTS', payload: {todolists}} as const)
}

export const fetchTodolistsTC = () => async (disptach: Dispatch) => {
    disptach(appActions.statusChangedAC('loading'))
    try {
        const {data} = await todolistsApi.getTodolists()
        batch(() => {
            todolistActions.setTodolist(data)
            disptach(appActions.statusChangedAC('succeeded'))
        })
    }
    catch(error) {
        netWorkErrorHandle(error, disptach)
    }
}

export const addTodolist = (title: string) => async (dispatch: Dispatch) => {
    dispatch(appActions.statusChangedAC('loading'))
    try {
        const {data} = await todolistsApi.createTodolist(title)
        if (data.resultCode === ResultCodesEnum.Success) {
            batch(() => {
                todolistActions.addedTodolist(data.data.item)
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
export const deleteTodolist = (todolistId: string) => async (dispatch: Dispatch) => {
    dispatch(appActions.statusChangedAC('loading'))
    try {
        const {data} = await todolistsApi.deleteTodolist(todolistId)
        if (data.resultCode === ResultCodesEnum.Success) {
            batch(() => {
                todolistActions.deletedTodolist(todolistId)
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
export const changeTodolistTitle = (todolistId: string, title: string) => async (dispatch: Dispatch) => {
    try {
        const {data} = await todolistsApi.updateTodolist(todolistId, title)
        if (data.resultCode === ResultCodesEnum.Success) {
            batch(() => {
                todolistActions.changedTodolistTitle(todolistId, title)
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

export type FilterValuesType = 'all' | 'active' |'completed';
export type TodolistDomainType = TodolistType & {filter: FilterValuesType, entityStatus: RequestStatusType}