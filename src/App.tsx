import React, {useEffect} from 'react';
import './App.css';
import {useDispatch, useSelector} from 'react-redux';
import {AppStateType} from './redux/store';
import {initializeAppTC, RequestStatusType} from './redux/app-reducer';
import {AuthInfoType} from './api/todolists-api';

export const App = () => {
    const dispatch = useDispatch();
    const isInitialized = useSelector<AppStateType, boolean>(state => state.app.isInitialized);
    const status = useSelector<AppStateType, RequestStatusType>(state => state.app.status);
    const userInfo = useSelector<AppStateType, AuthInfoType | null>(state => state.app.userInfo);
    const error = useSelector<AppStateType, string | null>(state => state.app.error);

    useEffect(()=>{
        dispatch(initializeAppTC())
        console.log(userInfo)
    }, [])

    if (!isInitialized) {
        return(
            <div>
            <h1>Initializing...</h1>
        </div>
        );
    }

    return (
        <div className='App'>
            <h1>
                App is initialized
            </h1>
            <h3>with <span style={status === 'succeeded'
                ? ({color: '#3f8442'})
                : status === 'loading'
                    ? ({color: '#dacd00'})
                    : ({color: '#b70000'})
            }>{status}</span> authorization</h3>

        </div>
    );
}

