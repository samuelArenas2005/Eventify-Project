import * as React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { Mail, Lock } from "lucide-react";
import { Link as RouterLink } from "react-router-dom";
import Link from "@mui/material/Link";
import { useNavigate } from "react-router-dom";

// Asegúrate de que la ruta a la imagen de fondo sea correcta
import backgroundImage from "../assets/register_background.png";

const Login = ({ login }) => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);

  // Para el login, solo necesitamos register, handleSubmit, reset y errors
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    const success = await login(data.email, data.password)
    console.log("Login successful:", success);
    if (success) {
      navigate("/dashboard"); // ← Redirige aquí
    }
  };

  return (
    <Box
      sx={{
        // Mismo estilo de contenedor principal que el registro
        minHeight: "100vh",
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "center",
        background: `url(${backgroundImage})`,
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      }}
    >
      <Box
        sx={{
          // Mismo estilo de tarjeta "glassmorphism" que el registro
          background:
            "linear-gradient(135deg, rgba(255, 255, 255, 0.8) 80%, rgba(243, 234, 255, 0.8) 100%)",
          borderRadius: "var(--border-radius-lg)",
          boxShadow:
            "0 5px 32px 5px rgba(11, 115, 185, 0.27), 0 1.5px 5px 0px rgba(194, 70, 180, 0.32)",
          backdropFilter: "blur(8px)",
          p: 5,
          minWidth: 300,
          maxWidth: 450, // Mismo ancho máximo
          width: "90%",
          marginRight: "2rem",
          marginY: "auto",
          alignSelf: "center",
        }}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={3}>
            <>
              <Typography
                variant="h1"
                sx={{
                  // Mismo estilo de título
                  alignSelf: "center",
                  fontWeight: "bold",
                  mb: 1,
                  color: "var(--text-primary)",
                  fontSize: "1.8rem",
                  letterSpacing: "1px",
                }}
              >
                Iniciar Sesión
              </Typography>
              <Typography variant="body2" align="center" sx={{ mb: 2 }}>
                ¿No tienes cuenta?{" "}
                <Link
                  component={RouterLink}
                  to="/register" // Enlace hacia la página de registro
                  sx={{
                    color: "var(--color-secondary)",
                    textDecoration: "none",
                    "&:hover": {
                      textDecoration: "underline",
                    },
                  }}
                >
                  Regístrate
                </Link>
              </Typography>
            </>

            <TextField
              label="Correo"
              type="email"
              fullWidth
              // Usamos las validaciones de React Hook Form
              {...register("email", {
                required: "Este campo no puede estar vacío",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Correo electrónico no válido",
                },
              })}
              error={!!errors.email} // Manejo de error de RHF
              helperText={errors.email ? errors.email.message : ""}
              placeholder="tu@email.com"
              InputProps={{
                startAdornment: (
                  <Mail
                    size={20}
                    style={{ marginRight: "8px", color: "#666" }}
                  />
                ),
              }}
              sx={{
                "& .MuiInputBase-input::placeholder": {
                  color: "var(--color-placeholder)",
                  opacity: 1,
                },
              }}
            />

            <TextField
              label="Contraseña"
              type="password"
              fullWidth
              {...register("password", {
                required: "Este campo no puede estar vacío",
                
              })}
              error={!!errors.password}
              InputProps={{
                startAdornment: (
                  <Lock
                    size={20}
                    style={{ marginRight: "8px", color: "#666" }}
                  />
                ),
              }}
              sx={{
                "& .MuiInputBase-input::placeholder": {
                  color: "var(--color-placeholder)",
                  opacity: 1,
                },
              }}
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{
                // Mismo estilo de botón que el registro
                mt: 2,
                background: "var(--color-primary)",
                color: "var(--color-white)",
                fontWeight: 400,
                fontSize: "1.1rem",
                borderRadius: "var(--border-radius-lg)",
                padding: "12px 20",
                boxShadow: "0 10px 8px rgba(57, 140, 170, 0.34)",
                textTransform: "none",
                "&:hover": {
                  // Puedes definir un hover si lo deseas
                  // background: 'var(--color-primary-dark)'
                },
              }}
            >
              Iniciar Sesión
            </Button>
          </Stack>
        </form>
      </Box>
    </Box>
  );
};

export default Login;
