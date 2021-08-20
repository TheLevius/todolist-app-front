import React, {FC, useEffect} from 'react';
import {useDispatch} from 'react-redux';
import {addTodolist, fetchTodolistsTC} from '../../redux/todolist-reducer';
import Layout, {Content, Footer, Header} from 'antd/lib/layout/layout';
import fastifyLogo from '../../assets/img/svg/fistify-logo.svg';
import Breadcrumb from 'antd/lib/breadcrumb';
import {AddItemForm} from '../AddItemForm/AddItemForm';
import {Card} from 'antd';
import {Todolists} from '../Todolists/Todolists';

export const TodolistsPage: FC<{}> = (props) => {

    const dispatch = useDispatch()

    const addTodolistHandle = (title: string) => {
        dispatch(addTodolist(title))
    }

    useEffect(()=>{
        dispatch(fetchTodolistsTC())

    }, [dispatch]);

    console.log('TodolistsPage')

    return(
        <Layout className={'layout'} style={{minHeight: '100vh'}}>
            <Header style={{display: 'flex', backgroundColor: '#6d8aa8'}}>
                <img src={fastifyLogo} alt='fastify logotype' style={{maxWidth: '32px', marginRight: '8px'}}/>
                <h3 style={{color: '#fff'}}>
                    Todolist Application
                </h3>
            </Header>
            <Content className={'site-layout-content'} style={{width: '100%', padding: '0 50px', margin: '0 auto'}}>
                <Breadcrumb style={{margin: '16px 8px'}}>
                    <Breadcrumb.Item>Home</Breadcrumb.Item>
                    <Breadcrumb.Item>App</Breadcrumb.Item>
                </Breadcrumb>
                <div className="site-layout-background" style={{flexDirection: 'column', maxWidth: '1200px'}}>
                    <Card style={{margin: '8px'}} bordered={false}>
                        <AddItemForm addItem={addTodolistHandle}/>
                    </Card>
                    <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center', width: '100%'}}>
                        <Todolists />
                    </div>
                </div>
            </Content>
            <Footer style={{textAlign: 'center'}}>
                Todolist Application ©2021 Created by Nikita Levitski
            </Footer>
        </Layout>
    )
}

