import React from 'react';
import s from "./SuperButton.module.css";
import {FilterValuesType} from "./App";
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';

type SuperButtonPropsType = {
    name: string
    callback: () => void
    value?: FilterValuesType
    filter?: FilterValuesType
    btnType?: string
}

export const SuperButton: React.FC<SuperButtonPropsType> = (
    {
        name,
        callback,
        value,
        filter,
        btnType
    }
) => {

    const activeButtonColor = !value ? 'primary' : value === filter ? 'secondary' : 'primary'


    return (
        btnType === 'trash'
            ? <IconButton aria-label="delete" onClick={callback}>
                <DeleteIcon/>
            </IconButton>

            : btnType === 'delete'
                ? <Button onClick={callback} variant="outlined" startIcon={<DeleteIcon/>}>
                    Delete
                </Button>

                : <Button
                    color={activeButtonColor}
                    className={s.btn}
                    variant="contained"
                    size={'small'}
                    onClick={callback}
                >{name}
                </Button>
    );
};

