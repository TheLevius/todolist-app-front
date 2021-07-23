import React, {FC, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {fetchTodolistsTC, TodolistDomainType} from '../../redux/todolist-reducer';
import {AppStateType} from '../../redux/store';
import {Todolist} from '../Todolist/Todolist';

export const TodolistList: FC<{}> = ({...props}) => {

    const dispatch = useDispatch()
    const todolistList = useSelector<AppStateType, TodolistDomainType[]>(state => state.todolist)
    console.log('todolistList: ', todolistList)
    useEffect(()=>{
        dispatch(fetchTodolistsTC())

    }, [dispatch]);

    return(
        <>
            {todolistList.map(td => (
                <Todolist key={td.id} td={td} />
            ))}
        </>
    )
}

