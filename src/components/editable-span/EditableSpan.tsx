import React, {ChangeEvent, useCallback, useState} from 'react';
import s from './EditableSpan.module.css'
import TextField from '@mui/material/TextField';

type EditableSpanType = {
    title: string
    callback: (title: string) => void
}

export const EditableSpan: React.FC<EditableSpanType> = React.memo( (
    {
        title,
        callback,
    }
) => {

    const [editMode, setEditMode] = useState<boolean>(false)
    const [newTitle, setNewTitle] = useState<string>(title)
    const onEditModeHandler = () => setEditMode(true)

    const offEditModeHandler = useCallback( () => {
       if  (newTitle.length > 0 ) {
           callback(newTitle)
           setEditMode(false)
       } else {
           setNewTitle(title)
           setEditMode(false)
       }
    }, [callback, title, newTitle ])

    const onChangeHandler =  useCallback((e: ChangeEvent<HTMLInputElement>) => {
        setNewTitle(e.currentTarget.value)
    }, [])

    return (
        <>
            {editMode
                ? <TextField
                    size={'small'}
                    id="outlined-basic"
                    label={title}
                    variant="outlined"
                    onChange={onChangeHandler}
                    onBlur={offEditModeHandler}
                    value={newTitle}
                    autoFocus
                />
                : <span className={s.todolist_title} onDoubleClick={onEditModeHandler}>{title}</span>}
        </>

    )
});

