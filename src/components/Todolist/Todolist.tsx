import React, {FC, useEffect} from 'react';
import {Button, Radio, RadioChangeEvent} from 'antd';
import Card from 'antd/lib/card';
import {EditableSpan} from '../common/EditableSpan/EditableSpan';
import {DeleteFilled} from '@ant-design/icons/lib';
import {Task} from './Task/Task';
import {AddItemForm} from '../AddItemForm/AddItemForm';
import {changeTodolistTitle, deleteTodolist, todolistActions, TodolistDomainType} from '../../redux/todolist-reducer';
import {useDispatch, useSelector} from 'react-redux';
import {addTask, fetchTasks} from '../../redux/task-reducer';
import {AppStateType} from '../../redux/store';
import {TaskStatusesType, TaskType} from '../../api/todolists-api';


export const Todolist: FC<{td: TodolistDomainType}> = ({td}) => {

    const dispatch = useDispatch();
    const taskList = useSelector<AppStateType, TaskType[]>(state => (state.task[td.id]?.filter(t => {

        if (td.filter === 'active') {
            return t.status === TaskStatusesType.New
        } else if (td.filter === 'completed') {
            return t.status === TaskStatusesType.Completed
        }
        return !!t
    })))

    const taskComponents = taskList?.map((t) => (<Task key={t.id} task={t} />));

    useEffect(() => {
        dispatch(fetchTasks(td.id))

    }, [dispatch])

    const addTaskHandle = (title: string) => {
        dispatch(addTask(td.id, title))
    }

    const onTodolistTitleChanged = (title: string) => {
        dispatch(changeTodolistTitle(td.id, title))
    }

    const onRemoveTodolistClick = () => {
        dispatch(deleteTodolist(td.id))
    }

    const onFilterValueChangeHandle = (e: RadioChangeEvent) => {
        dispatch(todolistActions.changedTodolistFilter(td.id, e.target.value.toLowerCase() ))
    }


    return (
        <Card bodyStyle={{
            height: '100%',
            display: 'flex',
            justifyContent: 'space-between',
            flexDirection: 'column',

        }} style={{
            display: 'flex',
            minWidth: 'calc(25% - 16px)',
            flexDirection: 'column',
            margin: '8px',
            overflow: 'hidden'
        }}
              title={
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
                                  overflow: 'hidden',
                              }}/>
                <Button
                    onClick={onRemoveTodolistClick}
                    type='text'
                    icon={<DeleteFilled style={{color: '#c8c8c8', fontSize: '18px'}}/>}
                    shape='circle'
                />
            </div>
        } bordered={false} >
            <div style={{display: 'flex', flexDirection: 'column', height: '100%'}}>
                <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%'}}>
                    <div>
                        <div style={{marginBottom: '16px'}}>
                            <AddItemForm addItem={addTaskHandle}/>
                        </div>
                        <div style={{display: 'flex', flexDirection: 'column'}}>
                            {taskComponents}
                        </div>
                    </div>
                    <div style={{margin: '16px 0'}}>
                        <Radio.Group style={{display: 'flex'}} onChange={onFilterValueChangeHandle}>
                            <Radio.Button value='All'>All</Radio.Button>
                            <Radio.Button value='Active'>Active</Radio.Button>
                            <Radio.Button value='Completed'>Completed</Radio.Button>
                        </Radio.Group>
                    </div>
                </div>
            </div>
        </Card>
    )
}