import {ResultCodesEnum, todolistsApi, TodolistType} from '../api/todolists-api';
import {RequestStatusType} from './app-reducer';
import {Dispatch} from 'redux';
import {batch} from 'react-redux';
import {appErrorHandle, netWorkErrorHandle} from '../utils/error-utils';
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

const initialState: TodolistDomainType[] = [];


const slice = createSlice({
    name: 'todolist',
    initialState: initialState,
    reducers: {
        addedTodolist: (state, action: PayloadAction<{todolist: TodolistType}>) => {
            state.push({filter: 'all', entityStatus: 'idle', ...action.payload.todolist})
        },
        deletedTodolist: (state, action: PayloadAction<{todolistId: string}>) => {
            const index = state.findIndex(td => td.id === action.payload.todolistId)
            if (index > -1) state.splice(index, 1);
        },
        changedTodolistTitle: (state, action: PayloadAction<{todolistId: string, title: string}>) => {
            const index = state.findIndex(td => td.id === action.payload.todolistId)
            state[index].title = action.payload.title;
        },
        changedTodolistFilter: (state, action: PayloadAction<{todolistId: string, filter: FilterValuesType}>) => {
            const index = state.findIndex(td => td.id === action.payload.todolistId)
            state[index].filter = action.payload.filter;
        },
        changedTodolistEntityStatus: (state, action: PayloadAction<{todolistId: string, entityStatus: RequestStatusType}>) => {
            const index = state.findIndex(td => td.id === action.payload.todolistId)
            state[index].entityStatus = action.payload.entityStatus;
        },
        setTodolists: (state, action: PayloadAction<{todolists: TodolistType[]}>) => {
            return action.payload.todolists.forEach(td => {
                td.filter = 'all'
                td.entityStatus = 'idle'
            })
        },
    }
})

export const todolistReducer = slice.reducer;

export const {
    addedTodolist,
    deletedTodolist,
    changedTodolistTitle,
    changedTodolistFilter,
    changedTodolistEntityStatus,
    setTodolists
} = slice.actions


export const fetchTodolistsTC = () => async (dispatch: Dispatch) => {
    try {
        const {data} = await todolistsApi.getTodolists()
            dispatch(setTodolists({todolists: data}))
    } catch (error) {
        netWorkErrorHandle(error, dispatch)
    }
}

export const addTodolist = (title: string) => async (dispatch: Dispatch) => {
    try {
        const {data} = await todolistsApi.createTodolist(title)
        if (data.resultCode === ResultCodesEnum.Success) {

            dispatch(addedTodolist({todolist: data.data.item}))
        } else {
            appErrorHandle(data, dispatch)
        }
    } catch (error) {

        netWorkErrorHandle(error, dispatch)
    }
}
export const deleteTodolist = (todolistId: string) => async (dispatch: Dispatch) => {
    try {
        const {data} = await todolistsApi.deleteTodolist(todolistId)

        if (data.resultCode === ResultCodesEnum.Success) {
            dispatch(deletedTodolist({todolistId: todolistId}))
        } else {
            appErrorHandle(data, dispatch)
        }
    } catch (error) {
        netWorkErrorHandle(error, dispatch)
    }
}
export const changeTodolistTitle = (todolistId: string, title: string) => async (dispatch: Dispatch) => {
    try {
        const {data} = await todolistsApi.updateTodolist(todolistId, title)
        if (data.resultCode === ResultCodesEnum.Success) {
            batch(() => {
                changedTodolistTitle({todolistId, title})
            })
        } else {
            appErrorHandle(data, dispatch)
        }
    } catch (error) {
        netWorkErrorHandle(error, dispatch)
    }
}


export type FilterValuesType = 'all' | 'active' | 'completed';
export type TodolistDomainType = TodolistType & { filter: FilterValuesType, entityStatus: RequestStatusType }