import {authAPI, LoginReqParamsType, ResultCodesEnum} from '../api/todolists-api';
import {Dispatch} from 'redux';
import {batch} from 'react-redux';
import {appActions} from './app-reducer';
import {appErrorHandle, netWorkErrorHandle} from '../utils/error-utils';
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

const initialState = {
    isLoggedIn: false
}

const slice = createSlice({
    name: 'auth',
    initialState: initialState,
    reducers: {
        isLoggedInStatusChangedAC(state, action: PayloadAction<{value: boolean}>) {
           state.isLoggedIn = action.payload.value;
        }
    }
});

export const authReducer = slice.reducer;

export const {isLoggedInStatusChangedAC} = slice.actions;

// (state: InitialStateType = initialState, action: AuthActionsType): InitialStateType => {
//     switch (action.type) {
//         case 'AUTH/IS_LOGGED_IN_STATUS':
//             return ({
//                 ...state,
//                 ...action.payload
//             })
//         default: return state
//     }
// }

// export const authActions = {
//     isLoggedInStatusChangedAC: (status: boolean) => ({type: 'AUTH/IS_LOGGED_IN_STATUS', payload: {status}}),
// }
// type AuthActionsType = ReturnType<typeof  authActions.isLoggedInStatusChangedAC>

export const loginTC = (loginData: LoginReqParamsType) => async (dispatch: Dispatch) => {
    dispatch(appActions.statusChangedAC('loading'))
    try {
        const {data} = await authAPI.login(loginData)
        if (data.resultCode === ResultCodesEnum.Success) {
            batch(()=>{
                dispatch(isLoggedInStatusChangedAC({value: true}));
                dispatch(appActions.statusChangedAC('succeeded'));
            })
        } else {
            appErrorHandle(data, dispatch)
        }
    }
    catch(error) {
        netWorkErrorHandle(error, dispatch);
        dispatch(isLoggedInStatusChangedAC({value: false}))
    }
}
export const logoutTC = () => async (dispatch: Dispatch) => {
    dispatch(appActions.statusChangedAC('loading'));
    try {
        const {data} = await authAPI.logout();
        if (data.resultCode === ResultCodesEnum.Success) {
            batch(() => {
                dispatch(isLoggedInStatusChangedAC({value: true}));
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

// export type InitialStateType = {
//     isLoggedIn: boolean;
// }