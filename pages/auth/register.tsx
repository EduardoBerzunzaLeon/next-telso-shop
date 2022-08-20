import { useContext, useState } from 'react';
import { useRouter } from 'next/router';
import { GetServerSideProps } from 'next';
import NextLink from 'next/link';
import { getSession, signIn } from 'next-auth/react';

import { Box, Button, Chip, Grid, Link, TextField, Typography } from '@mui/material'
import { useForm } from 'react-hook-form';
import { AuthLayout } from '../../components/layouts'
// import { telsoApi } from '../../api';
import { ErrorOutline } from '@mui/icons-material';
import { validations } from '../../utils';
import { AuthContext } from '../../context';

type FormData = {
    name: string;
    email: string;
    password: string;
}


const RegisterPage = () => {

    const router = useRouter();
    const { registerUser } = useContext( AuthContext );
    const [ showError, setShowError ] = useState(false);
    const [ errorMessage, setErrorMessage ] = useState('');
    const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
    
    const onRegisterForm = async ({ name, email, password }: FormData) => {
        setShowError(false);
        const { hasError, message } = await registerUser(name, email, password);

        if( hasError ) {
            setShowError(true);
            setErrorMessage( message! );
            setTimeout(() => setShowError(false), 3000);
            return;
        }

        await signIn('credentials', { email, password });
        // const destination = router.query.p?.toString() || '/';
        // router.replace(destination);
    }

  return (
    <AuthLayout title='Registro'>
        <form onSubmit={ handleSubmit(onRegisterForm) } noValidate >            
            <Box sx={{ width: 350, padding: '10px 20px' }}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Typography variant='h1' component='h1'>Crear cuenta</Typography>
                        <Chip 
                            label={errorMessage}
                            color='error'
                            icon={ <ErrorOutline /> }
                            className='fadeIn'
                            sx={{ display: showError ? 'flex': 'none' }}
                        />
                    </Grid>
                    
                    <Grid item xs={12}>
                        <TextField 
                            label='Nombre completo' 
                            variant='filled' 
                            fullWidth
                            {...register('name', {
                                required: 'Este campo es requerido',
                                minLength: { value: 2, message: 'Mínimo 2 caracteres' }
                            })}
                            error={ !!errors.name }
                            helperText={ errors.name?.message }
                        />
                    </Grid>
                    
                    <Grid item xs={12}>
                        <TextField
                            type='email'
                            label='Correo' 
                            variant='filled' 
                            fullWidth
                            { ...register('email', {
                                required: 'Este campo es requerido',
                                validate: validations.isEmail
                            })}
                            error={ !!errors.email }
                            helperText={ errors.email?.message }
                        />
                    </Grid>
                    
                    <Grid item xs={12}>
                        <TextField 
                            label='Contraseña' 
                            type='password' 
                            variant='filled' 
                            fullWidth
                            {...register('password', {
                                required: 'Este campo es requerido',
                                minLength: { value: 6, message: 'Mínimo 6 caracteres' }
                            })}
                            error={ !!errors.password }
                            helperText={ errors.password?.message }
                        />
                    </Grid>
                    
                    <Grid item xs={12}>
                        <Button 
                            type='submit' 
                            color='secondary' 
                            className='circular-btn' 
                            size='large' 
                            fullWidth
                        >
                            Ingresar
                        </Button>
                    </Grid>
                    
                    <Grid item xs={12} display='flex' justifyContent='end'>
                        <NextLink href={ router.query.p ? `/auth/login?p=${ router.query.p }`: '/auth/login'} passHref>
                            <Link underline='always'>
                                Ya tengo cuenta
                            </Link>
                        </NextLink>
                    </Grid>
                </Grid>
            </Box>
        </form>

    </AuthLayout>
  )
}


export const getServerSideProps: GetServerSideProps = async ({ req, query }) => {
    const session = await getSession({ req });

    const { callbackUrl = '/'} = query;

    if( session ) {
        return {
            redirect: {
                destination: callbackUrl.toString(),
                permanent: false
            }
        }
    }

    return {
        props: {
            
        }
    }
}


export default RegisterPage