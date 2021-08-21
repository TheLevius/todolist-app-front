import {Dispatch} from 'redux';
import {authAPI, ResultCodesEnum} from '../api/todolists-api';
import { batch } from 'react-redux'
import {appErrorHandle, netWorkErrorHandle} from '../utils/error-utils';
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

const initialState: InitialStateType = {
    status: 'idle',
    isLoggedIn: true,
    isInitialized: false,
    error: null
}

const slice = createSlice({
    name: 'auth',
    initialState: initialState,
    reducers: {
        statusChangedAC: (state, action: PayloadAction<{status: RequestStatusType}>) => {
            state.status = action.payload.status
        },
        errorDetectedAC: (state, action: PayloadAction<{error: string | null}>) => {
            state.error = action.payload.error
        },
        isInitializedChangedAC: (state, action: PayloadAction<{isInitialized: boolean}>) => {
            state.isInitialized = action.payload.isInitialized
        },
        isLoggedInChangedAC: (state, action: PayloadAction<{isLoggedIn: boolean}>) => {
            state.isLoggedIn = action.payload.isLoggedIn
        }

    }
})

export const appReducer = slice.reducer

// export const appReducer = (state: InitialStateType = initialState, action: AppActionsType): InitialStateType => {
//     switch (action.type) {
//         case 'APP/STATUS_CHANGED':
//         case 'APP/ISINITIALIZED_CHANGED':
//         case 'APP/IS_LOGGED_IN_CHANGED':
//         case 'APP/ERROR_DETECTED':
//             return({
//                 ...state,
//                 ...action.payload
//             })
//
//         default: return state
//     }
// }
export const {statusChangedAC, isInitializedChangedAC, isLoggedInChangedAC, errorDetectedAC} = slice.actions

export const initializeAppTC = () => async (dispatch: Dispatch) => {

    try {
        dispatch(statusChangedAC({status: 'loading'}))
        const {data} = await authAPI.me()
        if (data.resultCode === ResultCodesEnum.Success) {
            batch(()=>{
                dispatch(statusChangedAC({status: 'succeeded'}))
                dispatch(isLoggedInChangedAC({isLoggedIn: true}))
                dispatch(isInitializedChangedAC({isInitialized: true}))
            })
        } else {
            appErrorHandle(data, dispatch)
        }
    }
    catch(error) {
        batch(()=>{
            netWorkErrorHandle(error, dispatch)
        })
    }
}

export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed';
export type InitialStateType = {
    status: RequestStatusType;
    isLoggedIn: boolean;
    isInitialized: boolean;
    error: string | null;
}