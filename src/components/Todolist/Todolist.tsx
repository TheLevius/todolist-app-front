import React, {FC} from 'react';
import {Button, Radio} from 'antd';
import Card from 'antd/lib/card';
import {EditableSpan} from '../common/EditableSpan/EditableSpan';
import {DeleteFilled} from '@ant-design/icons/lib';
import {Task} from './Task/Task';
import {AddItemForm} from '../AddItemForm/AddItemForm';

export const Todolist: FC<{}> =(props) => {

    return (
        <Card style={{minWidth: 'calc(25% - 16px)', maxWidth: 'calc(33.33% - 16px)', flexGrow: 1, margin: '8px'}} title={
            <div style={{display: 'flex', alignItems: 'center'}}>
                <EditableSpan bordered={false} strong={true} style={{
                    marginLeft: '0',
                    paddingLeft: '0',
                    fontSize: '20px',
                    lineHeight: '1',
                    textAlign: 'left',
                    overflow: 'visible'
                }}/>
                <Button
                    type='text'
                    style={{marginLeft: '8px'}}
                    icon={<DeleteFilled style={{color: '#c8c8c8', fontSize: '18px'}}/>}
                    shape='circle'
                />
            </div>
        } bordered={false}>
            <div style={{display: 'flex'}}>
                <AddItemForm />
            </div>
            <div style={{display: 'flex', flexDirection: 'column'}}>
                <Task/>
                <Task/>
                <Task/>
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