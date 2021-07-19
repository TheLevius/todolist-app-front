import React, {
    ChangeEvent,
    MouseEvent,
    KeyboardEvent,
    FocusEvent,
    FC,
    useState,
    CSSProperties
} from 'react';
import {Input} from 'antd';
import {EnterOutlined} from '@ant-design/icons';
import Button from 'antd/lib/button';
import { Typography} from 'antd';
const {Text} = Typography;

export const EditableSpan: FC<{strong?: boolean, style?: CSSProperties, bordered?: boolean}> = ({strong = false, bordered = true, style, ...props}) => {
    const [isEditMode, setIsEditMode] = useState<boolean>(false)
    const [content, setContent] = useState<string>('testContent')

    const onButtonClickHandle = (e: MouseEvent<HTMLElement>) => {
        setIsEditMode(prev => !prev)
    }

    const onChangeSubmitHandle = (event: KeyboardEvent<HTMLInputElement>
        | FocusEvent<HTMLInputElement>) => {
        if ((event as KeyboardEvent<HTMLInputElement>).key === 'Enter'
            || (event as FocusEvent<HTMLInputElement>).type === 'blur' ) {
            console.log(event)
            setIsEditMode(prev => !prev)
        }
    }

    const onContentChangeHandle = (e: ChangeEvent<HTMLInputElement>) => {
        setContent(e.target.value)
    }

    if(isEditMode) {
        return(
            <Input value={content}
                   onKeyPress={onChangeSubmitHandle}
                   suffix={<EnterOutlined />}
                   onChange={onContentChangeHandle}
                   onBlur={onChangeSubmitHandle}
                   bordered={bordered}
                   autoFocus
                   style={{...style}}
            />
        )
    }
    return(
        <Button type='text' block onClick={onButtonClickHandle} style={{...style}}>
            <Text strong={strong}>
                {content}
            </Text>
        </Button>
    )
}