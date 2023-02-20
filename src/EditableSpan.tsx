import React, {ChangeEvent, useState} from 'react';
import s from './EditableSpan.module.css'
import TextField from '@mui/material/TextField';

type EditableSpanType = {
    title: string
    callback: (title: string) => void
}

export const EditableSpan: React.FC<EditableSpanType> = (
    {
        title,
        callback,
    }
) => {

    const [editMode, setEditMode] = useState<boolean>(false)
    const [newTitle, setNewTitle] = useState<string>(title)
    const onEditModeHandler = () => setEditMode(true)
    const offEditModeHandler = () => {
       if  (newTitle.length > 0 ) {
           callback(newTitle)
           setEditMode(false)
       } else {
           setNewTitle(title)
           setEditMode(false)
       }
    }
    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setNewTitle(e.currentTarget.value)
    }

    return (
        <>
            {editMode
                ? <TextField
                    sx={{input: {color: 'white'}}}
                    size={'small'}
                    id="outlined-basic"
                    label={title}
                    variant="outlined"
                    onChange={onChangeHandler}
                    onBlur={offEditModeHandler}
                    value={newTitle}
                    autoFocus
                />
                //  <input className={s.input}
                //          onChange={onChangeHandler}
                //          value={newTitle}
                //          onBlur={offEditModeHandler}
                //          autoFocus
                // />
                : <span className={s.todolist_title} onDoubleClick={onEditModeHandler}>{title}</span>}
        </>

    )
};

