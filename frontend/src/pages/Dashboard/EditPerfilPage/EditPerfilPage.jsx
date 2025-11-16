import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import styles from './EditPerfilPage.module.css';
import { 
  User, 
  Mail, 
  Phone, 
  Key, 
  Hash, 
  Briefcase, 
  Save, 
  X, 
  Pencil,
  Eye,
  EyeOff,
  Image as ImageIcon
} from 'lucide-react';
import { getUser, updateUser } from '../../../API/api';

export default function EditPerfilPage() {
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(null);
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    name: '',
    last_name: '',
    phone: '',
    codigo: '',
    password: '',
    password2: '',
    avatar: null,
  });

  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const data = await getUser();
        setUserData(data);
        setFormData({
          username: data.username || '',
          email: data.email || '',
          name: data.name || '',
          last_name: data.last_name || '',
          phone: data.phone || '',
          codigo: data.codigo || '',
          password: '',
          password2: '',
          avatar: null,
        });
        if (data.avatar) {
          setAvatarPreview(data.avatar);
        }
      } catch (error) {
        console.error('Error loading user data:', error);
        toast.error('Error al cargar los datos del usuario');
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('La imagen no puede ser mayor a 5MB');
        return;
      }
      setFormData(prev => ({
        ...prev,
        avatar: file
      }));
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validar contraseñas si se proporcionan
    if (formData.password || formData.password2) {
      if (formData.password !== formData.password2) {
        toast.error('Las contraseñas no coinciden');
        return;
      }
      if (formData.password.length < 8) {
        toast.error('La contraseña debe tener al menos 8 caracteres');
        return;
      }
    }

    setSaving(true);
    try {
      const updateData = { ...formData };
      
      // Si no hay contraseña, no enviarla
      if (!updateData.password) {
        delete updateData.password;
        delete updateData.password2;
      }
      
      // Si no hay avatar nuevo, no enviarlo
      if (!updateData.avatar) {
        delete updateData.avatar;
      }

      await updateUser(updateData);
      toast.success('Perfil actualizado correctamente');
      
      // Recargar datos del usuario
      const updatedData = await getUser();
      setUserData(updatedData);
      
      // Limpiar contraseñas
      setFormData(prev => ({
        ...prev,
        password: '',
        password2: ''
      }));
    } catch (error) {
      console.error('Error updating user:', error);
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.password?.[0] ||
                          'Error al actualizar el perfil';
      toast.error(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate('/dashboard');
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Cargando datos...</p>
      </div>
    );
  }

  const initials = userData 
    ? `${userData.name?.charAt(0) || ''}${userData.last_name?.charAt(0) || ''}`
    : 'UU';

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Editar Perfil</h1>
        <p className={styles.subtitle}>Actualiza tu información personal</p>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.contentWrapper}>
          {/* Sección del Avatar */}
          <div className={styles.avatarSection}>
            <div className={styles.avatarContainer}>
              {avatarPreview ? (
                <img 
                  src={avatarPreview} 
                  alt="Avatar" 
                  className={styles.avatarImage}
                />
              ) : (
                <div className={styles.avatarPlaceholder}>
                  {initials}
                </div>
              )}
              <label className={styles.avatarEditButton}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  style={{ display: 'none' }}
                />
                <Pencil size={18} />
              </label>
            </div>
            <p className={styles.avatarHint}>Haz clic en el ícono para cambiar tu foto</p>
          </div>

          {/* Sección de Formulario */}
          <div className={styles.formSection}>
            <div className={styles.formGrid}>
              {/* Nombre */}
              <div className={styles.inputGroup}>
                <label className={styles.label}>
                  <User size={18} className={styles.labelIcon} />
                  Nombre
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={styles.input}
                  required
                />
              </div>

              {/* Apellido */}
              <div className={styles.inputGroup}>
                <label className={styles.label}>
                  <User size={18} className={styles.labelIcon} />
                  Apellido
                </label>
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleInputChange}
                  className={styles.input}
                  required
                />
              </div>

              {/* Username */}
              <div className={styles.inputGroup}>
                <label className={styles.label}>
                  <User size={18} className={styles.labelIcon} />
                  Nombre de Usuario
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className={styles.input}
                  required
                />
              </div>

              {/* Email */}
              <div className={styles.inputGroup}>
                <label className={styles.label}>
                  <Mail size={18} className={styles.labelIcon} />
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={styles.input}
                  required
                />
              </div>

              {/* Teléfono */}
              <div className={styles.inputGroup}>
                <label className={styles.label}>
                  <Phone size={18} className={styles.labelIcon} />
                  Teléfono
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={styles.input}
                  placeholder="+1234567890"
                />
              </div>

              {/* Código Institucional */}
              <div className={styles.inputGroup}>
                <label className={styles.label}>
                  <Hash size={18} className={styles.labelIcon} />
                  Código Institucional
                </label>
                <input
                  type="text"
                  name="codigo"
                  value={formData.codigo}
                  onChange={handleInputChange}
                  className={styles.input}
                />
              </div>

              {/* Cédula (No editable) */}
              <div className={styles.inputGroup}>
                <label className={styles.label}>
                  <Hash size={18} className={styles.labelIcon} />
                  Cédula
                </label>
                <input
                  type="text"
                  value={userData?.cedula || ''}
                  className={`${styles.input} ${styles.inputDisabled}`}
                  disabled
                  readOnly
                />
              </div>

              {/* Rol (No editable) */}
              <div className={styles.inputGroup}>
                <label className={styles.label}>
                  <Briefcase size={18} className={styles.labelIcon} />
                  Rol
                </label>
                <input
                  type="text"
                  value={userData?.rol || ''}
                  className={`${styles.input} ${styles.inputDisabled}`}
                  disabled
                  readOnly
                />
              </div>

              {/* Nueva Contraseña */}
              <div className={styles.inputGroup}>
                <label className={styles.label}>
                  <Key size={18} className={styles.labelIcon} />
                  Nueva Contraseña
                </label>
                <div className={styles.passwordWrapper}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={styles.input}
                    placeholder="Dejar vacío para no cambiar"
                  />
                  <button
                    type="button"
                    className={styles.passwordToggle}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Confirmar Contraseña */}
              <div className={styles.inputGroup}>
                <label className={styles.label}>
                  <Key size={18} className={styles.labelIcon} />
                  Confirmar Contraseña
                </label>
                <div className={styles.passwordWrapper}>
                  <input
                    type={showPassword2 ? 'text' : 'password'}
                    name="password2"
                    value={formData.password2}
                    onChange={handleInputChange}
                    className={styles.input}
                    placeholder="Confirmar nueva contraseña"
                  />
                  <button
                    type="button"
                    className={styles.passwordToggle}
                    onClick={() => setShowPassword2(!showPassword2)}
                  >
                    {showPassword2 ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            </div>

            {/* Botones de Acción */}
            <div className={styles.actions}>
              <button
                type="button"
                onClick={handleCancel}
                className={styles.cancelButton}
                disabled={saving}
              >
                <X size={18} />
                Cancelar
              </button>
              <button
                type="submit"
                className={styles.saveButton}
                disabled={saving}
              >
                <Save size={18} />
                {saving ? 'Guardando...' : 'Guardar Cambios'}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

