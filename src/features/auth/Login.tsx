import React from 'react';
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import FormLabel from "@mui/material/FormLabel";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import Checkbox from "@mui/material/Checkbox";
import {Controller, SubmitHandler, useForm} from "react-hook-form";
import {object, string} from "yup";
import {yupResolver} from "@hookform/resolvers/yup";
import {Navigate} from "react-router-dom";
import {loginTC} from "features/auth/auth-slice";
import {useAppSelector} from "app/hooks/use-AppSelector";
import {useAppDispatch} from "app/hooks/use-AppDispatch";

export type FormDataType = {
    email: string,
    password: string,
    rememberMe: boolean
}

const formSchema = object({
    email: string()
        .required('Email is required!')
        .email('Email not valid'),
    password: string()
        .required('Password is required!')
        .min(4, 'Password must be at least 4 symbols'),
})

export const Login = () => {
    const isLoggedIn = useAppSelector<boolean>(state => state.auth.isLoggedIn)
    const dispatch = useAppDispatch()

    const {handleSubmit, control, reset, formState: { errors } } = useForm<FormDataType>({
        defaultValues: {
            email: '',
            password: '',
            rememberMe: false
        },
        mode: "onTouched" ,
        resolver: yupResolver(formSchema)
    });
    const onSubmit: SubmitHandler<FormDataType> = (data) => {
        dispatch(loginTC(data))
        reset()
    }

    if(isLoggedIn) {
        return <Navigate to={'/'} />
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <FormControl sx={{minWidth: '350px'}}>
                <FormLabel>
                    <p>Log in or registered
                        <a href={'https://social-network.samuraijs.com/'}
                           target={'_blank'} rel={'noreferrer'}> here
                        </a>
                    </p>
                    <p>Use common test account credentials:</p>
                    <p>Email: free@samuraijs.com</p>
                    <p>Password: free</p>
                </FormLabel>
                <FormGroup>
                    <Controller
                        name={'email'}
                        control={control}
                        render={ ({field}) =>
                            <TextField {...field} label="Email"
                                       margin="normal"
                                       error={!!errors.email}
                                       helperText={errors.email?.message}
                                       size={'small'}
                            /> }
                    />
                   <Controller
                    name={'password'}
                    control={control}
                    render={ ({field}) =>
                        <TextField {...field} type="password"
                                   error={!!errors.password}
                                   helperText={errors.password?.message}
                                   label="Password"
                                   margin="normal"
                                   size={'small'}
                        /> }
                   />
                    <Controller
                        name={'rememberMe'}
                        control={control}
                        render={ ({field}) =>
                            <FormControlLabel {...field} label={'Remember me'} control={<Checkbox/>}/>}
                    />
                    <Button type={'submit'} variant={'contained'} color={'primary'}>
                        Login
                    </Button>
                </FormGroup>
            </FormControl>
        </form>
    );
};

