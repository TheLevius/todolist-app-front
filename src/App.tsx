import React, {useCallback, useEffect} from 'react';
import 'antd/dist/antd.css';
import './App.css';
import {useDispatch, useSelector} from 'react-redux';
import {AppStateType} from './redux/store';
import fastifyLogo from './assets/img/svg/fistify-logo.svg';
import {initializeAppTC, RequestStatusType} from './redux/app-reducer';
import Layout, {Content, Footer, Header} from 'antd/lib/layout/layout';
import {message, Space, Spin} from 'antd';
import Breadcrumb from 'antd/lib/breadcrumb';
import {AddItemForm} from './components/AddItemForm/AddItemForm';
import {TodolistList} from './components/TodolistList/TodolistList';
import {addTodolist} from './redux/todolist-reducer';


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

    const addTodolistHandle = (title: string) => {
        dispatch(addTodolist(title))
    }

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

        <Layout className={'layout'}>
            <Header style={{display: 'flex', backgroundColor: '#6d8aa8'}}>
                <img src={fastifyLogo} alt='fastify logotype' style={{maxWidth: '32px', marginRight: '8px'}}/>
                <h3 style={{color: '#fff'}}>
                    Todolist Application
                </h3>
            </Header>
            <Content className={'site-layout-content'} style={{width: '100%',padding: '0 50px', margin: '0 auto'}}>
                <Breadcrumb style={{margin: '16px 0'}}>
                    <Breadcrumb.Item>Home</Breadcrumb.Item>
                    <Breadcrumb.Item>App</Breadcrumb.Item>
                </Breadcrumb>
                <div className="site-layout-background" style={{flexDirection: 'column', maxWidth: '1200px'}}>
                    <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', margin: '8px'}}>
                        <AddItemForm addItem={addTodolistHandle} />
                    </div>
                    <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'start', width: '100%'}}>
                        <TodolistList />
                    </div>
                </div>
            </Content>

            <Footer style={{textAlign: 'center'}}>
                Todolist Application ©2021 Created by Nikita Levitski
            </Footer>
        </Layout>
    );
}

