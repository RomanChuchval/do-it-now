import React, {ChangeEvent, KeyboardEvent, useState} from "react";
import s from "./InputBlock.module.css";
import {SuperButton} from "./SuperButton";
import TextField from '@mui/material/TextField';

type InputBlockPropsType = {
    callback: (title: string) => void
}

export const InputBlock: React.FC<InputBlockPropsType> = (
    {
        callback,
    }
) => {
    const [title, setTitle] = useState<string>('')
    const [error, setError] = useState<string>('')
    const addTaskKeyDownHandler = (e: KeyboardEvent<HTMLInputElement>) => {
        return e.key === 'Enter' ? addItemHandler() : ''
    }
    const changeTaskTitleHandler = (e: ChangeEvent<HTMLInputElement>) => {
        error && setError('')
        if(title.length < 20) {
            setTitle(e.currentTarget.value)
        } else {
            setError('Max title length 20 letters')
            setTitle(e.currentTarget.value.slice(0, -1))
        }
    }

    const addItemHandler = () => {
        if (title.trim() === '') { setError('Title is required')
        } else {
            callback(title)
            setError('')
        }
        setTitle('')
    }

    return (
        <>
            <div className={s.input_block_wrapper}>
                <div>
                    <TextField
                        sx={{ input: {color: 'white'}}}
                        size={"small"}
                        error={!!error}
                        id="outlined-error"
                        label={!!error ? error : 'Add item'}
                        onKeyDown={addTaskKeyDownHandler}
                        value={title}
                        onChange={changeTaskTitleHandler}
                    />
                </div>
                <div>
                    <SuperButton name={'+'} callback={addItemHandler}/>
                </div>
            </div>
        </>
    );
};


