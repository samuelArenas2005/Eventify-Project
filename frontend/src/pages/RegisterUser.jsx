import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import toast from 'react-hot-toast';
import { useForm, Controller } from 'react-hook-form';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

const roles = [
    { value: 'Estudiante', label: 'Estudiante' },
    { value: 'Profesor', label: 'Profesor' },
    { value: 'Funcionario', label: 'Funcionario' },
    { value: 'Externo', label: 'Externo' },
];
const RegisterUser = () => {
   
    const { register, handleSubmit, reset, setValue, control, watch, formState: { errors } } = useForm();
    const rol = watch('rol');
    
    // Restringe el input de teléfono para que no podamos escribir numeros
    const handleTelefonoChange = (e) => {
        const value = e.target.value.replace(/\D/g, '');
        setValue('telefono', value);
    };
    // lo mismo de arriba pero para codigo
    const handleCodigoChange = (e) => {
        const value = e.target.value.replace(/\D/g, '');
        setValue('codigo', value);
    };

    // para cedula
    const handleIdentificacionChange = (e) => {
        const value = e.target.value.replace(/\D/g, '');
        setValue('identificacion', value);
    };

    const onSubmit = (data) => {
        // Validaciones para cada campo
         if (!data.nombre || !data.apellido || !data.email || !data.telefono || !data.password || !data.rol || !data.identificacion) {
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
        if (!/^\d+$/.test(data.identificacion)) {
            toast.error('El N° de identificación solo debe contener números');
            return;
        }
        if (!data.identificacion) {
            toast.error('El N° de identificación no puede estar vacío');
            return;
        }
            //ifs para exigir codigo institucional a profesores y estudiantes
        if (rol === 'Estudiante' || rol === 'Profesor') {
            if (!data.codigo) {
                toast.error('Debes proporcionar un código institucional');
                return;
            }
            if (!/^\d+$/.test(data.codigo)) {
                toast.error('El código solo debe contener números');
                return;
            }
            if (data.codigo.length < 5) {
                toast.error('El código institucional debe tener al menos 5 dígitos');
                return;
            }
            const year = parseInt(data.codigo.substring(0, 4), 10);
            if (isNaN(year) || year < 2000 || year > 2025) {
                toast.error('El código institucional debe comenzar con un año entre 2000 y 2025');
                return;
            }
        } else if ((rol === 'Funcionario' || rol === 'Externo') && data.codigo) {
            // funcionarios y externos no ingresaran codigo
            toast.error('Los roles Funcionario y Externo no deben ingresar código institucional');
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
                            Registrate para participar en eventos!
                        </Typography>
                        <Stack direction="row" spacing={2}>
                            <TextField
                                label="Nombre"
                                fullWidth
                                {...register('nombre', { required: true })}
                                error={!!errors.nombre}
                                helperText={errors.nombre ? 'Este campo no puede estar vacío' : ''}
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
                                sx={{
                                    '& .MuiInputBase-input::placeholder': {
                                        color: 'var(--color-placeholder)',
                                        opacity: 1,
                                    }
                                }}
                            />
                        </Stack>
                        
                        <Stack direction="row" spacing={2}>
                            <FormControl fullWidth error={!!errors.rol}>
                                <InputLabel id="rol-label">Rol</InputLabel>
                                <Controller
                                    name="rol"
                                    control={control}
                                    defaultValue=""
                                    rules={{ required: true }}
                                    render={({ field }) => (
                                        <Select 
                                            {...field}
                                            labelId="rol-label"
                                            label="Rol"
                                        >
                                            {roles.map((option) => (
                                                <MenuItem key={option.value} value={option.value}>
                                                    {option.label}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    )}
                                />
                            </FormControl>
                            <TextField
                                label="Código"
                                fullWidth
                                {...register('codigo')}
                                onChange={handleCodigoChange}
                                placeholder="Código institucional"
                                sx={{
                                    '& .MuiInputBase-input::placeholder': {
                                        color: 'var(--color-placeholder)',
                                        opacity: 1,
                                    }
                                }}
                            />
                        </Stack>
                       
                        <TextField
                            label="N° de identificación"
                            fullWidth
                            {...register('identificacion', { required: true })}
                            error={!!errors.identificacion}
                            helperText={errors.identificacion ? 'Este campo no puede estar vacío' : ''}
                            onChange={handleIdentificacionChange}                           
                            sx={{
                                '& .MuiInputBase-input::placeholder': {
                                    color: 'var(--color-placeholder)',
                                    opacity: 1,
                                }
                            }}
                        />
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
                            helperText={
                                errors.password
                                ? 'Este campo no puede estar vacío'
                                : 'Mínimo 6 dígitos'
                             }
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