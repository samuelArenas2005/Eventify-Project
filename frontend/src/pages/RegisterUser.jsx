import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';


const RegisterUser = () => {
    const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();

    // Restringe el input de teléfono para que no podamos escribir numeros
    const handleTelefonoChange = (e) => {
        const value = e.target.value.replace(/\D/g, '');
        setValue('telefono', value);
    };

    const onSubmit = (data) => {
        // Validaciones para cada campo
        if (!data.nombre || !data.apellido || !data.email || !data.telefono || !data.password) {
            toast.error('Todos los campos son obligatorios');
            return;
        }
        if (!/^\d+$/.test(data.telefono)) {
            toast.error('El teléfono solo debe contener números');
            return;
        }
        if (data.telefono.length < 6) {
            toast.error('El teléfono debe tener al menos 6 dígitos');
            return;
        }
        if (data.password.length < 6) {
            toast.error('La contraseña debe tener al menos 6 caracteres');
            return;
        }
        // aqui imprimo todo en la consola, denle inspeccionar para ver el registro exitoso
        console.log('Datos recibidos:', data); 
        toast.success('¡Registro exitoso!');
        reset();
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                background: 'linear-gradient(135deg, #0B72B9 50%, #e1e7f5 100%)',
            }}
        >
            <Box
                sx={{
                    background: 'linear-gradient(135deg, #fff 80%, #f3eaff 100%)',
                    borderRadius: 'var(--border-radius-lg)',
                    boxShadow: '0 8px 32px 0 rgba(11, 114, 185, 0.10), 0 1.5px 8px 0 rgba(0,0,0,0.04)',
                    p: 5,
                    minWidth: 350,
                    maxWidth: 400,
                    width: '100%',
                }}
            >
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Stack spacing={3}>
                        <Typography
                            variant="h4"
                            sx={{
                                alignSelf: 'flex-start',
                                fontWeight: 'bold',
                                mb: 1,
                                color: 'var(--color-secondary)',
                                fontSize: '2.5rem',
                                letterSpacing: '1px',
                            }}
                        >
                            Registro de Usuario
                        </Typography>
                        <Stack direction="row" spacing={2}>
                            <TextField
                                label="Nombre"
                                fullWidth
                                {...register('nombre', { required: true })}
                                error={!!errors.nombre}
                                helperText={errors.nombre ? 'Este campo no puede estar vacío' : ''}
                                placeholder="Nombre"
                                sx={{
                                    '& .MuiInputBase-input::placeholder': {
                                        color: 'var(--color-placeholder)',
                                        opacity: 1,
                                    }
                                }}
                            />
                            <TextField
                                label="Apellido"
                                fullWidth
                                {...register('apellido', { required: true })}
                                error={!!errors.apellido}
                                helperText={errors.apellido ? 'Este campo no puede estar vacío' : ''}
                                placeholder="Apellido"
                                sx={{
                                    '& .MuiInputBase-input::placeholder': {
                                        color: 'var(--color-placeholder)',
                                        opacity: 1,
                                    }
                                }}
                            />
                        </Stack>
                        <TextField
                            label="Correo"
                            type="email"
                            fullWidth
                            {...register('email', { required: true })}
                            error={!!errors.email}
                            helperText={errors.email ? 'Este campo no puede estar vacío' : ''}
                            placeholder="tu@email.com"
                            sx={{
                                '& .MuiInputBase-input::placeholder': {
                                    color: 'var(--color-placeholder)',
                                    opacity: 1,
                                }
                            }}
                        />
                        <TextField
                            label="Teléfono"
                            type="tel"
                            fullWidth
                            {...register('telefono', { required: true })}
                            error={!!errors.telefono}
                            helperText={errors.telefono ? 'Este campo no puede estar vacío' : ''}
                            onChange={handleTelefonoChange}
                            placeholder="Ej: 1123456789"
                            sx={{
                                '& .MuiInputBase-input::placeholder': {
                                    color: 'var(--color-placeholder)',
                                    opacity: 1,
                                }
                            }}
                        />
                        <TextField
                            label="Contraseña"
                            type="password"
                            fullWidth
                            {...register('password', { required: true })}
                            error={!!errors.password}
                            helperText={errors.password ? 'Este campo no puede estar vacío' : ''}
                            placeholder="Contraseña"
                            sx={{
                                '& .MuiInputBase-input::placeholder': {
                                    color: 'var(--color-placeholder)',
                                    opacity: 1,
                                }
                            }}
                        />
                        <Button
                            type="submit"
                            variant="contained"
                            fullWidth
                            sx={{
                                mt: 2,
                                background: 'var(--color-primary)',
                                color: 'var(--color-white)',
                                fontWeight: 700,
                                fontSize: '1.1rem',
                                borderRadius: 'var(--border-radius-md)',
                                padding: '12px 0',
                                boxShadow: '0 2px 8px rgba(185, 11, 11, 0.08)',
                                textTransform: 'none',
                                '&:hover': {
                                    background: 'var(--color-secondary)',
                                },
                            }}
                        >
                            Registrarse
                        </Button>
                    </Stack>
                </form>
            </Box>
        </Box>
    );
};

export default RegisterUser;