import * as React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import toast from "react-hot-toast";
import { useForm, Controller } from "react-hook-form";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import backgroundImage from "../assets/register_background.png"; // Add this import at the top
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  User2,
  Phone,
  Mail,
  Lock,
  IdCard,
  GraduationCap,
  UserRoundCog,
} from "lucide-react";
import { Link as RouterLink } from "react-router-dom";
import Link from "@mui/material/Link";
import axios from "../API/axiosConfig"; // añadido

const roles = [
  { value: "ESTUDIANTE", label: "Estudiante" },
  { value: "PROFESOR", label: "Profesor" },
  { value: "FUNCIONARIO", label: "Funcionario" },
  { value: "EXTERNO", label: "Externo" },
];
const RegisterUser = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    setIsVisible(true);
  }, []);
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    watch,
    formState: { errors },
  } = useForm();
  const rol = watch("rol");

  // Trigger animation on component mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Restringe el input de teléfono para que no podamos escribir numeros
  const handleTelefonoChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    setValue("phone", value);
  };
  // lo mismo de arriba pero para codigo
  const handleCodigoChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    setValue("codigo", value);
  };

  // para cedula
  const handleIdentificacionChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    setValue("cedula", value);
  };

  const onSubmit = async (data) => {
    // Validaciones para cada campo (ajustadas a los nombres reales)
    if (
      !data.name ||
      !data.last_name ||
      !data.email ||
      !data.phone ||
      !data.password ||
      !data.rol ||
      !data.cedula ||
      !data.username
    ) {
      toast.error("Todos los campos son obligatorios");
      return;
    }
    if (!/^\d+$/.test(data.phone)) {
      toast.error("El teléfono solo debe contener números");
      return;
    }
    if (data.phone.length < 6) {
      toast.error("El teléfono debe tener al menos 6 dígitos");
      return;
    }
    if (data.password.length < 6) {
      toast.error("La contraseña debe tener al menos 6 caracteres");
      return;
    }
    if (!/^\d+$/.test(data.cedula)) {
      toast.error("El N° de identificación solo debe contener números");
      return;
    }
    if (!data.cedula) {
      toast.error("El N° de identificación no puede estar vacío");
      return;
    }
    //ifs para exigir codigo institucional a profesores y estudiantes
    if (data.rol === "ESTUDIANTE" || data.rol === "PROFESOR") {
      if (!data.codigo) {
        toast.error("Debes proporcionar un código institucional");
        return;
      }
      if (!/^\d+$/.test(data.codigo)) {
        toast.error("El código solo debe contener números");
        return;
      }
      if (data.codigo.length < 5) {
        toast.error("El código institucional debe tener al menos 5 dígitos");
        return;
      }
      const year = parseInt(data.codigo.substring(0, 4), 10);
      if (isNaN(year) || year < 2000 || year > 2025) {
        toast.error(
          "El código institucional debe comenzar con un año entre 2000 y 2025"
        );
        return;
      }
    } else if (
      (data.rol === "FUNCIONARIO" || data.rol === "EXTERNO") &&
      data.codigo
    ) {
      // funcionarios y externos no ingresaran codigo
      toast.error(
        "Los roles Funcionario y Externo no deben ingresar código institucional"
      );
      return;
    }

    // Preparar payload para backend (incluye password2)
    const payload = {
      username: data.username,
      email: data.email,
      password: data.password,
      password2: data.password,
      name: data.name,
      last_name: data.last_name,
      phone: data.phone,
      rol: data.rol,
      codigo: data.codigo || "",
      cedula: data.cedula,
    };

    try {
      await axios.post("http://127.0.0.1:8000/api/user/users/", payload);
      toast.success("¡Registro exitoso!");
      navigate("/login");
    } catch (err) {
      console.error("Registro error:", err);
      const message = err.response?.data || err.message || "Error en registro";
      toast.error(JSON.stringify(message));
    }
  };

  return (
    <Box
      sx={{
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
          background:
            "linear-gradient(135deg, rgba(255, 255, 255, 0.8) 80%, rgba(243, 234, 255, 0.8) 100%)",
          borderRadius: "var(--border-radius-lg)",
          boxShadow:
            "0 5px 32px 5px rgba(11, 115, 185, 0.27), 0 1.5px 5px 0px rgba(194, 70, 180, 0.32)",
          backdropFilter: "blur(8px)",
          p: 5,
          minWidth: 450,
          maxWidth: 600,
          width: "90%",
          marginRight: "2rem",
          marginY: "auto",
          alignSelf: "center",
          marginTop: 5,
          marginBottom: 10,
          // Animation styles
          opacity: isVisible ? 1 : 0,
          transform: isVisible
            ? "translateY(0) scale(1)"
            : "translateY(30px) scale(0.95)",
          transition: "all 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
          transitionDelay: "0.1s",
        }}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={3}>
            <>
              <Typography
                variant="h1"
                sx={{
                  alignSelf: "center",
                  fontWeight: "bold",
                  mb: 1,
                  color: "var(--text-primary)",
                  fontSize: "1.8rem",
                  letterSpacing: "1px",
                }}
              >
                Crear una cuenta
              </Typography>
              <Typography variant="body2" align="center" sx={{ mb: 2 }}>
                ¿Ya tienes cuenta?{" "}
                <Link
                  component={RouterLink}
                  to="/login"
                  sx={{
                    color: "var(--color-secondary)",
                    textDecoration: "none",
                    "&:hover": {
                      textDecoration: "underline",
                    },
                  }}
                >
                  Inicia sesión
                </Link>
              </Typography>
            </>
            <Stack direction="row" spacing={2}>
              <TextField
                label="Nombre"
                fullWidth
                {...register("name", { required: true })}
                error={!!errors.name}
                helperText={
                  errors.name ? "Este campo no puede estar vacío" : ""
                }
                InputProps={{
                  startAdornment: (
                    <User2
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
                label="Apellido"
                fullWidth
                {...register("last_name", { required: true })}
                error={!!errors.last_name}
                helperText={
                  errors.last_name ? "Este campo no puede estar vacío" : ""
                }
                InputProps={{
                  startAdornment: (
                    <User2
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
            </Stack>
            <TextField
              label="Nombre de usuario"
              fullWidth
              {...register("username", { required: true })}
              error={!!errors.username}
              helperText={
                errors.username ? "Este campo no puede estar vacío" : ""
              }
              InputProps={{
                startAdornment: (
                  <User2
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
                      startAdornment={
                        <UserRoundCog
                          size={20}
                          style={{ marginRight: "8px", color: "#666" }}
                        />
                      }
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
                {...register("codigo")}
                onChange={handleCodigoChange}
                placeholder="Código institucional"
                InputProps={{
                  startAdornment: (
                    <GraduationCap
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
            </Stack>

            <TextField
              label="N° de identificación"
              fullWidth
              {...register("cedula", { required: true })}
              error={!!errors.cedula}
              helperText={
                errors.cedula ? "Este campo no puede estar vacío" : ""
              }
              onChange={handleIdentificacionChange}
              InputProps={{
                startAdornment: (
                  <IdCard
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
              label="Teléfono"
              type="tel"
              fullWidth
              {...register("phone", { required: true })}
              error={!!errors.phone}
              helperText={errors.phone ? "Este campo no puede estar vacío" : ""}
              onChange={handleTelefonoChange}
              InputProps={{
                startAdornment: (
                  <Phone
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
              label="Correo"
              type="email"
              fullWidth
              {...register("email", { required: true })}
              error={!!errors.email}
              helperText={errors.email ? "Este campo no puede estar vacío" : ""}
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
              {...register("password", { required: true })}
              error={!!errors.password}
              helperText={
                errors.password
                  ? "Este campo no puede estar vacío"
                  : "Mínimo 6 dígitos"
              }
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
                mt: 2,
                background: "var(--color-primary)",
                color: "var(--color-white)",
                fontWeight: 400,
                fontSize: "1.1rem",
                borderRadius: "var(--border-radius-lg)",
                padding: "12px 20",
                boxShadow: "0 10px 8px rgba(57, 140, 170, 0.34)",
                textTransform: "none",
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
