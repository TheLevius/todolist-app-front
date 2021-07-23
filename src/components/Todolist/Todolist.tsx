import React, {FC, useEffect} from 'react';
import {Button, Radio} from 'antd';
import Card from 'antd/lib/card';
import {EditableSpan} from '../common/EditableSpan/EditableSpan';
import {DeleteFilled} from '@ant-design/icons/lib';
import {Task} from './Task/Task';
import {AddItemForm} from '../AddItemForm/AddItemForm';
import {changeTodolistTitle, deleteTodolist, TodolistDomainType} from '../../redux/todolist-reducer';
import {useDispatch, useSelector} from 'react-redux';
import {fetchTasks} from '../../redux/task-reducer';
import {AppStateType} from '../../redux/store';
import {TaskType} from '../../api/todolists-api';


export const Todolist: FC<{td: TodolistDomainType}> = ({td}) => {

    const dispatch = useDispatch();
    const taskList = useSelector<AppStateType, TaskType[]>(state => (state.task[td.id]))
    console.log('taskList: ', taskList)
    const taskComponents = taskList !== undefined ? taskList.map(t => (<Task key={t.id} task={t} />)) : <>Empty</>;

    useEffect(() => {
        console.log('useEffect from todolist')
        dispatch(fetchTasks(td.id))

    }, [dispatch, td.id])

    const addTaskHandle = (title: string) => {
        console.log(title)
    }

    const onTodolistTitleChanged = (title: string) => {
        dispatch(changeTodolistTitle(td.id, title))
    }

    const onRemoveTodolistClick = () => {
        dispatch(deleteTodolist(td.id))
    }


    return (
        <Card style={{flexGrow: 1, margin: '8px'}} title={
            <div style={{display: 'flex', alignItems: 'center'}}>
                <EditableSpan onTitleChange={onTodolistTitleChanged} title={td.title}
                              bordered={false}
                              strong={true}
                              style={{
                    marginLeft: '0',
                    paddingLeft: '0',
                    fontSize: '20px',
                    lineHeight: '1',
                    textAlign: 'left',
                    overflow: 'visible'
                }}/>
                <Button
                    onClick={onRemoveTodolistClick}
                    type='text'
                    style={{marginLeft: '8px'}}
                    icon={<DeleteFilled style={{color: '#c8c8c8', fontSize: '18px'}}/>}
                    shape='circle'
                />
            </div>
        } bordered={false}>
            <div style={{display: 'flex'}}>
                <AddItemForm addItem={addTaskHandle}/>
            </div>
            <div style={{display: 'flex', flexDirection: 'column'}}>
                {taskComponents}
            </div>
            <div style={{margin: '16px 0'}}>
                <Radio.Group style={{display: 'flex'}}>
                    <Radio.Button value='All'>All</Radio.Button>
                    <Radio.Button value='Active'>Active</Radio.Button>
                    <Radio.Button value='Completed'>Completed</Radio.Button>
                </Radio.Group>
            </div>
        </Card>
    )
}