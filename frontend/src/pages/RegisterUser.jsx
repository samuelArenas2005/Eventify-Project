import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

const RegisterUser = () => {
    return (
         <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#f5f8ff', 
            }}
        >
            <Box
                sx={{
                    backgroundColor: '#fff',
                    borderRadius: 3,
                    boxShadow: 3,
                    p: 5,
                    minWidth: 350,
                    maxWidth: 400,
                    width: '100%',
                }}
            >
                <Stack spacing={2}>
                    <Typography
                        variant="h4"
                        sx={{ alignSelf: 'flex-start', fontWeight: 'bold', mb: 1 }}
                    >
                        Registro de Usuario
                    </Typography>
                   
                    <Stack direction="row" spacing={2}>
                        <TextField
                            required
                            id="nombre"
                            label="Nombre"
                            fullWidth
                        />
                        <TextField
                            required
                            id="apellido"
                            label="Apellido"
                            fullWidth
                        />
                    </Stack>
                   
                   
                    <TextField
                        required
                        id="email"
                        label="Email"
                        type="email"
                        fullWidth
                    />
                    
                </Stack>
                
            </Box>
            
        </Box>
    );
};

export default RegisterUser;