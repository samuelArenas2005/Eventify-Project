import React, { useState, useRef, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Toaster, toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  Calendar,
  MapPin,
  Info,
  Users,
  Tag,
  Image as ImageIcon,
  Upload,
  Star,
  X,
  Send,
  Loader2,
  ArrowLeft
} from 'lucide-react';
import styles from './CreateEventPage.module.css';

const EventDashboard = () => {
  // --- Estados ---
  const [images, setImages] = useState([]); // Almacena { url: '...', file: File }
  const [mainImageIndex, setMainImageIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  // --- React Hook Form ---
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm({
    defaultValues: {
      title: '',
      description: '',
      startDate: '',
      startTime: '',
      endDate: '',
      endTime: '',
      address: '',
      venueInfo: '',
      capacity: '',
      category: '',
    },
  });

  // Observar la fecha de inicio para validación
  const startDate = watch('startDate');

  // --- Manejadores de Imágenes ---

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const newImages = files.map((file) => ({
      url: URL.createObjectURL(file),
      file: file,
    }));

    setImages((prevImages) => [...prevImages, ...newImages]);
    toast.success(`${files.length} imagen(es) añadida(s)`);
  };

  const handleRemoveImage = (indexToRemove) => {
    // Revocar URL para liberar memoria
    URL.revokeObjectURL(images[indexToRemove].url);

    setImages((prevImages) =>
      prevImages.filter((_, index) => index !== indexToRemove)
    );

    // Ajustar el índice de la imagen principal si es necesario
    if (mainImageIndex === indexToRemove) {
      setMainImageIndex(0); // Vuelve a la primera
    } else if (mainImageIndex > indexToRemove) {
      setMainImageIndex((prevIndex) => prevIndex - 1);
    }
  };

  const setAsMainImage = (index) => {
    setMainImageIndex(index);
    toast('Imagen principal actualizada', { icon: '⭐' });
  };

  // Limpiar URLs al desmontar el componente
  useEffect(() => {
    return () => {
      images.forEach((image) => URL.revokeObjectURL(image.url));
    };
  }, [images]);

  // --- Manejador de Envío ---

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    const loadingToast = toast.loading('Registrando tu evento...');

    // 1. Validación de imágenes
    if (images.length === 0) {
      toast.error('Debes subir al menos una imagen.');
      setIsSubmitting(false);
      toast.dismiss(loadingToast);
      return;
    }

    // Simulación de subida
    await new Promise((resolve) => setTimeout(resolve, 2500));

    // 2. Crear FormData para enviar
    const formData = new FormData();

    // Añadir datos del formulario (data)
    for (const key in data) {
      formData.append(key, data[key]);
    }

    // Añadir imágenes
    images.forEach((image, index) => {
      formData.append('images', image.file);
      // Marcar la imagen principal
      if (index === mainImageIndex) {
        formData.append('mainImageName', image.file.name);
      }
    });

    // --- Aquí harías tu llamada fetch/axios ---
    // fetch('/api/events', { method: 'POST', body: formData })
    //   .then(res => res.json())
    //   .then(result => { ... })
    
    console.log('--- Datos del Evento Enviados ---');
    console.log('Datos del formulario:', data);
    console.log('Total de imágenes:', images.length);
    console.log('Imagen principal:', images[mainImageIndex]?.file.name);
    // console.log('FormData (para inspección):', ...formData.entries());

    // 3. Respuesta
    toast.dismiss(loadingToast);
    toast.success('¡Evento creado exitosamente!');
    setIsSubmitting(false);

    // 4. Resetear formulario
    reset();
    images.forEach((image) => URL.revokeObjectURL(image.url)); // Limpiar memoria
    setImages([]);
    setMainImageIndex(0);
  };

  const onError = (formErrors) => {
    console.log("Errores de validación:", formErrors);
    toast.error('Por favor, revisa los campos marcados en rojo.');
  };

  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <div className={styles.dashboardContainer}>

        {/* Contenido Principal */}
        <main className={styles.mainContent}>
          {/* Botón Volver al Dashboard */}
          <div className={styles.backButtonContainer}>
            <Link to="/dashboard" className={styles.backButton}>
              <ArrowLeft size={16} />
              Volver al Dashboard
            </Link>
          </div>
          
          <form onSubmit={handleSubmit(onSubmit, onError)} className={styles.formGrid}>
            
            {/* Columna Izquierda: Detalles del Evento */}
            <section className={`${styles.formColumn} ${styles.softAnimation}`}>
              <h1  className={styles.title} > <LayoutDashboard size={28} /> Crear Nuevo Evento</h1>
              <h2 className={styles.columnTitle}>Detalles del Evento</h2>

              {/* Título */}
              <div className={styles.formGroup}>
                <label htmlFor="title" className={styles.label}>
                  <FileText size={16} /> Título del Evento
                </label>
                <input
                  id="title"
                  className={styles.input}
                  placeholder="Ej: Concierto de Rock Sinfónico"
                  {...register('title', {
                    required: 'El título es obligatorio',
                    minLength: { value: 5, message: 'Mínimo 5 caracteres' }
                  })}
                />
                {errors.title && <span className={styles.errorMessage}>{errors.title.message}</span>}
              </div>

              {/* Descripción */}
              <div className={styles.formGroup}>
                <label htmlFor="description" className={styles.label}>
                  <Info size={16} /> Descripción
                </label>
                <textarea
                  id="description"
                  className={styles.textarea}
                  placeholder="Describe los detalles de tu evento..."
                  {...register('description', {
                    required: 'La descripción es obligatoria',
                    maxLength: { value: 1000, message: 'Máximo 1000 caracteres' }
                  })}
                />
                {errors.description && <span className={styles.errorMessage}>{errors.description.message}</span>}
              </div>

              {/* Fechas y Horas */}
              <div className={styles.formGridGroup}>
                <div className={styles.formGroup}>
                  <label htmlFor="startDate" className={styles.label}>
                    <Calendar size={16} /> Fecha de Inicio
                  </label>
                  <input
                    id="startDate"
                    type="date"
                    className={styles.input}
                    {...register('startDate', {
                      required: 'La fecha de inicio es obligatoria',
                      validate: val => new Date(val) >= new Date().setHours(0,0,0,0) || "La fecha no puede ser en el pasado"
                    })}
                  />
                  {errors.startDate && <span className={styles.errorMessage}>{errors.startDate.message}</span>}
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="startTime" className={styles.label}>Hora de Inicio</label>
                  <input
                    id="startTime"
                    type="time"
                    className={styles.input}
                    {...register('startTime', { required: 'La hora de inicio es obligatoria' })}
                  />
                  {errors.startTime && <span className={styles.errorMessage}>{errors.startTime.message}</span>}
                </div>
              </div>

              <div className={styles.formGridGroup}>
                <div className={styles.formGroup}>
                  <label htmlFor="endDate" className={styles.label}>
                    <Calendar size={16} /> Fecha de Fin
                  </label>
                  <input
                    id="endDate"
                    type="date"
                    className={styles.input}
                    {...register('endDate', {
                      required: 'La fecha de fin es obligatoria',
                      validate: val => new Date(val) >= new Date(startDate) || "Debe ser igual o posterior a la fecha de inicio"
                    })}
                  />
                  {errors.endDate && <span className={styles.errorMessage}>{errors.endDate.message}</span>}
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="endTime" className={styles.label}>Hora de Fin</label>
                  <input
                    id="endTime"
                    type="time"
                    className={styles.input}
                    {...register('endTime', { required: 'La hora de fin es obligatoria' })}
                  />
                  {errors.endTime && <span className={styles.errorMessage}>{errors.endTime.message}</span>}
                </div>
              </div>

              {/* Ubicación */}
              <div className={styles.formGroup}>
                <label htmlFor="address" className={styles.label}>
                  <MapPin size={16} /> Dirección
                </label>
                <input
                  id="address"
                  className={styles.input}
                  placeholder="Ej: Av. Siempre Viva 123"
                  {...register('address', { required: 'La dirección es obligatoria' })}
                />
                {errors.address && <span className={styles.errorMessage}>{errors.address.message}</span>}
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="venueInfo" className={styles.label}>
                  <Info size={16} /> Información del Lugar
                </label>
                <input
                  id="venueInfo"
                  className={styles.input}
                  placeholder="Ej: Auditorio principal, puerta 3"
                  {...register('venueInfo')}
                />
              </div>

              {/* Capacidad y Categoría */}
              <div className={styles.formGridGroup}>
                <div className={styles.formGroup}>
                  <label htmlFor="capacity" className={styles.label}>
                    <Users size={16} /> Capacidad
                  </label>
                  <input
                    id="capacity"
                    type="number"
                    className={styles.input}
                    placeholder="0"
                    {...register('capacity', {
                      required: 'La capacidad es obligatoria',
                      valueAsNumber: true,
                      min: { value: 1, message: 'La capacidad debe ser al menos 1' }
                    })}
                  />
                  {errors.capacity && <span className={styles.errorMessage}>{errors.capacity.message}</span>}
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="category" className={styles.label}>
                    <Tag size={16} /> Categoría
                  </label>
                  <select
                    id="category"
                    className={styles.select}
                    {...register('category', { required: 'Debes elegir una categoría' })}
                  >
                    <option value="">Selecciona una...</option>
                    <option value="concierto">Concierto</option>
                    <option value="conferencia">Conferencia</option>
                    <option value="taller">Taller</option>
                    <option value="deportivo">Deportivo</option>
                    <option value="otro">Otro</option>
                  </select>
                  {errors.category && <span className={styles.errorMessage}>{errors.category.message}</span>}
                </div>
              </div>

               {/* Botón de Envío */}
              <button type="submit" className={styles.submitButton} disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    Registrando...
                  </>
                ) : (
                  <>
                    <Send size={20} />
                    Crear Evento
                  </>
                )}
              </button>

            </section>

            {/* Columna Derecha: Imágenes */}
            <section className={`${styles.imageColumn} ${styles.softAnimation}`}>
              <h2 className={styles.columnTitle}>Imágenes del Evento</h2>

              {/* Zona de Carga */}
              <div
                className={styles.dropZone}
                onClick={() => fileInputRef.current && fileInputRef.current.click()}
              >
                <input
                  type="file"
                  multiple
                  accept="image/png, image/jpeg, image/webp"
                  className={styles.fileInput}
                  ref={fileInputRef}
                  onChange={handleFileChange}
                />
                <Upload size={40} className={styles.dropZoneIcon} />
                <p className={styles.dropZoneText}>
                  <span>Haz clic</span> o arrastra tus imágenes aquí
                </p>
                <p className={styles.dropZoneText} style={{ fontSize: '0.8rem' }}>
                  (JPG, PNG, WEBP)
                </p>
              </div>

              {/* Previsualización */}
              {images.length > 0 && (
                <div className={styles.imagePreviewContainer}>
                  {/* Imagen Principal */}
                  <p className={styles.previewTitle}>Imagen Principal</p>
                  <div className={styles.mainImagePreview}>
                    {images[mainImageIndex] ? (
                      <>
                        <img
                          src={images[mainImageIndex].url}
                          alt="Vista previa principal"
                          className={styles.mainImage}
                        />
                        <div className={styles.mainImageTag}>
                          <Star size={12} /> Principal
                        </div>
                      </>
                    ) : (
                      <div className={styles.mainImagePlaceholder}>
                        <ImageIcon size={40} />
                      </div>
                    )}
                  </div>

                  {/* Galería de Thumbnails */}
                  <p className={styles.previewTitle}>Imágenes Secundarias ({images.length})</p>
                  <div className={styles.thumbnailGrid}>
                    {images.map((image, index) => (
                      <div
                        key={index}
                        className={`${styles.thumbnail} ${mainImageIndex === index ? styles.active : ''}`}
                        onClick={() => setAsMainImage(index)}
                      >
                        <img
                          src={image.url}
                          alt={`Vista previa ${index + 1}`}
                          className={styles.thumbnailImage}
                        />
                        <div className={styles.thumbnailActions}>
                          <button
                            type="button"
                            className={`${styles.actionButton} ${styles.star}`}
                            onClick={(e) => {
                              e.stopPropagation(); // Evitar que el clic active el setAsMainImage
                              setAsMainImage(index);
                            }}
                            title="Marcar como principal"
                          >
                            <Star size={14} fill={mainImageIndex === index ? 'currentColor' : 'none'}/>
                          </button>
                          <button
                            type="button"
                            className={`${styles.actionButton} ${styles.delete}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveImage(index);
                            }}
                            title="Eliminar imagen"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </section>
          </form>
        </main>
      </div>
    </>
  );
};

export default EventDashboard;