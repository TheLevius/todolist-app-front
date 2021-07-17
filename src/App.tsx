import React, {useEffect} from 'react';
import 'antd/dist/antd.css';
import './App.css';
import {useDispatch, useSelector} from 'react-redux';
import {AppStateType} from './redux/store';
import fastifyLogo from './assets/img/svg/fistify-logo.svg';
import {initializeAppTC, RequestStatusType} from './redux/app-reducer';
import Row from 'antd/lib/grid/row';
import Col from 'antd/lib/grid/col';
import Layout, {Content, Footer, Header} from 'antd/lib/layout/layout';
import {message, Space, Spin} from 'antd';
import Button from 'antd/lib/button';



export const App = () => {
    const dispatch = useDispatch();
    const isInitialized = useSelector<AppStateType, boolean>(state => state.app.isInitialized);
    const status = useSelector<AppStateType, RequestStatusType>(state => state.app.status);
    const error = useSelector<AppStateType, string | null>(state => state.app.error);

    const initNotification = 'initializeNotificatoin';

    const initializationMessage = () => {

        if (status === 'loading') {
            message.loading({content: 'initializing!', key: initNotification, duration: 0})
        } else if (status === 'succeeded') {
            message.success({content: 'App Initialized!', key: initNotification, duration: 3})
        } else if (status === 'failed') {
            message.warning({content: 'App Initialized without authorization!', key: initNotification, duration: 3})
        }

    };

    useEffect(()=>{
        if (!isInitialized) {
            dispatch(initializeAppTC())
        }

       if (status !== 'idle') {
           initializationMessage()
       }
    }, [dispatch, status])
    console.log('App rendered')
    if (!isInitialized) {
        return(
            <div className='App'>
                <Space size='middle'>
                    <Spin size='large' tip='Initialize...'/>
                </Space>
            </div>
        );
    }

    return (
        <>
            <Layout>
                <Header style={{backgroundColor: '#6d8aa8'}}>
                    <Row justify={'center'}>
                        <Col span={1}>
                            <div className={'logo'} style={{color: '#fff', maxWidth: '32px'}}>
                                <img src={fastifyLogo} alt='fastify-logotype' />
                            </div>
                        </Col>
                        <Col span={5}>
                            <h3 style={{color: '#fff'}}>
                               Todolist Application
                            </h3>
                        </Col>
                    </Row>
                </Header>
                <Content>

                </Content>
                <Footer>

                </Footer>
            </Layout>
        </>
        // <div className={'App'}>
        //     <h1>
        //         App is initialized
        //     </h1>
        //     <h3>with <span style={status === 'succeeded'
        //             ? ({color: '#3f8442'})
        //             : status === 'loading'
        //                 ? ({color: '#dacd00'})
        //                 : ({color: '#b70000'})
        //         }>{status}
        //         </span> authorization
        //     </h3>
        //
        // </div>
    );
}

