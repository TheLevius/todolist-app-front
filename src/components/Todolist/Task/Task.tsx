import React, {FC, useState} from 'react';
import Checkbox, {CheckboxChangeEvent} from 'antd/lib/checkbox';
import {EditableSpan} from '../../common/EditableSpan/EditableSpan';
import {Button} from 'antd';
import {DeleteFilled} from '@ant-design/icons/lib';

export const Task: FC<{}> = (props) => {
    const [checkboxStatus, setCheckboxStatus] = useState<boolean>(false)
    const onCheckboxChange = (e: CheckboxChangeEvent) => {
        setCheckboxStatus(prev => !prev)
    }

    return(
        <div style={{display: 'flex', alignItems: 'center', margin: '8px 0'}}>
            <Checkbox checked={checkboxStatus} onChange={onCheckboxChange} style={{marginRight: '16px'}}/>
            <EditableSpan bordered={true} style={{marginLeft: '-8px', paddingLeft: '8px', textAlign: 'left'}}/>
            <Button
                type='text'
                style={{marginLeft: '8px'}}
                icon={<DeleteFilled style={{color: '#c8c8c8', fontSize: '18px'}}/>}
                shape='circle'
            />
        </div>
    )
}