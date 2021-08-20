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

export const EditableSpan: FC<{
    title?: string;
    strong?: boolean;
    style?: CSSProperties;
    bordered?: boolean;
    onTitleChange: (title: string) => void
}> = ({onTitleChange, title = 'empty', strong = false, bordered = true, style, ...props}) => {
    const [isEditMode, setIsEditMode] = useState<boolean>(false)
    const [content, setContent] = useState<string>(title || 'undefined')

    const onButtonClickHandle = (e: MouseEvent<HTMLElement>) => {
        setIsEditMode(prev => !prev)
    }

    const onChangeSubmitHandle = (event: KeyboardEvent<HTMLInputElement>
        | FocusEvent<HTMLInputElement>) => {
        if ((event as KeyboardEvent<HTMLInputElement>).key === 'Enter'
            || (event as FocusEvent<HTMLInputElement>).type === 'blur' ) {
            if (content !== '') {
                onTitleChange(content);
                setIsEditMode(prev => !prev);
            } else {
                setContent(title || 'empty')
                setIsEditMode(prev => !prev)
            }
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
            <Text strong={strong} style={{width: '100%', textOverflow: 'ellipsis', overflow: 'hidden'}}>
                {content}
            </Text>
        </Button>
    )
}