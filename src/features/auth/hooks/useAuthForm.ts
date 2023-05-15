import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import {object, string} from "yup";

export type LoginRequestData = {
    email: string,
    password: string,
    rememberMe: boolean
}
export const useAuthForm = () => {

    const formSchema = object({
        email: string()
            .required('Email is required!')
            .email('Email not valid'),
        password: string()
            .required('Password is required!')
            .min(4, 'Password must be at least 4 symbols'),
    })
    const {handleSubmit, control, reset, formState: { errors } } = useForm<LoginRequestData>({
        defaultValues: {
            email: '',
            password: '',
            rememberMe: false
        },
        mode: "onTouched" ,
        resolver: yupResolver(formSchema)
    });

    return {
        handleSubmit,
        control,
        reset,
        errors
    }
}