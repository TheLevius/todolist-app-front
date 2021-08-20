import React, {useCallback, useEffect} from 'react';
import 'antd/dist/antd.css';
import './App.css';
import {useDispatch, useSelector} from 'react-redux';
import {AppStateType} from './redux/store';
import {initializeAppTC, RequestStatusType} from './redux/app-reducer';
import {message, Space, Spin} from 'antd';
import {TodolistsPage} from './components/TodolistsPage/TodolistsPage';
import {Switch, Route, Redirect} from 'react-router-dom';
import {LoginPage} from './components/LoginPage/LoginPage';
import {RegistrationPage} from './components/RegistrationPage/RegistrationPage';

export const App = () => {
    const dispatch = useDispatch();
    const isInitialized = useSelector<AppStateType, boolean>(state => state.app.isInitialized);
    const status = useSelector<AppStateType, RequestStatusType>(state => state.app.status);
    const error = useSelector<AppStateType, string | null>(state => state.app.error);

    const initNotification = 'initializeNotificatoin';
    const initializationMessage = useCallback((status: string) => {
            if (status === 'loading') {
                message.loading({content: 'initializing!', key: initNotification, duration: 0, className: 'custom-class', style: {marginTop: '20vh'}})
            } else if (status === 'succeeded') {
                message.success({content: 'App Initialized!', key: initNotification, duration: 1, className: 'custom-class', style: {marginTop: '20vh'}})
            } else if (error?.length && status === 'failed') {
                message.error({content: error, key: initNotification, duration: 5, className: 'custom-class', style: {marginTop: '20vh'}})
            } else if (status === 'failed') {
                message.warning({content: !!error ? error : 'Some app error', key: initNotification, duration: 3, className: 'custom-class', style: {marginTop: '20vh'}})
            }

    }, [error]);

    useEffect(() => {
        if (!isInitialized) {
            console.log(`initialization requested, status: ${isInitialized}`)
            dispatch(initializeAppTC())
        }
    }, [dispatch, isInitialized])


    useEffect(() => {
        if (status !== 'idle') {
            console.log('status: ', status)
            initializationMessage(status)
        }
    }, [dispatch, status, initializationMessage])

    console.log('App rendered')

    if (!isInitialized) {
        return(
            <div className='App'>
                <Space size='large'>
                    <Spin size='large' tip='Initialize...'/>
                </Space>
            </div>
        );
    }

    return (
        <>
            <Switch>
                <Route path={'/login'} render={()=><LoginPage /> } />
                <Route path={'/registration'} render={()=><RegistrationPage /> } />
                <Route path={'/'} exact render={ () => {
                    if (!isInitialized) {
                        return(<Redirect to={'/login'}/>)
                    }
                    return <Redirect to={'/todolists'} />
                }} />
                <Route path={'/todolists'} render={()=><TodolistsPage/>} />
                <Route path={'*'} render={()=><h1>404 Page not found</h1>} />
            </Switch>
        </>
    );
}

