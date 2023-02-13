import React, {ChangeEvent, useState} from 'react';
import s from './EditableSpan.module.css'

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
        callback(newTitle)
        setEditMode(false)
    }
    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setNewTitle(e.currentTarget.value)
    }

    return (
        <>
            {editMode
                ? <input className={s.input}
                         onChange={onChangeHandler}
                         value={newTitle}
                         onBlur={offEditModeHandler}
                         autoFocus
                />
                : <span onDoubleClick={onEditModeHandler}
                >
                    {title}
            </span>}
        </>

    )
};

