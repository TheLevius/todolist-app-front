import React, {ChangeEvent, CSSProperties, FC, KeyboardEvent, FocusEvent, useState} from 'react';
import {Button} from 'antd';
import {EnterOutlined, PlusCircleFilled} from '@ant-design/icons/lib';
import Input from 'antd/lib/input';

export const AddItemForm: FC<{bordered?: boolean}> = ({bordered = true, ...props}) => {
    const [inputValue, setInputValue] = useState<string>('')
    const onChangeHandle = (e: ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value)
    }

    const onSubmitHandle = (e: KeyboardEvent<HTMLInputElement> | FocusEvent<HTMLInputElement>) => {
        if ((e as KeyboardEvent<HTMLInputElement>).key === 'Enter'
            || (e as FocusEvent<HTMLInputElement>).type === 'blur' ) {
            console.log('submit')
            setInputValue('')
        }
    }

    return(
        <>
            <Input onKeyPress={onSubmitHandle}
                   onBlur={onSubmitHandle}
                   placeholder={'Add task'}
                   value={inputValue}
                   bordered={bordered}
                   onChange={onChangeHandle} />
            <Button
                style={{marginLeft: '8px'}}
                type='text'
                icon={<PlusCircleFilled style={{color: '#2999ff', fontSize: '18px'}}/>}
                shape='circle'
            />
        </>
    )
}