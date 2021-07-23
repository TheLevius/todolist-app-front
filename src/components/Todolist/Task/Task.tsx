import React, {FC, MouseEvent} from 'react';
import Checkbox, {CheckboxChangeEvent} from 'antd/lib/checkbox';
import {EditableSpan} from '../../common/EditableSpan/EditableSpan';
import {Button} from 'antd';
import {DeleteFilled} from '@ant-design/icons/lib';
import {TaskStatusesType, TaskType, UpdateTaskModelType} from '../../../api/todolists-api';
import {useDispatch} from 'react-redux';
import {deleteTask, updateTask} from '../../../redux/task-reducer';

export const Task: FC<{task: TaskType}> = ({task}) => {

    const dispatch = useDispatch()

    const onCheckboxChange = (e: CheckboxChangeEvent) => {
        const newTaskModel: UpdateTaskModelType = { ...task,
            status: (e.target.checked ? TaskStatusesType.Completed : TaskStatusesType.New) }
        dispatch(updateTask(task.todoListId, task.id, newTaskModel));
    }

    const onTaskTitleChanged = (title: string) => {
        const newTaskModel: UpdateTaskModelType = { ...task, title}
        dispatch(updateTask(task.todoListId, task.id, newTaskModel));
    }

    const onRemoveTaskClick = () => {
        dispatch(deleteTask(task.todoListId, task.id))
    }

    return(
        <div style={{display: 'flex', alignItems: 'center', margin: '8px 0'}}>
            <Checkbox checked={task.status === TaskStatusesType.Completed} onChange={onCheckboxChange} style={{marginRight: '16px'}}/>
            <EditableSpan onTitleChange={onTaskTitleChanged} title={task.title} bordered={true} style={{marginLeft: '-8px', paddingLeft: '8px', textAlign: 'left'}}/>
            <Button
                onClick={onRemoveTaskClick}
                type='text'
                style={{marginLeft: '8px'}}
                icon={<DeleteFilled style={{color: '#c8c8c8', fontSize: '18px'}}/>}
                shape='circle'
            />
        </div>
    )
}