import {ResType} from '../api/todolists-api';
import {Dispatch} from 'redux';
import {errorDetectedAC, statusChangedAC} from "../redux/app-reducer";

export const appErrorHandle = (data: ResType, dispatch: Dispatch): void => {
    if (data.messages.length) {
        dispatch(errorDetectedAC({error: data.messages[0]}))
    } else {
        dispatch(errorDetectedAC({error: 'Some error occured'}))
    }
    dispatch(statusChangedAC({status: 'failed'}))
}

export const netWorkErrorHandle = (error: {message: string}, dispatch: Dispatch): void => {
    dispatch(errorDetectedAC({error: error.message ? error.message : 'Some error occured'}))
    dispatch(statusChangedAC({status: 'failed'}))
}