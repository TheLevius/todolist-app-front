import {ResType} from '../api/todolists-api';
import {Dispatch} from 'redux';
import {appActions} from '../redux/app-reducer';

export const appErrorHandle = (data: ResType, dispatch: Dispatch): void => {
    if (data.messages.length) {
        dispatch(appActions.errorDetectedAC(data.messages[0]))
    } else {
        dispatch(appActions.errorDetectedAC('Some error occured'))
    }
    dispatch(appActions.statusChangedAC('failed'))
}

export const netWorkErrorHandle = (error: {message: string}, dispatch: Dispatch): void => {
    dispatch(appActions.errorDetectedAC(error.message ? error.message : 'Some error occured'))
    dispatch(appActions.statusChangedAC('failed'))
}