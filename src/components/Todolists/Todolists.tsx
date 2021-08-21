import React, {FC} from 'react';
import {Todolist} from '../Todolist/Todolist';
import {TodolistDomainType} from '../../redux/todolist-reducer';
import {Space, Spin} from "antd";
import {useSelector} from "react-redux";
import {AppStateType} from "../../redux/store";


export const Todolists: FC = () => {

    const todolists = useSelector<AppStateType, TodolistDomainType[] | null>(state => {
        return (!!state.todolist ? state.todolist : null)
    })

    if (!todolists) {
        console.log('spinners')
        return (
            <Space size='large'>
                <Spin size='large' tip='Initialize...'/>
            </Space>
        )
    }

    console.log('todolist mapping')
    return (
        <>
            {todolists.map(td => (<Todolist key={td.id} title={td.title} id={td.id} filter={td.filter}/>))}
        </>
    )
}