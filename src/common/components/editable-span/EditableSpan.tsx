import React, {ChangeEvent, useCallback} from 'react';
import s from 'common/components/editable-span/EditableSpan.module.css'
import TextField from '@mui/material/TextField';
import {useEditableSpan} from "common/hooks/useEditableSpan";

type EditableSpanType = {
    title: string
    callback: (title: string) => void
}

export const EditableSpan: React.FC<EditableSpanType> = React.memo((
    {
        title,
        callback,
    }
) => {
    const {updatedTitle, onEditMode, onChange, editMode, offEditMode} = useEditableSpan(callback, title)
    const onChangeHandler = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        onChange(e)
    }, [onChange])

    return (
        <>
            {editMode
                ? <TextField
                    size={'small'}
                    id="outlined-basic"
                    label={title}
                    variant="outlined"
                    onChange={onChangeHandler}
                    onBlur={offEditMode}
                    value={updatedTitle}
                    autoFocus
                />
                : <span className={s.todolist_title} onDoubleClick={onEditMode}>{title}</span>}
        </>

    )
});

