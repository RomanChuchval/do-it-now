import React, {ChangeEvent, KeyboardEvent, useState} from "react";
import s from "./InputBlock.module.css";
import {SuperButton} from "./SuperButton";

type InputBlockPropsType = {
    callback: (title: string) => void
}

export const InputBlock: React.FC<InputBlockPropsType> = (
    {
        callback,

    }
) => {
    const [title, setTitle] = useState<string>('')
    const [error, setError] = useState<boolean>(false)
    const addTaskKeyDownHandler = (e: KeyboardEvent<HTMLInputElement>) => {
        return e.key === 'Enter' ? addItemHandler() : ''
    }
    const changeTaskTitleHandler = (e: ChangeEvent<HTMLInputElement>) => {
        error && setError(false)
        setTitle(e.currentTarget.value)
    }

    const addItemHandler = () => {
        title.trim() === '' ? setError(true) :
            callback(title)
        setTitle('')
    }

    return (
        <>
            <div className={s.error_title}>{error && 'Title is required'}</div>
            <div>
                <input placeholder={'write task title'}
                       className={s.input}
                       onKeyDown={addTaskKeyDownHandler}
                       value={title}
                       onChange={changeTaskTitleHandler}
                       type={'text'}/>
                <SuperButton name={'+'} callback={addItemHandler}/>
            </div>

        </>
    );
};


