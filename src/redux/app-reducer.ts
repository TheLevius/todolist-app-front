import {Dispatch} from 'redux';
import {authAPI, AuthInfoType} from '../api/todolists-api';
import { batch } from 'react-redux'

const initialState: InitialStateType = {
    status: 'idle',
    isInitialized: false,
    error: null,
    userInfo: null
}

export const appReducer = (state: InitialStateType = initialState, action: AppActionsType): InitialStateType => {
    switch (action.type) {
        case 'APP/STATUS_CHANGED':
        case 'APP/ISINITIALIZED_CHANGED':
        case 'APP/ERROR_DETECTED':
        case 'APP/USER_INFO_SETTLED':
            return({
                ...state,
                ...action.payload
            })

        default: return state
    }
}

export const appActions = {
    statusChanged: (status: RequestStatusType) => ({type: 'APP/STATUS_CHANGED', payload: {status}} as const),
    isInitializedChanged: (value: boolean) => ({type: 'APP/ISINITIALIZED_CHANGED', payload: {isInitialized: value}} as const),
    errorDetected: (error: string | null) => ({type: 'APP/ERROR_DETECTED', payload: {error}} as const),
    userInfoSettled: (userInfo: any) => ({type: 'APP/USER_INFO_SETTLED', payload: {userInfo}} as const)
};

export const initializeAppTC = () => async (dispatch: Dispatch) => {

    try {
        dispatch(appActions.statusChanged('loading'))
        const response = await authAPI.me()
        batch(()=>{
            dispatch(appActions.userInfoSettled(response.data))
            dispatch(appActions.statusChanged('succeeded'))
        })
    }
    catch(error) {
        batch(()=>{
            dispatch(appActions.statusChanged('failed'))
            dispatch(appActions.errorDetected(error))
        })
    }
    finally {
        dispatch(appActions.isInitializedChanged(true))
    }

}

type InferActionsType<T> = T extends {[key: string]: infer P } ? P : never;
export type AppActionsType = ReturnType<InferActionsType<typeof appActions>>

export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed';
export type InitialStateType = {
    status: RequestStatusType
    isInitialized: boolean;
    error: string | null;
    userInfo: AuthInfoType | null
}