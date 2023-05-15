import React from "react";
import s from "common/components/input-block/InputBlock.module.css";
import {SuperButton} from "common/components/super-button/SuperButton";
import TextField from '@mui/material/TextField';
import {useAppForm} from "common/hooks/useAppForm";

type InputBlockPropsType = {
    callback: (title: string) => void
}
type InputFormType = {
    titleInput: string
}
export const InputBlock: React.FC<InputBlockPropsType> = React.memo((
    {
        callback
    }
) => {
    const {handleSubmit, errors, reset, register} = useAppForm(['titleInput'])
    const onSubmitHandler = (data: InputFormType) => {
        callback(data.titleInput)
        reset()
    }
    return (
        <>
            <form onSubmit={handleSubmit(onSubmitHandler)} className={s.input_block_wrapper}>
                <div>
                    <TextField
                        {...register('titleInput')}
                        size={"small"}
                        error={!!errors.titleInput}
                        id="outlined-error"
                        label={!!errors.titleInput ? errors.titleInput.message : 'Add item'}
                    />
                </div>
                <div>
                    <SuperButton name={'+'}/>
                </div>
            </form>
        </>
    );
});


