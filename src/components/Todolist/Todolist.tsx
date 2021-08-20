import React, {FC, useEffect} from 'react';
import {Button, Radio, RadioChangeEvent, Space, Spin} from 'antd';
import Card from 'antd/lib/card';
import {EditableSpan} from '../common/EditableSpan/EditableSpan';
import {DeleteFilled} from '@ant-design/icons/lib';
import {Task} from './Task/Task';
import {AddItemForm} from '../AddItemForm/AddItemForm';
import {changeTodolistTitle, deleteTodolist, FilterValuesType, todolistActions,} from '../../redux/todolist-reducer';
import {useDispatch, useSelector} from 'react-redux';
import {addTask, fetchTasks} from '../../redux/task-reducer';
import {AppStateType} from '../../redux/store';
import {TaskType} from '../../api/todolists-api';
import styles from './Todolist.module.css';
import {selectTasks} from "./todolist-selectors";

export const Todolist: FC<{
    id: string
    title: string
    filter: FilterValuesType
    }> = React.memo(({id, title, filter}) => {

    const dispatch = useDispatch()
    const tasks = useSelector<AppStateType, TaskType[] | null>(state => selectTasks(state, id, filter))

    useEffect(() => {
        dispatch(fetchTasks(id))

    }, [dispatch, id])

    const addTaskHandle = (title: string) => {
        dispatch(addTask(id, title))
    }

    const onTodolistTitleChanged = (title: string) => {
        dispatch(changeTodolistTitle(id, title))
    }

    const onRemoveTodolistClick = () => {
        dispatch(deleteTodolist(id))
    }

    const onFilterValueChangeHandle = (e: RadioChangeEvent) => {
        dispatch(todolistActions.changedTodolistFilter(id, e.target.value.toLowerCase() ))
    }

    if(tasks === null) {
        return(
            <Space size='large'>
                <Spin size='large' tip='Initialize...'/>
            </Space>
        )
    }
    console.log('todolist render')
    return (
        <Card bodyStyle={{
            height: '100%',
            display: 'flex',
            justifyContent: 'space-between',
            flexDirection: 'column',

        }} className={`${styles.card}`}
              title={
                  <div style={{display: 'flex', alignItems: 'center'}}>
                      <EditableSpan onTitleChange={onTodolistTitleChanged} title={title}
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
                            {!!tasks && tasks.map((t) => (<Task key={t.id} task={t} />))}
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
})