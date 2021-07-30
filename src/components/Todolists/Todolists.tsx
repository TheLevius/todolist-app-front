import React, {FC} from 'react';
import {Todolist} from '../Todolist/Todolist';
import {useSelector} from 'react-redux';
import {AppStateType} from '../../redux/store';
import {TodolistDomainType} from '../../redux/todolist-reducer';
import {todoListsSelector} from '../../redux/selectors';



export const Todolists: FC<{}> = (props) => {

    const todolistList = useSelector<AppStateType, TodolistDomainType[]>(state => todoListsSelector(state))

    return(
        <>
            {todolistList?.map(td => (<Todolist key={td.id} td={td}/>))}
        </>
    )
}