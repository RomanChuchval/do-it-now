import React from 'react';
import s from "./SuperButton.module.css";
import {FilterValuesType} from "./App";
import {Button} from "@mui/material";

type SuperButtonPropsType = {
    name: string
    callback: () => void
    value?: string
    filter?: FilterValuesType
}

export const SuperButton: React.FC<SuperButtonPropsType> = (
    {
        name,
        callback,
        value,
        filter
    }
) => {

    const buttonClassName = `${s.btn} ${filter && filter === value ? s.active_btn : ''}`
    return (
        // <Button onClick={callback} className={s.btn2} variant="contained">{name}</Button>
        <button className={buttonClassName} onClick={callback}>{name}</button>
    );
};

