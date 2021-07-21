import {authAPI, LoginReqParamsType, ResultCodesEnum} from '../api/todolists-api';
import {Dispatch} from 'redux';
import {batch} from 'react-redux';
import {appActions} from './app-reducer';
import {appErrorHandle, netWorkErrorHandle} from '../utils/error-utils';

const initialState = {
    isLoggedIn: false
}

export const authReducer = (state: InitialStateType = initialState, action: AuthActionsType): InitialStateType => {
    switch (action.type) {
        case 'AUTH/IS_LOGGED_IN_STATUS':
            return ({
                ...state,
                ...action.payload
            })
        default: return state
    }
}

export const authActions = {
    isLoggedInStatusChangedAC: (status: boolean) => ({type: 'AUTH/IS_LOGGED_IN_STATUS', payload: {status}}),
}
type AuthActionsType = ReturnType<typeof  authActions.isLoggedInStatusChangedAC>

export const loginTC = (loginData: LoginReqParamsType) => async (dispatch: Dispatch) => {
    dispatch(appActions.statusChangedAC('loading'))
    try {
        const {data} = await authAPI.login(loginData)
        if (data.resultCode === ResultCodesEnum.Success) {
            batch(()=>{
                dispatch(authActions.isLoggedInStatusChangedAC(true));
                dispatch(appActions.statusChangedAC('succeeded'));
            })
        } else {
            appErrorHandle(data, dispatch)
        }
    }
    catch(error) {
        netWorkErrorHandle(error, dispatch);
        dispatch(authActions.isLoggedInStatusChangedAC(false))
    }
}
export const logoutTC = () => async (dispatch: Dispatch) => {
    dispatch(appActions.statusChangedAC('loading'));
    try {
        const {data} = await authAPI.logout();
        if (data.resultCode === ResultCodesEnum.Success) {
            batch(() => {
                dispatch(authActions.isLoggedInStatusChangedAC(false));
                dispatch(appActions.statusChangedAC('succeeded'));
            })
        } else {
            appErrorHandle(data, dispatch);
        }
    }
    catch(error) {
        netWorkErrorHandle(error, dispatch);
    }
}

export type InitialStateType = {
    isLoggedIn: boolean;
}