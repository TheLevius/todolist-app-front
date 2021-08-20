import {Dispatch} from 'redux';
import {authAPI, ResultCodesEnum} from '../api/todolists-api';
import { batch } from 'react-redux'
import {appErrorHandle, netWorkErrorHandle} from '../utils/error-utils';

const initialState: InitialStateType = {
    status: 'idle',
    isLoggedIn: true,
    isInitialized: false,
    error: null
}

export const appReducer = (state: InitialStateType = initialState, action: AppActionsType): InitialStateType => {
    switch (action.type) {
        case 'APP/STATUS_CHANGED':
        case 'APP/ISINITIALIZED_CHANGED':
        case 'APP/IS_LOGGED_IN_CHANGED':
        case 'APP/ERROR_DETECTED':
            return({
                ...state,
                ...action.payload
            })

        default: return state
    }
}

export const appActions = {
    statusChangedAC: (status: RequestStatusType) => ({type: 'APP/STATUS_CHANGED', payload: {status}} as const),
    isInitializedChangedAC: (value: boolean) => ({type: 'APP/ISINITIALIZED_CHANGED', payload: {isInitialized: value}} as const),
    isLoggedInChangedAC: (value: boolean) => ({type: 'APP/IS_LOGGED_IN_CHANGED', payload: {isLoggedIn: value}} as const),
    errorDetectedAC: (error: string | null) => ({type: 'APP/ERROR_DETECTED', payload: {error}} as const)
};

export const initializeAppTC = () => async (dispatch: Dispatch) => {

    try {
        dispatch(appActions.statusChangedAC('loading'))
        const {data} = await authAPI.me()
        if (data.resultCode === ResultCodesEnum.Success) {
            batch(()=>{
                dispatch(appActions.statusChangedAC('succeeded'))
                dispatch(appActions.isLoggedInChangedAC(true))
                dispatch(appActions.isInitializedChangedAC(true))
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

type InferActionsType<T> = T extends {[key: string]: infer P } ? P : never;
export type AppActionsType = ReturnType<InferActionsType<typeof appActions>>

export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed';
export type InitialStateType = {
    status: RequestStatusType;
    isLoggedIn: boolean;
    isInitialized: boolean;
    error: string | null;
}