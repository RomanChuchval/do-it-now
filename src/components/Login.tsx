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
        console.log(data);
        reset()
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <FormControl>
                <FormLabel>
                    <p>To log in get registered
                        <a href={'https://social-network.samuraijs.com/'}
                           target={'_blank'} rel={'noreferrer'}> here
                        </a>
                    </p>
                    <p>or use common test account credentials:</p>
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

