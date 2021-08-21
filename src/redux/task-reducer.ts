import {ResultCodesEnum, TaskType, todolistsApi, UpdateTaskModelType} from '../api/todolists-api';
import {Dispatch} from 'redux';
import {batch} from 'react-redux';
import {appErrorHandle, netWorkErrorHandle} from '../utils/error-utils';
import {AppStateType} from './store';
import {addedTodolist, deletedTodolist, setTodolists} from "./todolist-reducer";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

export type InitialStateType = {
    [key: string]: TaskType[]
}

const initialState: InitialStateType = {}

const slice = createSlice({
    name: 'tasks',
    initialState: initialState,
    reducers: {
        setTasks: (state, action: PayloadAction<{todolistId: string, tasks: TaskType[]}>) => {
            state[action.payload.todolistId].push(...action.payload.tasks)
        },
        addedTask: (state, action: PayloadAction <{task: TaskType}>) => {
            state[action.payload.task.todoListId].unshift(action.payload.task)
        },
        deletedTask: (state, action: PayloadAction <{todolistId: string, taskId: string}>) => {
            const index = state[action.payload.todolistId].findIndex(t => t.id === action.payload.taskId)
            state[action.payload.todolistId].splice(index, 1);
        },
        updatedTask: (state, action: PayloadAction <{model: UpdateTaskModelType}>) => {
            const index = state[action.payload.model.todoListId].findIndex(t => t.id === action.payload.model.todoListId);
            state[action.payload.model.todoListId][index] = {
                ...state[action.payload.model.todoListId][index],
                ...action.payload.model
            }
        }
    },
    extraReducers: (builder) => {
        builder.addCase(addedTodolist, (state, action) => {
            state[action.payload.todolist.id] = []
        });
        builder.addCase(deletedTodolist, (state, action) => {
            delete state[action.payload.todolistId]
        });
        builder.addCase(setTodolists, (state, action) => {
            action.payload.todolists.forEach((td) => state[td.id] = [])
        });
    }
})

export const taskReducer = slice.reducer;

export const {setTasks, addedTask, deletedTask, updatedTask} = slice.actions;

export const fetchTasks = (todolistId: string) => async (dispatch: Dispatch) => {

    try {
        const {data} = await todolistsApi.getTasks(todolistId)
        batch(() => {
            dispatch(setTasks({todolistId, tasks: data.items}))
        })
    }
    catch(error) {
        netWorkErrorHandle(error, dispatch)
    }
}
export const deleteTask = (todolistId: string, taskId: string) => async (dispatch: Dispatch) => {

    try {
        const {data} = await todolistsApi.deleteTask(todolistId, taskId)
        if (data.resultCode === ResultCodesEnum.Success) {
           batch( () => {
               dispatch(deletedTask({todolistId, taskId}))
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

    try {
        const {data} = await todolistsApi.createTask(todolistId, title)
        if (data.resultCode === ResultCodesEnum.Success) {
            batch(() => {
                dispatch(addedTask({task: data.data.item}))
            })
        } else {
            appErrorHandle(data, dispatch)
        }
    }
    catch(error) {
        netWorkErrorHandle(error, dispatch)
    }
}
export const updateTask = (todolistId: string, taskId: string, model: UpdateTaskModelType) => async (dispatch: Dispatch, getState: () => AppStateType) => {
    try {
        const {data} = await todolistsApi.updateTask(todolistId, taskId, model)
        if (data.resultCode === ResultCodesEnum.Success) {
            dispatch(updatedTask({ model: data.data}))
        } else {
            appErrorHandle(data, dispatch)
        }
    }
    catch(error) {
        netWorkErrorHandle(error, dispatch)
    }
}